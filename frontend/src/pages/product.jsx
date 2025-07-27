import axios from 'axios';
import {useState,useEffect} from 'react';
import {useParams} from 'react-router-dom';
import useCache from '../utils/useCache.jsx'
import { Minus,Plus,Heart,ChevronDown,ChevronUp,Timer,PhoneCall,CreditCard } from 'lucide-react';
import heart from '../asset/icon/heart.png';
import checkFavExisting from '../utils/checkFavExisting.jsx'
import {addCartToCache,checkIfCartExisting,updateCartInCache} from '../utils/cacheCart.jsx'
import RelativeProduct from '../pages/relativeProduct.jsx'
const Product = () => {
    const {id} = useParams();
    const [clickDown,setClickDown] = useState(true)
    const {isFavExisting,loadingFavorites,errorFav,togglefav} = checkFavExisting(id)
    const [loadingCartAdding,setLoadingCartAdding] = useState(false);
    const [islogged,setIslogged] = useState(false);
    const [order,setOrder] = useState({
        product_id : id,
        size : '',
        quantity : 1,
        image_url : '',
        price : 0,
        name : ''
    })
    useEffect(() => {
        CheckIsLoggedByLocalStorage();
    })
    const CheckIsLoggedByLocalStorage = () => {
        const key = 'isLoggedIn';
        setIslogged(localStorage.getItem(key))
    }
    const {data : product , loading , error} = useCache(
        `product_${id}`,
        async () => {
            const response = await axios.get(`http://localhost:5000/api/products/${id}`);
            if(response.data.success){
                return response.data.data;
            }
            throw new Error('product not fount');
        }
    )
    if(loading){
        return(
            <div className="flex justify-center items-center min-h-screen">
                <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-blue-500"></div>
            </div>
        )
    }
    if(error){
        return (
            <div className="flex justify-center items-center min-h-screen">
                <h1 className="text-2xl text-red-500">Error: {error.message}</h1>
            </div>
        )
    }
    const handleClickSize = (size) => {
        setOrder( prevOrder => ({
            ...prevOrder,
            size : size
        }))
    }
    const handleClickOnMinus = () => {
        setOrder(prevOrder => ({
            ...prevOrder,
            quantity : Math.max(1,prevOrder.quantity-1)
        }))
    }
    const resetQuantity = () => {
        setOrder(prev => ({
                    ...prev,
                    quantity : 1
                })
            )
    }
    const handleClickOnAddToCart = async () => {
        setLoadingCartAdding(true);
        order.image_url = product.image_url;
        order.price = product.price;
        order.name = product.product_name;
        if(order.size === ''){
            alert('please select a size')
            setLoadingCartAdding(false);
            return;
        }else if(!islogged){
            console.log('add cart in localstorage')
            const cartIndex = checkIfCartExisting(order.product_id,order.size)
            if(cartIndex !== -1){
                console.log('cart already exists in local storage')
                updateCartInCache(order,cartIndex);
                resetQuantity()
                setLoadingCartAdding(false);
                console.log('here')
                return;
            }else{
                console.log('cart does not exist in local storage')
                addCartToCache(order);
                resetQuantity()
                setLoadingCartAdding(false);
                console.log(loadingCartAdding)
                return;
            }
        }else{
            //check in database
            console.log('add cart in database')
            try {
                const res = await axios.post('http://localhost:5000/api/cart/add',
                {
                    productId : id,
                    quantity : order.quantity,
                    size : order.size
                },
                {
                    withCredentials: true
                })
                if(res.data.success){
                    console.log('cart added successfully')
                    resetQuantity();
                    setLoadingCartAdding(false);
                }
            } catch (error) {
                console.error('error adding to cart:',error)
            }finally{
                setLoadingCartAdding(false);
            }
        }
    }

    const handleClickOnPlus = () => {
        setOrder(prevOrder => ({
            ...prevOrder,
            quantity : prevOrder.quantity + 1
        }))
    }
    const handleClickOnDropDown = () => {
        setClickDown(!clickDown)
    }
    const name = product.product_name;
    const upperCaseName = name.charAt(0).toUpperCase() + name.slice(1);
    const price = product.sizes[0].price_override === null ? false : true;  
    return (
        <div className='flex flex-col mb-8'>
            <div>
                <div className='flex my-4 space-x-20 justify-center'>
                    <img src={product.image_url} alt="" className='w-[480px] h-[550px] border border-gray-200 rounded-lg shadow-lg'/>
                    <div className='space-y-3 my-8'>
                        <div>
                            {price ? (
                                <div className='flex gap-4'>
                                    <h1 className='text-xl text-red-500 font-bold' >${product.sizes[0].price_override}</h1>
                                    <del className='text-xl font-semibold'>${product.price}</del>
                                </div>
                                    )
                                : (<h1 className='text-xl text-red-500 font-bold'>${product.price}</h1>)}
                            
                        </div>
                        <h1 className='font-normal text-lg'>{upperCaseName}</h1>
                        <div className='space-y-2'>
                            <h1 className='font-normal text-lg'>Size :</h1>
                            <div className='flex '>
                                {product.sizes.map((size, index) => (
                                    <button key={index} onClick={() => handleClickSize(size.size)}  
                                        className={`
                                            w-12 h-12 flex items-center justify-center border-2 rounded-md mr-2 mb-2 text-sm font-medium transition-all duration-200
                                            ${order.size === size.size 
                                                ? 'border-blue-500 bg-blue-500 text-white shadow-md' 
                                                : 'border-gray-300 text-gray-700 hover:border-blue-400 hover:bg-blue-50'
                                            }
                                            ${size.stock_quantity === 0 
                                                ? 'opacity-50 cursor-not-allowed bg-gray-100' 
                                                : 'cursor-pointer'
                                            }
                                        `}                                  disabled={size.stock_quantity === 0}>
                                        {size.size}
                                    </button>
                                ))}
                            </div>
                        </div>
                        <h1 className='text-lg'>Quantity :</h1>
                        <div className='flex items-center space-x-3'>
                            <button className='w-8 h-8 border-2 border-gray-300 rounded-lg text-xl flex items-center justify-center cursor-pointer bg-gray-200 disabled:cursor-not-allowed disabled:opacity-50' onClick={handleClickOnMinus} disabled={order.quantity===1} >
                                <Minus />
                            </button>
                            <input type="number" value={order.quantity} className='border-2 border-gray-300 w-16 h-12 text-center rounded-lg pl-3' disabled />
                            <button className='w-8 h-8 border-2 border-gray-300 rounded-lg text-xl flex items-center justify-center cursor-pointer bg-gray-200 disabled:cursor-not-allowed disabled:opacity-50' onClick={handleClickOnPlus} disabled={order.quantity>=10}> 
                                <Plus/>
                            </button>
                        </div>   
                        <div className='my-8 flex space-x-2'>
                            <button className=' w-54 text-lg font-medium rounded-xl h-12 bg-green-400 cursor-pointer flex items-center justify-center ' onClick={handleClickOnAddToCart}>Add To Cart{ loadingCartAdding && <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white"></div>}</button>
                            <button 
                            className={`
                                w-12 h-12 rounded-xl flex items-center justify-center cursor-pointer 
                                transform transition-all duration-300 ease-in-out
                                ${isFavExisting 
                                    ? 'bg-pink-300 hover:bg-pink-400 text-white scale-110 shadow-lg' 
                                    : 'bg-gray-100 hover:bg-red-100 text-gray-600 hover:scale-105'
                                }
                                ${loadingFavorites 
                                    ? 'opacity-50 cursor-not-allowed animate-pulse' 
                                    : 'hover:shadow-md active:scale-95'
                                }
                            `}
                            onClick={togglefav}
                            disabled={loadingFavorites}
                        >
                            {loadingFavorites ? (
                                <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white"></div>
                            ) : isFavExisting ? (
                                <img 
                                    src={heart} 
                                    alt="Favorited" 
                                    className='w-6 h-6 transition-transform duration-200 hover:scale-110' 
                                />
                            ) : (
                                <Heart className='w-6 h-6 transition-transform duration-200 hover:scale-110' />
                            )}
                        </button>
                        </div>
                        <div>
                            <div className='bg-gray-200 w-96 h-16 rounded-t-xl flex items-start justify-end p-4 '>
                                {clickDown ? (<button onClick={handleClickOnDropDown}><ChevronUp/></button>) : (<button onClick={handleClickOnDropDown}><ChevronDown/></button>)}
                            </div>
                            {
                                clickDown && (
                                    <div className='bg-gray-100 w-96 h-56 rounded-b-xl flex items-start py-4 flex-wrap'>
                                        <div className='flex space-x-2 px-4 items-center'>
                                            <Timer/>
                                            <div className='flex flex-col'>
                                                <h2>Fast Delivery</h2>
                                                <h2>From 1 - 3 days</h2>
                                            </div>
                                        </div>
                                        <div className='flex space-x-2 px-4 items-center'>
                                            <PhoneCall/>
                                            <div className='flex flex-col'>
                                                <h2>Support 24/7</h2>
                                                <h2>(+855) 069 255 312</h2>
                                            </div>
                                        </div>
                                        <div className='flex space-x-2 px-4 items-center'>
                                            <CreditCard/>
                                            <div className='flex flex-col'>
                                                <h2>ABA Pay</h2>
                                                <h2>Easy Pay Easy Life</h2>
                                            </div>
                                        </div>
                                    </div>
                                )
                            }
                        </div> 
                    </div>
                </div>
            </div>
            <RelativeProduct team={product.team} region={product.region}/>
        </div>
    )
}

export default Product;