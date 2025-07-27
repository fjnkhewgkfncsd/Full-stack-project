import {OAuth2Client} from 'google-auth-library';
import dotenv from 'dotenv';
dotenv.config();
import {User} from '../models/main.js'
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
        console.log({sub, name, email, picture});
        let user = await User.findOne({
            where : {
                userEmail : email
            }
        })
        console.log('User found:', user ? user.toJSON() : 'No user found');
        if(!user){
            try {
                user = await User.create({
                    googleId: sub,
                    userName: name,
                    userEmail: email,
                    userImage: picture
                });
                console.log('User created:', user.toJSON());
            } catch (err) {
                console.error(err.name, err.errors?.map(e => e.message));
                console.error('Error creating user:', err);
                return res.status(500).json({ error: 'Failed to create user' });
            }
        }
        const jwtToken = jwt.sign({
            userId:user.userId
        },
        process.env.JWT_SECRET,
        {
            expiresIn : '1d'
        }
        );
        
        res.cookie('access_token', jwtToken, {
            httpOnly: true,
            secure: process.env.NODE_ENV === 'production',
            sameSite: 'Lax',
            maxAge : 24 * 60 * 60 * 1000, // 1 day
        });
        res.json({ message: 'Google authentication successful',
            user: { id: user.userId, email: user.userEmail } });
    }catch(err){
        console.error('Error during Google authentication:', err);
        res.status(401).json({error: 'Invalid Google Token'});
    }
}

const login = async (req, res) => {
    const { email, password } = req.body;

    try {
    const user = await User.findOne({ where: { userEmail: email } });

    if (!user) {
        return res.status(403).json({ message: 'User not found' });
    }

    // ✅ Check password using bcrypt
    const isMatch = await bcrypt.compare(password, user.userPassword_hash);
    if (!isMatch) {
        return res.status(403).json({ message: 'Invalid password' });
    }

    // ✅ Generate tokens
    const accessToken = generateAccessToken(user.userId);
    const refreshToken = generateRefreshToken(user.userId);

    // ✅ Send tokens in cookies
    res.cookie('access_token', accessToken, {
        httpOnly: true,
        secure: process.env.NODE_ENV === 'production',
        sameSite: 'lax',
        maxAge: 15 * 60 * 1000
    });

    res.cookie('refresh_token', refreshToken, {
        httpOnly: true,
        secure: process.env.NODE_ENV === 'production',
        sameSite: 'lax',
        maxAge: 7 * 24 * 60 * 60 * 1000
    });

    res.json({ 
    message: 'Login successful',
    user: { id: user.userId, email: user.userEmail },
    isLogged: true,
    success: true
});

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
        secure: process.env.NODE_ENV === 'production',
        sameSite: 'lax',
        maxAge: 15 * 60 * 1000
    });
    res.json({ message: 'Token refreshed' });
    });
};

const getProfile = async (req,res) => {
    let token = req.cookies.access_token;
    if(!token && req.headers.authorization?.startsWith('Bearer ')){
        token = req.headers.authorization.split(' ')[1];
    }
    if(!token){
        return res.status(401).json({
            error: 'Unauthorized',
            success: false,
            isLogged: false
        });
    }
    try {
        const decode = jwt.verify(token,process.env.JWT_SECRET);
        const user = await User.findOne({
            where : {
                userId : decode.userId
            }
        });
        res.status(200).json({
            data : user,
            success : true,
            isLogged : true
        });
    } catch (error) {
        console.error('JWT error:', error.message);
        res.status(401).json({error: 'Invalid Token'});
    }
}

const logout = (req,res) => {
    res.clearCookie('access_token');
    res.clearCookie('refresh_token');
    res.status(200).json({message: 'Logged out successfully'});
}

const register = async (req, res) => {
    const {username, email, password} = req.body;
    if(!username || !email || !password){
        return res.status(400).json({
            message: 'username, email and password are required',
            success: false,
            isLogged: false
        });
    }
    try {
        const existingUser = await User.findOne({
            where: { userEmail: email }
        });
        if(existingUser){
            return res.status(400).json({
                message: 'User already exists',
                success: false,
                isLogged: false
            });
        }
        const hashedPassword = await bcrypt.hash(password, 10);
        const newUser = await User.create({
            userName: username,
            userEmail: email,
            userPassword_hash: hashedPassword
        });
        console.log(process.env.JWT_SECRET);
        console.log('User created:', newUser.toJSON());
        const token = generateAccessToken(newUser.userId);
        res.cookie('access_token', token, {
            httpOnly: true,
            secure: process.env.NODE_ENV === 'production',
            sameSite: 'Lax',
            maxAge: 24 * 60 * 60 * 1000, // 1 day
        });
        res.status(201).json({
            message: 'User registered successfully',
            success: true,
            isLogged: true,
            user: {
                id: newUser.userId,
                email: newUser.userEmail
            }
        });
    } catch (err) {
        console.error('Error during registration:', err);
        res.status(500).json({
            message: 'Internal server error',
            success: false,
            isLogged: false
        });
    }
};

export {authenWithgoogle,getProfile,logout,login,refreshToken, register};