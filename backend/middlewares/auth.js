const jwt = require('jsonwebtoken');
const JWT_SECRET = process.env.JWT_SECRET;

// Middleware to verify token and attach user info
const verifyToken = (req, res, next) => {
  const token = req.headers['authorization']?.split(' ')[1]; // Extract token from 'Bearer <token>'

  if (!token) {
    console.log('No token provided');
    return res.status(401).json({ error: 'Access Denied: No Token Provided' });
  }

  try {
    const verified = jwt.verify(token, JWT_SECRET);
    console.log('Decoded Token:', verified);
    req.user = verified; // Attach user info to request
    next(); // Proceed to the next middleware
  } catch (err) {
    console.error('Token verification failed:', err.message);
    return res.status(400).json({ error: 'Invalid Token' });
  }
};

// Utility function to generate JWT
const generateToken = (userId) => {
  return jwt.sign({ id: userId }, JWT_SECRET, { expiresIn: '1h' });
};

const verifyStaff = (req, res, next) => {
  if (req.user.role !== 'staff') {
    return res.status(403).json({ error: 'Access denied. Staff only.' });
  }
  next();
};

module.exports = { verifyToken, generateToken, verifyStaff };

