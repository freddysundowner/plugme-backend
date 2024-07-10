const place = require("../controllers/place");
const express = require("express");

const placeRouter = express.Router();
placeRouter.route("/place-details").get(place.placeDetails)

module.exports = placeRouter;