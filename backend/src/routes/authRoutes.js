import express from 'express';
const router = express.Router();
import { authenWithgoogle,getProfile,logout,login,refreshToken} from '../controller/authenticate.js'

//google authentication
router.post('/googleAuthentication', authenWithgoogle);
// get profile
router.get('/profile', getProfile);
//logout
router.get('/logout', logout);
//login
router.post('/login', login);
//refresh token
router.post('/refreshToken', refreshToken);

export default router;