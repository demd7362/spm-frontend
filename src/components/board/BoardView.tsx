import {useNavigate, useParams} from 'react-router-dom';
import useFetch from '../../hooks/useFetch';
import React, {useCallback, useContext, useEffect, useState} from 'react';
import Spinner from "../common/Spinner";
import dateUtil from "../../utils/dateUtils";
import {ContextStore} from "../../router/AppRouter";
import BoardCommentView from "./BoardCommentView";
import numericUtil from "../../utils/numericUtils";

export default function BoardView() {
    const params = useParams();
    const {num} = params;
    const navigate = useNavigate();
    const {header,modal} = useContext(ContextStore);
    const [data,setData] = useState<BoardInfo | null>(null);
    const fetch = useFetch();

    const handleRecommand = async () => {
        const result = await fetch.post(`/api/v1/board/recommend/${num}`);
        fetch.resultHandler(result,(data) => {
            setData(prev => {
                if(prev !== null){
                    return {
                        ...prev,
                        brCount: data
                    }
                } else {
                    return null;
                }
            })

        });
    }
    useEffect(() => {
        fetch.get(`/api/v1/board/view/${num}?recommend=true`)
            .then((result:FetchResult) => {
                fetch.resultHandler(result,(data:BoardInfo)=> {
                    const {biContent,biTitle,biUserId,biChanged,biCreated,brCount} = data;
                    setData({
                        biContent,
                        biTitle,
                        biUserId,
                        biCreated,
                        biChanged,
                        brCount
                    });
                    const handleClickModify = async ()=>{
                        navigate(`/board/post/${num}`)
                    }
                    const handleClickDelete = async ()=> {
                        modal.confirm('게시글 삭제','게시글을 정말로 삭제할까요?',async () => {
                            const result = await fetch.$delete(`/api/v1/board/delete/${num}`);
                            fetch.resultHandler(result,()=> {
                                navigate('/board/1');
                            });
                        })
                    }
                    header.setMenu(()=> {
                        return (
                            <>
                                <button onClick={handleClickModify}>[수정]</button>
                                <button onClick={handleClickDelete}>[삭제]</button>
                            </>
                        )
                    })
                })
            })
        return () => {
            header.setDefault();
        }
    }, []);
    const renderCreateDate = useCallback(()=> {
        if(!data) return null;
        const {years,months,days,hours,minutes,seconds} = dateUtil.parseDate(data.biCreated);
        return (
            <>
                <p className="text-sm font-light">{`${years}년 ${months}월 ${days}일 ${hours}시 ${minutes}분 ${seconds}초`}</p>
            </>
        )
    },[data])
    if(!data) return <Spinner/>

    return (
        <>
            <div className="container mx-auto p-4 bg-white rounded-lg h-screen">
                <h1 className="text-2xl font-bold mb-4 text-black">{data.biTitle}</h1>
                <div className="w-full max-w-[calc(100%-1rem)]">
                    <div className="border rounded-lg p-4 shadow-md">
                        <div dangerouslySetInnerHTML={{ __html: data.biContent }} className="text-gray-700" />
                        <div className="text-right mt-4">
                            <p className="text-sm font-light">작성자: {data.biUserId}</p>
                            {renderCreateDate()}
                        </div>
                    </div>
                    <div className="flex justify-center gap-2">
                        <button
                            onClick={handleRecommand}
                            className="mt-4 bg-amber-700 hover:bg-amber-800 text-white font-bold py-2 px-4 rounded"
                        >
                            추천 {data.brCount}
                        </button>
                        <button
                            onClick={() => navigate(-1)}
                            className="mt-4 bg-yellow-500 hover:bg-yellow-600 text-white font-bold py-2 px-4 rounded"
                        >
                            목록
                        </button>
                    </div>
                </div>
                <BoardCommentView />

            </div>

        </>
    )
}
