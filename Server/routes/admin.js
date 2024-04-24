const express = require("express");
const {
  deleteCategory,
  getCategory,
  getCategories,
  updateCategory,
  createCategory,
} = require("../controllers/admin/categoryController");
const router = express.Router();
const upload = require("../middleware/upload");
const { requireAdminAuth } = require("../middleware/requireAuth");
const {
  getProduct,
  createProducts,
  addProduct,
  getSingleProduct,
  updateProduct,
  deleteProduct,
} = require("../controllers/admin/productController");
const {
  getCustomer,
  getCustomers,
  blockOrUnblockCustomer,
} = require("../controllers/admin/customerController");
const {
  getOrders,
  clearOrder,
  getOrder,
  updateOrderStatus,
} = require("../controllers/admin/orderController");
//category controller functions mounting them to corresponding suiitable routes

router.get("/categories", getCategories);
router.get("/category/:id", getCategory);
router.delete("/category/:id", deleteCategory);
router.patch("/category/:id", upload.single("imgURL"), updateCategory);
router.post(
  "/category",
  requireAdminAuth,
  upload.single("imgURL"),
  createCategory
);
module.exports = router;

//product controller functions mounting them to corresponding suitabele routes

router.get("/products", getProduct);
router.get("/product/:id", getSingleProduct);
router.patch("/product/:id", upload.any(), updateProduct);
router.delete("product/:id");
router.post("/product", upload.any(), addProduct);
router.delete("/product/:id", deleteProduct);

//customer controller functions mounting them to corresponding suitable routes

router.get("/customers", getCustomers);
router.get("/customer/:id", getCustomer);
router.delete("/customer/:id");
router.patch("/customer/:id");
router.post("/customer", upload.any());
router.patch("/customer-block-unblock/:id", blockOrUnblockCustomer);

router.get("/orders", getOrders);
router.get("/clear-orders", clearOrder);
router.get("/orders/:id", getOrder);
router.patch(`/order-status/:id`, updateOrderStatus);
