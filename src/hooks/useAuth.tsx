import {useState} from "react";
export type AuthFormType = 'SignIn' | 'SignUp' | 'ForgotPassword'

export type AuthModalState = {
    isOpen?: boolean,
    /**
     * close or open callback
     */
    callback?: () => void,
    authFormType?: AuthFormType
}
export default function useAuth(): AuthContext {
    const [authModalState,setAuthModalState] = useState<AuthModalState>({
        isOpen: false,
        authFormType: 'SignIn'
    });
    const [jwt, setJwt] = useState<Jwt>((): Jwt => {
        const key = localStorage.getItem('key') || '{}';
        return JSON.parse(key);
    });
    const isLoggedIn = localStorage.getItem('key') !== null;
    const saveToken = (jwt: Jwt) => {
        localStorage.setItem('key', JSON.stringify(jwt));
        setJwt(jwt);
    }
    const deleteToken = () => {
        localStorage.removeItem('key');
        setJwt({
            accessToken: '',
            grantType: '',
            tokenExpiresIn: 0
        });
    }
    const close = () => {
        setAuthModalState(prev => ({
            ...prev,
            isOpen: false,
        }));
        authModalState.callback?.();
    }
    const open = () => {
        setAuthModalState(prev => ({
            ...prev,
            isOpen: true,
        }));
        authModalState.callback?.();
    }
    const handleAuthModal = (authModalState:AuthModalState) => {
        setAuthModalState(prev => ({
            ...prev,
            ...authModalState
        }));
    }

    return {
        close,
        open,
        handleAuthModal,
        authModalState,
        jwt,
        saveToken,
        deleteToken,
        isLoggedIn
    }
}
