const jwt = require('jsonwebtoken');

function verifyToken(req, res, next) {
    const token = req.headers['authorization']?.split(' ')[1]; // a tokent a headerből kapjuk
    if (!token) {
        return res.status(403).json({ success: false, message: 'No token provided.' });
    }
    jwt.verify(token, process.env.JWT_SECRET, (err, decoded) => {
        if (err) {
            return res.status(401).json({ success: false, message: 'Unauthorized.' });
        }
        req.userId = decoded.id; // Eközben a tokenben tárolt id-t a req objektumba helyezzük
        next();
    });
}

module.exports = verifyToken;
