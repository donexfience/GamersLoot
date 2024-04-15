const express = require("express");
const { logoutUser, getUserDataFirst } = require("../controllers/userController");
const router = express.Router();

router.get("/logout",logoutUser);
router.get('/',getUserDataFirst)

module.exports = router;
