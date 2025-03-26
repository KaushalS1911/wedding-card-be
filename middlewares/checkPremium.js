const {ROLES} = require("../constants");

const checkPremium = (req, res, next) => {
    if (req.user.role !== ROLES.ADMIN || !req.user.isPremium) {
        return res.status(403).json({message: "Access denied. Premium membership required."});
    }

    next();
};

module.exports = checkPremium;
