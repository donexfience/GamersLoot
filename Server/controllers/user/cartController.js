const jwt = require("jsonwebtoken");
const mongoose = require("mongoose");
const Cart = require("../../model/cartModel");
const Product = require("../../model/ProductModel");

const getCart = async (req, res) => {
  try {
    const token = req.cookies.user_token;
    const { _id } = jwt.verify(token, process.env.SECRET);
    if (!mongoose.Types.ObjectId.isValid(_id)) {
      throw Error("Invalid ID");
    }
    const cart = await Cart.findOne({ user: _id })
      .populate("items.product", {
        name: 1,
        imageURL: 1,
        price: 1,
        markup: 1,
      })
      .sort({ createdAt: -1 });
    res.status(200).json({ cart });
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
};

const addToCart = async (req, res) => {
  try {
    const token = req.cookies.user_token;
    const { _id } = jwt.verify(token, process.env.SECRET);
    const items = req.body;
    console.log("🚀 ~ file: cartController.js:32 ~ addToCart ~ items:", items);

    const product = await Product.findById(items.product);
    if (!product) {
      throw new Error("product not found");
    }
    if (product.stockQuantity < items.quantity) {
      throw new Error("Insufficient stock Quantity");
    }
    let cart = {};
    const exists = await Cart.findOne({ user: _id });
    console.log(
      "🚀 ~ file: cartController.js:43 ~ addToCart ~ exists:",
      exists
    );

    //checking product exist
    if (exists) {
      const existingProductIndex = exists.items.findIndex((item) => {
        return item.product.equals(items.product);
      });
      console.log(
        "🚀 ~ file: cartController.js:50 ~ existingProductIndex ~ existingProductIndex:",
        existingProductIndex
      );

      if (existingProductIndex !== -1) {
        //checking product quantity existence
        if (
          product.stockQuantity < exists.items[existingProductIndex].quantity
        ) {
          throw Error("Not enough Product Available to add ");
        }
        cart = await Cart.findOneAndUpdate(
          { "items.product": items.product, user: _id },
          {
            $inc: {
              "items.$.quantity": items.quantity,
            },
          },
          { new: true }
        );
        console.log(cart, "---------------------------");
      } else {
        //if product doesnt exist in the cart, add it
        cart = await Cart.findOneAndUpdate(
          { user: _id },
          {
            $push: {
              items: { product: items.product, quantity: items.quantity },
            },
          },
          { new: true }
        );
      }
    } else {
      //If the cart doesn't exist,create new one with item
      cart = await Cart.create({
        user: _id,
        items: [{ product: items.product, quantity: items.quantity }],
      });
    }
    res.status(200).json({ cart: cart });
  } catch (error) {
    console.log("🚀 ~ file: cartController.js:83 ~ addToCart ~ error:", error);
    res.status(400).json({ error: error.message });
  }
};

const deleteCart = async (req, res) => {
  try {
    const { _id } = req.params;
    if (!mongoose.Types.ObjectId.isValid(_id)) {
      throw Error("Invalid ID");
    }
    const cartItem = await Cart.findOneAndDelete({ _id: id });
    if (!cartItem) {
      throw Error("No such Cart");
    }
    res.status(200).json({ cartItem });
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
};
const deleteOneProduct = async (req, res) => {
  try {
    const { cartId, productId } = req.params;
    if (!mongoose.Types.ObjectId.isValid(cartId)) {
      throw Error("Invalid ID");
    }
    if (!mongoose.Types.ObjectId.isValid(productId)) {
      throw Error("Invalid ID");
    }
    const updatedCart = await Cart.findByIdAndUpdate(cartId, {
      $pull: { items: { product: productId } },
    });
    if (!updatedCart) {
      throw Error("Invalid product");
    }
    console.log(
      "🚀 ~ file: cartController.js:116 ~ deleteOneProduct ~ updatedCart:",
      updatedCart
    );
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
};
const incrementQuantity = async (req, res) => {
  try {
    const { cartId, productId } = req.params;
    let cart = await Cart.findOne({ _id: cartId });
    let [product] = cart.items.filter((item) => {
      return item.product.toString() === productId;
    });
    let productOriginalData = await Product.findById(product.product, {
      stockQuantity: 1,
    });
    if (product.quantity >= productOriginalData.stockQuantity) {
      throw Error("Insufficient Products");
    }
    cart = await Cart.findOneAndUpdate(
      {
        "items.product": productId,
        _id: cartId,
      },
      {
        $inc: {
          "items.$.quantity": 1,
        },
      },
      {
        new: true,
      }
    );
    let [dataAfterIncrement] = cart.items.filter((item) => {
      return item.product.toString() === productId;
    });
    return res.status(200).json({ updatedItem: dataAfterIncrement });
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
};

const decrementQuantity = async (req, res) => {
  try {
    const { cartId, productId } = req.params;
    let cart = await Cart.findOne({ _id: cartId });
    let [product] = cart.items.filter((item) => {
      return item.product.toString() === productId;
    });
    if (product.quantity < 2) {
      throw Error("At least 1 quantity is required");
    }
    cart = await Cart.findByIdAndUpdate(
      { "item.product": productId, _id: cartId },
      { $inc: { "items.$.quantity": -1 } },
      { new: true }
    );
    let [dataAfterDecrement] = cart.item.filter((item) => {
      return item.product.toString() === productId;
    });
    return res.status(200).json({ updatedItem: dataAfterDecrement });
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
};
module.exports = {
  getCart,
  deleteCart,
  addToCart,
  incrementQuantity,
  decrementQuantity,
  deleteOneProduct,
};
