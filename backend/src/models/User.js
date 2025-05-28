import sequelize from '../config/db.js'
import {DataTypes} from 'sequelize'
const User  = sequelize.define('User',{
    userId : {
        type : DataTypes.INTEGER,
        primaryKey : true,
        autoIncrement : true,
        field : 'user_id'
    },
    googleId : {
        type : DataTypes.STRING,
        allowNull : true,
        unique : true,
        field : 'google_id'
    },
    userName : {
        type : DataTypes.STRING,
        allowNull : false,
        field : 'name'
    },
    userEmail : {
        type : DataTypes.STRING,
        allowNull : false,
        unique : true,
        field : 'email'
    },
    userImage : {
        type : DataTypes.STRING,
        allowNull : true,
        field : 'user_image'
    }, 
    userPassword_hash : {
        type : DataTypes.STRING,
        allowNull : true,
        field : 'password_hash'
    },
    userPhone : {
        type : DataTypes.STRING,
        allowNull : true,
        unique : true,
        field : 'phone'
    },
    userAddress : {
        type : DataTypes.STRING,
        allowNull : true,
        field : 'address'
    },
    userRole : {
        type : DataTypes.STRING,
        allowNull : false,
        defaultValue : 'user',
        field : 'role'
    },
},
{
    tableName : 'Users',
    timestamps : true,
}
)
export default User;