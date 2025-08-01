import { useState, useEffect, useRef } from 'react';

const useCache = (key, fetcher, options = {}) => {
    const [data, setData] = useState(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    const fetcherRef = useRef(fetcher);
    fetcherRef.current = fetcher;

    useEffect(() => {
        const fetchData = async () => {
            try {
                setLoading(true);
                setError(null);
                const result = await fetcherRef.current();
                setData(result);
            } catch (err) {
                setError(err);
            } finally {
                setLoading(false);
            }
        };

        if (key) {
            fetchData();
        }
    }, [key]);

    const invalidateCache = () => {};

    return { data, loading, error, invalidateCache };
};

export default useCache;