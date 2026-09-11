// src/middleware/auth.js
const jwt = require('jsonwebtoken');

/**
 * Middleware ensuring the request has a valid Bearer JWT.
 * Attaches decoded payload { userId, email } to req.user.
 */
function authenticateToken(req, res, next) {
  const authHeader = req.headers['authorization'];
  const token = authHeader && authHeader.split(' ')[1]; // Extract token from "Bearer <TOKEN>"

  if (!token) {
    return res.status(401).json({ error: 'Access token required.' });
  }

  jwt.verify(token, process.env.JWT_SECRET, (err, decodedUser) => {
    if (err) {
      if (err.name === 'TokenExpiredError') {
        return res.status(401).json({ error: 'Session expired. Please log in again.' });
      }
      return res.status(401).json({ error: 'Invalid or malformed authentication token.' });
    }

    req.user = decodedUser; // Contains: { userId: user.id, email: user.email }
    next();
  });
}

module.exports = authenticateToken;
