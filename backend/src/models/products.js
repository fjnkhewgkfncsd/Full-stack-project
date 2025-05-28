import sequelize from '../config/db.js'
import {DataTypes} from 'sequelize'

const products = sequelize.define('products',{
    product_id : {
        type : DataTypes.INTEGER,
        autoIncrement : true,
        primaryKey : true,
        field : 'product_id'
    },
    product_name : {
        type : DataTypes.STRING,
        allowNull : false,
        field : 'name'
    },
    description : {
        type : DataTypes.TEXT,
        allowNull : false,
        field : 'description'
    },
    price : {
        type : DataTypes.DECIMAL,
        allowNull : false,
        field : 'price'
    },
    team : {
        type : DataTypes.STRING,
        allowNull : false,
        field : 'team'
    },
    image_url : {
        type : DataTypes.TEXT,
        allowNull : false,
        field : 'image_url'
    },
    category_id : {
        type : DataTypes.INTEGER,
        allowNull : false,
        field : 'category_id',
        references: {
            model: 'categories', // This references the categories table
            key: 'categoryId'
        }
    },
},
{
    tableName: 'products',
    timestamps: true,
});

export default products