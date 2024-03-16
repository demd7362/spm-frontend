import React, {useCallback, useContext, useEffect, useState} from "react";
import useFetch from "../../hooks/useFetch";
import Spinner from "../common/Spinner";
import addImage from "assets/add-image.png";
import {ContextStore} from "../../router/AppRouter";
import BoardComment from "./BoardComment";
import {useNavigate, useParams} from "react-router-dom";
import Pagination from "../common/Pagination";
import usePagination from "../../hooks/usePagination";
import StringUtils from "../../utils/StringUtils";

const BOTTOM_SIZE = 5;
const PAGE_SIZE = 10;
export default function BoardCommentView() {
    const fetch = useFetch();
    const params = useParams();
    const {num, page} = params;
    const {modal} = useContext(ContextStore);
    const navigate = useNavigate();
    const [hashes, setHashes] = useState<string[]>([]);
    const {
        pagination,
        setPagination,
        handleNext,
        handlePrev,
        handleClickPage
    } = usePagination<BoardCommentPagination>(Number(page || '1'), PAGE_SIZE, BOTTOM_SIZE);
    const [comment, setComment] = useState<string>('');
    const getComments = useCallback(async () => {
        const result = await fetch.get(`/api/v1/board/comment/${num}/${pagination.page}/${pagination.pageSize}`);
        fetch.resultHandler(result, (data) => {
            console.log(data);
            data.content.sort((a:BoardCommentProps,b:BoardCommentProps) => a.num - b.num);
            setPagination(prev => ({
                ...prev,
                content: data.content,
                totalPages: data.totalPages
            }))
            navigate(`/board/view/${num}/${pagination.page || 1}`, {replace: true});
        })
    }, [pagination.page])
    useEffect(() => {
        getComments();
    }, [pagination.page])
    const handleCommentSubmit = async (comment: string) => {
        const result: FetchResult = await fetch.post('/api/v1/board/comment/insert', {
            content: comment,
            boardNum: Number(num),
            deep: 1,
            hashes
        });
        fetch.resultHandler(result, async () => {
            await getComments();
            setComment('');
            setHashes([]);
        });
    }
    const handleAddImage = useCallback(() => {
        const input = document.createElement('input');
        input.setAttribute('type', 'file');
        input.setAttribute('accept', 'image/*');
        input.click();

        input.addEventListener('change', () => {
            const file = input.files?.[0];
            if (file === undefined) return;
            if (!file.type.includes('image')) {
                modal.setAuto('이미지 업로드', '이미지만 업로드 가능합니다.', () => {
                    input.click();
                })
                return;
            }
            try {
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
                            ociType: '02',
                            hash
                        }
                        setHashes(prev => [...prev, hash]);
                        const result = await fetch.post('/api/v1/oci/upload', ociRequest);
                        fetch.resultHandler(result, (data) => {
                            const newComment = `<img src="${data}">`;
                            setComment(newComment);
                            handleCommentSubmit(newComment);
                        });
                    }
                })
            } catch (e){
                setComment('');
            }
        })

    }, [])


    return (
        <div className="p-4">
            <div className="mb-4">
                {pagination.content.map(comment => {
                    return <BoardComment key={comment.num} {...comment}/>
                })}
            </div>
            <div className={'container mx-auto py-2'}>
                {pagination.content.length > 0 && (
                    <Pagination pagination={pagination} handlePrev={handlePrev} handleNext={handleNext} handleClickPage={handleClickPage} bottomSize={BOTTOM_SIZE}/>
                )}
            </div>

            <textarea rows={3} className="w-full p-2 border border-gray-300 rounded" value={comment} onChange={(e) => setComment(e.target.value)}/>
            <div className={'flex gap-2'}>
                <button onClick={() => handleCommentSubmit(comment)} className="mt-2 px-4 py-2 text-sm font-medium text-gray-100 bg-purple-600 rounded-lg shadow hover:bg-purple-700 focus:outline-none focus:ring-2 focus:ring-purple-500 focus:ring-opacity-50 transition duration-300 ease-in-out">
                    댓글 달기
                </button>
                <img onClick={handleAddImage} src={addImage} alt="Add Image" className={'w-10 h-10 mt-2 rounded-3xl cursor-pointer'}/>
            </div>
        </div>
    );
}
