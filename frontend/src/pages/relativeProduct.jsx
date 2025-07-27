import {useState,useEffect} from 'react'
import axios from 'axios'
import Card from '../components/card4.jsx'
import {useParams} from 'react-router-dom'
const RelativeProduct = ({team,region}) => {
    const [products,setProducts] = useState([])
    const [loading,setloading] = useState(true)
    const { id } = useParams(); 
    useEffect(
        () => {
            const fetchRelateProduct = async() => {
                try {
                    setloading(true);
                    const res = await axios.get(`http://localhost:5000/api/products/relative/${team}`)
                    if(res.data.success){
                        console.log('fetch relative products successfully');
                        setProducts(res.data.data);
                        setloading(false);
                        console.log(products)
                        console.log(res.data.data)
                    }
                } catch (error) {
                    console.error('failed to fetch relative products:',error)
                }finally{
                    setloading(false)
                }
            }
            if(team){
                fetchRelateProduct()
            }
        },[]
    )
    useEffect(() => {
        console.log(' Products state updated:', products);
        console.log(' Products count:', products.length);
    }, [products]);

    return (
        <div className='mx-16 space-y-8'>
            <div>
                <div className='flex items-center gap-4'>
                    <div className='h-[2px] w-32 bg-gray-200 rounded-sm'></div>
                    <h1 className='text-xl font-bold font-serif w-64 text-center'>Related Product</h1>
                    <div className='h-[2px] w-full bg-gray-200 rounded-sm'></div>
                </div>
            </div>
            <div>
                {
                    products ? (
                        <div className='flex flex-wrap gap-9'>
                            {
                                products.map((product,index) => {
                                    if(product.product_id === id){
                                        return null;
                                    }
                                    return (
                                            <Card key={product.product_id || index} product={product}/>
                                    )
                                })
                            }
                        </div>) : (
                        <div className='flex justify-center items-center h-96'>
                            <h1 className='text-2xl font-bold text-gray-500'>No relative products found</h1>
                        </div>
                    )
                }
            </div>
        </div>
    )
}
export default RelativeProduct;