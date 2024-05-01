const Wallet = require("../../model/walletModel");
const jwt = require("jsonwebtoken");

const getWalletBalance = async (req, res) => {
  try {
    const token = req.cookies.user_token;
    const { _id } = jwt.verify(token, process.env.SECRET);
    const wallet = await Wallet.findOne({ user: _id });

    if (!wallet) {
      return res.status(404).json({ message: "Wallet not found" });
    }
    const walletBalance = wallet.balance;
    res.status(200).json({ balance: walletBalance });
  } catch (error) {
    console.error("Error getting wallet balance:", error);
    res.status(500).json({ message: "Server error" });
  }
};

module.exports = { getWalletBalance };
