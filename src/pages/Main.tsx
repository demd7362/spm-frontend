import React, {useEffect, useState} from 'react';
import Draggable from 'react-draggable';


interface Notice {
    id: number;
    title: string;
    date: string;
}

const notices: Notice[] = [
    {
        id: 1,
        title: 'AI 채팅 기능 업데이트',
        date: '2024-03-15',
    },
    {
        id: 2,
        title: '게시판 업데이트',
        date: '2024-03-10',
    },
    {
        id: 3,
        title: '이벤트 당첨자 발표',
        date: '2024-03-05',
    },
];

export default function Main(){
    const [position, setPosition] = useState({ x: window.innerWidth / 5, y: window.innerHeight / 5});
    const [visible ,setVisible] = useState(true);
    const [d ,setD] = useState(1);
    const handleDrag = (e: any, data: any) => {
        setPosition({ x: data.x, y: data.y });
    };
    const handleVisible = () => {
        setVisible(false);
    }

    return (
        <Draggable onDrag={handleDrag} defaultPosition={position}>
            <div className={`bg-white rounded-md shadow-lg p-4 w-72 ${visible ? '' : 'hidden'}`}>
                <div className='flex justify-between'>
                    <h2 className="text-lg font-semibold mb-2">공지사항</h2>
                    <div onClick={handleVisible} className='cursor-pointer'>X</div>
                </div>
                <ul className="space-y-2">
                {notices.map((notice) => (
                        <li key={notice.id} className="bg-gray-100 rounded-md p-2 flex justify-between items-center">
                            <span className="truncate">{notice.title}</span>
                            <span className="text-gray-500 text-sm">{notice.date}</span>
                        </li>
                    ))}
                </ul>
            </div>
        </Draggable>
    );
};

