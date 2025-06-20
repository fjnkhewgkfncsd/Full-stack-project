import sequelize from '../config/db.js'
import {DataTypes} from 'sequelize'

const Order = sequelize.define('order' , {
    orderId : {
        type : DataTypes.INTEGER,
        primaryKey : true,
        autoIncrement : true,
        field : 'order_id'
    },
    user_id : {
        type : DataTypes.INTEGER,
        allowNull : false,
        field : 'user_id',
        references : {
            model : 'user',
            key : 'userId'
        }
    },
    total_amount : {
        type : DataTypes.DECIMAL,
        allowNull : false,
        field : 'total_amount'
    },
    status : {
        type : DataTypes.ENUM('pending', 'shipped','delivered','completed', 'cancelled'),
        allowNull : false,
        defaultValue : 'pending',
        field : 'status'
    }
},
{
    tableName : 'orders',
    timestamps : true,
    createdAt: 'created_at'
})

export default Order;