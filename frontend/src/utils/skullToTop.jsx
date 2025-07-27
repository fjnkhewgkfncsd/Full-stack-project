import { useEffect} from 'react';
export const scrollToTop = () => {
    window.scrollTo({
        top: 0,
        behavior: 'smooth'
    });
};
export const scrollToTopOnMount = () => {
    useEffect(() => {
        scrollToTop();
    }, []);
};