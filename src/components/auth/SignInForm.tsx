import React, {FormEvent, useCallback, useContext, useState} from 'react';
import useFetch from '../../hooks/useFetch';
import {ContextStore} from "../../router/AppRouter";


export default function SignInForm() {
    const fetch = useFetch();
    const {header, modal,auth} = useContext(ContextStore);
    const [formData, setFormData] = useState<SignIn>({
        email: '',
        password: '',
    });
    const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const {name, value} = e.target;
        setFormData({...formData, [name]: value});
    };

    const handleSubmit = useCallback(async (e: FormEvent) => {
        e.preventDefault();
        const result: FetchResult = await fetch.post('/api/v1/auth/sign-in', formData);
        fetch.resultHandler(result, (data) => {
            const {title, content} = result.modal;
            modal.setAuto(title, content);
            header.setUserMenu();
            auth.saveToken(data);
            auth.close();
        });
    }, [formData])
    const handleForgotPassword = () => {
        auth.handleAuthModal({
            authFormType: "ForgotPassword"
        })
    }
    const handleSignUp = () => {
        auth.handleAuthModal({
            authFormType: "SignUp"
        })
    }
    return (
        <div className="z-800 flex fixed inset-0 bg-gray-600 bg-opacity-50 overflow-y-auto h-full w-full justify-center items-center">
            <div className="relative p-5 border w-96 shadow-lg rounded-md bg-white min-h-[200px]">
                <button onClick={auth.close} className="absolute top-0 right-0 p-2 text-black text-lg">
                    X
                </button>
                <form onSubmit={handleSubmit} className="space-y-4">
                    <div>
                        <label className="block text-sm font-bold" htmlFor="email">Email</label>
                        <input className="block w-full mt-1 p-2 border rounded" type="email" name="email" value={formData.email} onChange={handleInputChange} required/>
                    </div>

                    <div>
                        <label className="block text-sm font-bold" htmlFor="password">Password</label>
                        <input className="block w-full mt-1 p-2 border rounded" type="password" name="password" value={formData.password} onChange={handleInputChange} required/>
                    </div>

                    <div className="flex space-x-3">
                        <button className="w-1/3 mt-4 p-2 text-sm bg-blue-500 text-white rounded" type="submit">
                            접속
                        </button>
                        <button className="w-1/3 mt-4 p-2 text-xs bg-blue-500 text-white rounded" type="button" onClick={handleForgotPassword}>
                            비밀번호 분실
                        </button>
                        <button className="w-1/3 mt-4 p-2 text-sm bg-blue-500 text-white rounded" type="button" onClick={handleSignUp}>
                            회원가입
                        </button>
                    </div>
                </form>
            </div>
        </div>
    );
}
