const mongoose = require("mongoose");
const Category = require("../../model/categoryModel");

//getting all category list to admin dashboard

const getCategories = async (req, res) => {
  try {
    const { status, search, page = 1, limit = 10 } = req.query;

    let filter = {};
    console.log(status,'-------status')

    if (status) {
      if (status === "active") {
        filter.IsActive = true;
      } else {
        filter.IsActive = false;
      }
    }

    if (search) {
      filter.name = { $regex: new RegExp(search, "i") };
    }

    const skip = (page - 1) * limit;

    const categories = await Category.find(filter).skip(skip).limit(limit);

    const totalAvailableCategories = await Category.countDocuments(filter);

    res.status(200).json({ categories, totalAvailableCategories });
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
};
//Creatinig a new Category if need for admin

const createCategory = async (req, res) => {
  try {
    let formData = req.body;
    const imgURL = req?.file?.filename;

    if (imgURL) {
      formData = { ...formData, imgURL: imgURL };
    }

    const category = await Category.create(formData);

    res.status(200).json({ category });
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
};

//deleting cateogory
const deleteCategory = async (req, res) => {
  try {
    const { id } = req.params;
    if (!mongoose.Types.ObjectId.isValid(id)) {
      throw Error("Invalid ID");
    }

    const category = await Category.findOneAndDelete({ _id: id });
    if (!category) {
      throw Error("No such  Cateogry");
    }
    res.status(200).json({ category });
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
};
//updating the cateogry
const updateCategory = async (req, res) => {
  try {
    const { id } = req.params;
    let formData = req.body;
    if (!mongoose.Types.ObjectId.isValid(id)) {
      throw Error("Invalid ID");
    }

    let imgURL = req?.file?.filename;
    console.log(imgURL,"-----------imgurl----------------")
    if (imgURL) {
      formData = { ...formData, imgURL: imgURL };
    }
    console.log(formData,"++++++++++++++++++++++++++++++++++++++++")
    const category = await Category.findOneAndUpdate(
      { _id: id },
      { $set: { ...formData } },
      { new: true }
    );
    if (!category) {
      throw Error("No such Cateogory");
    }
    res.status(200).json({ category });
  } catch (error) {
    console.error(error,"category update--------------")
    res.status(400).json({ error: error.message });
  }
};
// Only getting one Category
const getCategory = async (req, res) => {
  try {
    const { id } = req.params;

    if (!mongoose.Types.ObjectId.isValid(id)) {
      throw Error("Invalid ID!!!");
    }

    const category = await Category.findOne({ _id: id });

    if (!category) {
      throw Error("No Such Category");
    }

    res.status(200).json({ category });
  } catch (error) {
    console.error("error is thrown",error)
    res.status(400).json({ error: error.message });
  }
};

module.exports = {
  updateCategory,
  getCategories,
  createCategory,
  deleteCategory,
  getCategory,
};
