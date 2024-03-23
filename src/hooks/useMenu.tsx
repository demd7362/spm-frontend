import React, {ReactElement, useState} from "react";
import UserMenu from "../components/auth/UserMenu";
import GuestMenu from "../components/auth/GuestMenu";


export default function useMenu():MenuContext {

    const [authMenu, setAuthMenu] = useState<ReactElement>(() => {
        const isLoggedIn = localStorage.getItem('key') !== null;
        return isLoggedIn ? <UserMenu/> : <GuestMenu/>
    });
    const setUserMenu = () => {
        setAuthMenu(<UserMenu/>);
    }
    const setGuestMenu = () => {
        setAuthMenu(<GuestMenu/>);
    }


    return {authMenu,  setUserMenu, setGuestMenu}
}
