async function auth(req, res, next) {
    try {
        const authHeader = req.headers.authorization;

        if (!authHeader || !authHeader.startsWith('Bearer ')) {
            return res.status(401).json({message: "Unauthorized: Auth token not found!", status: 401});
        }

        const authToken = authHeader.split("Bearer ")[1];

        const user = await verifyToken(authToken);
        if (!user) return res.status(401).json({message: "Unauthorized: Invalid token!", status: 401});

        const verifiedUser = await UserModel.findById(user.id);
        if (!verifiedUser) return res.status(401).json({message: "Unauthorized: Auth token is invalid!", status: 401});

        req.user = verifiedUser;
        next();
    } catch (error) {
        res.status(500).json({message: "Internal Server Error", error: error.message});
    }
}

module.exports = auth;