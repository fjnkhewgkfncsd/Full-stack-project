// hooks/useCache.js
import { useState, useEffect, useRef } from 'react';

const useCache = (key, fetcher, options = {}) => {
    const [data, setData] = useState(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    
    // ✅ Use ref to store the latest fetcher without causing re-renders
    const fetcherRef = useRef(fetcher);
    fetcherRef.current = fetcher;

    const {
        cacheDuration = 5 * 60 * 1000,
        storageType = 'localStorage'
    } = options;

    useEffect(() => {
        const fetchData = async () => {
            try {
                setLoading(true);
                setError(null);

                // Check cache
                const storage = storageType === 'sessionStorage' ? sessionStorage : localStorage;
                const cacheKey = `cache_${key}`;
                const timestampKey = `${cacheKey}_timestamp`;
                
                const cachedData = storage.getItem(cacheKey);
                const timestamp = storage.getItem(timestampKey);

                if (cachedData && timestamp) {
                    const isExpired = Date.now() - parseInt(timestamp) > cacheDuration;
                    
                    if (!isExpired) {
                        console.log('✅ Cache HIT:', key);
                        setData(JSON.parse(cachedData));
                        setLoading(false);
                        return;
                    } else {
                        console.log('🗑️ Cache expired:', key);
                        storage.removeItem(cacheKey);
                        storage.removeItem(timestampKey);
                    }
                }

                // Fetch fresh data using ref
                console.log('📡 Fetching:', key);
                const result = await fetcherRef.current(); // ✅ Use ref
                setData(result);

                // Cache result
                storage.setItem(cacheKey, JSON.stringify(result));
                storage.setItem(timestampKey, Date.now().toString());
                console.log('💾 Cached:', key);

            } catch (err) {
                console.error('❌ Error:', err);
                setError(err);
            } finally {
                setLoading(false);
            }
        };

        if (key) {
            fetchData();
        }
    }, [key, cacheDuration, storageType]); // ✅ Removed fetcher from dependencies

    const invalidateCache = () => {
        const storage = storageType === 'sessionStorage' ? sessionStorage : localStorage;
        storage.removeItem(`cache_${key}`);
        storage.removeItem(`cache_${key}_timestamp`);
    };

    return { data, loading, error, invalidateCache };
};

export default useCache;