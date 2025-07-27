import axios from 'axios';
import { useEffect, useState } from 'react';
import Card from '../components/card.jsx';
import { scrollToTop } from '../utils/skullToTop.jsx';

const Shop = () => {
    const [isLoading, setLoading] = useState(true);
    const [products, setProducts] = useState([]);
    const [totalPage, setTotalPage] = useState(0);
    const [currentPage, setCurrentPage] = useState(1);

    useEffect(() => {
        fetchitem();
    }, [currentPage]);
    const fetchitem = async () => {
        setLoading(true);
        try {
            const res = await axios.get(`http://localhost:5000/api/products?page=${currentPage}`);
            if(res.data.success){
                setProducts(res.data.data);
                setTotalPage(Math.ceil(res.data.totalCount / 12));
            }else{
                setProducts([]);
            }
        } catch (error) {
            console.error("Error fetching products:", error);
        } finally {
            setLoading(false);
        }
    }

    const handleClickPageNumber = (page) => {
        scrollToTop();
        setCurrentPage(page);
        fetchitem(page);
    }

    const handleClickNext = () => {
        scrollToTop();
        setCurrentPage(currentPage + 1);
        fetchitem(currentPage + 1);
    }
    return (
        <div className='flex flex-col items-center space-y-8 mx-16'>
            <div>
                {products.length > 0 ? (
                    <div className='flex flex-wrap gap-4'>
                        {products.map((product,index) => (
                            <Card key={index} image={product} />
                        ))}
                    </div>
                ) : (
                    <p>No products found.</p>
                )}
            </div>
            <div className='flex space-x-8 items-center justify-center mb-16'>
                <div className='space-x-4'>
                    {totalPage > 1 && 
                        Array.from({ length: totalPage }, (_, i) => i + 1).map((pageNumber) => (
                            <button key={pageNumber} onClick={() => handleClickPageNumber(pageNumber)} className={`bg-gray-300 cursor-pointer hover:bg-gray-300 text-gray-800 font-bold py-2 px-4 rounded ${currentPage === pageNumber ? 'bg-gray-400' : ''}`}>{pageNumber}</button>
                        ))
                    }
                </div>
                <button className='bg-gray-300 cursor-pointer hover:bg-gray-400 text-gray-800 font-bold py-2 px-4 rounded justify-start' onClick={() => handleClickNext()}>Next</button>
            </div>
        </div>
    )
}
export default Shop;