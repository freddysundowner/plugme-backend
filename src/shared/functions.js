
const stripeConnect = async (payload) => {
  const stripe = require("stripe")(process.env.STRIPE_KEY);

  const account = await stripe.accounts.create(payload);
  if (account["external_accounts"]) {
    return account;
  } else {
    return { error: "error creating stripe account" };
  }
};
module.exports = {
  stripeConnect,
};
