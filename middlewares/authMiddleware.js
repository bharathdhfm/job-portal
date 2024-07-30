import JWT from 'jsonwebtoken';

const userAuth = async (req, res, next) => {
    const authHeader = req.headers.authorization;
    if (!authHeader || !authHeader.startsWith('Bearer ')) {
        console.log('Authorization header missing or invalid');
        return next(new Error('Auth Failed: Authorization header missing or invalid'));
    }

    const token = authHeader.split(' ')[1];
    try {
        const payload = JWT.verify(token, process.env.JWT_SECRET);
        console.log('Token payload:', payload); // Debug log
        req.body.user = { userId: payload.userId };
        next();
    } catch (error) {
        console.log('Token verification failed:', error.message);
        next(new Error('Auth Failed: Invalid token'));
    }
};

export default userAuth;
