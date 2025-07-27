import axios from 'axios';
import {useState, useEffect} from "react"
import { authCookies } from './auth';
import {cacheFav,removeFav} from './cacheFav'

const CheckFavExisting = (productID) => {
    const [isFavorited,setIsFavorited] = useState(false)
    const [loading,setloading] = useState(false);
    const [isLoggedIn, setIsLoggedIn] = useState(false);

    useEffect( () => {
        const checkIsLoggedIn = async () => {
            try {
                const res = await axios.get('http://localhost:5000/api/auth/profile', { withCredentials: true });
                setIsLoggedIn(res.data.isLogged);
            } catch (error) {
                console.error("Error checking login status:", error);
                setIsLoggedIn(false);
            }
        }
        checkIsLoggedIn();
    })
    useEffect(
        () => {
            const checkFav = async () => {
                if(!isLoggedIn){
                    const cacheKey = `favItems`
                    let array = [];
                    const cached =localStorage.getItem(cacheKey)
                    if(cached){
                        array = JSON.parse(cached);
                    }
                    if(array.includes(productID)){
                        setIsFavorited(true);
                        return;
                    }
                    return;
                }
                try {
                    setloading(true);
                    const res = await axios.get(`http://localhost:5000/api/favorites/product/${productID}`,{withCredentials : true })
                    if(res.data.success){
                        setIsFavorited(true);
                        return;
                    }else{
                        setIsFavorited(false);
                        return;
                    }
                } catch (error) {
                    console.error('error checking favorite :', error)
                    setIsFavorited(false);
                }finally{
                    setloading(false);
                }
            }
            checkFav();
        },[productID, isLoggedIn]
    )

    const togglefav = async () => {
        let loggedIn = false;
        try {
            const res = await axios.get('http://localhost:5000/api/auth/profile', {
                withCredentials: true
            });
            loggedIn = !!res.data.isLogged;
            setIsLoggedIn(loggedIn);
        } catch {
            loggedIn = false;
            setIsLoggedIn(false);
        }
        if(!loggedIn){
            console.log('add to cache')
            const cacheKey = `favItems`
            if(isFavorited){
                let array = [];
                const cached = localStorage.getItem(cacheKey);
                if(cached){
                    array = JSON.parse(cached);
                    array = array.filter(item => item !== productID);
                }
                removeFav(cacheKey)
                localStorage.setItem(cacheKey, JSON.stringify(array));
                setIsFavorited(false);
                return;
            }else{
                let array = [];
                const cached = localStorage.getItem(cacheKey);
                if (cached) {
                    try {
                        array = JSON.parse(cached);
                        if (!Array.isArray(array)) array = [];
                    } catch {
                        array = [];
                    }
                }
                array.push(productID);
                cacheFav(cacheKey, productID);
                localStorage.setItem(cacheKey, JSON.stringify(array));
                setIsFavorited(true);
                return;
            }
        }
        try {
            console.log('add to db')
            setloading(true)
            if(isFavorited){
                const res = await axios.delete(`http://localhost:5000/api/favorites/${productID}`,{ withCredentials: true });
                if(res.data.success){
                    setIsFavorited(false)
                }
            }else{
                const res = await axios.post(
                    `http://localhost:5000/api/favorites/${productID}`,{},{withCredentials : true})
                if(res.data.success){
                    setIsFavorited(true)
                }
            }
        } catch (error) {
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
        togglefav
    }
}

export default CheckFavExisting;