const express = require("express");
const auth = require("../middlewares/auth");
const {isAdmin} = require("../middlewares/isAdmin");
const {
    createPremium,
    getAllPremiums,
    getPremiumById,
    updatePremium,
    deletePremium,
    sendReminder
} = require("../controllers/premium");

const router = express.Router();

router.post("/", auth, createPremium);
router.get("/", auth, isAdmin, getAllPremiums);
router.get("/:id", auth, getPremiumById);
router.put("/:id", auth, updatePremium);
router.delete("/:id", auth, deletePremium);
router.post("/send-reminder", auth, sendReminder);

module.exports = router;
