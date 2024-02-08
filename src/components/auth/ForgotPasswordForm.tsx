import React, {FormEvent, useCallback, useContext, useEffect, useState} from "react";
import useFetch from "../../hooks/useFetch";
import {ContextStore} from "../../router/AppRouter";
import Spinner from "../common/Spinner";

type FormState = {
    button: '분실코드 전송' | '코드 입력',
    endpoint: 'send' | 'verify',
    codeType: string,
    buttonType: 'email' | 'text',
    code: string,
    email: string
}
export default function ForgotPasswordForm() {
    const fetch = useFetch();
    const [formState, setFormState] = useState<FormState>({
        button: '분실코드 전송',
        endpoint: 'send',
        codeType: '02',
        buttonType: 'email',
        code: '',
        email: ''
    });
    const [loading, setLoading] = useState(false);
    const {modal, auth} = useContext(ContextStore);
    useEffect(() => {
        return () => {
            setFormState({
                button: '분실코드 전송',
                endpoint: 'send',
                codeType: '02',
                buttonType: 'email',
                code: '',
                email: ''
            })
        }
    }, [])
    const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const type = e.target.type;
        setFormState(prev => ({
            ...prev,
            [type === 'email' ? 'email' : 'code']: e.target.value
        }))
    };
    const handleSubmit = async (e: FormEvent) => {
        e.preventDefault();
        setLoading(true);
        const {email, codeType, code} = formState;
        const result: FetchResult = await fetch.post(`/api/v1/code/mail/${formState.endpoint}`, {
            email,
            codeType,
            code
        });
        setLoading(false);
        if (result.statusCode === 200) {
            modal.setAuto('이메일로 임시 비밀번호가 발급되었습니다.', '이메일을 확인해주세요.');
            setFormState(prev => ({
                ...prev,
                endpoint: 'verify',
                button: '코드 입력',
                buttonType: 'text',
                value: '',
                code: ''
            }));
        } else {
            fetch.resultHandler(result);
        }
    }
    const handleSignUp = () => {
        auth.handleAuthModal({
            authFormType: "SignUp"
        })
    }
    const handleSignIn = () => {
        auth.handleAuthModal({
            authFormType: "SignIn"
        })
    }
    if (loading) {
        return <Spinner/>
    }
    return (
        <>
            <div className="z-800 flex fixed inset-0 bg-gray-600 bg-opacity-50 overflow-y-auto h-full w-full justify-center items-center">
                <div className="relative p-5 border w-96 shadow-lg rounded-md bg-white min-h-[200px]">
                    <button onClick={auth.close} className="absolute top-0 right-0 p-2 text-black text-lg">
                        X
                    </button>
                    <form onSubmit={handleSubmit} className="space-y-4">
                        <div>
                            <label className="block text-sm font-bold" htmlFor={formState.buttonType}>{formState.buttonType === 'email' ? 'email' : '인증 코드를 입력해주세요.'}</label>
                            <input className="block w-full mt-1 p-2 border rounded" type={formState.buttonType} name={formState.buttonType} value={formState.buttonType === 'email' ? formState.email : formState.code} onChange={handleInputChange} required/>
                        </div>
                        <div className="flex space-x-3">
                            <button className="w-1/3 mt-4 p-2 text-sm bg-blue-500 text-white rounded" type="submit">
                                {formState.button}
                            </button>
                            <button className="w-1/3 mt-4 p-2 text-sm bg-blue-500 text-white rounded" type="button" onClick={handleSignIn}>
                                로그인
                            </button>
                            <button className="w-1/3 mt-4 p-2 text-sm bg-blue-500 text-white rounded" type="button" onClick={handleSignUp}>
                                회원가입
                            </button>
                        </div>
                    </form>
                </div>
            </div>
        </>
    );
}
