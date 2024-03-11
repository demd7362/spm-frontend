import useFetch from '../../hooks/useFetch';
import React, {ChangeEvent, Fragment, useCallback, useContext, useEffect, useState,} from 'react';
import dateUtil from '../../utils/dateUtils';
import Spinner from '../common/Spinner';
import Pagination from '../common/Pagination';
import {useNavigate, useParams} from 'react-router-dom';
import usePagination from "../../hooks/usePagination";
import {ContextStore} from "../../router/AppRouter";

const BOTTOM_SIZE = 10;
const PAGE_SIZE_MULTIPLE_VALUE = 20;
const SELECT_OPTIONS = 5;

export default function BoardForm() {
    const params = useParams();
    const {page} = params;
    const navigate = useNavigate();
    const {modal} = useContext(ContextStore);
    const fetch = useFetch();
    const {
        pagination,
        setPagination,
        handleNext,
        handlePrev,
        handleClickPage
    } = usePagination<BoardPagination>(Number(page || '1'), PAGE_SIZE_MULTIPLE_VALUE, BOTTOM_SIZE);
    useEffect(() => {
        fetch
            .get(`/api/v1/board/list/${pagination.page}/${pagination.pageSize}`)
            .then((result) => {
                fetch.resultHandler(result, (data) => {
                    console.log(data)
                    if (data.content.length > 0) {
                        setPagination(prev => ({
                            ...prev,
                            content: data.content,
                            totalPages: data.totalPages
                        }));
                        navigate(`/board/${pagination.page || 1}`, { replace: true });
                    }
                });
            });
    }, [pagination.page, pagination.pageSize]);


    const handleOptionChange = useCallback(
        (e: ChangeEvent<HTMLSelectElement>) => {
            debugger
            const pageSize = Number(e.target.value);
            if (isNaN(pageSize)) return;
            setPagination((prev: BoardPagination) => {
                return {
                    ...prev,
                    page: 1,
                    pageSize,
                };
            });
        },
        [],
    );

    const renderOptions = useCallback(() => {
        return [...new Array(SELECT_OPTIONS)].map((_, index) => {
            return (
                <Fragment key={index}>
                    <option value={(index + 1) * PAGE_SIZE_MULTIPLE_VALUE}>
                        {(index + 1) * PAGE_SIZE_MULTIPLE_VALUE}
                    </option>
                </Fragment>
            );
        });
    }, []);
    const handlePost = useCallback(async () => {
        navigate('/board/post');
    }, [])
    const handleClickPost = (num: number) => {
        navigate(`/board/view/${num}/1`);
    }
    return (
        <>
            <div className={'container mx-auto'}>
                <div className={'flex items-baseline'}>
                    <div className={
                        'container mx-auto flex py-2 items-center space-x-3'
                    }>
                        <button className={
                            'bg-white hover:bg-gray-100 text-gray-800 font-semibold py-2 px-4 border border-gray-400 rounded shadow'
                        } onClick={handlePost}>
                            글쓰기
                        </button>
                    </div>
                    <select value={pagination.pageSize} className={
                        'bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500'
                    } onChange={handleOptionChange}>
                        {renderOptions()}
                    </select>
                </div>
                {pagination.content.map((row: BoardInfo) => {
                    const {years, months, days, hours, minutes} =
                        dateUtil.parseDate(row.changed);
                    return (
                        <div className={'bg-amber-50 text-black py-4 px-6 mb-4 rounded-lg shadow-lg transition duration-300 ease-in-out text-lg font-semibold border-2 border-t-amber-100'} key={row.num}>
                            <span className={'text-left py-3 px-4'}>
                                #{row.num}
                            </span> <span className={'text-left py-3 px-4'}>
                                ID : {row.email}
                            </span>
                            <span className={'text-left py-3 px-4 cursor-pointer hover:text-gray-300'} onClick={() => {
                                handleClickPost(row?.num ?? 1);
                            }}>
                                &gt; {row.title}
                            </span>
                            <span className={'text-left py-3 px-4'}>{`${years}년 ${months}월 ${days}일 ${hours}시 ${minutes}분`}</span>
                        </div>
                    );
                })}
            </div>
            <div className={'container mx-auto py-2'}>
                {pagination.content.length > 0 && (
                    <Pagination pagination={pagination} handlePrev={handlePrev} handleNext={handleNext} handleClickPage={handleClickPage} bottomSize={BOTTOM_SIZE}/>
                )}
            </div>
        </>
    );
}
