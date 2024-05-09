const Order = require("../../model/orderModel");

const TotalSales = async (req, res) => {
  try {
    const numberOfDates = parseInt(req.query.numberOfDates) || 7;
    const filter = {};
    const startDate = new Date();
    startDate.setDate(startDate.getDate() - numberOfDates);
    filter.createdAt = { $gte: startDate };
    const orders = await Order.find(filter);
    const totalOrdersSold = orders.length; 

    const salesData = await Order.aggregate([
      { $match: filter },
      {
        $group: {
          _id: { $dateToString: { format: "%Y-%m-%d", date: "$createdAt" } },
          totalSales: { $sum: 1 }, 
        },
      },
      { $sort: { _id: 1 } },
    ]);

    res.status(200).json({ totalOrdersSold, salesData });
  } catch (error) {
    console.error("Error fetching total sales:", error);
    res.status(500).json({ error: "Internal server error" });
  }
};

module.exports = {
  TotalSales,
};
