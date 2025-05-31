import {useState,useEffect} from 'react'
import {Link} from 'react-router-dom'

const SignupPage = () => {
  const [isPageLoaded, setIsPageLoaded] = useState(true);
  const [isLoading, setIsLoading] = useState(false);
  const [formData, setFormData] = useState({
    username: '',
    email : '',
    password: '',
    confirmPassword: ''
  });
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
    // Call API to handle signup
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
            <button
              variant="outline"
              disabled={isLoading}
              className="w-full flex items-center justify-center gap-2 border-2 border-gray-300 hover:border-teal-400 hover:bg-teal-50 transition-all duration-300 py-3 rounded-xl disabled:opacity-50 disabled:cursor-not-allowed"
              type="button"
            >
              {isLoading ? (
                <div className="flex items-center justify-center gap-2">
                  <div className="w-5 h-5 border-2 border-gray-400 border-t-transparent rounded-full animate-spin"></div>
                  Loading...
                </div>
              ) : (
                <>
                  <svg className="w-5 h-5" viewBox="0 0 24 24">
                    <path
                      fill="currentColor"
                      d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"
                    />
                    <path
                      fill="currentColor"
                      d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"
                    />
                    <path
                      fill="currentColor"
                      d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z"
                    />
                    <path
                      fill="currentColor"
                      d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"
                    />
                  </svg>
                  Continue with Google
                </>
              )}
            </button>
          </div>
        </div>
      </div>
    </div>
  )
}
export default SignupPage;