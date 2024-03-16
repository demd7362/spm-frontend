import React, {ChangeEvent, KeyboardEvent, useCallback, useContext, useEffect, useRef, useState} from "react";
import useFetch from "../hooks/useFetch";
import {BarLoader, CircleLoader, ClipLoader} from "react-spinners";
import {ContextStore} from "../router/AppRouter";
import StringUtils from "../utils/StringUtils";

type Role = 'user' | 'assistant';

interface Message {
    role: Role;
    content: string;
}

interface Content {
    text: string;
    type: string;
}

interface Usage {
    input_tokens: number;
    output_tokens: number;
}

interface Response {
    content: Content[];
    id: string;
    model: string;
    role: string;
    stop_reason: string;
    stop_sequence: string;
    type: string;
    usage: Usage;
}

export default function Claude() {
    const [messages, setMessages] = useState<Message[]>([]);
    const inputRef = useRef<HTMLInputElement>(null);
    const divRef = useRef<HTMLDivElement>(null);
    const [input, setInput] = useState('');
    const fetch = useFetch();
    const [loading, setLoading] = useState(false);
    const handleKeyDown = (e: KeyboardEvent<HTMLInputElement>) => {
        if (e.key === 'Enter') {
            handleSendMessage();
        }
    }
    const handleInputChange = (e: ChangeEvent<HTMLInputElement>) => {
        setInput(e.target.value);
    }
    useEffect(() => {
        divRef.current?.scrollTo(0, divRef.current?.scrollHeight);
    }, [messages]);
    const handleFinally = () => {
        setLoading(false);
        inputRef.current?.focus();
    }
    const handleSendMessage = async () => {
        if(!StringUtils.hasText(input)){
            return;
        }
        setLoading(true);
        const updatedMessage = {
            role: 'user' as Role,
            content: input.trim()
        };
        setInput('');
        setMessages(prev => [...prev, updatedMessage]);
        console.log('messages', messages);
        const result = await fetch.post('/api/v1/claude/chat', [...messages, updatedMessage]);
        fetch.resultHandler(result, (data: Response) => {
            console.log('response', data);
            const role = 'assistant';
            const {text} = data.content?.[0];
            setMessages(prev => [...prev, {role, content: text}]);
            handleFinally();
        }, () => {
            setMessages(prev => [...prev.slice(0, prev.length - 1)]);
            console.log(messages);
            handleFinally();
        });
    }
    const renderChat = () => {
        if (loading) {
            return messages.slice(0, messages.length - 1).map((message: Message, index: number) => (
                <div key={index} className={`mb-2 p-2 rounded-lg ${message.role === 'user' ? 'bg-blue-500 text-white self-end' : 'bg-gray-200 text-gray-800 self-start'}`}>
                    {message.content}
                </div>
            )).concat(<BarLoader key={null}/>);
        } else {
            return messages.map((message: Message, index: number) => (
                <div key={index} className={`mb-2 p-2 rounded-lg ${
                    message.role === 'user' ? 'bg-blue-500 text-white self-end' : 'bg-gray-200 text-gray-800 self-start'
                }`}>
                    {message.content}
                </div>
            ))
        }
    }
    return (
        <div className="flex flex-col h-90vh">
            <div ref={divRef} className="flex-1 p-4 overflow-y-auto">
                {renderChat()}
            </div>
            <div className="flex p-4">
                <input type="text" value={input} ref={inputRef} onKeyDown={handleKeyDown} onChange={handleInputChange} className="flex-1 px-4 py-2 border border-gray-300 rounded-l" placeholder="메시지 입력..."/>
                <button disabled={loading} onClick={handleSendMessage} className={`px-4 py-2 text-white rounded-r ${loading ? 'bg-gray-500' : 'bg-blue-500 hover:bg-blue-600'}`}>
                    전송
                </button>
            </div>
        </div>
    );
}
