import React from 'react';
import useFetch from '../hooks/useFetch';

export default function Main() {
    const fetch = useFetch();
    return (
        <>
            <div className={'h-screen flex items-center'}>
                <div className={'container m-auto'}>
                    <div className={'mb-3 flex items-center justify-center'}>
                        {/*<img src={dog} onClick={async ()=> {*/}
                        {/*    const result = await fetch.post('/api/v1/code/mail/send',{*/}
                        {/*        codeType: '01',*/}
                        {/*        email: 'j.h.jung@runtime.co.kr'*/}
                        {/*    })*/}
                        {/*    console.log(result)*/}
                        {/*}}/>*/}
                    </div>
                    <div className={'bg-red-100 text-center space'}>
                    </div>
                </div>
            </div>
        </>
    );
}
