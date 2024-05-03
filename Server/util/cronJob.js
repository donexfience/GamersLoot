const cron = require("node-cron");
const mongoose = require("mongoose");
const CatOffer = require("../model/categoryoffer");
const Product = require("../model/ProductModel");
const checkoffer = async () => {
  cron.schedule("0 0 * * *", async () => {
    try {
      // Find active offers within the date range
      const currentDate = new Date();
      const activeOffers = await Offer.find({
        startingDate: { $lte: currentDate },
        endingDate: { $gte: currentDate },
      });

      for (const offers of activeOffers) {
        const products = await Product.find({ category: offers.category });
        for (const product of products) {
          if (!product.offer || product.offer < offers.offer) {
            product.offer = offers.offer;
            await product.save();
          }
        }
      }
      console.log("product updated successfully");
    } catch (error) {
      console.error(error, "error of updating cateogory offer");
    }
  });
};
module.exports=checkoffer
