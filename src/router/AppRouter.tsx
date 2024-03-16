import {BrowserRouter, Route, Routes} from 'react-router-dom';
import React, {createContext, lazy, Suspense} from 'react';
import useHeader from "../hooks/useHeader";
import useModal from "../hooks/useModal";
import useAuth from "../hooks/useAuth";
import Modal from "../components/common/Modal";
import Header from "../components/common/Header";
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
const headerDefaultValue: HeaderContext = {
    menu: <></>,
    authMenu: <></>,
    setMenu: () => {},
    setGuestMenu: () => {},
    setUserMenu: () => {},
    setDefault: () => {}
}
const authDefaultValue: AuthContext = {
        authModalState: {
        authFormType:'SignIn',
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
    }
}

interface ContextStore {
    modal:ModalContext;
    header:HeaderContext;
    auth: AuthContext;
}

export const ContextStore = createContext<ContextStore>({
    modal: modalDefaultValue,
    header: headerDefaultValue,
    auth: authDefaultValue,
})
export default function AppRouter() {
    const contextStore: ContextStore = {
        header : useHeader(),
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
                <Header />
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
