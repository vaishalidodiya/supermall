const Product = require("../../models/product");

const productList = async (req, res) => {
  const start = parseInt(req.query.start);
  const length = parseInt(req.query.length);
  const storeId = req.query.storeId;

  try {
    const filter = storeId ? { storeId } : {};

    let products = await Product.find(
      filter,
      {},
      { skip: start, limit: length, sort: { createdAt: -1 }, lean: true }
    );

    const total = await Product.countDocuments(filter);

    products = products.map((elem, index) => {
      elem.seqNo = index + start + 1;
      return elem;
    });

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
    const products = await Product.findOne({
      _id: req.params.id,
    });
    if (!products)
      return res.status(404).json({ message: "Product not found" });
    res.json({ products });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

const productCreate = async (req, res) => {
  try {
    console.log("🔥 Received product data:", req.body); // Should show your data

    const { productName, description, floor, features, price, storeId } = req.body;

    if (!storeId) return res.status(400).send("storeId is required");

    const product = new Product({
      productName,
      description,
      floor,
      features,
      price,
      storeId,
    });

    await product.save();

    res.status(200).send("okay");
  } catch (error) {
    res.status(500).send("Server error");
  }
};

const productUpdate = async (req, res) => {
  try {
    const updated = await Product.updateOne(
      { _id: req.params.id },
      {
        $set: {
          productName: req.body.productName,
          description: req.body.description,
          floor: req.body.floor,
          features: req.body.features,
          price: req.body.price,
        },
      }
    );

    if (updated.modifiedCount === 0) {
      return res
        .status(404)
        .json({ message: "Product not found or no changes made" });
    }

    res.json({ message: "Product updated successfully" });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

const productDelete = async(req,res)=>{
  try{
    const product = await Product.findOne({
      _id: req.params.id,
     
    });

    if (!product) {
      return res.status(404).json({ message: "Product not found" });
    }

    await Product.deleteOne({ _id: req.params.id });
    res.json({ message: "Product deleted successfully" });
  }catch(error){
        res.status(500).json({ error: error.message });

  }
}

module.exports = { productCreate, productDetails, productList, productUpdate, productDelete };
