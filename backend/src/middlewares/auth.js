const jwt = require('jsonwebtoken');

const verifyToken = (req, res, next) => {
    console.log('🔐 [Auth Middleware] Verifying token for:', req.method, req.path);
    const authHeader = req.headers['authorization'];
    console.log('  Authorization header:', authHeader ? '✅ Present' : '❌ Missing');
    const token = authHeader && authHeader.split(' ')[1];

    if (!token) {
        console.log('  ❌ No token provided');
        return res.status(401).json({ error: 'Access denied. No token provided.' });
    }

    try {
        const decoded = jwt.verify(token, process.env.JWT_SECRET);
        req.user = decoded;
        console.log('  ✅ Token valid, user:', decoded.id);
        next();
    } catch (error) {
        console.log('  ❌ Invalid token:', error.message);
        res.status(401).json({ error: 'Invalid token.' });
    }
};

const isAdmin = (req, res, next) => {
    if (req.user && req.user.role === 'admin') {
        next();
    } else {
        res.status(403).json({ error: 'Access denied. Admin role required.' });
    }
};

module.exports = { verifyToken, isAdmin };
