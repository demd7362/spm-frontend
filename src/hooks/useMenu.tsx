import React, {ReactElement, useCallback, useState} from "react";
import UserMenu from "../components/auth/UserMenu";
import GuestMenu from "../components/auth/GuestMenu";


export default function useMenu():MenuContext {
    const [authMenu, setAuthMenu] = useState<ReactElement>(() => {
        const isLoggedIn = localStorage.getItem('key') !== null;
        return isLoggedIn ? <UserMenu/> : <GuestMenu/>
    });
    const setUserMenu = useCallback(() => {
        setAuthMenu(<UserMenu/>);
    },[]);
    const setGuestMenu = useCallback(() => {
        setAuthMenu(<GuestMenu/>);
    },[]);


    return {authMenu,  setUserMenu, setGuestMenu}
}
