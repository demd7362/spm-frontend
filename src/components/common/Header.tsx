import {ReactElement, useContext, useEffect, useState} from 'react';
import { Link } from 'react-router-dom';
import {ContextStore} from "../../router/AppRouter";
import '../../index.css'

export default function Header() {
    const {header} = useContext(ContextStore);
    return (
        <div className="bg-gradient-to-r from-blue-600 via-purple-500 to-pink-500 text-white top-0 sticky z-10 w-full shadow-lg">
            <div className="container mx-auto flex justify-between items-center py-4 px-6">
                <div className="flex space-x-4">
                    <Link to={'/'} className="hover:underline">메인</Link>
                    <Link to={'/board/1'} className="hover:underline">게시판</Link>
                    {header.menu}
                </div>
                <nav className="space-x-4">{header.authMenu}</nav>
            </div>
        </div>
    );
}
