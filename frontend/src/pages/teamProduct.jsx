import axios from 'axios';
import {useEffect,useState} from 'react';
import Card from '../components/card.jsx';
import {useParams} from 'react-router-dom';

const TeamProducts = () => {
    let { team } = useParams();
    const [isLoading,setLoading] = useState(true);
    const [products,setProducts] = useState([]);
    const [teamPicture,setTeamPicture] = useState('');
    const [bannerLoading,setBannerLoading] = useState(true);
    const displayteam = team.replace(/_/g, ' ').replace(/\b\w/g, c => c.toUpperCase());
    team = team.toLowerCase();
    useEffect(
        () => {
            const fetchTeamProducts = async () => {
                try {
                    const res = await axios.get(`http://localhost:5000/api/products/team/${team}`);
                    if(res.data.success){
                        console.log('fetch team products successfully');
                        setProducts(res.data.data);
                        setLoading(false);
                    }
                } catch (error) {
                    console.log('failed to fetch team products:', error);
                }finally{
                    setLoading(false);
                }
            }
            const fetchTeamPicture = async () => {
                try {
                    const res = await axios.get(`http://localhost:5000/api/products/team/${team}/picture`);
                    if(res.data.success){
                        console.log('fetch team picture successfully')
                    }
                    setTeamPicture(res.data.data.imageUrl);
                }catch (error) {
                    console.error('failed to fetch team picture:', error);
                }
            }
            if(team){
                
                fetchTeamProducts();
                fetchTeamPicture();
            }
        },[team]
        
    )
    return (
        <div>
            {
            
            isLoading ? 
                (
                    <div>
                        <h2>page not found</h2>
                    </div>
                ) : (
                    <div className='flex flex-col items-center space-y-8 mx-16'>
                        <div className='w-screen h-screen flex items-center justify-center'>
                            <div className={`w-[1300px] h-[700px] ${bannerLoading ? 'animate-pulse bg-gray-300 rounded-lg duration-300 transition-all' : 'hidden'}`}></div>
                            <img src={teamPicture} onLoad={() =>setBannerLoading(false)} className={`w-full h-full ${bannerLoading ? 'hidden' : ''}`}/>
                        </div>
                        <div className='w-full'>
                            <h1 className='text-2xl font-serif font-medium text-left ml-4'>{`${displayteam} Jersey`}</h1>
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
                    </div>
                )
            }
        </div>
    )
}
export default TeamProducts;