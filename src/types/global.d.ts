import {Dispatch, ReactElement, SetStateAction} from 'react';
import {AuthModalState} from "../hooks/useAuth";
declare global {

    type SignIn = {
        email: string;
        password: string;
    };

    type SignUp = SignIn & {
        passwordCheck: string;
        code: string;
    };

    type Jwt = {
        grantType: string;
        accessToken: string;
        refreshToken?: string;
        tokenExpiresIn: number;
    };
    type BoardInfo = {
        biNum?: number;
        biUserId?: string;
        biContent: string;
        biTitle: string;
        biCreated?: string;
        biChanged?: string;
        biActive?: number;
        brCount?: number;
    };

    type DateTime = {
        years: string | number;
        months: string | number;
        days: string | number;
        hours: string | number;
        minutes: string | number;
        seconds: string | number;
        date?: Date;
    };

    type FetchResult = {
        responseMessage: string;
        status: string;
        data?: object;
        modal: Modal;
        statusCode: number;
    };

    interface CommonPagination {
        page: number;
        pageSize: number;
        totalPages: number;
        content?: any[];
    }
    interface BoardPagination extends CommonPagination {
        content: BoardInfo[];
    }

    interface BoardCommentPagination extends CommonPagination {
        content: BoardCommentProps[];
    }


    type PaginationProps = {
        pagination: Pagination;
        handlePrev(): void;
        handleNext(): void;
        handleClickPage(page: number): void;
        prevText?: string;
        nextText?: string;
        bottomSize: number;
    };

    type Modal = {
        title: string;
        content: string;
    }

    type UseModal = Modal & {
        isOpen?: boolean;
        closeText?: string;
        onClose(): void;
        onConfirm?: (() => void) | null;
        confirmText?: string;
    };



    interface ModalContext {
        props: UseModal;
        setProps: Dispatch<SetStateAction<UseModal>>;
        open(): void;
        close(callback?:()=>void): void;
        setAuto(title: string, content: string, onClose?:() => void): void;
        confirm(title: string, content: string, onConfirm: () => void,onClose?: () => void): void;
    }

    interface HeaderContext {
        menu: ReactElement;
        authMenu: ReactElement;
        setMenu: Dispatch<SetStateAction<ReactElement>>;
        setDefault(): void;
        setUserMenu(): void;
        setGuestMenu(): void;
    }
    interface AuthContext {
        authModalState:AuthModalState,
        close: () => void;
        open: () => void;
        handleAuthModal: (authModalState:AuthModalState) => void;
        jwt: Jwt;
        saveToken: (Jwt:Jwt) => void;
        deleteToken: () => void;
    }
    type OCIType = 'board' | 'comment'

    type OCIRequest = {
        base64: string;
        name: string;
        size: number;
        type: OCIType;
    }
    type BoardCommentProps = {
        bcNum:number;
        bcUserId?:string;
        bcBoardNum:number;
        bcParentNum?:number;
        bcContent:string;
        bcDeep:number;
        bcCreated?:string;
        bcChanged?:string;
    }



}

