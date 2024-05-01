const Product = require("../../model/ProductModel");


// Reading entire banners
const getNewKeyboard = async (req, res) => {
  try {
    const keyboards = await Product.find(
      {
        category: "662e9e1d1f9735e6fb9ba4cc",
        isActive: true,
      },
      { imageURL: 1, price: 1, markup: 1, name: 1 }
    )
      .sort({ createdAt: -1 })
      .limit(5);

    return res.status(200).json({ keyboards });
  } catch (error) {
    console.error(error,"error from public home slider")
    res.status(400).json({ error: error.message });
  }
};

module.exports = {
  getNewKeyboard,
};
