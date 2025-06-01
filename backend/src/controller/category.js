import {Category,Product} from '../models/main.js';
import {redisClient,setCache} from '../utils/redis.js';

const getAllCategories = async (req,res) => {
    const cacheKey = 'categories';
    try {
        const cached = await redisClient.get(cacheKey)
        if(cached){
            console.log('cached categories from redis');
            return res.status(200).json({categories : JSON.parse(cached)})
        }
        const categories = await Category.findAll(
            {
                attributes : {
                    exclude : ['createdAt', 'updatedAt','description']
                },
                include : {
                    model : Product,
                    as : 'products',
                    attributes : {
                        exclude : ['createdAt', 'updatedAt','description','category_id']
                    }
                }
            }
            );
        setCache(cacheKey,categories,3600);    
        res.status(200).json({categories})
    } catch (error) {
        res.status(500).json({
            message: 'Error fetching categories',
            error: error.message
        });
    }
}

const getCategoryById = async (req,res) => {
    const {id} = req.params;
    const cacheKey=`category:${id}`;
    try {
        const cached = await redisClient.get(cacheKey)
        if(cached){
            return res.status(200).json({category : JSON.parse(cached)})
        }
        const category = await Category.findOne({
            attributes : {
                exclude : ['createdAt', 'updatedAt','description']
            },
            where : {
                categoryId : id
            },
            include : {
                model : Product,
                as : 'products',
                attributes : {
                    exclude : ['createdAt', 'updatedAt','description','category_id']
                }
            }
        })
        if(!category){
            return res.status(404).json({
                message : 'Category not found'
            })
        }
        setCache(cacheKey,category,3600);
        res.status(200).json({category})
    }catch(error){
        res.status(500).json({
            message: 'Error fetching category',
            error: error.message
        })
    }
}
export {
    getAllCategories,
    getCategoryById
};