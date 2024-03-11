import {useEffect, useMemo, useState} from "react";
import useFetch from "../hooks/useFetch";
import DateUtils from "../utils/dateUtils";

export default function Profile() {
    const fetch = useFetch();
    const [isAuthorized, setIsAuthorized] = useState(false);
    const [userInfo, setUserInfo] = useState<UserInfo>({
        point: 0,
        email: ''
    });
    useEffect(() => {
        getProfile();
    }, []);
    const getProfile = async () => {
        const result: FetchResult = await fetch.get('/api/v1/auth/profile');
        fetch.resultHandler(result, (data) => {
            setUserInfo(data);
            setIsAuthorized(true);
        })
    }
    const getDateDiff = useMemo(() => {
        if(userInfo.created === undefined){
            return null;
        }
        const dateObject = DateUtils.parseDate(userInfo.created);
        const createdDate = dateObject.date;
        if(!createdDate){
            return null;
        }
        const currentDate = new Date();
        const diffInMilliseconds = currentDate.getTime() - createdDate.getTime();

        return Math.floor(diffInMilliseconds / (1000 * 60 * 60 * 24));
    },[userInfo.created])
    if (!isAuthorized) return null;
    return (
        <div className="flex items-center justify-center h-screen">
            <div className='flex space-x-10'>
                <div className="bg-blue-500 text-white font-bold py-6 px-8 rounded-lg shadow-md">
                    <p className="text-center text-3xl mb-2">당신의 포인트</p>
                    <p className="text-center text-6xl">{userInfo.point}</p>
                </div>
                <div className="bg-blue-500 text-white font-bold py-6 px-8 rounded-lg shadow-md">
                    <p className="text-center text-3xl mb-2">가입일로부터</p>
                    <p className="text-center text-6xl">D-{getDateDiff}</p>
                </div>
                <div className="cursor-pointer  bg-blue-500 text-white font-bold py-6 px-8 rounded-lg shadow-md">
                    <p className="text-center hover:text-cyan-200 text-4xl mt-7">비밀번호 변경</p>
                </div>
            </div>
        </div>
    )
}
