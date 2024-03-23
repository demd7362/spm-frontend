import {BrowserRouter, Route, Routes} from 'react-router-dom';
import React, {createContext, lazy, Suspense} from 'react';
import useMenu from "../hooks/useMenu";
import useModal from "../hooks/useModal";
import useAuth from "../hooks/useAuth";
import Modal from "../components/common/Modal";
import Menu from "../components/common/Menu";
import AuthForm from "../components/auth/AuthForm";
import Spinner from "../components/common/Spinner";
import Claude from "../pages/Claude";


const modalDefaultValue: ModalContext = {
    props: {
        title: '',
        content: '',
        onClose: () => {}
    },
    setProps: () => {},
    open: () => {},
    close: () => {},
    setAuto: (arg1, arg2) => {},
    confirm: (arg1,arg2,arg3) => {}
};
const menuDefaultValue: MenuContext = {
    authMenu: <></>,
    setGuestMenu: () => {},
    setUserMenu: () => {},
}
const authDefaultValue: AuthContext = {
        authModalState: {
        authFormType: 'SignIn',
        isOpen:false,
    },
    close: () => {},
    open: () => {},
    handleAuthModal: () => {},
    saveToken: () => {},
    deleteToken: () => {},
    jwt: {
        accessToken: '',
        grantType: '',
        tokenExpiresIn: 0
    },
    isLoggedIn: false
}

interface ContextStore {
    modal: ModalContext;
    menu: MenuContext;
    auth: AuthContext;
}

// eslint-disable-next-line @typescript-eslint/no-redeclare
export const ContextStore = createContext<ContextStore>({
    modal: modalDefaultValue,
    menu: menuDefaultValue,
    auth: authDefaultValue,
})
export default function AppRouter() {
    const contextStore: ContextStore = {
        menu : useMenu(),
        modal : useModal(),
        auth: useAuth()
    }
    const Main = lazy(() => import('../pages/Main'));
    const NotFound = lazy(() => import('../pages/NotFound'));
    const Board = lazy(() => import('../pages/Board'));
    const BoardPost = lazy(() => import('../components/board/BoardPost'));
    const BoardView = lazy(() => import("../components/board/BoardView"));
    const Profile = lazy(() => import("../pages/Profile"));
    return (
        <BrowserRouter>
            <ContextStore.Provider value={contextStore}>
                <Modal {...contextStore.modal.props}/>
                <Menu />
                <AuthForm {...contextStore.auth}/>
                <Suspense fallback={<Spinner/>}>
                    <Routes>
                        <Route path="/" element={<Main />} />
                        <Route path="/board/:page" element={<Board />}/>
                        <Route path="/chat" element={<Claude/>}/>
                        <Route path="/board/view/:num" element={<BoardView/>}/>
                        <Route path="/board/view/:num/:page" element={<BoardView/>}/>
                        <Route path="/board/post" element={<BoardPost />} />
                        <Route path="/board/post/:num" element={<BoardPost />} />
                        <Route path="/profile" element={<Profile/>}/>
                        <Route path="*" element={<NotFound />} />
                    </Routes>
                </Suspense>
            </ContextStore.Provider>
        </BrowserRouter>
    );
}
