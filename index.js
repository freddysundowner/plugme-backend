const express = require("express");
const http = require("http");
const cors = require("cors");
const stripeRouter = require("./src/routes/stripeRoute");
const flutterWaveRoute = require("./src/routes/flutterwave");
const placeRouter = require("./src/routes/place");
require("dotenv").config();
/*****************
 *SERVER INITILIZATIONS
 *****************/

const app = express();
app.use(cors());
const port = process.env.PORT || 6000;
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use("/stripe", stripeRouter);
app.use("/flutterwave", flutterWaveRoute);
app.use("/place", placeRouter);

/*****************
 *SERVER INSTANTIATION
 *****************/
var server = http.createServer(app);
// app.use("/", (req, res) => {
//   res.send("PLUGME WORKING");
// });

server.listen(port, function () {
  console.log("PLUGME SERVER WORKING ON PORT", port);
});

module.exports = app;
