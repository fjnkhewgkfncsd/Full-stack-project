import sequelize from '../config/db.js'
import {DataTypes} from 'sequelize'

const Category = sequelize.define('Category', {
    categoryId: {
        type: DataTypes.INTEGER,
        primaryKey: true,
        autoIncrement: true,
        field: 'category_id'
    },
    categoryName: {
        type: DataTypes.STRING,
        allowNull: false,
        unique: true,
        field: 'name'
    },
},
{
    tableName: 'categories',
    timestamps: true
});

export default Category