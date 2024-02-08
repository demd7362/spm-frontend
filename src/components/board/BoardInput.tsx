import React, {ChangeEvent, Dispatch, SetStateAction, useContext, useState} from 'react';
import useFetch from '../../hooks/useFetch';
import {ContextStore} from '../../router/AppRouter';

type BoardInputProps = {
    setRenderTrigger: Dispatch<SetStateAction<number>>
}
export default function BoardInput({setRenderTrigger} : BoardInputProps) {
    const [content, setContent] = useState('');
    const fetch = useFetch();
    const {modal} = useContext(ContextStore);
    const handleSubmit = async () => {
        if (content.length > 50) {
            modal.setAuto(
                '글은 50자를 초과하여 작성할 수 없습니다.',
                `현재 글자 수 ${content.length}자리`,
            );
            return;
        }
        const result: FetchResult = await fetch.post('/api/v1/board/insert', {
            biContent: content,
        });
        fetch.resultHandler(result, () => {
            setRenderTrigger(prev => prev + 1);
            setContent('');
        });
    };
    const handleKeyUp = (e: React.KeyboardEvent<HTMLInputElement>) => {
        if (e.key === 'Enter') {
            handleSubmit();
        }
    };
    const handleInputChange = (e: ChangeEvent<HTMLInputElement>) => {
        setContent(e.target.value);
    };
    return (
        <>
            <div
                className={'container mx-auto flex py-2 items-center space-x-3'}
            >
                <div>
                    <input
                        onChange={handleInputChange}
                        onKeyUp={handleKeyUp}
                        value={content}
                        className={
                            'bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500'
                        }
                    />
                </div>
                <button
                    className={
                        'bg-white hover:bg-gray-100 text-gray-800 font-semibold py-2 px-4 border border-gray-400 rounded shadow'
                    }
                    onClick={handleSubmit}
                >
                    글쓰기
                </button>
            </div>
        </>
    );
}
