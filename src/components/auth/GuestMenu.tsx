import React, {useCallback, useContext} from "react";
import {ContextStore} from "../../router/AppRouter";

const commonProps = {className: 'hover:text-gray-300'};
export default function GuestMenu(){
    const {auth} = useContext(ContextStore);
    const handleSignIn = () => {
        auth.handleAuthModal({
            isOpen:true,
            authFormType: "SignIn",
        })
    }
    const handleSignUp = () => {
        auth.handleAuthModal({
            isOpen:true,
            authFormType: "SignUp",
        })
    }
    return (
        <>
            <button {...commonProps} onClick={handleSignIn}> 로그인 </button>
            <button {...commonProps} onClick={handleSignUp}> 회원가입 </button>
        </>
    )
}
