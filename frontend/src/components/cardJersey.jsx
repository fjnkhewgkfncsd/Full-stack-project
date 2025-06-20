import {Link} from 'react-router-dom';
import {useState} from 'react';
const CardTeam = ({image}) => {
    const [isLoading,setIsLoading] = useState(true);
    return (
        <div className='w-full h-full flex items-center justify-center relative'>
            {isLoading && (
                <div className="absolute w-2/3 inset-0 animate-pulse bg-gray-50 rounded-full"></div>
            )}
            <Link to={`Team/${image.Team}`} >
                <img onLoad={() => setIsLoading(false)} src={image.url} alt={image.alt} className={`w-56 h-62 duration-300 transition-opacity ${isLoading ? "opacity-0" : "opacity-100"}`}/>
            </Link>
        </div>
    )
}
export default CardTeam;