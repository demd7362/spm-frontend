import { useCallback, useContext, useMemo, useState } from 'react';
import { ContextStore } from '../router/AppRouter';
import {useLocation, useNavigate} from 'react-router-dom';
import useAuth from "./useAuth";

const PREFIX = process.env.REACT_APP_API_URL;

export default function useFetch() {
    const navigate = useNavigate();
    const { modal,auth } = useContext(ContextStore);
    const defaultHeaders = useMemo(
        () => {
            return {
                headers: {
                    'content-type': 'application/json',
                    Authorization: auth.jwt.grantType + ' ' + auth.jwt.accessToken,
                },
            }
        },
        [auth.jwt],
    );

    const authenticate = useCallback(async (successCallback?: () => void) => {
        const result = await getRequest('/auth/validate');
        resultHandler(result, successCallback);
    }, []);

    const getRequest = useCallback(
        async (url: string) => {
            const response = await fetch(PREFIX + url, defaultHeaders);
            return await response.json();
        },
        [defaultHeaders],
    );

    const bodyRequest = useCallback(
        async (url: string, method: string,body?: object) => {
            const response = await fetch(PREFIX + url, {
                ...defaultHeaders,
                method,
                body: JSON.stringify(body),
            });
            return await response.json();
        },
        [defaultHeaders],
    );
    const post = useCallback(
        async <T extends object>(url: string, body?: T) => {
            return await bodyRequest(url, 'POST', body);
        },
        [bodyRequest],
    );
    const patch = useCallback(
        async <T extends object>(url: string,body?: T) => {
            return await bodyRequest(url, 'PATCH', body);
        },
        [bodyRequest],
    );
    const $delete = useCallback(
        async <T extends object>(url: string,body?: T) => {
            return await bodyRequest(url, 'DELETE', body);
        },
        [bodyRequest],
    );

    const resultHandler = useCallback(
        (
            { modal:modalOption ,statusCode, status, data }: FetchResult,
            successCallback?: (data?: any) => void,
        ) => {
            switch (statusCode) {
                case 200:
                    successCallback?.(data);
                    break;
                case 401:
                    modal.setAuto(modalOption.title, modalOption.content, () => {
                        auth.handleAuthModal({
                            isOpen:true,
                            authFormType: "SignIn",
                            callback: () => {
                                navigate(-1);
                            }
                        })
                    });
                    break;
                default:
                    modal.setAuto(modalOption.title, modalOption.content);
            }
        },
        [],
    );

    return { get: getRequest, post,patch,$delete, resultHandler, authenticate};
}
