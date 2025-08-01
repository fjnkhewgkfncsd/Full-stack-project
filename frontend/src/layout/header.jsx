"use client"

import { useState, useRef,useEffect } from "react"
import { Link } from "react-router-dom"
import Cart from "../asset/icon/cart-icon.svg"
import Account from "../asset/icon/account-icon.svg"
import Heart from "../asset/icon/heart.svg"
import Notification from "../asset/icon/notification.svg"
import CartPanel from "../components/Cart.jsx"
import { X } from "lucide-react"
import {ErrorBoundary} from 'react-error-boundary';
import axios from 'axios';
import { useNavigate } from "react-router-dom"
import {scrollToTop} from '../utils/skullToTop.jsx';
import FavPanel from '../components/favPanel.jsx';

const Header = () => {
  const [isDropdownOpen, setDropDownOpen] = useState(false)
  const timeOut = useRef(null)
  const [isAccountOpen, setIsAccountOpen] = useState(false)
  const [isSearchOpen, setIsSearchOpen] = useState(false)
  const [searchQuery, setSearchQuery] = useState("")
  const [isLog, setIsLog] = useState(false);
  const [isCartOpen, setIsCartOpen] = useState(false)
  const [isFavOpen, setIsFavOpen] = useState(false)
  const navigate = useNavigate();
  const handleMouseEnter = () => {
    clearTimeout(timeOut.current)
    setDropDownOpen(true)
  }

  useEffect(() => {
    console.log('i was calling root')
    getIsloggedIn();
    const handleAuthChange = () => {
      console.log('i was calling authchange')
      getIsloggedIn();
    };
    window.addEventListener('authchange', handleAuthChange);
    return () => {
      console.log('i was calling remove')
      window.removeEventListener('authchange', handleAuthChange);}
  }, []);

  const getIsloggedIn = async () => {
    try {
      const res = await axios.get('http://localhost:5000/api/auth/profile', {withCredentials: true});
      if(res.data.isLogged){
        setIsLog(true);
        localStorage.setItem('isLoggedIn', 'true');
      } else if(res.data.status === 401){
        await refresh_token();
      }
    } catch {
      setIsLog(false);
      localStorage.removeItem('isLoggedIn');
    }
  };

  const refresh_token = async () => {
    try{
      const res = await axios.post('http://localhost:5000/api/auth/refreshToken',{},{withCredentials: true});
      if(res.data.success){
        setIsLog(true);
        localStorage.setItem('isLoggedIn','true')
      }else{
        setIsLog(false);
        localStorage.removeItem('isLoggedIn');
      }
    }catch(err){
      console.error(err);
    }
  }
  const handleMouseLeave = () => {
    timeOut.current = setTimeout(() => {
      setDropDownOpen(false)
    }, 100) //delay 100ms before closing
  }

  const handleClickOnDropDown = () => {
    window.scrollTo({
      top: 0,
      behavior: "smooth",
    })
  }

  const handleClickOnSearch = () => {
    setIsSearchOpen(true)
  }

  const handleClickOnCart = () => {
    setIsCartOpen(!isCartOpen)
  }

const handleClickOnFav = () => {
  setIsFavOpen(!isFavOpen)
}

const handleCloseFav = () => {
  setIsFavOpen(false)
}

  const handleCloseCart = () => {
    setIsCartOpen(false)
  }

  const handleClickAccount = () => {
    if(isLog){
      setIsAccountOpen(true)
    }else{
      navigate("/login");
    }
  }

  const handleClearSearch = () => {
    setSearchQuery("")
  }

  const handleSearchSubmit = (e) => {
    e.preventDefault()
    // Handle search submission
    console.log("Searching for:", searchQuery)
  }

  return (
    <div className='sticky top-0 bg-white z-40 '>
      <header className="w-screen h-17 pb-4 flex items-center justify-around py-2  shadow-sm sticky top-0 bg-white z-40">
        <nav className="w-1/5">
          <ul className="flex items-center justify-between w-full gap-6 font-semibold font-sans text-xl">
            <li className="hover:text-blue-500">
              <Link to='/'>Home</Link>
            </li>
            <li className="hover:text-blue-500">
              <Link to='/shop'>Shop</Link>
            </li>
            <li className="relative" onMouseEnter={handleMouseEnter} onMouseLeave={handleMouseLeave}>
              <div className="flex gap-1/2 items-center">
                <Link className="hover:text-blue-500">Collection</Link>
                <svg className="ml-1 h-4 w-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                </svg>
              </div>
              {isDropdownOpen && (
                <div
                  className="absolute top-full left-0 mt-2 w-screen max-w-4xl bg-white shadow-xl rounded-lg border border-gray-200"
                  onMouseEnter={handleMouseEnter}
                  onMouseLeave={handleMouseLeave}
                >
                  <div className="p-6">
                    <div className="grid grid-cols-4 gap-8">
                      {/* Featured Image */}
                      <div className="col-span-1">
                        <div className="relative h-48 rounded-lg overflow-hidden">
                          <img
                            src="https://res.cloudinary.com/dwlbowgx5/image/upload/f_webp/v1749137175/-1x-1_nojzaa"
                            alt="World Cup"
                            className="object-cover w-full h-full"
                          />
                        </div>
                      </div>

                      {/* Europe Club */}
                      <div className="col-span-1">
                        <h3 className="font-semibold text-gray-900 mb-4">Europe Club</h3>
                        <ul className="space-y-2">
                          {[
                            "FC Barcelona",
                            "Real Madrid",
                            "FC Bayern Munich",
                            "Inter Milan",
                            "Manchester City",
                            "Liverpool FC",
                            "Manchester United",
                            "Chelsea FC",
                          ].map((club) => (
                            <li key={club}>
                              <Link
                                to={`/team/${club.toLowerCase().replace(/\s+/g, "_")}`}
                                className="text-gray-600 hover:text-blue-600 transition-colors duration-200 text-sm"
                                onClick={handleClickOnDropDown}
                              >
                                {club}
                              </Link>
                            </li>
                          ))}
                        </ul>
                      </div>
                      {/* National Team */}
                      <div className="col-span-1">
                        <h3 className="font-semibold text-gray-900 mb-4">National Team</h3>
                        <ul className="space-y-2">
                          {["Cambodia", "Spain", "Germany", "France", "England", "Italy", "Portugal", "Japan"].map(
                            (country) => (
                              <li key={country}>
                                <Link
                                  to={`/team/${country.toLowerCase()}`}
                                  className="text-gray-600 hover:text-blue-600 transition-colors duration-200 text-sm"
                                  onClick={handleClickOnDropDown}
                                >
                                  {country}
                                </Link>
                              </li>
                            ),
                          )}
                        </ul>
                      </div>
                      {/* League Team */}
                      <div className="col-span-1">
                        <h3 className="font-semibold text-gray-900 mb-4">League Team</h3>
                        <ul className="space-y-2">
                          {["Premier League", "La Liga", "Bundesliga", "Serie A", "Ligue 1"].map((league) => (
                            <li key={league}>
                              <Link
                                to={`/league/${league.toLowerCase().replace(/\s+/g, "_")}`}
                                className="text-gray-600 hover:text-blue-600 transition-colors duration-200 text-sm"
                                onClick={handleClickOnDropDown}
                              >
                                {league}
                              </Link>
                            </li>
                          ))}
                        </ul>
                      </div>
                    </div>
                  </div>
                </div>
              )}
            </li>
          </ul>
        </nav>
        <div className="flex-shrink-0">
          <Link to="/">
            <div className="relative left-16 w-32 h-12 lg:w-40 lg:h-16">
              <img
                src="https://res.cloudinary.com/dwlbowgx5/image/upload/f_webp/v1749055998/Screenshot_2025-06-04_234408_ham0kp"
                alt="Logo"
                className="object-cover w-full h-full rounded-md"
              />
            </div>
          </Link>
        </div>
        <div className="flex gap-4 items-center">
          {/* Search bar - styled like the image */}
          <form onSubmit={handleSearchSubmit} className="relative">
            <div className="flex items-center bg-white rounded-md h-10 w-[300px] border-1">
              <input
                type="text"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder="Search"
                className="bg-transparent text-black placeholder-black px-4 py-2 w-full outline-none"
                style={{ WebkitAppearance: "none" }} // Removes default styling on Safari
              />
              {searchQuery && (
                <button type="button" onClick={handleClearSearch} className="text-black hover:bg-gray-200 rounded-full transition-colors duration-100 p-1 mx-1 cursor-pointer">
                  <X size={18} />
                </button>
              )}
              <div className='border-l-1 h-full w-1'></div>
              <button type="submit" className="text-black p-1 m-1 hover:bg-gray-200 rounded-full cursor-pointer">
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  width="20"
                  height="20"
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="2"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                >
                  <circle cx="11" cy="11" r="8"></circle>
                  <line x1="21" y1="21" x2="16.65" y2="16.65"></line>
                </svg>
              </button>
            </div>
          </form>

          {/* Other icons */}
          <button onClick={handleClickOnCart} className="p-2 hover:bg-gray-100 rounded-full transition-colors cursor-pointer">
            <img src={Cart || "/placeholder.svg"} alt="Cart" className="w-6 h-6" />
          </button>
          <button className="p-2 hover:bg-gray-100 rounded-full transition-colors cursor-pointer">
            <img src={Notification || "/placeholder.svg"} alt="" className="w-6 h-6" />
          </button>
          <button className="p-2 hover:bg-gray-100 rounded-full transition-colors cursor-pointer" onClick={handleClickOnFav}>
            <img src={Heart || "/placeholder.svg"} alt="" className="w-6 h-6" />
          </button>
          {isLog ? (
            <Link to='/account' className="p-2 hover:bg-gray-100 rounded-full transition-colors">
              <img src={Account || "/placeholder.svg"} alt="account" className="w-6 h-6" />
            </Link>
          ) : (
            <button className="px-4 py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600 transition-colors" onClick={() => {
              scrollToTop();
              navigate("/login")}}>
              Login
            </button>
          )}
        </div>
      </header>

      {/* Cart Panel */}
      <ErrorBoundary fallback={<div>Something went wrong in your cart.</div>}>
        <CartPanel isOpen={isCartOpen} onClose={handleCloseCart} />
      </ErrorBoundary>
      {/* Fav Panel */}
      <ErrorBoundary fallback={<div>Something went wrong in your wishlist.</div>}>
        <FavPanel isOpen={isFavOpen} onClose={handleCloseFav} />
      </ErrorBoundary>
    </div>
  )
}

export default Header
