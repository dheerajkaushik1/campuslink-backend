const jwt = require('jsonwebtoken');

const protect = (req, res, next) => {
    try{
        const token = req.headers.authorization
        if(!token){
            return res.status(401).json({message: "No token, authorization denied!"});
        }
        const decoded = jwt.verify(token, process.env.JWT_SECRET);
        req.user = decoded;

        next();
    } catch (err) {
        res.status(500).json({message: "Server Error", eroor: err.message});
    }
};

module.exports = {protect};
