const mongoose = require("mongoose");
const User = require("./userModel");
const Product = require("./ProductModel");

const { Schema } = mongoose;
const cartSchema = new Schema({
  user: {
    type: Schema.Types.ObjectId,
    ref: User,
    required: true,
  },
  items: [
    {
      product: {
        type: Schema.Types.ObjectId,
        ref: Product,
      },
      quantity: {
        type: Number,
      },
    },
  ],
  
  
});

const Cart = mongoose.model("Cart",cartSchema);
module.exports=Cart;

