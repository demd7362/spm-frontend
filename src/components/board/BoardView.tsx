import {useNavigate, useParams} from 'react-router-dom';
import useFetch from '../../hooks/useFetch';
import React, {Suspense, useCallback, useContext, useEffect, useState} from 'react';
import Spinner from "../common/Spinner";
import dateUtil from "../../utils/dateUtils";
import {ContextStore} from "../../router/AppRouter";
import BoardCommentView from "./BoardCommentView";
import numericUtil from "../../utils/numericUtils";

export default function BoardView() {
    const params = useParams();
    const {num} = params;
    const navigate = useNavigate();
    const {modal,auth} = useContext(ContextStore);
    const [data,setData] = useState<BoardInfo | null>(null);
    const fetch = useFetch();

    const handleRecommand = async () => {
        const result = await fetch.post(`/api/v1/board/recommend/${num}`);
        fetch.resultHandler(result,(data) => {
            setData(prev => {
                if(prev !== null){
                    return {
                        ...prev,
                        count: data
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
                    const {content,title,email,changed,created,count} = data;
                    setData({
                        content,
                        title,
                        email,
                        created,
                        changed,
                        count,
                    });

                })
            })
    }, []);
    const handleClickModify = async ()=>{
        navigate(`/board/post/${num}`);
    }
    const handleClickDelete = async ()=> {
        modal.confirm('게시글 삭제','게시글을 정말로 삭제할까요?',async () => {
            const result = await fetch.$delete(`/api/v1/board/delete/${num}`);
            fetch.resultHandler(result,()=> {
                navigate('/board/1');
            });
        })
    }
    const renderCreateDate = useCallback(()=> {
        if(!data) return null;
        const {years,months,days,hours,minutes,seconds} = dateUtil.parseDate(data.created);
        return (
            <>
                <p className="text-sm font-light">{`${years}년 ${months}월 ${days}일 ${hours}시 ${minutes}분 ${seconds}초`}</p>
            </>
        )
    },[data])
    if(!data) return null;

    return (
        <div className="container mx-auto p-4 bg-white rounded-lg h-screen">
            <h1 className="text-2xl font-bold mb-4 text-black">{data.title}</h1>
            <div className="w-full max-w-[calc(100%-1rem)]">
                <div className="border rounded-lg p-4 shadow-md">
                    <div dangerouslySetInnerHTML={{ __html: data.content }} className="text-gray-700" />
                    <div className="text-right mt-4">
                        <p className="text-sm font-light">작성자: {data.email}</p>
                        {renderCreateDate()}
                    </div>
                </div>
                <div className="flex justify-center gap-2">
                    <button
                        onClick={handleRecommand}
                        className="mt-4 bg-amber-700 hover:bg-amber-800 text-white font-bold py-2 px-4 rounded"
                    >
                        추천 {data.count}
                    </button>
                    <button
                        onClick={() => navigate('/board/1')}
                        className="mt-4 bg-yellow-500 hover:bg-yellow-600 text-white font-bold py-2 px-4 rounded"
                    >
                        목록
                    </button>
                    {auth.isLoggedIn &&
                        <>
                            <button onClick={handleClickModify} className="mt-4 bg-gray-400 hover:bg-blue-600 text-white font-bold py-2 px-4 rounded">
                                수정
                            </button>
                            <button onClick={handleClickDelete} className="mt-4 bg-gray-500 hover:bg-red-600 text-white font-bold py-2 px-4 rounded">
                                삭제
                            </button>
                        </>}
                </div>
            </div>
            <BoardCommentView/>
        </div>
    )
}
