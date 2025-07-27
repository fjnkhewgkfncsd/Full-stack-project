"use client"

import { useState, useEffect } from "react"
import axios from "axios"
import { X, ShoppingBag } from "lucide-react"
import { Trash2 } from 'lucide-react';
import { useNavigate } from "react-router-dom";


const Fav = ({ isOpen, onClose }) => {
    const [isLoading, setIsLoading] = useState(false)
    const [isLoggedIn, setIsLoggedIn] = useState(false)
    const [favItem, setFavItem] = useState([])
    const [isFavEmpty, setIsFavEmpty] = useState(true)
    const navigate = useNavigate();
    useEffect(() => {
    (async () => {
        try {
            const res = await axios.get('http://localhost:5000/api/auth/profile', { withCredentials: true });
            if(res.data.isLogged){
                setIsLoggedIn(true);
                console.log('User is logged in');
                console.log('isLogged: true');
                console.log('fetching from server');
                fetchFavItems();
            } else {
                setIsLoggedIn(false);
                console.log('User is not logged in');
                console.log('isLogged: false');
                console.log('fetching from local storage');
                fetchItemFromLocalStorage();
            }
        } catch(err){
            setIsLoggedIn(false);
            console.log('fetching from local storage',err);
            fetchItemFromLocalStorage();
        }
    })();
}, [isOpen]);

    const fetchFavItems = async () => {
        try {
            const res = await axios.get('http://localhost:5000/api/favorites/all', { withCredentials: true });
            if(res.data.success){
                const fav = res.data.data;
                const items = fav.map(item => ({
                    productId: item.productId,
                    name: item.product.product_name,
                    favoriteId: item.favoriteId,
                    image_url: item.product.image_url,
                    price: item.product.price
                }))
                setFavItem(items);
                setIsFavEmpty(items.length === 0);
            }
            console.log('Fetched favorite items:', favItem);
        } catch (error) {
            console.error("Error fetching favorite items:", error);
        }
    }

    const handleRemoveFav = async (productId) => {
        if(!isLoggedIn){
            const cacheKey = 'favItems';
            const cached = localStorage.getItem(cacheKey);
            let items = [];
            if(cached){
                items = JSON.parse(cached);
            }
            const updatedItems = items.filter(item => item.productId !== productId);
            localStorage.setItem(cacheKey, JSON.stringify(updatedItems));
        }else{
            try{
                const res = await axios.delete(`http://localhost:5000/api/favorites/${productId}`, { withCredentials: true });
                if(res.data.success){
                    console.log('Favorite item removed successfully');
                    fetchFavItems();
                }else{
                    console.error('Failed to remove favorite item');
                }
            }catch(err){
                console.error('Error removing favorite item:', err);
                if(err.response.status === 401){
                    console.log('User is not logged in');
                    console.log('isLogged: false');
                    console.log('fetching from local storage');
                    fetchItemFromLocalStorage();
                }
            }
        }
    }

    const fetchItemFromLocalStorage = () => {
        const cacheKey = 'favItems';
        const cached = localStorage.getItem(cacheKey);
        let items = [];
        if(cached){
            items = JSON.parse(cached);
        }
        setFavItem(items);
        setIsFavEmpty(items.length === 0);
    }
    const CheckIsLoggedIn = async () => {
        try{
            const res = await axios.get('http://localhost:5000/api/auth/profile', { withCredentials: true });
            if(res.data.isLogged){
                setIsLoggedIn(true);
            }else{
                setIsLoggedIn(false);
            }
        }catch(err){
            console.error("Error checking login status:", err);
            setIsLoggedIn(false);
        }
    }
    if(!isOpen) return null;

    return (
        <div className="fixed inset-0 z-50 flex">
        {/* Overlay - takes up 66.67% of the screen with semi-transparent background */}
        <div className="w-2/3 h-full bg-black/30 transition-opacity duration-300" onClick={onClose}></div>

        {/* Cart panel - takes up 33.33% of the screen */}
        <div className="w-1/3 h-full bg-white shadow-xl">
            <div className="flex flex-col h-full">
            {/* Cart header */}
            <div className="flex items-center justify-between p-4 border-b
            mt-[9px]">
                <div className="flex items-center">
                <ShoppingBag className="mr-2" />
                <h2 className="text-lg font-semibold">Your wishlist</h2>
                </div>
                <button onClick={onClose} className="p-1 rounded-full hover:bg-gray-100 cursor-pointer">
                <X size={20} />
                </button>
            </div>

            {/* Cart content */}
            <div className="flex-grow overflow-auto p-4">
                {isLoading ? (
                <div className="flex justify-center items-center h-full">
                    <div className="animate-spin rounded-full h-8 w-8 border-t-2 border-b-2 border-gray-900"></div>
                </div>
                ) : isFavEmpty ? (
                <div className="flex flex-col items-center justify-center h-full text-center">
                    <h2 className="text-2xl font-bold mb-4">Your wishlist is empty</h2>
                    <p className="text-gray-600 mb-8">Check out our latest arrivals stay up-to-date with latest styles</p>
                    <h3 className="text-xl font-semibold mb-4">Start shopping</h3>
                    <div className="space-y-3 w-full">
                    <button className="w-full py-3 bg-black text-white font-medium" onClick={() => navigate('/shop')}>Shopping with us</button>

                    </div>
                </div>
                ) : (
                <div className="space-y-4 border-b-1">
                    {favItem.map((item) => (
                    <div key={item.favoriteId||`${item.productId}`} className="flex pb-4 ">
                        <div className="w-28 h-36 bg-gray-100 mr-3 flex-shrink-0">
                        {item.image_url && (
                            <img
                            src={item.image_url || "/placeholder.svg"}
                            alt={item.name}
                            className="w-full h-full object-cover"
                            />
                        )}
                        </div>
                        <div className="flex flex-col space-y-2 pt-4">
                        <h3 className="font-medium">{(item.name || "Product").toUpperCase()}</h3>
                        <h1 className='font-semibold text-red-500'>${item.price}</h1>
                        </div>
                        <div className='flex items-end justify-end pl-8 pb-4'>
                            <Trash2 onClick={() => handleRemoveFav(item.productId)} />
                        </div>
                    </div>
                    ))}
                </div>
                )}
            </div>
            </div>
        </div>
        </div>
    )
    }

export default Fav
