import { useState, useEffect } from "react";

const useAxios = () => {
    const [response, setResponse] = useState([]);
    const [error, setError] = useState('');
    const [loading, setLoading] = useState(false);
    const [controller, setController] = useState();

    const axiosFetch = async (configObj) => {
        const {
            axiosInstance,
            method,
            url,
            requestConfig = {}
        } = configObj;

        try {
            setLoading(true);
            const ctrl = new AbortController();
            setController(ctrl);
            const res = await axiosInstance[method.toLowerCase()](url, {
                ...requestConfig
            });
            setResponse(res.data);
        } catch (err) {
            if (err.response){
                setError(err.response.data)
            } else {
                setError(err.message);
            }
        } finally {
            setLoading(false);
        }
    }

    useEffect(() => {
        return () => controller && controller.abort();
    }, [controller]);

    return [response, error, loading, axiosFetch, setError];
}

export default useAxios;