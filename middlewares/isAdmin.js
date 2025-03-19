const ROLES = require("../constants");

const isAdmin = (req, res, next) => {
    if (!req.user || req.user.role !== ROLES.ADMIN) {
        return res.status(403).json({message: "Access denied. Admins only."});
    }
    next();
};

module.exports = {isAdmin};
