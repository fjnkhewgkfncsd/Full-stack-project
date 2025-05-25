import {OAuth2Client} from 'google-auth-library';
require('dotenv').config();
import User from '../models/User.js'
import jwt from 'jsonwebtoken';

const client = new OAuth2Client(process.env.GOOGLE_CLIENT_ID);

const authenWithgoogle =  async (req,res) => {
    const {token} = req.body;

    try{
        const ticket = await client.verifyIdToken({
            idToken: token,
            audience: process.env.GOOGLE_CLIENT_ID,
        });

        const payload = ticket.getPayload();
        const {sub,email,name,picture} = payload; 

        let user = User.findsOne({
            where : {
                email
            }
        })
        if(!user){
            user = await User.create(
                {
                    googleId : sub,
                    userName : name,
                    userEmail : email,
                    userImage : picture
                }
            )
        }
        const jwtToken = jwt.sign({
            userId:user.userId
        },
        process.env.JWT_SECRET,
        {
            expiresIn : '1d'
        }
        );
        
        res.cookie('token', jwtToken, {
            httpOnly: true,
            secure: process.env.NODE_ENV === 'production',
            sameSite: 'Lax',
            maxAge : 24 * 60 * 60 * 1000, // 1 day

        });
    }catch(err){
        console.error('Error during Google authentication:', err);
        res.status(401).json({error: 'Invalid Google Token'});
    }
}

const getProfile = async (req,res) => {
    const token = req.cookies.token;
    if(!token){
        return res.status(401).json({error: 'Unauthorized'});
    }
    try {
        const decode = jwt.verify(token,process.env.JWT_SECRET);
        const user = await User.findOne({
            where : {
                userId : decode.userId
            }
        });
        res.status(200).json(user);
    } catch (error) {
        res.status(401).json({error: 'Invalid Token'});
    }
}

const logout = (req,res) => {
    res.clearCookie('token');
    res.status(200).json({message: 'Logged out successfully'});
}

export {authenWithgoogle,getProfile,logout};