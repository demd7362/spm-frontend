import {useState} from "react";

export default function useLoading():LoadingContext {
    const [isLoading, setLoading] = useState(false);
    const toggleLoading = () => {
        setLoading(prev => !prev);
    }
    return {
        isLoading,
        toggleLoading
    }
}
