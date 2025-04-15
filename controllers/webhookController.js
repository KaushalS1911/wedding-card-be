const stripe = require("stripe")(process.env.STRIPE_SECRET_KEY);
const Subscription = require("../models/subscriptionModel");
const User = require("../models/user");
require('dotenv').config();

exports.handleWebhook = async (req, res) => {
    console.log(req, res)
    const sig = req.headers["stripe-signature"];
    let event;

    try {
        event = stripe.webhooks.constructEvent(
            req.body,
            sig,
            process.env.STRIPE_WEBHOOK_SECRET
        );
    } catch (err) {
        console.error("Webhook Error:", err.message);
        return res.status(400).send(`Webhook Error: ${err.message}`);
    }

    if (event.type === "checkout.session.completed") {
        const session = event.data.object;

        try {
            const sub = await stripe.subscriptions.retrieve(session.subscription);

            const user = await User.findOne({stripeCustomerId: sub.customer});

            if (!user) {
                console.warn(`No user found with stripeCustomerId: ${sub.customer}`);
                return res.status(404).send("User not found");
            }

            const newSub = new Subscription({
                email: user.email,
                stripeCustomerId: sub.customer,
                stripeSubscriptionId: sub.id,
                plan: sub.items.data[0].price.id,
                startDate: new Date(),
                status: sub.status,
                user_id: user._id,
            });

            await newSub.save();

            user.isPremium = true;
            await user.save();

            console.log(`User ${user.email} is now premium.`);
            res.status(200).send("Webhook handled successfully");
        } catch (error) {
            console.error("Error handling subscription:", error.message);
            return res.status(500).send("Internal Server Error");
        }
    } else {
        res.status(200).send("Event ignored");
    }
};

