import React, { useCallback, useState } from 'react';

export default function useModal():ModalContext {
    const [props, setProps] = useState<UseModal>({
        title: '',
        content: '',
        isOpen: false,
        onClose: () => {}
    });

    const open = useCallback(() => {
        setProps((prev) => ({
            ...prev,
            isOpen: true,
        }));
    }, []);

    const close = useCallback(() => {
        setProps((prev) => ({
            ...prev,
            isOpen: false,
        }));
    }, []);

    const setAuto = useCallback(
        (title: string, content: string, onClose?: () => void) => {
            setProps((prev) => ({
                ...prev,
                title,
                content,
                isOpen: true,
                onClose : () => {
                    close();
                    onClose?.();
                },
                onConfirm: null,
                closeText: '확인'
            }));
        },
        [],
    );

    const confirm = useCallback((title:string,content:string,onConfirm: () => void, onClose?: () => void)=> {
        setProps((prev) => ({
            ...prev,
            title,
            content,
            isOpen: true,
            onClose: () => {
                close();
                onClose?.();
            },
            onConfirm: () => {
                close();
                onConfirm();
            },
            closeText: '취소',
            confirmText: '확인'
        }));
    },[])

    return {
        props,
        setProps,
        open,
        close,
        setAuto,
        confirm,
    };
}
