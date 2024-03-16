import { ClipLoader } from 'react-spinners';

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
