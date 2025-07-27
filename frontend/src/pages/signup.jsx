import {useState,useEffect} from 'react'
import {Link} from 'react-router-dom'
import axios from 'axios';
import { GoogleLogin } from '@react-oauth/google';
import { useNavigate } from 'react-router-dom';

const SignupPage = () => {
  const [isPageLoaded, setIsPageLoaded] = useState(true);
  const [isLoading, setIsLoading] = useState(false);
  const [formData, setFormData] = useState({
    username: '',
    email : '',
    password: '',
    confirmPassword: ''
  });
  const navigate = useNavigate();
  useEffect(() => {
    setIsPageLoaded(false);
  }, []);

  const handleInputChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name] : e.target.value
    })
  }

  const handleSubmit = async (e) => {
    e.preventDefault()
    setIsLoading(true);
    try {
      const res = await axios.post('http://localhost:5000/api/auth/register',
        {
          username: formData.username,
          email: formData.email,
          password: formData.password,
        },
        { withCredentials: true }
      )
      if(res.data.success){
        localStorage.setItem('isLoggedIn', 'true');
        window.dispatchEvent(new Event('authchange')); // trigger custom event
        navigate('/');
      }else{
        console.error(res.data.message);
        alert(res.data.message);
      }
    } catch (error) {
      console.error('Error during registration:', error);
      alert('Registration failed. Please try again.');
    }
    setIsLoading(false);
  }


  return(
    <div className='min-h-screen flex items-center justify-center bg-white py-12 px-4 sm:px-6 lg:px-8'>
      <div className='max-w-md w-full space-y-8'>
        <div className='text-center'>
          <h2 className='text-4xl font-bold text-black drop-shadow-lg'>Join Us Today</h2>
          <p className='mt-2 text-lg text-black/90'>Create your new account</p>
        </div>
        <div className='bg-white/95 backdrop-blur-sm py-8 px-6 shadow-2xl rounded-2xl border border-white/20'>
          <form className="space-y-6" onSubmit={handleSubmit}>
            {/* Username field */}
            <div className="relative">
              {isLoading ? (
                <div className="w-full px-4 py-3 border-2 border-gray-200 rounded-xl bg-gray-100 animate-pulse">
                  <div className="h-6 bg-gray-200 rounded"></div>
                </div>
              ) : (
                <>
                  <input
                    id="username"
                    name="username"
                    type="text"
                    value={formData.username}
                    onChange={handleInputChange}
                    required
                    disabled={isLoading}
                    className="peer w-full px-4 py-3 border-2 border-gray-300 rounded-xl focus:border-teal-500 focus:outline-none transition-all duration-300 text-gray-700 bg-white/50 disabled:opacity-50 disabled:cursor-not-allowed"
                    placeholder=" "
                  />
                  <label
                    htmlFor="username"
                    className={`absolute left-4 transition-all duration-300 pointer-events-none ${
                      formData.username
                        ? "top-0 -translate-y-1/2 text-sm text-teal-600 bg-white px-2 rounded"
                        : "top-1/2 -translate-y-1/2 text-gray-500"
                    } peer-focus:top-0 peer-focus:-translate-y-1/2 peer-focus:text-sm peer-focus:text-teal-600 peer-focus:bg-white peer-focus:px-2 peer-focus:rounded`}
                  >
                    Username
                  </label>
                </>
              )}
            </div>

            {/* Email Field */}
            <div className="relative">
              {isLoading ? (
                <div className="w-full px-4 py-3 border-2 border-gray-200 rounded-xl bg-gray-100 animate-pulse">
                  <div className="h-6 bg-gray-200 rounded"></div>
                </div>
              ) : (
                <>
                  <input
                    id="email"
                    name="email"
                    type="email"
                    value={formData.email}
                    onChange={handleInputChange}
                    required
                    disabled={isLoading}
                    className="peer w-full px-4 py-3 border-2 border-gray-300 rounded-xl focus:border-teal-500 focus:outline-none transition-all duration-300 text-gray-700 bg-white/50 disabled:opacity-50 disabled:cursor-not-allowed"
                    placeholder=" "
                  />
                  <label
                    htmlFor="email"
                    className={`absolute left-4 transition-all duration-300 pointer-events-none ${
                      formData.email
                        ? "top-0 -translate-y-1/2 text-sm text-teal-600 bg-white px-2 rounded"
                        : "top-1/2 -translate-y-1/2 text-gray-500"
                    } peer-focus:top-0 peer-focus:-translate-y-1/2 peer-focus:text-sm peer-focus:text-teal-600 peer-focus:bg-white peer-focus:px-2 peer-focus:rounded`}
                  >
                    Email Address
                  </label>
                </>
              )}
            </div>

            {/* Password Field */}
            <div className="relative">
              {isLoading ? (
                <div className="w-full px-4 py-3 border-2 border-gray-200 rounded-xl bg-gray-100 animate-pulse">
                  <div className="h-6 bg-gray-200 rounded"></div>
                </div>
              ) : (
                <>
                  <input
                    id="password"
                    name="password"
                    type="password"
                    value={formData.password}
                    onChange={handleInputChange}
                    required
                    disabled={isLoading}
                    className="peer w-full px-4 py-3 border-2 border-gray-300 rounded-xl focus:border-teal-500 focus:outline-none transition-all duration-300 text-gray-700 bg-white/50 disabled:opacity-50 disabled:cursor-not-allowed"
                    placeholder=" "
                  />
                  <label
                    htmlFor="password"
                    className={`absolute left-4 transition-all duration-300 pointer-events-none ${
                      formData.password
                        ? "top-0 -translate-y-1/2 text-sm text-teal-600 bg-white px-2 rounded"
                        : "top-1/2 -translate-y-1/2 text-gray-500"
                    } peer-focus:top-0 peer-focus:-translate-y-1/2 peer-focus:text-sm peer-focus:text-teal-600 peer-focus:bg-white peer-focus:px-2 peer-focus:rounded`}
                  >
                    Password
                  </label>
                </>
              )}
            </div>

            {/* Confirm Password Field */}
            <div className="relative">
              {isLoading ? (
                <div className="w-full px-4 py-3 border-2 border-gray-200 rounded-xl bg-gray-100 animate-pulse">
                  <div className="h-6 bg-gray-200 rounded"></div>
                </div>
              ) : (
                <>
                  <input
                    id="confirmPassword"
                    name="confirmPassword"
                    type="password"
                    value={formData.confirmPassword}
                    onChange={handleInputChange}
                    required
                    disabled={isLoading}
                    className="peer w-full px-4 py-3 border-2 border-gray-300 rounded-xl focus:border-teal-500 focus:outline-none transition-all duration-300 text-gray-700 bg-white/50 disabled:opacity-50 disabled:cursor-not-allowed"
                    placeholder=" "
                  />
                  <label
                    htmlFor="confirmPassword"
                    className={`absolute left-4 transition-all duration-300 pointer-events-none ${
                      formData.confirmPassword
                        ? "top-0 -translate-y-1/2 text-sm text-teal-600 bg-white px-2 rounded"
                        : "top-1/2 -translate-y-1/2 text-gray-500"
                    } peer-focus:top-0 peer-focus:-translate-y-1/2 peer-focus:text-sm peer-focus:text-teal-600 peer-focus:bg-white peer-focus:px-2 peer-focus:rounded`}
                  >
                    Confirm Password
                  </label>
                </>
              )}
            </div>

            <button
              type="submit"
              disabled={isLoading}
              className="w-full bg-gradient-to-r from-teal-600 to-green-600 hover:from-teal-700 hover:to-green-700 text-white font-semibold py-3 rounded-xl transition-all duration-300 transform hover:scale-105 shadow-lg disabled:opacity-50 disabled:cursor-not-allowed disabled:transform-none"
            >
              {isLoading ? (
                <div className="flex items-center justify-center gap-2">
                  <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                  Creating Account...
                </div>
              ) : (
                "Create Account"
              )}
            </button>
          </form>
          <div className="mt-6 text-center">
            <p className="text-sm text-gray-600">
              Already have an account?{" "}
              <Link
                to="/login"
                className="font-semibold text-transparent bg-clip-text bg-gradient-to-r from-teal-600 to-green-600 hover:from-teal-700 hover:to-green-700 underline decoration-2 underline-offset-2 transition-all duration-300"
              >
                Sign in
              </Link>
            </p>
          </div>

          <div className="mt-6">
            <div className="w-full h-px bg-gray-300 my-4"></div>
            <div className="text-center text-sm text-gray-500 mb-4">Or continue with</div>
            <GoogleLogin
              onSuccess={credentialResponse => {
                const googleToken = credentialResponse.credential;
                axios.post('http://localhost:5000/api/auth/googleAuthentication', 
                  { token: googleToken }, 
                  { withCredentials: true }
                )
                .then(res => {
                  // Handle success (e.g., redirect, show message)
                  console.log(res.data);
                  localStorage.setItem('isLoggedIn', 'true');
                  window.dispatchEvent(new Event('authchange')); // trigger custom event
                  navigate('/');
                })
                .catch(err => {
                  console.error(err);
                });
              }}
              onError={() => {
                console.log('Google Login Failed');
              }}
              width="100%" // optional, for full width button
            />
          </div>
        </div>
      </div>
    </div>
  )
}
export default SignupPage;