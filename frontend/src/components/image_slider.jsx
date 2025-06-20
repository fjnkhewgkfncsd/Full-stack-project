import {useState} from 'react'
import {ChevronLeft,ChevronRight} from 'lucide-react'
import PropTypes from 'prop-types'

const SliderImage = ({list, Card}) => {
    const [currentIndex, setCurrentIndex] = useState(0);
    
    // ✅ Enhanced debugging
    console.log('SliderImage props:', { list, Card, listLength: list?.length });
    
    if (!list || list.length === 0) {
        return <div>No items to display</div>;
    }

    const visibleImages = () => {
        console.log('Current index:', currentIndex);
        console.log('List length:', list.length);
        
        try {
            const images = [
                list[currentIndex % list.length],
                list[(currentIndex + 1) % list.length],
                list[(currentIndex + 2) % list.length]
            ];
            
            console.log('Visible images:', images);
            
            // ✅ Filter out any undefined/null items
            return images.filter(image => image != null);
            
        } catch (error) {
            console.error('Error in visibleImages:', error);
            return [list[0]]; // Fallback to first item
        }
    }
    
    const handleClickLeft = () => {
        setCurrentIndex(prev => (
            prev === 0 ? list.length - 1 : prev - 1
        ))
    }

    const handleClickRight = () => {
        setCurrentIndex(prev => (
            prev === list.length - 1 ? 0 : prev + 1
        ))
    }
    
    return (
        <div className='w-screen flex items-start'>
            <div className='flex items-center justify-center w-full h-full'>
                <button 
                    className='w-12 h-12 hover:bg-gray-200 rounded-full transition-colors duration-300' 
                    onClick={handleClickLeft}
                >
                    <ChevronLeft className='w-full h-full'/>
                </button>
                
                <div className='flex w-2/3 h-9/12 group'>
                    {visibleImages().map((image, index) => {
                        console.log('Rendering image at index', index, ':', image);
                        
                        // ✅ Safety check for each image
                        if (!image) {
                            console.warn('Empty image at index:', index);
                            return (
                                <div key={`empty-${currentIndex}-${index}`} className='w-full h-full bg-gray-200 rounded-lg flex items-center justify-center'>
                                    <p>Empty slot</p>
                                </div>
                            );
                        }

                        try {
                            return (
                                <div className='w-full h-full transition-transform duration-200 group-hover:scale-95 hover:!scale-105' key={`${currentIndex}-${index}`}>
                                    <Card image={image} className='w-96 h-96'/>
                                </div>
                            );
                        } catch (error) {
                            console.error('Error rendering Card:', error, 'Image:', image);
                            return (
                                <div key={`error-${currentIndex}-${index}`} className='w-full h-full bg-red-100 rounded-lg flex items-center justify-center'>
                                    <p className="text-red-600">Render Error</p>
                                </div>
                            );
                        }
                    })}
                </div>
                
                <button 
                    className='w-12 h-12 hover:bg-gray-200 rounded-full transition-colors duration-300' 
                    onClick={handleClickRight}
                >
                    <ChevronRight className='w-full h-full'/>
                </button>
            </div>
        </div>
    )
}

SliderImage.propTypes = {
    list: PropTypes.array.isRequired,
    Card: PropTypes.elementType.isRequired
}

export default SliderImage;