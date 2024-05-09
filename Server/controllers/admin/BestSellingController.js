const Order = require("../../model/orderModel");
const Products = require("../../model/ProductModel");
const BestSellingProducts = async (req, res) => {
  try {
    const bestSellingProducts = await Order.aggregate([
      { $unwind: "$products" },
      {
        $group: {
          _id: "$products.productId",
          totalQuantitySold: { $sum: "$products.quantity" },
        },
      },
      { $sort: { totalQuantitySold: -1 } },
      { $limit: 10 },
      {
        $lookup: {
          from: "products",
          localField: "_id",
          foreignField: "_id",
          as: "productDetails",
        },
      },
      {
        $project: {
          _id: 0,
          totalQuantitySold: 1,
          "productDetails.name": 1,
          "productDetails.stockQuantity": 1,
          "productDetails.imageURL": 1,
          "productDetails.price": 1,
          "productDetails.status": 1,
          "productDetails.category": 1,
        },
      },
    ]);
    console.log(
      bestSellingProducts,
      "kkkkkkkkkkkkkkkkkkkkkkkkkkkkkkkkkkkkkkkkkkkkkkkkkkkkkkkkkkkkkk"
    );
    res.status(200).json(bestSellingProducts);
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
};

const BestSellingCategory = async (req, res) => {
  try {
    const bestSellingCategories = await Order.aggregate([

        //stage 1 from products
      { $unwind: "$products" }, // Unwind to access each product in the order
      {
        $lookup: {
          from: "products",
          localField: "products.productId",
          foreignField: "_id",
          as: "productDetails",
        },
      },
      { $unwind: "$productDetails" }, // Unwind to access the product details
      {
        $lookup: {
          from: "categories",
          localField: "productDetails.category",
          foreignField: "_id",
          as: "category",
        },
      },
      { $unwind: "$category" }, // Unwind to access the category details
      {
        $group: {
          _id: "$category", // Group by category
          totalQuantitySold: { $sum: "$products.quantity" }, // Sum up the quantity sold
        },
      },
      { $sort: { totalQuantitySold: -1 } },
      { $limit: 10 },
    ]);

    res.status(200).json(bestSellingCategories);
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
};

module.exports = {
  BestSellingProducts,
  BestSellingCategory,
};
