import sequelize from '../config/db.js'
import {DataTypes} from 'sequelize'

const productSize = sequelize.define('product_sizes',{
    product_size_id : {
        type : DataTypes.INTEGER,
        autoIncrement : true,
        primaryKey : true,
        field : 'product_size_id'
    },
    product_id : {
        type :DataTypes.INTEGER,
        allowNull : false,
        field : 'product_id',
        references : {
            model : 'products',
            key : 'product_id'
        },
        onDelete: 'CASCADE', // Optional: Define what happens on delete
    },
    size : {
        type: DataTypes.ENUM('S', 'M', 'L', 'XL', 'XXL', 'XXXL'),
        allowNull: false,
        field : 'size'
    },
    stock_quantity : {
        type : DataTypes.INTEGER,
        allowNull : false,
        field : 'stock_quantity'
    },
    price_override : {
        type : DataTypes.DECIMAL,
        allowNull : true,
        field : 'price_override'
    },
},
{
    tableName : 'product_sizes',
    timestamps : true
});

export default productSize;
