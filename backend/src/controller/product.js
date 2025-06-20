import { QueryTypes } from 'sequelize';
import sequelize from '../config/db.js';  // ✅ Import sequelize from config
import { Product,ProductSize } from '../models/main.js';  // ✅ Import Product model
import {redisClient,setCache} from '../utils/redis.js'

const getNationalJersey = async (req, res) => {
    try {
        const { limit = 10 } = req.query;  
        const result = await sequelize.query(`
            SELECT DISTINCT ON (team)
                product_id,
                name as product_name,
                price,
                image_url,
                team,
                region
            FROM products 
            WHERE category_id = 1
            ORDER BY team, price DESC, product_id ASC
            LIMIT $1
        `, {
            bind: [parseInt(limit)],
            type: QueryTypes.SELECT
        });
        res.status(200).json({
            success: true,
            count: result.length,
            data: result,
            message: `Found ${result.length} unique teams with their most expensive jerseys`
        });
    } catch (error) {
        console.error('Error fetching national jerseys:', error);
        res.status(500).json({
            success: false,
            message: 'Error fetching national jerseys',
            error: error.message
        });
    }
};

const getProductById = async (req,res) => {
    const {id} = req.params;
    const cacheKey = `product:${id}`;
    try{
        const cached = await redisClient.get(cacheKey);
        if(cached){
            console.log('cached product from redis');
            return res.status(200).json({data : JSON.parse(cached),
                message : 'product fetched successfully',
                success: true,
                cached : true
            })
        }
        const product = await Product.findOne({
            where : { product_id : id},
            attributes : ['product_id','product_name','description','price','image_url','team','region'],
            include : {
                model : ProductSize,
                as : 'sizes',
                attributes : ['product_size_id','product_id','size','stock_quantity','price_override'],
            }
        })
        if(!product){
            return res.status(404).json({
                message : 'Product not found',
                success : false
            })
        }
        await setCache(cacheKey,JSON.stringify(product),3600);
        res.status(200).json({
            data : product,
            message : 'product fetched successfully',
            success: true,
            cached : false
        })
    }catch(error){
        console.error('Error fetching product by ID:', error);
        return res.status(500).json({
            message: 'Error fetching product',
            error: error.message
        });
    }
}

export { getNationalJersey,getProductById };