import {useParams} from 'react-router-dom';
import {useState,useEffect} from 'react';
import axios from 'axios';
import Card from '../components/card.jsx';
import {Plus} from 'lucide-react';
import {scrollToTop} from '../utils/skullToTop.jsx'

const LeagueProduct = () => {
    const [products, setProducts] = useState([]);
    const [bannerLoading, setBannerLoading] = useState(true);
    const [productLoading, setProductLoading] = useState(true);
    const [banner, setBanner] = useState(null);
    const [totalPages, setTotalPages] = useState(0);
    const [currentPage, setCurrentPage] = useState(1);
    const { league } = useParams();

    const display = league.replace(/_/g, ' ').replace(/\b\w/g, c => c.toUpperCase());
    const fetchProductsByLeague = async (league, page = 1) => {
        try {
            const res = await axios.get(`http://localhost:5000/api/products/league/${league}?page=${page}`);
            if(res.data.success){
                console.log('fetch products by league successfully');
                setProducts(res.data.data);
                setTotalPages(Math.ceil(res.data.totalCount / 12));
                setProductLoading(false);
            }else{
                setProductLoading(false);
                setProducts([]);
            }
        } catch (error) {
            console.error('Error fetching products by league:', error);
        }
    }
    const fetchLeagueBanner = async (league) => {
        try {
            const res = await axios.get(`http://localhost:5000/api/products/team/${league}/picture`);
            if(res.data.success){
                setBanner(res.data.data.imageUrl)
            }
        }catch (error) {
            console.error('Error fetching league banner:', error);
        }
    }
    useEffect(
        () => {
            if(league){
                fetchProductsByLeague(league);
                fetchLeagueBanner(league);
            }
        },[league]
    )

    const handleClickPageNumber = (page) => {
        scrollToTop();
        setCurrentPage(page);
        fetchProductsByLeague(league, page);
    }
    const handleClickNext = () => {
        scrollToTop();
        fetchProductsByLeague(league, currentPage + 1)
        setCurrentPage(currentPage + 1)
    }
    return (
        <div className='flex flex-col items-center space-y-8 mx-16'>
            <div className='w-screen h-screen flex items-center justify-center'>
                <div className={`w-[1300px] h-[700px] ${bannerLoading ? 'animate-pulse bg-gray-300 rounded-lg duration-300 transition-all' : 'hidden'}`}></div>
                <img src={banner} onLoad={() =>setBannerLoading(false)} className={`w-full h-full ${bannerLoading ? 'hidden' : ''}`}/>
            </div>
            <div className='w-full'>
                <h1 className='text-2xl font-serif font-medium text-left ml-4'>{`${display}`}</h1>
            </div>
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
                {totalPages > 1 &&
                (
                    <div className='flex space-x-4'>
                        <div className='space-x-4'>
                        {totalPages > 1 && 
                            Array.from({ length: totalPages }, (_, i) => i + 1).map((pageNumber) => (
                                <button key={pageNumber} onClick={() => handleClickPageNumber(pageNumber)} className={`bg-gray-300 cursor-pointer hover:bg-gray-300 text-gray-800 font-bold py-2 px-4 rounded ${currentPage === pageNumber ? 'bg-gray-400' : ''}`}>{pageNumber}</button>
                            ))
                        }
                    </div>
                    <button className='bg-gray-300 cursor-pointer hover:bg-gray-400 text-gray-800 font-bold py-2 px-4 rounded justify-start' onClick={() => handleClickNext()}>Next</button>
                    </div>)
                }
            </div>
            
        </div>
    )
}
export default LeagueProduct;