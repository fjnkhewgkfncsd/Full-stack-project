import axios from 'axios';
import {useState, useEffect} from "react"
import { authCookies } from './auth';
import {cacheFav,removeFav} from './cacheFav'

const CheckFavExisting = (productID) => {
    const [isFavorited,setIsFavorited] = useState(false)
    const [loading,setloading] = useState(false);
    const [errorFav,setError] = useState(null);
    const user = authCookies.getUser();

    useEffect(
        () => {
            const checkFav = async () => {
                if(!user){
                    const cacheKey = `fav_${productID}`
                    const cached =localStorage.getItem(cacheKey)
                    setIsFavorited(!!cached)
                    return;
                }
                try {
                    setloading(true);
                    const res = await axios.get(`http://localhost:5000/api/favorites/${user.id}/${productID}`,
                        {
                            headers : {
                                'Authorization' : `Bearer ${user.token}`,
                                'Content-Type' : 'application/json',
                            },
                            withCredentials : true
                        }
                    )
                    if(res.data.success){
                        setIsFavorited(true);
                        return;
                    }else{
                        setIsFavorited(false);
                        setError(res.data.error);
                        return;
                    }
                } catch (error) {
                    console.error('error checking favorite :', error)
                    setError(error.message);
                    setIsFavorited(false);
                    if(error.res?.status === 401){
                        authCookies.clearAuth();
                    }
                }finally{
                    setloading(false);
                }
            }
            checkFav();
        }, [user?.id, productID]
    )

    const togglefav = async () => {
        console.log(isFavorited)
        if(!user){
            const cacheKey = `fav_${productID}`
            if(isFavorited){
                removeFav(cacheKey)
                setIsFavorited(false);
                return;
            }else{
                cacheFav(cacheKey,productID);
                setIsFavorited(true);
                return;
            }
        }
        try {
            setloading(true)
            if(isFavorited){
                const res = await axios.delete(
                    `http://localhost:5000/api/favorites/${user.id}/${productID}`,
                    {
                        headers : {
                            'Authorization' : `Bearer ${user.token}`,
                            'Content-Type' : 'application/json',
                        },
                        withCredentials : true
                    }
                )
                if(res.data.success){
                    setIsFavorited(false)
                }
            }else{
                const res = await axios.post(
                    `http://localhost:5000/api/favorites`,
                    {
                        user_id : user.id,
                        product_id : productID
                    },
                    {
                        headers : {
                            'Authorization' : `Bearer ${user.token}`,
                            'Content-Type ' : 'application/json',
                        },
                        withCredentials : true
                    }
                )
                if(res.data.success){
                    setIsFavorited(true)
                }
            }
        } catch (error) {
            setError(error.message)
            if(error.res?.status === 401){
                authCookies.clearAuth();
            }
        }finally{
            setloading(false);
        }
    }
    return {
        isFavExisting : isFavorited,
        loadingFavorites : loading,
        errorFav,
        togglefav,
        user
    }
}

export default CheckFavExisting;