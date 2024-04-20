const express = require("express");
const {
  logoutUser,
  getUserDataFirst,
} = require("../controllers/userController");
const {
  getProducts,
  getProduct,
  getAvailableQuantity,
} = require("../controllers/user/productController");
const { getCategories } = require("../controllers/user/CategoryController");
const {
  getCart,
  addToCart,
  deleteCart,
  deleteOneProduct,
  incrementQuantity,
  decrementQuantity,
} = require("../controllers/user/cartController");
const {
  getAddresses,
  getAddress,
  createAddress,
  deleteAddress,
  updateAddress,
} = require("../controllers/user/addressController");
const router = express.Router();
//Logout

router.get("/logout", logoutUser);

//to get user data at initial load;

router.get("/", getUserDataFirst);

//products on Dashboard

router.get("/product", getProducts);
router.get("/product/:id", getProduct);
router.get("/product/quantity/:id", getAvailableQuantity);

//getting category for user dashboard

// Category

router.get("/categories", getCategories);

//cart

router.get("/cart", getCart);
router.post("/cart", addToCart);
router.delete("/cart/:id", deleteCart);
router.delete("/cart/:cartId/item/:productId", deleteOneProduct);
router.patch(
  "/cart-increment-quantity/:cartId/item/:ProductId",
  incrementQuantity
);
router.patch(
  "/cart-decrement-quantity/:cartId/item/:productId",
  decrementQuantity
);

//address
router.get("/address", getAddresses);
router.get("/address/:id", getAddress);
router.post("/address", createAddress);
router.delete("/address/:id", deleteAddress);
router.patch("/address/:id", updateAddress);

//order
router.post('/order')
router.get('/orders')
router.get('/order/:id');
router.post('/cancel-order/:id')



module.exports = router;
