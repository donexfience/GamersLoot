const Coupon = require("../../model/couponModel");
const jwt = require("jsonwebtoken");
const mongoose = require("mongoose");
const Cart = require("../../model/cartModel");
const getCoupons = async (req, res) => {
  try {
    const TodayDate = new Date();
    const coupons = await Coupon.find({
      isActive: true,
      expirationDate: { $gt: TodayDate },
    });
    return res.status(200).json({ coupons });
  } catch (error) {
    console.error(error);
    res.status(400).json({ error: error.message });
  }
};

const applyCoupon = async (req, res) => {
  try {
    const { code } = req.body;
    const TodayDate = new Date();
    const coupon = await Coupon.findOne({
      code,
      expirationDate: { $gt: TodayDate },
    });
    if (!coupon) {
      throw Error("coupon not found");
    }
    if (coupon.used === coupon.maximumUses) {
      throw Error("Coupon Usage Limit Reached");
    }
    const token = req.cookies.user_token;
    const { _id } = jwt.verify(token, process.env.SECRET);
    if (!mongoose.Types.ObjectId.isValid(_id)) {
      throw Error("Invalid ID !!!");
    }

    const cart = await Cart.findOne({ user: _id }).populate("items.productId", {
      name: 1,
      price: 1,
      markup: 1,
    });
    let totalQuantity = 0;
    let sum = 0;
    cart.items.map((item) => {
      sum = sum + (item.product.price + item.product.markup) * item.quantity;
      totalQuantity = totalQuantity + item.quantity;
    });
    if (sum < coupon.minimumPurchaseAmount) {
      throw Error("total price is greater than coupon purchase limit");
    }
    const updatedCart = await Cart.findOneAndUpdate(
      {
        id: cart._id,
      },
      {
        $set: {
          coupon: coupon._id,
          couponCode: code,
          discount: coupon.value,
          type: coupon.type,
        },
      }
    );
    if (!updatedCart) {
      throw Error("cart is not updated");
    }
    res.status(200).json({
      discount: coupon.value,
      couponType: coupon.type,
      couponCode: code,
    });
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
};
const removeCoupon = async (req, res) => {
  try {
    const token = req.cookies.user_token;
    const { _id } = jwt.verify(token, process.env.SECRET);
    if (!mongoose.Types.ObjectId.isValid(_id)) {
      throw Error("invalid user Id");
    }
    await Cart.findOneAndUpdate(
      { user: _id },
      { $set: { coupon: null, couponCode: null, discount: null, type: null } },
      { new: true }
    );
    res.status(200).json({ success: true });
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
};

module.exports ={
    getCoupons,
    applyCoupon,
    removeCoupon
}