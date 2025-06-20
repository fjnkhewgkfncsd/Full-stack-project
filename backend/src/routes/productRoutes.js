import {getNationalJersey,getProductById} from '../controller/product.js';
import express from 'express';

const router = express.Router();

router.get('/national-jerseys',getNationalJersey);
router.get('/:id', getProductById);
export default router;