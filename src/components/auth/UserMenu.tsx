import React, {Dispatch, ReactElement, SetStateAction, useContext} from "react";
import {ContextStore} from "../../router/AppRouter";
import {Link} from "react-router-dom";

const commonProps = {className: 'hover:text-gray-300'};
export default function UserMenu(){
    const {header,auth} = useContext(ContextStore);
    const handleSignOut = () => {
        auth.deleteToken();
        header.setGuestMenu();
    }
    return (
        <>
            <button {...commonProps} onClick={handleSignOut}> 로그아웃 </button>
            <Link {...commonProps} to={'/profile'}> 마이페이지 </Link>
        </>
    )
}
