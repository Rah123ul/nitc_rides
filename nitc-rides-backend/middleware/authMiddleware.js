const jwt = require('jsonwebtoken');

// Secret key (This MUST match the exact string we used in authController to lock the token)
const JWT_SECRET = process.env.JWT_SECRET || 'super_secret_nitc_key';

const verifyToken = (req, res, next) => {
    // 1. Look for the token inside the incoming request "headers"
    // Standard practice is to send it formatted as "Bearer <your_token_here>"
    const authHeader = req.headers.authorization;

    if (!authHeader || !authHeader.startsWith('Bearer ')) {
        // Security guard blocks the door
        return res.status(401).json({ error: 'Access denied. No token provided.' });
    }

    // 2. Cut off the word "Bearer " to get just the actual token
    const token = authHeader.split(' ')[1];

    try {
        // 3. Crack the token open using our secret key
        const decoded = jwt.verify(token, JWT_SECRET);

        // 4. If it worked, attach the decoded data (id, phone, role) to the request object
        // This is powerful: now our upcoming controllers can simply ask for 'req.user.id'
        req.user = decoded;

        // 5. Open the door and let the request proceed to the actual controller
        next();
    } catch (error) {
        // If the token was tampered with or has expired (past 24h)
        return res.status(401).json({ error: 'Invalid or expired token.' });
    }
};

module.exports = {
    verifyToken
};
