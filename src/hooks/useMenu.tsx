import React, {ReactElement, useCallback, useContext, useState} from "react";
import {Link} from "react-router-dom";
import {ContextStore} from "../router/AppRouter";
import UserMenu from "../components/auth/UserMenu";
import GuestMenu from "../components/auth/GuestMenu";


export default function useHeader():HeaderContext {
    const [extraMenu, setExtraMenu] = useState<ReactElement>(<></>);

    const [authMenu, setAuthMenu] = useState<ReactElement>(() => {
        const isLoggedIn = sessionStorage.getItem('key') !== null;
        return isLoggedIn ? <UserMenu/> : <GuestMenu/>
    });
    const setUserMenu = () => {
        setAuthMenu(<UserMenu/>);
    }
    const setGuestMenu = () => {
        setAuthMenu(<GuestMenu/>);
    }

    const setDefault = () => {
        setExtraMenu(() => <></>);
    }

    return {menu: extraMenu, authMenu, setMenu: setExtraMenu, setUserMenu, setGuestMenu, setDefault}
}
