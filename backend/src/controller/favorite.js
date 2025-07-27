import {Favorite,Product} from '../models/main.js'
const getFavoritesByProductID = async (req, res) => {
    const id = req.user.userId;
    const {productID} = req.params;
    try{
        const favorite = await Favorite.findOne({where: {productId: Number(productID),userId : id}});
        if(favorite){
            return res.json({success: true, favorite});
        }else{
            return res.status(404).json({success: false, message: 'Favorite not found'});
        }
    }catch(error){
        console.error('Error fetching favorite:', error);
        return res.status(500).json({success: false, message: 'Internal server error'});
    }
}

const addFavorite = async (req, res) => {
    const id = req.user.userId;
    const {productID} = req.params;
    try {
        const product = await Favorite.create({
            userId : id,
            productId: Number(productID)
        })
        if(product){
            return res.status(201).json({
                success: true,
                data:product
            })
        }else{
            return res.status(400).json({
                success:false,
                data: {}
            })
        }
    } catch (error) {
        console.log('error to add fav',error);
        res.status(500).json({
            success:false,
            data: {}
        })
    }
}

const getAllFavItems = async (req, res) => {
    const id = req.user.userId;
    try {
        const items = await Favorite.findAll({
            where: {
                userId: id,
            },
            include: [
                {
                    model: Product,
                    as: 'product',
                    attributes: ['product_id', 'product_name', 'image_url', 'price'],
                }
            ],
        });
        if (items.length > 0) {
            res.json({
                success: true,
                data: items
            });
        } else {
            res.json({
                success: true,
                data: [],
                message: 'no favorites found'
            });
        }
    } catch (error) {
        console.error('Error fetching favorites:', error);
        res.status(500).json({
            success: false,
            data: [],
            message: 'Internal server error'
        });
    }
}

const deleteFavByID = async (req, res) => {
    const id = req.user.userId;
    const {productID} = req.params;
    try {
        const result = await Favorite.destroy({
            where : {
                userId : id,
                productId:productID
            }
        })
        if(result){
            res.json({
                success: true,
                message: 'Favorite deleted successfully'
            })
        }else{
            res.status(404).json({
                success: false,
                message: 'Favorite not found'
            })
        }
    } catch (error) {
        console.error('Error deleting favorite:', error);
        res.status(500).json({
            success: false,
            message: 'Internal server error'
        });
    }
}
export {getFavoritesByProductID,addFavorite,deleteFavByID,getAllFavItems};