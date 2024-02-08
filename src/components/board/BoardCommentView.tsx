import React, {useCallback, useContext, useEffect, useState} from "react";
import useFetch from "../../hooks/useFetch";
import Spinner from "../common/Spinner";
import addImage from "assets/add-image.png";
import {ContextStore} from "../../router/AppRouter";
import BoardComment from "./BoardComment";
import {useNavigate, useParams} from "react-router-dom";
import Pagination from "../common/Pagination";
import usePagination from "../../hooks/usePagination";

const BOTTOM_SIZE = 5;
const PAGE_SIZE = 10;
export default function BoardCommentView() {
    const fetch = useFetch();
    const params = useParams();
    const {num, page} = params;
    const {modal} = useContext(ContextStore);
    const navigate = useNavigate();
    const [loading, setLoading] = useState(false);

    const {
        pagination,
        setPagination,
        handleNext,
        handlePrev,
        handleClickPage
    } = usePagination<BoardCommentPagination>(Number(page || '1'), PAGE_SIZE, BOTTOM_SIZE);
    const [comment, setComment] = useState<string>('');
    const [base64Image, setBase64Image] = useState<string>('');
    const getComments = useCallback(async () => {
        setLoading(true);
        const result = await fetch.get(`/api/v1/board/comment/${num}/${pagination.page}/${pagination.pageSize}`);
        fetch.resultHandler(result, (data) => {
            data.content.sort((a:BoardCommentProps,b:BoardCommentProps) => a.bcNum - b.bcNum);
            setPagination(prev => ({
                ...prev,
                content: data.content,
                totalPages: data.totalPages
            }))
            navigate(`/board/view/${num}/${pagination.page || 1}`, {replace: true});
            setLoading(false);
        })
    }, [pagination.page])
    useEffect(() => {
        getComments();
    }, [pagination.page])

    const handleCommentSubmit = useCallback(async () => {
        const result: FetchResult = await fetch.post<BoardCommentProps>('/api/v1/board/comment/insert', {
            bcContent: comment,
            bcBoardNum: Number(num),
            bcDeep: 1,
            bcNum: 1
        });
        fetch.resultHandler(result, async () => {
            await getComments();
            setComment('');
        });
    }, [comment])
    useEffect(() => {
        if (base64Image !== '') {
            const imageElement = `<img src="${base64Image}"/>`;
            fetch.post('/api/v1/board/comment/insert', {
                bcContent: imageElement,
                bcBoardNum: Number(num),
                bcDeep: 1,
            }).then(result => {
                fetch.resultHandler(result, async () => {
                    await getComments();
                    setBase64Image('');
                });
            })
        }
    }, [base64Image])
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
            const reader = new FileReader();
            reader.readAsDataURL(file);
            reader.addEventListener('load', () => {
                if (typeof reader.result === 'string') {
                    const base64 = reader.result;
                    setBase64Image(base64);
                }
            })
        })

    }, [])


    if (loading) return <Spinner/>
    return (
        <div className="p-4">
            <div className="mb-4">
                {pagination.content.map(comment => {
                    return <BoardComment key={comment.bcNum} {...comment}/>
                })}
            </div>
            <div className={'container mx-auto py-2'}>
                {pagination.content.length > 0 && (
                    <Pagination pagination={pagination} handlePrev={handlePrev} handleNext={handleNext} handleClickPage={handleClickPage} bottomSize={BOTTOM_SIZE}/>
                )}
            </div>

            <textarea rows={3} className="w-full p-2 border border-gray-300 rounded" value={comment} onChange={(e) => setComment(e.target.value)}/>
            <div className={'flex gap-2'}>
                <button onClick={handleCommentSubmit} className="mt-2 px-4 py-2 text-sm font-medium text-gray-100 bg-purple-600 rounded-lg shadow hover:bg-purple-700 focus:outline-none focus:ring-2 focus:ring-purple-500 focus:ring-opacity-50 transition duration-300 ease-in-out">
                    댓글 달기
                </button>
                <img onClick={handleAddImage} src={addImage} alt="Add Image" className={'w-10 h-10 mt-2 rounded-3xl cursor-pointer'}/>
            </div>
        </div>
    );
}
