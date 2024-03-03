import React, {FormEvent, useContext, useState} from 'react';
import useFetch from '../../hooks/useFetch';
import {ContextStore} from '../../router/AppRouter';
import Spinner from "../common/Spinner";

export default function SignUpForm() {
    const fetch = useFetch();
    const {modal, auth} = useContext(ContextStore);
    const [loading, setLoading] = useState(false);
    const [isAvailable, setIsAvailable] = useState(false);
    const [formData, setFormData] = useState<SignUp>({
        email: '',
        password: '',
        passwordCheck: '',
        code: ''
    });

    const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const {name, value} = e.target;
        setFormData({...formData, [name]: value});
    };
    const handleSubmit = async (e: FormEvent) => {
        e.preventDefault();
        setLoading(true);
        if (isAvailable) {
            const verifyResult: FetchResult = await fetch.post('/api/v1/code/mail/verify', {
                code: formData.code,
                email: formData.email,
                codeType: '03'
            });
            fetch.resultHandler(verifyResult, async () => {
                const signUpResult: FetchResult = await fetch.post('/api/v1/auth/sign-up', formData);
                fetch.resultHandler(signUpResult, () => {
                    auth.handleAuthModal({
                        isOpen: true,
                        authFormType: "SignIn",
                    })
                });
            })

        } else {
            const {password, passwordCheck} = formData;
            if (password !== passwordCheck) {
                modal.setAuto('비밀번호 불일치', '동일한 비밀번호를 입력해주세요.');
                setLoading(false);
                return;
            }
            const result: FetchResult = await fetch.post('/api/v1/code/mail/send', {
                code: formData.code,
                email: formData.email,
                codeType: '03'
            });
            fetch.resultHandler(result, () => {
                const {title, content} = result.modal;
                modal.setAuto(title,content);
                setIsAvailable(true);
            });
        }
        setLoading(false);
    };
    if (loading) return <Spinner/>
    return (
        <>
            <div className="z-800 flex fixed inset-0 bg-gray-600 bg-opacity-50 overflow-y-auto h-full w-full justify-center items-center">
                <div className="relative p-5 border w-96 shadow-lg rounded-md bg-white min-h-[200px]">
                    <button onClick={auth.close} className="absolute top-0 right-0 p-2 text-black text-lg">
                        X
                    </button>
                    <form onSubmit={handleSubmit} className="space-y-4">
                        <div>
                            <label className="block text-sm font-bold" htmlFor="email">이메일</label>
                            <input className="block w-full mt-1 p-2 border rounded" type="email" name="email" value={formData.email} onChange={handleInputChange} required/>
                        </div>

                        <div>
                            <label className="block text-sm font-bold" htmlFor="password">비밀번호</label>
                            <input className="block w-full mt-1 p-2 border rounded" type="password" name="password" value={formData.password} onChange={handleInputChange} required/>
                        </div>

                        <div>
                            <label className="block text-sm font-bold" htmlFor="confirmPassword"> 비밀번호 확인</label>
                            <input className="block w-full mt-1 p-2 border rounded" type="password" name="passwordCheck" value={formData.passwordCheck} onChange={handleInputChange} required/>
                        </div>
                        <div className={isAvailable ? '' : 'hidden'}>
                            <label className="block text-sm font-bold" htmlFor="code"> 인증 코드</label>
                            <input className="block w-full mt-1 p-2 border rounded" type="text" name="code" value={formData.code} onChange={handleInputChange}/>
                        </div>

                        <button className="block w-full mt-4 p-2 bg-blue-500 text-white rounded" type="submit">
                            {isAvailable ? '회원가입 완료' : '확인'}
                        </button>
                    </form>
                </div>
            </div>
        </>
    );

}
