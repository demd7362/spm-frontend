import {ChangeEvent, useCallback, useContext, useEffect, useMemo, useRef, useState} from 'react';
import ReactQuill from 'react-quill';
import {ContextStore} from '../../router/AppRouter';
import useFetch from "../../hooks/useFetch";
import {useNavigate, useParams} from "react-router-dom";
import StringUtils from "../../utils/StringUtils";

const MB = 10;
const MAX_FILE_SIZE = 1048576 * MB;

export default function BoardEditor() {
    const params = useParams();
    const [hashes, setHashes] = useState<string[]>([]);
    const {num} = params;
    const quillRef = useRef<ReactQuill>(null);
    const [data, setData] = useState<BoardInfo>({
        title: '',
        content: ''
    });
    const {header, modal, auth} = useContext(ContextStore);
    const fetch = useFetch();
    const navigate = useNavigate();
    const handleSubmit = useCallback(async () => {
        let url = num === undefined ? '/board/insert' : '/board/update';
        url = '/api/v1' + url;
        const method = num === undefined ? 'post' : 'patch';
        const result = await fetch[method](url, {
            ...data,
            hashes
        });
        fetch.resultHandler(result, () => {
            navigate('/board/1');
        });
    }, [data, num, auth.jwt])
    useEffect(() => {
        header.setMenu(() => {
            return <button onClick={handleSubmit}>[작성 완료]</button>
        })
        return () => {
            header.setDefault();
        }
    }, [handleSubmit]);
    useEffect(() => {
        const authenticate = async () => {
            await fetch.authenticate();
            if (num === undefined) return;
            const result = await fetch.get(`/api/v1/board/view/${num}?recommend=false`);
            fetch.resultHandler(result, (data) => {
                setData(data);
            })
        }
        authenticate();
    }, [])
    const imageHandler = useCallback(() => {
        const input = document.createElement('input');
        input.setAttribute('type', 'file');
        input.setAttribute('accept', 'image/*');
        input.click();
        input.addEventListener('change', async () => {
            const file = input.files?.[0];
            if (file === undefined) return;
            if (!file.type.includes('image')) {
                modal.setAuto('이미지 업로드', '이미지만 업로드 가능합니다.', () => {
                    input.click();
                })
                return;
            }
            if (file.size > MAX_FILE_SIZE) {
                modal.setAuto('파일 크기 초과', `이미지는 ${MB}MB까지 업로드가 가능합니다.`, () => {
                    input.click();
                });
                return;
            }
            const reader = new FileReader();
            reader.readAsDataURL(file);
            reader.addEventListener('load', async () => {
                if (typeof reader.result === "string") {
                    const base64 = reader.result.replace(/^data:.+;base64,/, '');

                    const hash = StringUtils.generateRandomHash();
                    const ociRequest: OCIRequest = {
                        base64,
                        originalName: file.name,
                        size: file.size,
                        type: '01',
                        hash
                    }
                    setHashes(prev => [...prev, hash]);
                    const result = await fetch.post('/api/v1/oci/upload', ociRequest);
                    fetch.resultHandler(result, (data) => {
                        // @ts-ignore
                        const quill = quillRef.current.getEditor();
                        const range = quill.getSelection(true);
                        // 이미지 삽입
                        quill.insertEmbed(range.index, 'image', data); // reader.result => 클라이언트 사이드 인코딩

                        // 커서를 이미지 다음 위치로 이동
                        quill.setSelection(range.index + 1, range.index + 1);
                    });
                }
            })

        });
    }, [])
    const modules = useMemo(() => ({
        toolbar: {
            container: [
                ['bold', 'italic', 'underline', 'strike'],        // toggled buttons
                ['blockquote', 'code-block'],
                [{'header': 1}, {'header': 2}],               // custom button values
                [{'list': 'ordered'}, {'list': 'bullet'}],
                [{'script': 'sub'}, {'script': 'super'}],      // superscript/subscript
                [{'indent': '-1'}, {'indent': '+1'}],          // outdent/indent
                [{'direction': 'rtl'}],                         // text direction

                [{'size': ['small', false, 'large', 'huge']}],  // custom dropdown
                [{'header': [1, 2, 3, 4, 5, 6, false]}],

                [{'color': []}, {'background': []}],          // dropdown with defaults from theme
                [{'font': []}],
                [{'align': []}],

                ['clean'],                                        // remove formatting button

                ['image', 'video']               // 추가된 iframe 버튼
            ],
            handlers: {
                image: imageHandler,
            }
        }
    }), [])

    const handleTitleChange = (e: ChangeEvent<HTMLInputElement>) => {
        setData(prev => ({
            ...prev,
            title: e.target.value
        }))
    };
    const handleContentChange = (content: string) => {
        setData(prev => ({
            ...prev,
            content
        }))

    };


    return (
        <div className={'p-2'}>
            <input type="text" onChange={handleTitleChange} value={data.title} className={'w-full max-w-[calc(100%-1rem)] p-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-800 m-2 focus:border-transparent'} placeholder="제목을 입력하세요"/>
            <ReactQuill ref={quillRef} className={'m-2 h-80vh bg-white'} value={data.content} onChange={handleContentChange} modules={modules}/>
        </div>
    );
}
