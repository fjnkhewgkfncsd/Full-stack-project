import Slider from '../components/image_slider.jsx'
import ScrollVelocity from  "../animation/ScrollVelocity";
import display from '../components/cardJersey.jsx'
import {EuporeTeam} from '../asset/models/euporeTeam.jsx'
import National from '../asset/models/nationalLogoTeam.jsx'
import {ThreeDMarqueeDemoSecond} from '../components/bg_with_text.jsx'
import {useEffect,useState} from 'react'
import displayNational from '../components/card.jsx'
import axios from 'axios';
import ErrorBoundary from '../utils/errorBoundary.jsx'
const Home = () => {
    const [nationalJersey,setNationalJersey] = useState([]);

    useEffect(() => {
        const fetchNationalJersey = async () => {
            try {
                const response = await axios.get('http://localhost:5000/api/products/national-jerseys');
                if(response.data.success){
                    setNationalJersey(response.data.data);
                }else{
                    console.log('error to fetch national jerseys!')
                }
            } catch (error) {
                console.error('Error fetching national jerseys:', error);
            }
        };
        fetchNationalJersey();
    }, []);
    return (
        <div>
            <div className='w-screen h-screen'>
                <ThreeDMarqueeDemoSecond className='w-full h-full'/>
            </div>
            <div className='bg-black py-8'>
                <ScrollVelocity texts={['DELIVERY IS FREE — SHOP NOW ', 'NEW COLLECTION AVAILABLE!']} velocity={100} className='text-blue-200 text-3xl px-4'/>
            </div>
            <div className='w-screen h-[550px]'>
                <img src="https://res.cloudinary.com/dwlbowgx5/image/upload/v1749671518/UCL_image_logo-1440x550_yjoidx.jpg" alt="UCL" className='w-full h-full'/>
            </div>
            <div className='flex flex-col items-center space-y-24 my-20'>
                <h1 className='text-5xl font-bold font-serif' >UCL Team</h1>
                <Slider list={EuporeTeam} Card={display}/>
            </div>
            <div className='flex flex-col items-center space-y-4 my-28'>
                <h1 className='text-5xl font-serif font-bold'>Latest Jersey 2025</h1>
                <p className='text-2xl font-semibold font-serif'>get your jersey now</p>
                <div className="w-screen h-[430px] flex space-x-4 my-8 items-center justify-center group">
                    <img
                        src="https://res.cloudinary.com/dwlbowgx5/image/upload/v1749711356/Screenshot2025-05-07at16.35.28_oagsgy.jpg"
                        alt=""
                        className="w-[340px] h-full shadow-lg transition-transform duration-200 rounded-xl group-hover:scale-95 hover:!scale-105"
                    />
                    <img
                        src="https://res.cloudinary.com/dwlbowgx5/image/upload/v1749711352/real-banner_ysgyif.jpg"
                        alt=""
                        className="w-[340px] h-full shadow-lg transition-transform duration-200 rounded-xl group-hover:scale-95 hover:!scale-105"
                    />
                    <img
                        src="https://res.cloudinary.com/dwlbowgx5/image/upload/v1749711345/25100SM_1_8c629ec1-ac64-4b6d-bec6-7d613ea8d7c3_ikspyi.webp"
                        alt=""
                        className="w-[340px] h-full shadow-lg transition-transform duration-200 rounded-xl group-hover:scale-95 hover:!scale-105"
                    />
                    <img
                        src="https://res.cloudinary.com/dwlbowgx5/image/upload/v1749711324/PSG-2025-Jordan-Wings-Fourth-Kit-1_mbvz04.jpg"
                        alt=""
                        className="w-[340px] h-full shadow-lg transition-transform duration-200 rounded-xl group-hover:scale-95 hover:!scale-105"
                    />
                </div>
            </div>
            <div>
                <img src="https://res.cloudinary.com/dwlbowgx5/image/upload/v1749717808/fifa-header_jyf4ma.png" alt="" className='w-screen h-auto'/>
            </div>
            <div className='my-20'>
                <h1 className='text-5xl font-bold font-serif text-center my-20'>National Team</h1>
                <Slider list={National} Card={display}/>
            </div>
            <div>
                <img src="https://res.cloudinary.com/dwlbowgx5/image/upload/v1749993705/new-bg_ry2vvk.jpg" alt="" className='w-screen h-auto' />
            </div>
            <div className='my-20'>
                <h1 className='text-5xl text-center font-serif font-bold'>National Team Jersey</h1>
                {
                    nationalJersey.length > 0 ? (
                        <ErrorBoundary>
                            <Slider list={nationalJersey} Card={displayNational} />
                        </ErrorBoundary>
                    ) : (
                        <h1 className='text-3xl text-center font-serif font-bold'>No Jersey Found</h1>
                    )
                }
            </div>
        </div>
        
    )
}
export default Home;