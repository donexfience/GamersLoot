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
    const { id } = req.params;
    if (!mongoose.Types.ObjectId.isValid(id)) {
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

    if (!mongoose.Types.ObjectId.isValid(productId)) {
      throw Error("Invalid Product !!!");
    }
    if (!mongoose.Types.ObjectId.isValid(cartId)) {
      throw Error("Invalid Cart !!!");
    }

    const updatedCart = await Cart.findByIdAndUpdate(cartId, {
      $pull: {
        items: { product: productId },
      },
    });

    if (!updatedCart) {
      throw Error("Invalid Product");
    }

    console.log(updatedCart);

    res.status(200).json({ productId });
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
};
const incrementQuantity = async (req, res) => {
  try {
    console.log(req.params)
    const { cartId, ProductId } = req.params;
    let cart = await Cart.findOne({ _id: cartId });
    let [product] = cart.items.filter((item) => {
      return item.product.toString() === ProductId;
    });
    console.log(product)
    let productOriginalData = await Product.findById(product.product, {
      stockQuantity: 1,
    });
    if (product.quantity >= productOriginalData.stockQuantity) {
      throw Error("Insufficient Products");
    }
    cart = await Cart.findOneAndUpdate(
      {
        "items.product": ProductId,
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
      return item.product.toString() === ProductId;
    });
    return res.status(200).json({ updatedItem: dataAfterIncrement });

  } catch (error) {
    console.error(error)
    res.status(400).json({ error: error.message });
  }
};

const decrementQuantity = async (req, res) => {
  try {
    const { cartId, productId } = req.params;
    
    // Find the cart
    let cart = await Cart.findOne({ _id: cartId });

    // Find the product in the cart
    const productIndex = cart.items.findIndex(item => item.product.toString() === productId);
    if (productIndex === -1) {
      throw new Error("Product not found in cart");
    }

    // Ensure the quantity is greater than 1
    if (cart.items[productIndex].quantity < 2) {
      throw new Error("At least 1 quantity is required");
    }

    // Decrement the quantity of the product in the cart
    cart.items[productIndex].quantity--;
    cart = await cart.save();

    // Return the updated product data
    const updatedItem = cart.items[productIndex];

    return res.status(200).json({ updatedItem });
  } catch (error) {
    console.error(error);
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
