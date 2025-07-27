import {getNationalJersey,getProductById,getRelativeProducts,getProductByTeam,getTeamPicture,getProductsByLeague,getProducts} from '../controller/product.js';
import express from 'express';

const router = express.Router();

router.get('/national-jerseys',getNationalJersey);
router.get('/:id', getProductById);
router.get('/relative/:team',getRelativeProducts);
router.get('/team/:team',getProductByTeam);
router.get('/team/:team/picture',getTeamPicture);
router.get('/league/:league', getProductsByLeague);
router.get('/', getProducts);
export default router;