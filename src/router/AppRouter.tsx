import {BrowserRouter, Route, Routes} from 'react-router-dom';
import Main from '../pages/Main';
import NotFound from '../pages/NotFound';
import React, {createContext} from 'react';
import Header from '../components/common/Header';
import Board from '../pages/Board';
import Modal from '../components/common/Modal';
import useModal from '../hooks/useModal';
import BoardPost from '../components/board/BoardPost';
import BoardView from "../components/board/BoardView";
import useHeader from "../hooks/useHeader";
import AuthForm from "../components/auth/AuthForm";
import useAuth from "../hooks/useAuth";

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
    return (
        <BrowserRouter>
            <ContextStore.Provider value={contextStore}>
                <Modal {...contextStore.modal.props}/>
                <Header />
                <AuthForm {...contextStore.auth}/>

                <Routes>
                    <Route path="/" element={<Main />} />
                    <Route path="/board/:page" element={<Board />}/>
                    <Route path="/board/post" element={<BoardPost />} />
                    <Route path="/board/post/:num" element={<BoardPost />} />
                    <Route path="/board/view/:num" element={<BoardView/>}/>
                    <Route path="/board/view/:num/:page" element={<BoardView/>}/>
                    <Route path="*" element={<NotFound />} />
                </Routes>
            </ContextStore.Provider>
        </BrowserRouter>
    );
}
