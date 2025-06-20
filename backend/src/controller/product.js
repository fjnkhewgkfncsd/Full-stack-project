import { QueryTypes } from 'sequelize';
import sequelize from '../config/db.js';  // ✅ Import sequelize from config
import { Product } from '../models/main.js';  // ✅ Import Product model

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

export { getNationalJersey };