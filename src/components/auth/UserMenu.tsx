import React, {useContext} from "react";
import {ContextStore} from "../../router/AppRouter";
import {Link} from "react-router-dom";
import {IoLogIn, IoLogOutOutline, IoPersonCircleOutline, IoTrailSignOutline} from "react-icons/io5";

const commonProps = {className: 'hover:text-gray-300'};
export default function UserMenu() {
    const {menu, auth} = useContext(ContextStore);
    const handleSignOut = () => {
        auth.deleteToken();
        menu.setGuestMenu();
    }
    return (
        <div className='flex space-x-2'>
            <button {...commonProps} onClick={handleSignOut}><IoLogOutOutline className='text-4xl'/></button>
            <Link {...commonProps} to={'/profile'}><IoPersonCircleOutline className='text-4xl'/></Link>
        </div>
    )
}
