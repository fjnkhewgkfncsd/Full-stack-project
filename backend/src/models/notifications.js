import sequelize from '../config/db.js'
import {DataTypes} from 'sequelize'

const Noftification = sequelize.define('notifications', {
    notificationId: {
        type: DataTypes.INTEGER,
        primaryKey: true,
        autoIncrement: true,
        field: 'notification_id'
    },
    message: {
        type: DataTypes.STRING,
        allowNull: false,
        field: 'message'
    }
}, 
{
    tableName: 'notifications',
    timestamps: true,
    createdAt: 'created_at',
    updatedAt: 'updated_at'
});
export default Noftification;