import Sequelize from 'config/db.js'
import {DataType} from 'sequelize'
const User  = Sequelize.define('User',{
    userId : {
        type : Sequelize.INTEGER,
        primaryKey : true,
        autoIncrement : true
    },
    googleId : {
        type : Sequelize.STRING,
        allowNull : true,
        unique : true
    },
    userName : {
        type : DataType.STRING,
        allowNull : false
    },
    userEmail : {
        type : DataType.STRING,
        allowNull : false,
        unique : true
    },
    userImage : {
        type : DataType.STRING,
        allowNull : true
    }, 
    userPassword_hash : {
        type : DataType.STRING,
        allowNull : true
    },
    userPhone : {
        type : DataType.STRING,
        allowNull : true,
        unique : true
    }
},
{
    tableName : 'Users',
    timestamps : true,
}
)