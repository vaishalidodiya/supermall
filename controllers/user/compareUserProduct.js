const Product = require("../../models/product");


const getAllProductsForComparison = async (req, res) => {
  try {
    const products = await Product.find({})
      .populate("categoryId", "categoryName")
      .populate("offerId", "offerName")
      .populate("storeId", "storeName")
      .lean();



    const formattedProducts = products.map((product) => ({
      _id: product._id,
      productName: product.productName,
      description: product.description,
      floor: product.floor,
      features: product.features,
      price: product.price,
      categoryName: product.categoryId?.categoryName || "",
      offerName: product.offerId?.offerName || "",
      storeName: product.storeId?.storeName || "",
    }));

    res.json(formattedProducts);
  } catch (err) {
    console.error("Error fetching compare products:", err);
    res.status(500).json({ error: "Failed to load products" });

  }
};

module.exports = {
  getAllProductsForComparison,
};
