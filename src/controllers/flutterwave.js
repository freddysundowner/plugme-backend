const Flutterwave = require("flutterwave-node-v3");
const got = require("got");

exports.createSubAccount = async (req, res) => {
  const flw = new Flutterwave(
    process.env.FLW_PUBLIC_KEY,
    process.env.FLW_SECRET_KEY
  );
  const details = {
    account_bank: "040",
    account_number: req.body.account_number,
    business_name: "ReggyCodas",
    business_mobile: req.body.business_mobile,
    business_email: req.body.business_email,
    country: req.body.country,
    split_type: "percentage",
    split_value: 0.1,
  };
  flw.Subaccount.create(details)
    .then((result) => {
      res.json(result);
      console.log(result);
    })
    .catch((err) => {
      res.status(500).send(err);
      console.log(`error is ~${err}`);
    });
};

exports.createRedirectUrl = async (req, res) => {
  try {
    const response = await got
      .post("https://api.flutterwave.com/v3/payments", {
        headers: {
          Authorization: `Bearer ${process.env.FLW_SECRET_KEY}`,
        },
        json: {
          tx_ref: "hooli-tx-1920bbtytty",
          amount: req.body.amount,
          currency: req.body.currency,
          redirect_url:
            "https://webhook.site/9d0b00ba-9a69-44fa-a43d-a82c33c36fdc",
          meta: {
            consumer_id: 23,
            consumer_mac: "92a3-912ba-1192a",
          },
          customer: {
            email: req.body.email,
            phonenumber: req.body.phone,
            name: req.body.name,
          },
          customizations: {
            title: "Pied Piper Payments",
            logo: "http://www.piedpiper.com/app/themes/joystick-v27/images/logo.png",
          },
        },
      })
      .json();
    res.json(response["data"]);
    console.log(response);
  } catch (err) {
    res.send(err);
  }
};
