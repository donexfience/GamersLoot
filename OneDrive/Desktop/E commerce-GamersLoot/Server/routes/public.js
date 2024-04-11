const express = require("express");
const { getCategories } = require("../controllers/global/collectionController");
const router = express.Router();
router.get("/collections", getCategories);
module.exports = router;
