import jwt from 'jsonwebtoken';
import dotenv from 'dotenv';
dotenv.config();
const AuthenticatedMiddleware = (req, res, next) => {
    let token = null;
    if (req.cookies?.access_token) {
        token = req.cookies.access_token;
        console.log('Token from cookies:', token);
    } else if (
        req.headers.authorization &&
        req.headers.authorization.startsWith('Bearer ')
    ) {
        token = req.headers.authorization.split(' ')[1];
    }
    if(!token){
        console.log('No token provided');
        return res.status(401).json({
            error : 'Authentication token is required',
            success: false,
            isLogged: false
        })
    }
    try {
        const decoded = jwt.verify(token, process.env.JWT_SECRET);
        req.user = decoded;
        next();
    } catch (error) {
        return res.status(401).json({
            error: 'Invalid authentication token',
            success: false
        });
    }
}

export default AuthenticatedMiddleware;