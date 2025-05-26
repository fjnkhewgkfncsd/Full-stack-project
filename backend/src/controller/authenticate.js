import {OAuth2Client} from 'google-auth-library';
require('dotenv').config();
import User from '../models/User.js'
import jwt from 'jsonwebtoken';
import bcrypt from 'bcrypt';
import {generateAccessToken,generateRefreshToken} from '../utils/auth_helper.js'

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

        const user = await User.findOne({
            where : {
                Useremail : email
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

const login = async (req, res) => {
    const { email, password } = req.body;

    try {
    const user = await User.findOne({ where: { userEmail: email } });

    if (!result) {
        return res.status(403).json({ message: 'User not found' });
    }

    // ✅ Check password using bcrypt
    const isMatch = await bcrypt.compare(password, user.userPassword_hash);
    if (!isMatch) {
        return res.status(403).json({ message: 'Invalid password' });
    }

    // ✅ Generate tokens
    const accessToken = generateAccessToken(result.userId);
    const refreshToken = generateRefreshToken(result.userId);

    // ✅ Send tokens in cookies
    res.cookie('access_token', accessToken, {
        httpOnly: true,
        secure: false, // change to true in production
        sameSite: 'Strict',
        maxAge: 15 * 60 * 1000
    });

    res.cookie('refresh_token', refreshToken, {
        httpOnly: true,
        secure: false,
        sameSite: 'Strict',
        maxAge: 7 * 24 * 60 * 60 * 1000
    });

    res.json({ message: 'Login successful' });

    } catch (err) {
    console.error(err);
    res.status(500).json({ message: 'Server error' });
    }
};

const refreshToken = (req, res) => {
    const token = req.cookies.refresh_token;
    if (!token) return res.sendStatus(401);

    jwt.verify(token, process.env.REFRESH_TOKEN_SECRET, (err, user) => {
    if (err) return res.sendStatus(403);

    const newAccessToken = generateAccessToken(user.userId);
    res.cookie('access_token', newAccessToken, {
        httpOnly: true,
        secure: false,
        sameSite: 'Strict',
        maxAge: 15 * 60 * 1000
    });
    res.json({ message: 'Token refreshed' });
    });
};

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

export {authenWithgoogle,getProfile,logout,login,refreshToken};