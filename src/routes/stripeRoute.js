const stripeController = require("../controllers/stripe");
const express = require("express");
const stripeRouter = express.Router();
stripeRouter.route("/connect/:id").post(stripeController.connect);
stripeRouter.route("/createPayment").post(stripeController.createPayment);
stripeRouter.route("/createIntent").post(stripeController.createIntent);
stripeRouter.route("/capturepayment").post(stripeController.captureCardTokenPayment);
stripeRouter.route("/transfer").post(stripeController.transfer);
stripeRouter.route("/cancel").post(stripeController.cancelPayment);
stripeRouter.route("/accounts/:accountNumber").get(stripeController.getStripeBankAccount);
stripeRouter.route("/balance/:accountNumber").get(stripeController.stripePayoutBalance);
stripeRouter.route("/payout/:accountNumber").post(stripeController.stripePayout);
stripeRouter.route("/transactions/:accountNumber").get(stripeController.stripePayoutTransactions);

stripeRouter.route("/deleteaccount/:id").get(stripeController.deleteAccount);
module.exports = stripeRouter; 
