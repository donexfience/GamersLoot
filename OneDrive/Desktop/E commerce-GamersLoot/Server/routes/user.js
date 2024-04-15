const express = require("express");
const { logoutUser, getUserDataFirst } = require("../controllers/userController");
const { getProducts, getProduct, getAvailableQuantity } = require("../controllers/user/productController");
const { getCategories } = require("../controllers/user/CategoryController");
const router = express.Router();
//Logout

router.get("/logout",logoutUser);

//to get user data at initial load;

router.get('/',getUserDataFirst)

//products on Dashboard

router.get('/product',getProducts);
router.get("/product/:id",getProduct)
router.get("/product-quantity/:id",getAvailableQuantity)

//getting category for user dashboard

// Category
router.get("/categories", getCategories);

module.exports = router;
