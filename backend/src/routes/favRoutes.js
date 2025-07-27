import express from 'express';
import {getFavoritesByProductID,addFavorite,deleteFavByID,getAllFavItems} from '../controller/favorite.js'
import authMiddleware from '../middleware/authMiddleware.js'
const router = express.Router()

router.get('/product/:productID',authMiddleware, getFavoritesByProductID)
router.delete('/:productID',authMiddleware, deleteFavByID)
router.post('/:productID',authMiddleware,addFavorite)
router.get('/all',authMiddleware, getAllFavItems)

export default router;
