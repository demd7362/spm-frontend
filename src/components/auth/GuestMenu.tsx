import React, {useContext} from "react";
import {ContextStore} from "../../router/AppRouter";
import {IoLogInOutline, IoPersonAddOutline} from "react-icons/io5";

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
        <div className='flex space-x-4'>
            <button {...commonProps} onClick={handleSignIn}><IoLogInOutline className='text-4xl'/></button>
            <button {...commonProps} onClick={handleSignUp}><IoPersonAddOutline className='text-4xl'/></button>
        </div>
    )
}
