const mongoose = require("mongoose");
const Product = require("../../model/ProductModel");
const Address = require("../../model/AddressModal");
const Cart = require("../../model/cartModel");
const Order = require("../../model/orderModel");
const Payment = require("../../model/paymentModel");
const jwt = require("jsonwebtoken");

const getOrders = async (req, res) => {
  try {
    const token = req.cookies.user_token;
    const { _id } = jwt.verify(token, process.env.SECRET);
    if (!mongoose.Types.ObjectId.isValid(_id)) {
      throw Error("Invalid ID");
    }
    const { page = 1, limit = 10 } = req.query;
    const skip = (page - 1) * limit;
    const orders = await Order.find(
      { user: _id },
      {
        address: 0,
        paymentMode: 0,
        deliveryDate: 0,
        user: 0,
        statusHistory: 0,
        products: { $slice: 1 },
      }
    )
      .skip(skip)
      .limit(limit)
      .populate("products.productId", { name: 1 })
      .sort({ creatdAt: -1 });
    const totalAvailableOrders = await Order.countDocuments({ user: _id });
    res.status(200).json({ orders, totalAvailableOrders });
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
};

//stock updating
//increment or decremnt product count and updating status

// # we can use it for cancel order and create order

const updateProductList = async (id, count) => {
  const product = await Product.findOne({ _id: id });
  if (count < 0) {
    if (product.stockQuantity - count * -1 < 0) {
      throw Error(`${product.name} doesn\'t have ${count * -1} stock`);
    }
  }
  const updateProduct = await Product.findByIdAndUpdate(
    id,
    { $inc: { stockQuantity: count } },
    { new: true }
  );
  if (
    parseInt(updateProduct.stockQuantity) < 5 &&
    parseInt(updateProduct.stockQuantity) > 0
  ) {
    await Product.findByIdAndUpdate(id, {
      $set: { status: "low quantity" },
    });
  }
  if (parseInt(updateProduct.stockQuantity) === 0) {
    await Product.findByIdAndUpdate(
      id,
      { $set: { status: "out of stock" } },
      { new: true }
    );
  }
  if (parseInt(updateProduct.stockQuantity) > 5) {
    await Product.findByIdAndUpdate(id, {
      $set: { status: "published" },
    });
  }
};

const createOrder = async (req, res) => {
  try {
    const token = req.cookies.user_token;
    const { _id } = jwt.verify(token, process.env.SECRET);
    if (!mongoose.Types.ObjectId.isValid(_id)) {
      throw Error("Invalid ID");
    }
    const { address, paymentMode, notes } = req.body;
    console.log(address,"--------------------------")
    const addressData = await Address.findOne({ _id: address });
    console.log(addressData,"---------------")
    const cart = await Cart.findOne({ user: _id }).populate("items.product", {
      name: 1,
      price: 1,
      markup: 1,
    });
    let sum = 0;
    let totalQuantity = 0;
    cart.items.map((item) => {
      sum = sum + (item.product.price + item.product.markup) * item.quantity;
      totalQuantity = totalQuantity + item.quantity;
    });
    let sumWithTax = parseInt(sum + sum * 0.08);

    const products = cart.items.map((item) => ({
      productId: item.product._id,
      totalPrice: item.product.price + item.product.markup,
      price: item.product.price,
      markup: item.product.markup,
      quantity: item.quantity,
    }));
    let orderData = {
      user: _id,
      address: addressData,
      products: products,
      subTotal: sum,
      tax: parseInt(sum * 0.08),
      paymentMode,
      totalPrice: sumWithTax,
      totalQuantity,
      statusHistory: [
        {
          status: "pending",
        },
      ],
      ...(notes ? notes : {}),
    };
    console.log(orderData,"000000000000000000000000")
    const updateProductCount = products.map((item) => {
      return updateProductList(item.productId, -item.quantity);
    });
    await Promise.all(updateProductCount);
    const order = await Order.create(orderData);
    console.log(order,"suceessssssssssssssssssssssssssss")
    if (order) {
      await Cart.findByIdAndDelete(cart._id);
    }
    res.status(200).json({ order });
  } catch (error) {
    console.error(error, "--------------------------");
    res.status(400).json({ error: error.message });
  }
};

//canceling order

const cancelOrder = async (req, res) => {
  try {
    const { id } = req.params;
    const { reason } = req.body;
    let finder = {};
    if (mongoose.Types.ObjectId.isValid(id)) {
      finder._id = id;
    } else {
      finder.orderId = id;
    }
    const orderDetails = await Order.findOne(finder).populate(
      "products.productId"
    );
    const products = orderDetails.products.map((item) => ({
      productId: item.productId,
      quantity: item.quantity,
    }));
    const updateProductCount = products.map((item) => {
      return updateProductList(item.productId, item.quantity);
    });
    await Promise.all(updateProductCount);
    const order = await Order.findOneAndUpdate(
      find,
      {
        $set: { status: "cancelled" },
        $push: {
          statusHistory: {
            status: "cancelled",
            date: Date.now(),
            reason: reason,
          },
        },
      },
      { new: true }
    );

    //updating payment of delivery in payment collection

    await Payment.findOneAndUpdate(
      { order: order._id },
      {
        $set: {
          status: "refunded",
        },
      }
    );
    res.status(200).json({ order });
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
};

//getting single order

const getOrder = async (req, res) => {
  try {
    const { id } = req.params;
    let finder = {};

    if (mongoose.Types.ObjectId.isValid(id)) {
      find._id = id;
    } else {
      finder.orderId = id;
    }
    const order = await Order.findOne(finder).populate("products.productId", {
      imageURL: 1,
      name: 1,
      description: 1,
    });
    if (!order) {
      throw Error("No such order");
    }
    res.status(200).json({ order });
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
};

// total orders and details

const orderCount = async (req, res) => {
  try {
    const token = req.cookies.user_token;
    const { _id } = jwt.verify(token, process.env.SECRET);
    if (!mongoose.Types.ObjectId.isValid(_id)) {
      {
        throw Error("Invalid Id");
      }
    }
    const totalOrders = await Order.countDocuments({ user: _id });
    const pendingOrders = await Order.countDocuments({
      user: _id,
      status: "pending",
    });
    const completedOrders = await Order.countDocuments({
      user: _id,
      status: "delivered",
    });
    const totalAddresses = await Address.countDocuments({ user: _id });

    // Calculate total products purchased
    const orders = await Order.find({ user: _id });
    let totalProductsPurchased = 0;
    orders.forEach((order) => {
      totalProductsPurchased += order.totalQuantity;
    });
    // Calculate total products available
    const totalProductsAvailable = await Product.countDocuments();

    // Calculate average purchase percentage
    const averagePurchasePercentage =
      (totalProductsPurchased / totalProductsAvailable) * 100;
    res.status(200).json({
      totalAddresses,
      totalProductsPurchased,
      averagePurchasePercentage,
      totalOrders,
      pendingOrders,
      completedOrders,
    });
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
};

module.exports = {
  createOrder,
  getOrder,
  getOrders,
  cancelOrder,
  orderCount,
};
