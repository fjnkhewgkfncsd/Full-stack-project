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
        allowNull: false
    }
}, {
    tableName: 'cart_items',
    timestamps: false,
    underscored: true
});

// Define associations
CartItem.associate = (models) => {
    CartItem.belongsTo(models.Cart, {
        foreignKey: 'cartId',
        as: 'cart'
    });
    
    CartItem.belongsTo(models.Product, {
        foreignKey: 'productId',
        as: 'product'
    });
};

export default CartItem;