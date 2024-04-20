const mongoose = require("mongoose");
const Product = require("../../model/ProductModel");
const Address = require("../../model/AddressModal");
const Cart = require("../../model/cartModel");
const Order = require("../../model/orderModel");

//stock updating
//increment or decremnt product count and updating status

const updateProductList = async (id, count) => {
  const product = await Product.findOne({ _id: id });
  if (count < 0) {
    if (product.stockQuantity - count * -1 < 0) {
      throw Error(`${product.name} doesn\'t have ${count} stock`);
    }
  }
  const updateProduct = await Product.findByIdAndUpdate(
    id,
    { $inc: { stockQuantity: count } },
    { new: true }
  );
  if (
    parseInt(updateProduct.stockQuantity) < 5 &&
    parent(updateProduct.stockQuantity) > 0
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
    const addressData = await Address.findOne({ id: address });
    const cart = await Cart.findOne({ user: _id }).populate("item.product", {
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
    const updateProductPromises = products.map((item) => {
      return updateProductList(item.productId, -item.quantity);
    });
    await Promise.all(updateProductPromises);
    const order = await Order.create(orderData);
    if (order) {
      await Cart.findByIdAndDelete(cart._id);
    }
    res.status(200).json({ order });
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
};
