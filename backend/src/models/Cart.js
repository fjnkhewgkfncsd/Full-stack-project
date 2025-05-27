import Sequelize from 'config/db.js';
import { DataTypes } from 'sequelize';

const Cart = Sequelize.define('Cart', {
    cartId: {
        type: DataTypes.INTEGER,
        primaryKey: true,
        autoIncrement: true,
        field: 'cart_id' // Maps to the column name in the database
    },
    userId: {
        type: DataTypes.INTEGER,
        allowNull: false,
        field: 'user_id',
        references: {
            model: 'users', // This references the users table
            key: 'user_id'
        },
        unique: true // As per your SQL schema
    },
    createdAt: {
        type: DataTypes.DATE,
        defaultValue: Sequelize.NOW,
        field: 'created_at'
    }
}, {
    tableName: 'cart', // Explicitly set the table name
    timestamps: false, // We're manually handling the created_at field
    underscored: true // If you want Sequelize to automatically map camelCase to snake_case
});

export default Cart;