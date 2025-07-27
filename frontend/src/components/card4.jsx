import {useState} from 'react'
import {Link} from 'react-router-dom'
const Card = ({product}) => {
    const [loading,setLoading] = useState(true)
    if(product.product_name){
        product.product_name = product.product_name.charAt(0).toUpperCase() + product.product_name.slice(1);
    }
    return (
        <Link to={`/product/${product.product_id}`}>
            <div className='flex flex-col w-80 h-[440px] bg-gray-200 rounded-xl py-3 px-3'>
                <div className=' w-74 h-90 rounded-lg'>
                    <img src={product.image_url} onLoad={() => setLoading(false)} className={`w-full h-full duration-300 transition-all ${loading ? "animate-pulse bg-gray-300 rounded-lg" : ""}`}/>
                </div>
                <div className='flex flex-col justify-center py-2 space-y-2'>
                    <h1 className={`font-bold text-lg font-arial h-6 w-full text-red-500${loading ? "animate-pulse bg-gray-300 rounded-lg" : ""}`}>{loading ? '' : `$ ${product.price}`}</h1>
                    <h1 className={`font-semibold text-md h-6 w-full${loading ? "animate-pulse bg-gray-300 rounded-lg" : ""}`}>{loading ? '' : `${product.product_name}`}</h1>
                </div>
            </div>
        </Link>
    )
}
export default Card;