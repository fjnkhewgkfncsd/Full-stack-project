import express from 'express';
const router = express.Router();
import { authenWithgoogle,getProfile,logout} from '../controller/authenticate.js'

//google authentication

router.post('/googleAuthentication', authenWithgoogle);
// get profile
router.get('/profile', getProfile);
//logout
router.get('/logout', logout);

export default router;