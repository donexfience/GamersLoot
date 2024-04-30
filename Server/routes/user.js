const express = require("express");
const {
  logoutUser,
  getUserDataFirst,
  editUser,
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
const {
  createOrder,
  getOrder,
  getOrders,
  cancelOrder,
  orderCount,
} = require("../controllers/user/orderController");
const upload = require("../middleware/upload");
const {
  readProductReviews,
  readProductReview,
  createNewReview,
  EditReview,
  readOrderReview,
} = require("../controllers/user/reviewController");
const {
  applyCoupon,
  removeCoupon,
} = require("../controllers/user/couponController");
const {
  createRazorPayOrder,
  getKey,
  verifyPayment,
} = require("../controllers/user/paymentController");
const { addTowishlist, deleteOneProductw, deleteWishlist, getWishlist, addToCartFromWishlist } = require("../controllers/user/wishlistController");
const router = express.Router();
//Logout

router.get("/logout", logoutUser);

//to get user data at initial load;

router.get("/", getUserDataFirst);

//edit user profile

router.post("/edit-profile", upload.single("profileImgURL"), editUser);

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
router.post("/order", createOrder);
router.get("/orders", getOrders);
router.get("/order/:id", getOrder);
router.post("/cancel-order/:id", cancelOrder);
router.get("/order-count", orderCount);

//review
// Reviews
router.get("/reviews/:id", readProductReviews);
router.get("/review/:id", readProductReview);
router.post("/review", createNewReview);
router.patch("/review/:id", EditReview);
// Review on order details page
router.get("/order-review/:id", readOrderReview);

//coupon apply and remove

router.post("/coupon-apply", applyCoupon);
router.get("/coupon-remove", removeCoupon);

//razorpay payment config

router.get("/razor-key", getKey);
router.post("/razor-order", createRazorPayOrder);
router.post("/razor-verify", verifyPayment);

//wishlist

router.post("/wishlist", addTowishlist);
router.get('/wishlist',getWishlist)
router.delete('/wishlist/:id',deleteWishlist)
router.delete("/wishlist/:wishlist/item/:productId", deleteOneProductw);
router.post('/wishlist/addToCart',addToCartFromWishlist)

module.exports = router;
