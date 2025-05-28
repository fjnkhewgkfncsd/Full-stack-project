import Sequelize from 'config/db.js';
import { DataTypes } from 'sequelize';

const CartItem = Sequelize.define('CartItem', {
    cartItemId: {
        type: DataTypes.INTEGER,
        primaryKey: true,
        autoIncrement: true,
        field: 'cart_item_id'
    },
    cartId: {
        type: DataTypes.INTEGER,
        allowNull: false,
        field: 'cart_id',
        references: {
            model: 'cart',
            key: 'cart_id'
        }
    },
    productId: {
        type: DataTypes.INTEGER,
        allowNull: false,
        field: 'product_id',
        references: {
            model: 'products',
            key: 'product_id'
        }
    },
    quantity: {
        type: DataTypes.INTEGER,
        defaultValue: 1,
        allowNull: false,
        field: 'quantity'
    },
    size : {
        type : DataTypes.ENUM('S', 'M', 'L', 'XL', 'XXL', 'XXXL'),
        allowNull: false,
        field: 'size'
    }
}, 
{
    tableName: 'cart_items',
    timestamps: true,
    underscored: true
});

export default CartItem;