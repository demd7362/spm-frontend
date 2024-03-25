import {useCallback, useMemo, useState} from "react";
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
    const isLoggedIn = useMemo(() => localStorage.getItem('key') !== null,[]);
    const saveToken = useCallback((jwt: Jwt) => {
        localStorage.setItem('key', JSON.stringify(jwt));
        setJwt(jwt);
    },[]);
    const deleteToken = useCallback(() => {
        localStorage.removeItem('key');
        setJwt({
            accessToken: '',
            grantType: '',
            tokenExpiresIn: 0
        });
    },[])
    const close = useCallback(() => {
        setAuthModalState(prev => ({
            ...prev,
            isOpen: false,
        }));
        authModalState.callback?.();
    },[authModalState])
    const open = useCallback(() => {
        setAuthModalState(prev => ({
            ...prev,
            isOpen: true,
        }));
        authModalState.callback?.();
    },[authModalState])
    const handleAuthModal = useCallback((authModalState:AuthModalState) => {
        setAuthModalState(prev => ({
            ...prev,
            ...authModalState
        }));
    },[]);

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
