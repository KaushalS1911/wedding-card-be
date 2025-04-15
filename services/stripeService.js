require('dotenv').config();
const stripe = require("stripe")(process.env.STRIPE_SECRET_KEY);
const User = require("../models/user");

const createCheckoutSession = async (plan, email) => {
    const priceMap = {
        monthly: process.env.STRIPE_MONTHLY_PRICE_ID,
        yearly: process.env.STRIPE_YEARLY_PRICE_ID,
    };

    if (!priceMap[plan]) {
        throw new Error("Invalid subscription plan.");
    }

    const customer = await stripe.customers.create({
        email: email,
    });

    await User.findOneAndUpdate(
        {email},
        {
            stripeCustomerId: customer.id,
        }
    );

    const session = await stripe.checkout.sessions.create({
        customer: customer.id,
        payment_method_types: ["card"],
        mode: "subscription",
        line_items: [
            {
                price: priceMap[plan],
                quantity: 1,
            },
        ],
        success_url: `${process.env.FRONTEND_URL}`,
        cancel_url: `${process.env.FRONTEND_URL}`,
    });

    return session.url;
};


module.exports = {createCheckoutSession};
