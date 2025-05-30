import sequelize from '../config/db.js'
import { DataTypes } from 'sequelize';

const shipment = sequelize.define('shipments', {
    shipmentId: {
        type: DataTypes.INTEGER,
        primaryKey: true,
        autoIncrement: true,
        field: 'shipment_id'
    },
    orderId: {
        type: DataTypes.INTEGER,
        allowNull: false,
        field: 'order_id',
        references: {
            model: 'orders', // This references the orders table
            key: 'order_id'
        }
    },
    trackingNumber: {
        type: DataTypes.STRING,
        allowNull: false,
        field: 'tracking_number'
    },
    carrier: {
        type: DataTypes.STRING,
        allowNull: false,
        field: 'carrier'
    },
    delivered_at: {
        type: DataTypes.DATE,
        allowNull: false,
        field: 'delivered_at'
    },
    shipped_at : {
        type: DataTypes.DATE,
        allowNull: false,
        field: 'shipped_at'
    }
}, {
    tableName: 'shipments',
    timestamps: true,
    createdAt: 'created_at',
    updatedAt: 'updated_at'
});

export default shipment;