import sequelize from '../config/db.js'
import { DataTypes } from 'sequelize'

const Payment = sequelize.define('payments', {
    payment_id: {
        type: DataTypes.INTEGER,
        primaryKey: true,
        autoIncrement: true,
        field: 'payment_id'
    },
    order_id: {
        type: DataTypes.INTEGER,
        allowNull: false,
        field: 'order_id',
        references: {
            model: 'orders',
            key: 'order_id'
        }
    },
    method: {
        type: DataTypes.ENUM('card', 'khqr', 'aba', 'bank_transfer'),
        allowNull: false,
        field: 'method'
    },
    status: {
        type: DataTypes.ENUM('pending', 'completed', 'failed'),
        allowNull: false,
        field: 'status',
        defaultValue: 'pending'
    },
    amount: {
        type: DataTypes.DECIMAL(10, 2),
        allowNull: false,
        field: 'amount'
    },
    transaction_id: {
        type: DataTypes.STRING,
        allowNull: true,
        field: 'transaction_id'
    }
}, {
    tableName: 'payments',
    timestamps: true,
    createdAt: 'paid_at',
    updatedAt: 'updated_at'
})

export default Payment