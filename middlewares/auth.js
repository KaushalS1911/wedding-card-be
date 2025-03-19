const {verifyToken} = require("../auth/jwt");
const UserModel = require('../models/user')

async function auth(req, res, next) {

    let authToken = req.headers?.token.split("Bearer ")[1];

    if (!authToken) return res.status(401).json({message: "UnAuthorised: Auth token not found!", status: 401});

    const user = await verifyToken(authToken);
    if (!user) return res.status(401).json({message: "Unauthorized: Invalid token!", status: 401});

    const verifiedUser = await UserModel.findById(user.id);

    if (!verifiedUser) return res.status(401).json({message: "UnAuthorised: Auth token is invalid!", status: 401});

    req.user = verifiedUser;

    next();
}

module.exports = auth;