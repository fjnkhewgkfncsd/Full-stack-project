import Cookies from 'js-cookie'

export const authCookies = {
    setAuth : (userData,token) => {
        const cookieOptions = {
            expires : 7,
            secure : true,
            sameSite : 'strict'
        }
        Cookies.set('token', token, cookieOptions);
        Cookies.set('userId',userData.id,cookieOptions);
        Cookies.set('userName',userData.name,cookieOptions);
        Cookies.set('userEmail',userData.email,cookieOptions);
    },
    getUser : () => {
        const userId = Cookies.get('userId');
        const userEmail = Cookies.get('userEmail');
        const userName = Cookies.get('userName');
        const token = Cookies.get('token');

        if(!userId && !token) return null;

        return {
            id : userId,
            email : userEmail,
            name : userName,
            token : token
        };
    },
    isLoggedIn: () => {
        return !!Cookies.get('userId') && !!Cookies.get('token');
    },

    // ✅ Clear all auth cookies
    clearAuth: () => {
        Cookies.remove('token');
        Cookies.remove('userId');
        Cookies.remove('userEmail');
        Cookies.remove('userName');
        console.log('Auth cookies cleared');
    },

    // ✅ Get token for API requests
    getToken: () => {
        return Cookies.get('token');
    }
} 
