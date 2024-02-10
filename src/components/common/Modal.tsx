import {useEffect, useRef} from 'react';

interface ModalProps extends UseModal {}

export default function Modal({
    title,
    content,
    closeText,
    isOpen,
    onClose,
    onConfirm,
    confirmText,
}: ModalProps) {
    const closeButtonRef = useRef<HTMLButtonElement>(null);
    useEffect(() => {
        const handleKeyDown = (event: KeyboardEvent) => {
            if (event.key === 'Enter') {
                onClose();
            }
        }
        closeButtonRef.current?.focus();

        if (isOpen) {
            window.addEventListener('keydown', handleKeyDown);
        }
        return () => {
            window.removeEventListener('keydown', handleKeyDown);
        };
    }, [title, content, onClose, onConfirm]);
    if (!isOpen) return null;

    return (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex justify-center items-center z-900">
            <div className="fixed z-10 inset-0 overflow-y-auto">
                <div className="flex items-end justify-center min-h-screen pt-4 px-4 pb-20 text-center sm:block sm:p-0">
                    <div
                        className="fixed inset-0 transition-opacity"
                        aria-hidden="true"
                    >
                        <div className="absolute inset-0 bg-gray-300 blur-lg opacity-75"></div>
                    </div>

                    <span
                        className="hidden sm:inline-block sm:align-middle sm:h-screen"
                        aria-hidden="true"
                    >
                        &#8203;
                    </span>

                    <div
                        className="inline-block align-bottom bg-white rounded-lg text-left overflow-hidden shadow-xl transform transition-all sm:my-8 sm:align-middle sm:max-w-lg sm:w-full"
                        role="dialog"
                        aria-modal="true"
                        aria-labelledby="modal-headline"
                    >
                        <div className="bg-white px-4 pt-5 pb-4 sm:p-6 sm:pb-4">
                            <div className="sm:flex sm:items-start">
                                <div className="mt-3 text-center sm:mt-0 sm:ml-4 sm:text-left">
                                    <h3
                                        className="text-lg leading-6 font-medium text-gray-900"
                                        id="modal-headline"
                                    >
                                        {title}
                                    </h3>
                                    <div className="mt-2">
                                        <p className="text-sm text-gray-500 whitespace-pre-wrap">
                                            {content}
                                        </p>
                                    </div>
                                </div>
                            </div>
                        </div>
                        <div className="bg-gray-50 px-4 py-3 sm:px-6 flex flex-row-reverse">
                            <button
                                ref={closeButtonRef}
                                onClick={onClose}
                                type="button"
                                className="w-full inline-flex justify-center rounded-md border border-transparent shadow-sm px-4 py-2 bg-red-600 text-base font-medium text-white hover:bg-red-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-red-500 sm:ml-3 sm:w-auto sm:text-sm"
                            >
                                {closeText}
                            </button>
                            {onConfirm && (
                                <button
                                    onClick={onConfirm}
                                    type="button"
                                    className="w-full inline-flex justify-center rounded-md border border-transparent shadow-sm px-4 py-2 bg-blue-600 text-base font-medium text-white hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 sm:ml-3 sm:w-auto sm:text-sm"
                                >
                                    {confirmText}
                                </button>
                            )}
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}
