import {ReactElement, useContext, useEffect, useState} from 'react';
import { Link } from 'react-router-dom';
import {ContextStore} from "../../router/AppRouter";

export default function Header() {
    const {header} = useContext(ContextStore);
    return (
        <div className="bg-black text-white top-0 sticky z-10 w-full">
            <div className="container mx-auto flex justify-between p-4">
                <div className="font-bold text-lg space-x-3">
                    <Link to={'/'}>메인</Link>
                    <Link to={'/board/1'}>게시판</Link>
                    {header.menu}
                </div>
                <nav className="space-x-4">{header.authMenu}</nav>
            </div>
        </div>
    );
}
