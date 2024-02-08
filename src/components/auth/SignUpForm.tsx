import React, { FormEvent, useContext, useState } from 'react';
import useFetch from '../../hooks/useFetch';
import { ContextStore } from '../../router/AppRouter';

export default function SignUpForm() {
    const fetch = useFetch();
    const { modal,auth } = useContext(ContextStore);
    const [formData, setFormData] = useState<SignUp>({
        email: '',
        password: '',
        passwordCheck: '',
    });

    const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const { name, value } = e.target;
        setFormData({ ...formData, [name]: value });
    };
    const handleSubmit = async (e: FormEvent) => {
        e.preventDefault();
        const { password, passwordCheck } = formData;
        if (password !== passwordCheck) {
            modal.setAuto('비밀번호 불일치', '동일한 비밀번호를 입력해주세요.');
            return;
        }
        const result: FetchResult = await fetch.post('/api/v1/auth/sign-up', formData);
        fetch.resultHandler(result, () => {
            auth.handleAuthModal({
                isOpen: true,
                authFormType: "SignIn",
            })
        });
    };

    return (
        <>
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

                        <div>
                            <label className="block text-sm font-bold" htmlFor="confirmPassword">Confirm Password</label>
                            <input className="block w-full mt-1 p-2 border rounded" type="password" name="passwordCheck" value={formData.passwordCheck} onChange={handleInputChange} required/>
                        </div>

                        <button className="block w-full mt-4 p-2 bg-blue-500 text-white rounded" type="submit">
                            회원가입 완료
                        </button>
                    </form>
                </div>
            </div>
        </>
    );

}
