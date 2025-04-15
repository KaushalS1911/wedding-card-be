const express = require("express");
const router = express.Router();
const { handleWebhook } = require("../controllers/webhookController");
const bodyParser = require("body-parser");

router.post(
    "/webhook",
    bodyParser.raw({ type: "application/json" }),
    handleWebhook
);

module.exports = router;
