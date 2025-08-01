import {Link} from 'react-router-dom';
const Card = ({image}) => {
    const isNameLong = image.product_name.length > 34;
    const cardHeight = isNameLong ? 'h-[440px]' : 'h-[430px]';
    return (
        <div className={`w-80 ${cardHeight} bg-gray-200 rounded-lg my-4 ml-3 relative shadow-lg`}>
            <Link to={`/product/${image.product_id}`} className='flex flex-col space-y-2'>
                <div className='w-72 h-80 mx-auto my-4 '>
                    <img src={image.image_url}  className='w-72 h-full rounded-md'/>
                </div>
                <div className='mx-4 font-arial '>
                    <p className='text-lg font-normal'>{image.product_name}</p>
                    <p className='text-lg font-semibold text-red-500'>{`${image.price} $`}</p>
                </div>
            </Link>
        </div>
    )
}
export default Card;