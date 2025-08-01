import {User} from '../models/main,js';
import bcrypt from 'bcrypt';

const updatePicture = async (req, res) => {
    const userId = req.user.userId;
    const url = req.file.path;
    try {
        const result = await User.update({
            userImage: url
        }, {
            where: {
                userId: userId
            }
        });
        if(result[0] === 1) {
            return res.status(200).json({
                message: 'Profile picture updated successfully',
                url: url,
                success: true
            });
        }
    } catch (error) {
        return res.status(500).json({
            message: 'Error updating profile picture',
            error: error.message,
            success: false
        });
    }   
}

const changeUsername = async (req, res) => {
    const userId = req.user.userId;
    const {username} = req.body;
    try {
        const result = await User.update({
            userName: username
        },{
            where: {
                userId: userId
            }
        })
        if(result[0] === 1) {
            return res.status(200).json({
                message: 'Username updated successfully',
                username: username,
                success : true
            });
        } else {
            return res.status(400).json({
                message: 'Username update failed, please try again',
                success: false
            });
        }
    } catch (error) {
        return res.status(500).json({
            message: 'Error updating username',
            error: error.message,
            success: false
        });
    }
}

const changePassword = async (req, res) => {
    const userId = req.user.userId;
    const {oldPassword, newPassword} = req.body;
    try {
        const user = await User.findOne({
            where: {
                userId: userId
            }
        });
        if (!user) {
            return res.status(404).json({
                message: 'User not found',
                success: false,
                data : null
            });
        }
        const isMatch = await bcrypt.compare(oldPassword,user.userPassword_hash);
        if (!isMatch) {
            return res.status(400).json({
                message: 'Old password is incorrect',
                success: false,
                data : null
            });
        }
        user.password = newPassword;
        await user.save();
        return res.status(200).json({
            message: 'Password updated successfully',
            success: true,
            data : user
        });
    } catch (error) {
        return res.status(500).json({
            message: 'Error updating password',
            error: error.message,
            success: false,
            data : null
        });
    }
}
