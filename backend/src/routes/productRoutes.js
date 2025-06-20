import {getNationalJersey} from '../controller/product.js';
import express from 'express';

const router = express.Router();

router.get('/national-jerseys',getNationalJersey);

export default router;