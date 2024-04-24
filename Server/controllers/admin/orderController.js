const mongoose = require("mongoose");
const Order = require("../../model/orderModel");
const getOrder = async (req, res) => {
  try {
    const { id } = req.params;
    //empty object for stroring queries
    let finder = {};
    if (!mongoose.Types.ObjectId.isValid(id)) {
      find._id = id;
    } else {
      finder.orderId = id;
    }
    const order = await Order.findOne(find).populate("products.producId", {
      imageURL: 1,
      name: 1,
    });

    if (!order) {
      throw Error("No Such Order");
    }

    res.status(200).json({ order });
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
};

const updateOrderStatus = async (req, res) => {
  try {
    const { id } = req.params;

    let finder = {};
    if (mongoose.Types.ObjectId.isValid(id)) {
      finder._id = id;
    } else {
      finder.orderId = id;
    }
    const { status, date, paymentStatus, description } = req.body;

    if (!mongoose.Types.ObjectId.isValid(id)) {
      throw Error("Invalid ID!!!");
    }

    const statusExisted = await Order.findOne({
      ...finder,
      "statusHistory.status": status,
    });

    let updateOptions = {
      $set: {
        status,
      },
    };

    // if the status is not ther wec creaing
    if (!statusExisted) {
      updateOptions.$push = {
        statusHistory: {
          status,
          description,
          date: new Date(date),
        },
      };
    }

    const updated = await Order.findOneAndUpdate(finder, updateOptions, {
      new: true,
    });

    if (!updated) {
      throw Error("Something went wrong");
    }

    if (paymentStatus === "yes") {
      await Payment.create({
        order: updated._id,
        payment_id: `cod_${uuid.v4()}`,
        user: updated.user,
        status: "success",
        paymentMode: "cashOnDelivery",
      });
    }

    if (paymentStatus === "no") {
      await Payment.create({
        order: updated._id,
        user: updated.user,
        status: "pending",
        paymentMode: "cashOnDelivery",
      });
    }

    const order = await Order.findOne(finder, {
      address: 0,
      products: { $slice: 1 },
    })
      .populate("user", { firstName: 1, lastName: 1 })
      .populate("products.productId", { imageURL: 1, name: 1 });

    res.status(200).json({ order });
  } catch (error) {
    console.error(error);
    res.status(400).json({ error: error.message });
  }
};
const getOrders = async (req, res) => {
  try {
    const {
      status,
      search,
      page = 1,
      limit = 10,
      startingDate,
      endingDate,
    } = req.query;

    let filter = {};

    if (startingDate) {
      const date = new Date(startingDate);
      filter.createdAt = { $gte: date };
    }
    if (endingDate) {
      const date = new Date(endingDate);
      filter.createdAt = { ...filter.createdAt, $lte: date };
    }

    if (status) {
      filter.status = status;
    } else {
      filter.status = {
        $in: [
          "pending",
          "processing",
          "shipped",
          "delivered",
          "cancelled",
          "returned",
        ],
      };
    }

    if (search) {
      if (mongoose.Types.ObjectId.isValid(search)) {
        filter._id = search;
      } else {
        const searchAsNumber = Number(search);
        if (!isNaN(searchAsNumber)) {
          filter.orderId = searchAsNumber;
        } else {
          throw new Error("Please search using order Id");
        }
      }
    }

    const skip = (page - 1) * limit;

    const orders = await Order.find(filter, {
      address: 0,
      statusHistory: 0,
      products: { $slice: 1 },
    })
      .skip(skip)
      .limit(limit)
      .populate("user", { firstName: 1, lastName: 1 })
      .populate("products.productId", { imageURL: 1, name: 1 })
      .sort({ createdAt: -1 });

    const totalAvailableOrders = await Order.countDocuments(filter);

    res.status(200).json({ orders, totalAvailableOrders });
  } catch (error) {
    console.error(error);
    res.status(400).json({ error: error.message });
  }
};
const clearOrder = async (req, res) => {
  try {
    const data = await Order.deleteMany({});

    res.status(200).json({ status: true });
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
};

module.exports = { clearOrder, getOrder, getOrders, updateOrderStatus };
