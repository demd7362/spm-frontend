import { ClipLoader } from 'react-spinners';
import { CSSProperties, useState } from 'react';

type SpinnerProps = {
    loading: boolean
}

export default function Spinner() {

    return (
        <div className="flex justify-center items-center h-screen">
            <ClipLoader />
        </div>
    );
}
