const flutterWave=require("../controllers/flutterwave");
const express = require("express");

const flutterWaveRouter = express.Router();
flutterWaveRouter.route("/createsubaccount").post(flutterWave.createSubAccount)
flutterWaveRouter.route("/createredirecturl").post(flutterWave.createRedirectUrl)





module.exports=flutterWaveRouter;