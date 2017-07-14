var stripe = require('stripe')(process.env.STRIPE_SECRET_KEY);

//description is what shows up on the user's credit card statement
exports.charge = function(token, amt) {
    return stripe.charges.create({
        source: token,
        amount: amt * 100,
        currency: 'usd',
        description: 'Blog Donation'
    });
}