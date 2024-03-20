import Draggable from "react-draggable";
import React, {ReactElement, useEffect, useState} from "react";
import useFetch from "../../hooks/useFetch";
import DateUtils from "../../utils/dateUtils";
import Spinner from "../common/Spinner";
import {useNavigate} from "react-router-dom";


export default function Notice(){
    const fetch = useFetch();
    const navigate = useNavigate();
    const [position, setPosition] = useState({ x: window.innerWidth / 5, y: window.innerHeight / 5});
    const [visible ,setVisible] = useState(true);
    const [notices, setNotices] = useState<BoardInfo[] | null>(() => {
        fetch.get('/api/v1/board/notice/1/5')
            .then(result => {
                fetch.resultHandler(result, (data) => {
                    setNotices(data.content);
                })
            })
        return null;
    });
    const handleDrag = (e: any, data: any) => {
        setPosition({ x: data.x, y: data.y });
    };
    const handleVisible = () => {
        setVisible(false);
    }
    const handleClickNotice = (boardNum: number | undefined) => {
        if(boardNum === undefined) {
            return;
        }
        navigate(`/board/view/${boardNum}/1`);
    }

    const parseDate = (dateStr: string | undefined) => {
        const date = DateUtils.parseDate(dateStr);
        return `${date.years}/${date.months}/${date.days}`;
    }
    return (
        <Draggable onDrag={handleDrag} defaultPosition={position}>
            <div className={`bg-white rounded-md shadow-lg p-4 w-72 ${visible ? '' : 'hidden'}`}>
                <div className='flex justify-between'>
                    <h2 className="text-lg font-semibold mb-2">공지사항</h2>
                    <div onClick={handleVisible} className='cursor-pointer'>X</div>
                </div>
                <ul className="space-y-2">
                    {notices?.map((notice) => (
                        <li key={notice.num} onClick={() => handleClickNotice(notice.num)} className="cursor-pointer bg-gray-100 rounded-md p-2 flex justify-between items-center">
                            <span className="truncate">{notice.title}</span>
                            <span className="text-gray-500 text-sm">{parseDate(notice.created)}</span>
                        </li>
                    ))}
                </ul>
            </div>
        </Draggable>
    )
}
