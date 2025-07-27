import sequelize from '../config/db.js'
import {DataTypes} from 'sequelize'
const favorite = sequelize.define('favorite', {
    favoriteId: {
        type: DataTypes.INTEGER,
        primaryKey: true,
        autoIncrement: true,
        field: 'favorite_id'
    },
    userId: {
        type: DataTypes.INTEGER,
        allowNull: false,
        field: 'user_id',
        references: {
            model: 'Users', // This references the Users table
            key: 'userId'
        }
    },
    productId: {
        type: DataTypes.INTEGER,
        allowNull: false,
        field: 'product_id',
        references: {
            model: 'products', // This references the products table
            key: 'product_id'
        }
    }
}, 
{
    tableName: 'favorites',
    timestamps: false,
});
export default favorite;