import Stripe from 'stripe';

const stripeSecretKey = process.env.STRIPE_SECRET_KEY;
const stripe = new Stripe(stripeSecretKey);

export default {
    async createCheckoutSession(req, res) {
        try {
            const checkoutProduct = req.body.checkoutProduct;
            const lineItems = checkoutProduct.map(item => ({
                price_data: {
                    currency: 'usd',
                    product_data: {
                        name: item.name,
                    },
                    unit_amount: item.price * 100, // Convert price to cents
                },
                quantity: item.quantity,
            }));

            const session = await stripe.checkout.sessions.create({
                success_url: "http://localhost:8080/success-payment?id={CHECKOUT_SESSION_ID}",
                cancel_url: "http://localhost:8080/cancel-payment",
                payment_method_types: ["card"],
                mode: "payment",
                line_items: lineItems,
                metadata: {
                    customerName: req.body.customerName,
                    customerPhoneNo: req.body.customerPhoneNo,
                    shippingAddress: req.body.shippingAddress,
                },
                customer_email: req.body.customerEmail,
            });

            res.json({
                id: session.id,
            });
        } catch (err) {
            res.status(500).send({
                error: "An error occurred when trying to checkout into stripe.",
            });
        }
    },

    async retrieveCheckoutSession(req, res) {
        try {
            const sessionId = req.params.sessionId;
            const session = await stripe.checkout.sessions.retrieve(sessionId, {
                expand: ["line_items"],
            });
            res.send(session);
        } catch (err) {
            res.status(500).send({
                error: "An error occurred when trying to retrieve checkout session.",
            });
        }
    },
};
