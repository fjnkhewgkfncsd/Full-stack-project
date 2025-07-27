import { QueryTypes } from 'sequelize';
import sequelize from '../config/db.js';  // ✅ Import sequelize from config
import { Product,ProductSize,Banner } from '../models/main.js';  // ✅ Import Product model
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

const getRelativeProducts = async (req,res) => {
    const {team} = req.params;
    const cacheKey = `relativeProducts:${team}`;
    try {
        const cached = await redisClient.get(cacheKey);
        if(cached){
            console.log('cached relative products from redis')
            return res.status(200).json({
                cached : true,
                data : JSON.parse(cached),
                success : true
            })
        }
        const relativeProducts = await Product.findAll({
            where : { team },
            attributes : {
                exclude : ['createdAt','updatedAt']
            }
        })
        if(relativeProducts.length === 0){
            return res.status(404).json({
                message : 'No relative products found',
                success : false,
                cached : false
            })
        }
        await setCache(cacheKey,JSON.stringify(relativeProducts),3600);
        res.status(200).json({
            data : relativeProducts,
            success : true,
            cached : false 
        })
    } catch (error) {
        console.error('error fetching relative products:',error);
        return res.status(500).json({
            message : 'error fetching relative products',
            error : error.message,
            success : false
        })
    }
}

const getProductByTeam = async (req, res) => {
    const {team} = req.params;
    const cacheKey = `productsByTeam:${team}`;
    try {
        const cached = await redisClient.get(cacheKey);
        if(cached){
            console.log(`cached products for team ${team} from redis`);
            return res.status(200).json({
                success:true,
                data:JSON.parse(cached),
                cached:true,
                message:`Products for team ${team} fetched successfully`
            })
        }
        const products = await Product.findAll({
            where : {team},
            attributes: {
                exclude: ['createdAt', 'updatedAt']
            }
        })
        if(products.length == 0){
            return res.status(404).json({
                success: false,
                data: [],
                message: `No products found for team ${team}`,
                cached:false
            })
        }
        await setCache(cacheKey,JSON.stringify(products),3600);
        res.status(200).json({
            success:true,
            data:products,
            cached:false,
            message:`Products for team ${team} fetched successfully`
        })
    } catch (error) {
        console.error('Error fetching products by team:', error);
        return res.status(500).json({
            success: false,
            message: 'Error fetching products',
            error: error.message
        });
    }
} 

const getTeamPicture = async (req, res) => {
    const {team} =req.params;
    const cacheKey = `productPicture:${team}`;
    try {
        const cached = await redisClient.get(cacheKey);
        if(cached){
            return res.status(200).json({
                success:true,
                data:JSON.parse(cached),
                cached:true,
                message:`Team picture for ${team} fetched successfully`
            })
        }
        const teamPicture = await Banner.findOne({
            where: { team: team },
            attributes: ['imageUrl']
        });
        if(!teamPicture){
            return res.status(404).json({
                success: false,
                message: `No picture found for team ${team}`,
                cached:false
            });
        }
        await setCache(cacheKey,JSON.stringify(teamPicture),3600);
        res.status(200).json({
            success:true,
            data:teamPicture,
            cached:false,
            message:`Team picture for ${team} fetched successfully`
        });
    } catch (error) {
        console.error('Error fetching team picture:', error);
        return res.status(500).json({
            success:false,
            message:'Error fetching team picture',
            error:error.message
        });
    }
}
const getProductsByLeague = async (req,res) => {
    const {league} = req.params;
    const { limit = 12, page = 1 } = req.query;
    const cacheKey = `league_${league}_product_limit${limit}_page${page}`;
    const cachetotalKey = `league_${league}_product_count`;
    try {
        const cached = await redisClient.get(cacheKey);
        const cachedTotal = await redisClient.get(cachetotalKey);
        let totalCount = 0;
        if(cachedTotal){
            totalCount = JSON.parse(cachedTotal);
        }else{
            const totalProducts = await Product.count({
                where: { league }
            });
            totalCount = totalProducts;
            await redisClient.set(cachetotalKey, JSON.stringify(totalCount),3600);
        }
        if(cached){
            console.log(`cached products for league ${league} from redis`);
            return res.status(200).json({
                success:true,
                data:JSON.parse(cached),
                cached:true,
                message:`Products for league ${league} fetched successfully`,
                totalCount: totalCount
            })
        }

        const offset = (parseInt(page) - 1) * parseInt(limit);
        const products = await Product.findAll({
            where : { league},
            attributes: {
                exclude: ['createdAt', 'updatedAt']
            },
            limit: parseInt(limit),
            offset: offset
        })
        if(products.length === 0){
            return res.status(404).json({
                success: false,
                data: [],
                message: `No products found for league ${league}`,
                cached:false
            });
        }
        await setCache(cacheKey,JSON.stringify(products),3600);
        res.status(200).json({
            success:true,
            data:products,
            cached:false,
            message:`Products for league ${league} fetched successfully`,
            totalCount: totalCount
        });
    } catch (error) {
        console.error('Error fetching products by league:', error);
        return res.status(500).json({
            success: false,
            message: 'Error fetching products',
            error: error.message,
            data: [],
            totalCount: 0
        });
    }
}
export { getNationalJersey,getProductById,getRelativeProducts,getProductByTeam,getTeamPicture,getProductsByLeague };