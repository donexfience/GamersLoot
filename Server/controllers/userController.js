const jwt = require("jsonwebtoken");
const User = require("../model/userModel");
const { default: mongoose } = require("mongoose");
const createToken = (_id) => {
  return jwt.sign({ _id }, process.env.SECRET, { expiresIn: "1d" });
};
const cookieConfig = {
  secure: true,
  httpOnly: true,
  maxAge: 100 * 60 * 60 * 24,
};

//to get user data when the first page load
const getUserDataFirst = async (req, res) => {
  try {
    const token = req.cookies.user_token;
    if (!token) {
      throw Error("NO TOKEN FOUND");
    }
    const { _id } = jwt.verify(token, process.env.SECRET);
    const user = await User.findOne({ _id }, { password: 0 });
    if (!user) {
      throw Error("Cannot find the user");
    }
    res.status(200).json(user);
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
};

const editUser = async (req, res) => {
  try {
    const token = req.cookies.user_token;
    const { _id } = jwt.verify(token, process.env.SECRET);
    if (!mongoose.Types.ObjectId.isValid(_id)) {
      throw Error("Invalid Id");
    }
    let formData = req.body;
    const profileImgURL = req?.file?.filename;

    if (profileImgURL) {
      formData = { ...formData, profileImgURL: profileImgURL };
    }
    const updateUser = await User.findByIdAndUpdate(
      { _id },
      { $set: { ...formData } },
      { new: true }
    );

    if (!updateUser) {
      throw Error("No such User");
    }
    res.status(200).json({updateUser})
  } catch (error) {
    console.error(error);
    res.status(400).json({ error: error.message });
  }
};

const signUpUser = async (req, res) => {
  try {
    let userCredentials = req.body;
    console.log(userCredentials, "signup data");
    const profileImgURL = req?.file?.filename;
    if (profileImgURL) {
      userCredentials = { ...userCredentials, profileImgURL };
    }
    const user = await User.signup(userCredentials, "user", true);

    const token = createToken(user._id);
    res.cookie("user_token", token, cookieConfig);
    res.status(200).json(user);
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
};
const loginUser = async (req, res) => {
  const { email, password } = req.body;
  try {
    const user = await User.login(email, password);
    const token = createToken(user._id);
    res.cookie("user_token", token, cookieConfig);
    res.status(200).json(user);
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
};
const logoutUser = async (req, res) => {
  res.clearCookie("user_token");

  res.status(200).json({ msg: "Logged out Successfully" });
};

module.exports = {
  logoutUser,
  loginUser,
  signUpUser,
  getUserDataFirst,
  editUser,
};
