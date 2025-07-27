import express from 'express';
const router = express.Router();
import { authenWithgoogle,getProfile,logout,login,refreshToken,register} from '../controller/authenticate.js'
import authenticateToken from '../middleware/authMiddleware.js';

//google authentication
router.post('/googleAuthentication', authenWithgoogle);
// get profile
router.get('/profile', authenticateToken, getProfile);
//logout
router.get('/logout', logout);
//login
router.post('/login', login);
//refresh token
router.post('/refreshToken', refreshToken);
//register
router.post('/register', register);

export default router;