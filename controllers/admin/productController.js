const Product = require("../../models/product");

const productList = async (req, res) => {
  const start = parseInt(req.query.start);
  const length = parseInt(req.query.length);
  const storeId = req.query.storeId;

  try {
    const filter = storeId ? { storeId } : {};

    const total = await Product.countDocuments(filter);

    let products = await Product.find(filter)
      .skip(start)
      .limit(length)
      .sort({ createdAt: -1 })
      .populate("categoryId", "categoryName")
      .populate("offerId", "offerName")
      .select(
        "_id productName description floor features price storeId categoryId offerId createdAt updatedAt"
      )

      .lean();

    products = products.map((elem, index) => ({
      ...elem,
      seqNo: index + start + 1,
      categoryName: elem.categoryId?.categoryName || "N/A",
      offerName: elem.offerId?.offerName || "N/A",
    }));

    res.json({
      status: 0,
      msg: products.length ? "Data loaded successfully" : "No records found",
      recordsTotal: total,
      recordsFiltered: total,
      data: products,
    });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

const productDetails = async (req, res) => {
  try {
    const product = await Product.findOne({ _id: req.params.id })
      .populate("categoryId", "categoryName")
      .populate("offerId", "offerName");

    if (!product) {
      return res.status(404).json({ message: "Product not found" });
    }

    res.json({ product });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

const productCreate = async (req, res) => {
  try {
    const {
      productName,
      description,
      floor,
      features,
      categoryId,
      price,
      offerId,
      storeId,
    } = req.body;

    if (!storeId) return res.status(400).send("storeId is required");

    const product = new Product({
      productName,
      description,
      floor,
      features,
      categoryId,
      price,
      offerId,
      storeId,
    });

    await product.save();

    res.status(200).send("okay");
  } catch (error) {
    console.log("productCreate:::::::::::>>>error: ", error);
    res.status(500).send(error.message);
  }
};

const productUpdate = async (req, res) => {
  try {
    const updateFields = {
      productName: req.body.productName,
      description: req.body.description,
      floor: req.body.floor,
      features: req.body.features,
      price: req.body.price,
      categoryId: req.body.categoryId,
      offerId: req.body.offerId,
      storeId: req.body.storeId,
    };

    Object.keys(updateFields).forEach(
      (key) => updateFields[key] === undefined && delete updateFields[key]
    );

    const updated = await Product.updateOne(
      { _id: req.params.id },
      { $set: updateFields }
    );

    if (updated.matchedCount === 0) {
      return res.status(404).json({ message: "Product not found" });
    }

    if (updated.modifiedCount === 0) {
      return res.status(200).json({ message: "No changes were made" });
    }

    res.json({ message: "Product updated successfully" });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

const productDelete = async (req, res) => {
  try {
    const product = await Product.findOne({
      _id: req.params.id,
    });

    if (!product) {
      return res.status(404).json({ message: "Product not found" });
    }

    await Product.deleteOne({ _id: req.params.id });
    res.json({ message: "Product deleted successfully" });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

module.exports = {
  productCreate,
  productDetails,
  productList,
  productUpdate,
  productDelete,
};
