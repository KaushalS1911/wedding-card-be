const {createCheckoutSession} = require("../services/stripeService");

exports.createSession = async (req, res) => {
    const {plan, email} = req.body;

    try {
        const url = await createCheckoutSession(plan, email);
        res.json({url});
    } catch (error) {
        console.error("Stripe error:", error);
        res.status(500).json({error: "Failed to create Stripe session"});
    }
};
