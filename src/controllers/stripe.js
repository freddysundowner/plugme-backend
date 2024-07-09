const functions = require("../shared/functions");

// const stripeSecretKey = process.env.STRIPE_KEY;
const stripeSecretKey = "sk_test_51LnLMXBxPn92AhXI9F0l9uAq0k4dFPuU93rxzQcCGWE8nAajaWGDeRgOCLdqULqJCVfA0zkF2ai9Z6lOoEYCmPzc00XmfNhuEi";

const stripe = require("stripe")(stripeSecretKey);

exports.transfer = async (req, res) => {
  try {
    const amount = req.body.amount;
    const accountNumber = req.body.account;

    const transfer = await stripe.transfers.create({
      amount: amount,
      currency: "usd",
      destination: accountNumber,
      transfer_group: "ORDER_95",
    });
    res.status(200).json(transfer);
  } catch (err) {
    res.status(500).send({
      message: err.message,
    });
  }
};
exports.createPayment = async (req, res) => {
  try {
    const amount = req.body.amount;
    const paymentIntent = await stripe.paymentIntents.create({
      amount: amount,
      currency: "usd",
      automatic_payment_methods: {
        enabled: true,
      },
      payment_method_options: {
        card: {
          capture_method: "manual",
        },
      },
    });
    res.status(200).json(paymentIntent);
  } catch (err) {
    res.status(500).send({
      message: err.message,
    });
  }
};



exports.createIntent = async (req, res) => {
  try {
    console.log(stripeSecretKey);
    let commission = 0.03 * req.body.amount;
    let paymentLoad = {
      currency: "usd",
      payment_method_types: ["card"],
      capture_method: "manual",
      application_fee_amount: parseInt(commission),
      amount: req.body.accountno
        ? req.body.amount * 100
        : req.body.amount * 100,
      on_behalf_of: req.body.accountno,
      confirm: false,
      transfer_data: {
        destination: req.body.accountno,
      },
    };

    paymentLoad["customer"] = req.body.customerId;
    const paymentIntent = await stripe.paymentIntents.create(paymentLoad);
    res.json({
      response: paymentIntent["status"] == "succeeded",
      amount: paymentIntent["amount_received"],
      client_secret: paymentIntent["client_secret"],
      transactionId: paymentIntent["id"],
    });
  } catch (err) {
    res.status(500).send({
      message: err.message,
    });
  }
};

exports.captureCardTokenPayment = async (req, res) => {
  try {
    const transactionId = req.body.transactionId;
    const paymentIntent = await stripe.paymentIntents.capture(
      transactionId,
      {}
    );
    res.json({
      response: paymentIntent["status"] == "succeeded",
      amount: paymentIntent,
    });
  } catch (err) {
    res.status(500).send({
      message: err.message,
    });
  }
};

exports.cancelPayment = async (req, res) => {
  try {
    const transactionId = req.body.transactionId;
    const cancel = await stripe.paymentIntents.cancel(transactionId);
    res.json({
      response: cancel["status"] == "canceled",
      body: cancel,
    });
  } catch (err) {
    res.status(500).send({
      message: err.message,
    });
  }
};

exports.getStripeBankAccount = async (req, res) => {
  try {
    const account = await stripe.accounts.retrieve(req.params.accountNumber);
    if (account["external_accounts"] != null) {
      let banks = account["external_accounts"]["data"];
      res.json({ banks: banks, status: true });
    } else {
      res.json({ banks: [], status: false });
    }
  } catch (err) {
    res.send({
      message: err.message,
      status: false,
    });
  }
};

exports.stripePayoutBalance = async (req, res) => {
  try {
    const balance = await stripe.balance.retrieve({
      stripeAccount: req.params.accountNumber,
    });
    res.json(balance);
  } catch (err) {
    res.status(500).send({
      message: err.message,
    });
  }
};

exports.stripePayout = async (req, res) => {
  const account = await stripe.accounts.retrieve(req.params.accountNumber);
  try {
    let banks = account["external_accounts"]["data"];
    let amount = req.body.amount * 100;
    const payoutresponse = await stripe.payouts.create(
      {
        amount: amount,
        currency: "usd",
        destination: banks[0]["id"],
      },
      { stripeAccount: req.params.accountNumber }
    );
    res.json({ response: payoutresponse, status: true });
  } catch (err) {
    res.json({
      response: err.message,
      status: false,
    });
  }
};

exports.stripePayoutTransactions = async (req, res) => {
  const stripe = require("stripe")(stripeSecretKey);
  try {
    const payoutresponse = await stripe.payouts.list(
      {},
      { stripeAccount: req.params.accountNumber }
    );
    res.json({ response: payoutresponse, status: true });
  } catch (err) {
    res.json({
      response: err.message,
      status: false,
    });
  }
};
exports.connect = async (req, res) => {
  let email = req.body.email;
  let first_name = req.body.first_name;
  let last_name = req.body.last_name;
  let routing_number = req.body.routing_number;
  let account_number = req.body.account_number;
  let phone = req.body.phone;
  let country = req.body.country;
  let postal_code = req.body.postal_code;
  let line1 = req.body.address_one;
  let line2 = req.body.address_two;
  let state = req.body.state;
  let city = req.body.city;
  let day = req.body.day;
  let month = req.body.month;
  let ssn_last_4 = req.body.ssn_last_4;
  let year = req.body.year;
  let currency = req.body.currency ?? "usd";

  let payload = {
    country: "US",
    type: "custom",
    capabilities: {
      card_payments: { requested: true },
      transfers: { requested: true },
    },
    email: email,
    business_type: "individual",
    business_profile: { url: "https://site.tokshopping.live", mcc: "5734" },
    tos_acceptance: {
      date: Math.floor(Date.now() / 1000),
      ip: "120.0.0.1",
    },
    external_account: {
      object: "bank_account",
      country,
      currency,
      account_holder_type: "individual",
      routing_number,
      account_number,
    },
    individual: {
      ssn_last_4,
      email,
      last_name,
      first_name,
      phone,
      address: {
        country,
        city,
        state,
        line1,
        line2,
        postal_code,
      },
      dob: {
        day,
        month,
        year,
      },
      phone,
    },
    company: {
      address: {
        country,
        city,
        state,
        line1,
        line2,
        postal_code,
      },
    },
  };

  try {
    const account = await functions.stripeConnect(
      payload,
      req.params.id,
      first_name,
      last_name,
      email
    );
    var response = res.json({ success: true, account });
    return response;
  } catch (err) {
    return res.json({
      message: err.message,
      success: false,
    });
  }
};

exports.deleteAccount = async (req, res) => {
  try {
    const deleted = await stripe.accounts.del(req.params.id);
    var response = res.json({ success: true, deleted });
    return response;
  } catch (err) {
    return res.json({
      message: err.message,
      success: false,
    });
  }
};

stripeAccount = async (account) => {
  var response = await functions.getSettings();
  const stripe = require("stripe")(response["stripeSecretKey"]);
  let accountresponse = await stripe.accounts.retrieveCapability(
    account,
    "card_payments"
  );
  return accountresponse;
};
