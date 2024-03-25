import {useNavigate} from "react-router-dom";
import {useContext, useEffect} from "react";
import {ContextStore} from "../router/AppRouter";

export default function NotFound() {
    const navigate = useNavigate();
    const {modal} = useContext(ContextStore);
    useEffect(() => {
        modal.setAuto('페이지를 찾을 수 없습니다.', '', () => {
            navigate(-1);
        });
    }, []);
    return (
        <div className="container-fluid">
            <div className="cursor-pointer bg-not-found bg-no-repeat w-screen h-screen bg-center"/>
        </div>
    )
}
