import sequelize from '../config/db.js'
import {DataTypes} from 'sequelize'

const OrderItem = sequelize.define('order_items',{
    order_itemId : {
        type : DataTypes.INTEGER,
        primaryKey : true,
        autoIncrement : true,
        field : 'order_item_id'
    },
    order_id : {
        type : DataTypes.INTEGER,
        allowNull : false,
        field : 'order_id',
        references : {
            model : 'orders', // This references the orders table
            key : 'orderId'
        }
    },
    product_id : {
        type : DataTypes.INTEGER,
        allowNull : false,
        field : 'product_id',
        references : {
            model : 'products', // This references the products table
            key : 'product_id'
        }
    },
    product_size : {
        type : DataTypes.ENUM('S', 'M', 'L', 'XL', 'XXL', 'XXXL'),
        allowNull : false,
        field : 'size'
    },
    quantity : {
        type : DataTypes>INTEGER,
        allowNull : false,
        field : 'quantity'
    }
},
{
    tableName : 'order_items',
    timestamps : false
})

export default OrderItem;