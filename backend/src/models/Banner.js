import Sequelize from '../config/db.js';
import {DataTypes} from 'sequelize';

const Banner = Sequelize.define('Banner', {
    bannerId: {
        type: DataTypes.INTEGER,
        primaryKey: true,
        autoIncrement: true,
        field: 'banner_id' 
    },
    imageUrl: {
        type: DataTypes.STRING,
        allowNull: false,
        field: 'url_image'
    },
    team : {
        type: DataTypes.STRING,
        allowNull: false,
        field: 'team'
    }
},
{
    tableName: 'banners', 
    timestamps: true, 
    underscored: true 
});
export default Banner;