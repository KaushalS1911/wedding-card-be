const checkPremium = (req, res, next) => {
    if (!req.user) {
        return res.status(401).json({message: "Unauthorized. Please log in."});
    }

    if (req.user.role === 'admin') {
        return next();
    }

    if (req.user.isPremium) {
        return next();
    } else {
        return res.status(403).json({message: "Access denied. Premium membership required."});
    }
};

module.exports = checkPremium;
