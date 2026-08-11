import jwt from 'jsonwebtoken';

export const generateToken = (id, email, isAdmin = false) => {
    return jwt.sign(
        {
            id,
            email,
            isAdmin,
        },
        process.env.JWT_SECRET,
        {
            expiresIn: process.env.JWT_EXPIRE || '7d',
        }
    );
};

export const generateRefreshToken = (id) => {
    return jwt.sign(
        { id },
        process.env.JWT_SECRET,
        {
            expiresIn: '30d',
        }
    );
};

export const verifyToken = (token) => {
    try {
        return jwt.verify(token, process.env.JWT_SECRET);
    } catch (error) {
        return null;
    }
};

export default { generateToken, generateRefreshToken, verifyToken };