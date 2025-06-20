import Facebook from '../asset/icon/facebook-icon.svg'
import Instagram from '../asset/icon/instagram-icon.svg'
import Twitter from '../asset/icon/twitter-icon.svg'
import Tiktok from '../asset/icon/tiktok-icon.svg'
import Phone from '../asset/icon/phone-call-svgrepo-com.svg'
import Mail from '../asset/icon/mail-alt-svgrepo-com.svg'
const Footer = () => {
    return (
        <footer className='flex justify-around items-start w-full bg-white h-full shadow-sm pb-8'>
            <img className='w-64 h-32' src="https://res.cloudinary.com/dwlbowgx5/image/upload/f_webp/v1749055998/Screenshot_2025-06-04_234408_ham0kp" alt="" />
            <div className='space-y-8'>
                <h1 className='text-2xl font-semibold font-serif'>Follow Us</h1>
                <ul className='space-y-4'>
                    <li className='flex space-x-2 items-center '>
                        <img src={Facebook} alt="Facebook" className='w-12 h-12'/>
                        <span className='text-lg'>Facebook</span>
                    </li>
                    <li className='flex space-x-2 items-center'>
                        <img src={Instagram} alt="Instagram" className='w-12 h-12'/>
                        <span className='text-lg'>Instagram</span>
                    </li>
                    <li className='flex space-x-2 items-center'>
                        <img src={Tiktok} alt="Tiktok" className='w-12 h-12'/>
                        <span className='text-lg'>Tiktok</span>
                    </li>
                    <li className='flex space-x-2 items-center'>
                        <img src={Twitter} alt="Twitter" className='w-12 h-12'/>
                        <span className='text-lg'>Twitter</span>
                    </li>
                </ul>
            </div>
            <div className='space-y-8'>
                <h1 className='text-2xl font-semibold font-serif'>Get In Touch</h1>
                <ul className='space-y-2'>
                    <li className='space-x-2 flex items-center'>
                        <img src={Mail} alt="Mail" className='w-8 h-8'/><span className='text-lg'>info@jersey-shop.com</span>
                    </li>
                    <li className='flex space-x-2 items-center'>
                        <img src={Phone} alt="Phone" className='w-8 h-8'/><span className='text-lg'>(+885)69 255 312</span>
                    </li>
                    <li className='flex space-x-2 items-center'>
                        <img src={Phone} alt="Phone" className='w-8 h-8'/><span className='text-lg'>(+885)69 255 312</span>
                    </li>
                </ul>
            </div>
            <div className='space-y-8'>
                <h2 className='text-2xl font-semibold font-serif'>We Accept</h2>
                <ul className='space-y-2'>
                    <li><img src="https://res.cloudinary.com/dwlbowgx5/image/upload/f_webp/v1749050031/bakong-share_psgwx2" alt="Bakong" className='w-40 h-20'/></li>
                    <li><img src="https://res.cloudinary.com/dwlbowgx5/image/upload/f_webp/v1749060024/id5zyxkG2O_1749050393985_fp9htf" alt="ABA" className='w-32 h-36'/></li>
                    <li><img src="https://res.cloudinary.com/dwlbowgx5/image/upload/f_webp/v1749051702/ACELEDA_gxsnue" alt="Aceleda" className='w-28 h-28'/></li>
                </ul>
            </div>
        </footer>
    )
}

export default Footer;