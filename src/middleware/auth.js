
const JWT = require('jsonwebtoken');
require('dotenv').config();
const verifyToken = (req, res, next) => {
    // 1. Look for the token in the headers
    const authHeader = req.headers['authorization'];
    const token = authHeader && authHeader.split(' ')[1]; // Extracts token from "Bearer <token>"
    if (!token) {
        return res.status(401).json({ success: false, message: "Access Denied: No Token Provided" });
    }
    try {
        // 2. Try to verify the token
        const verified = JWT.verify(token, process.env.JWT_SECRET); //2bara token genrate then check weter same or not 
        req.user = verified; // Store user info (like user ID) in the request
        
        next(); // 🔓 Success! Move to the next function
    } catch (err) {
        res.status(403).json({ success: false, message: "Invalid or Expired Token" });
    }
};
module.exports = verifyToken;