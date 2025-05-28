import sequelize from '../config/db.js'
import {DataTypes} from 'sequelize'

const payment = sequelize.define('payments',{
    payment_id : {
        type : DataTypes.INTEGER,
        primaryKey : true,
        autoIncrement : true,
        field : 'payment_id'
    },
    order_id : {
        type : DataTypes.INTEGER,
        allowNull : false,
        field : 'order_id',
        references : {
            model : 'orders', // This references the orders table
            key : 'order_id'
        }
    },
    method : {
        type : DataTypes.ENUM('bank_transfer'),
        allowNull : false,
        field : 'method',
        defaultValue : 'bank_transfer'
    },
    status : {
        type : DataTypes.ENUM('pending', 'completed', 'failed'),
        allowNull : false,
        field : 'status',
        defaultValue : 'pending'
    }
},
{
    tableName : 'payments',
    timestamps : true,
    createdAt: 'paid_at'
})
export default payment;