const Category = require("../../models/categories");

const categoryList = async (req, res) => {
  const start = parseInt(req.query.start);
  const length = parseInt(req.query.length);

  try {
    let categories = await Category.find(
      {},
      {},
      { skip: start, limit: length, sort: { createdAt: -1 }, lean: true }
    );
    categories = categories.map((elem, index) => {
      elem.seqNo = index + start + 1;
      return elem;
    });

    const total = await Category.countDocuments();

    res.json({
      status: 0,
      msg: categories.length ? "Data loaded successfully" : "No records found",
      recordsTotal: total,
      recordsFiltered: total,
      data: categories,
    });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

const categoryDetails = async (req, res) => {
  try {
    const categories = await Category.findOne({
      _id: req.params.id,
    });
    if (!categories)
      return res.status(404).json({ message: "category not found" });

    res.json({ categories });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

const categoriesAdd = async (req, res) => {
  try {
    const { categoryName, description } = req.body;

    console.log('cate name', categoryName)
    console.log('cate des', description)

    console.log("Received body:", req.body);

    const newcategories = new Category({
      categoryName,
      description,
    });

    await newcategories.save();

    console.log("category", newcategories);

    res
      .status(201)
      .json({ message: "Category created successfully", newcategories });
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
};

const categoryUpdate = async (req, res) => {
  try {
    const updated = await Category.updateOne(
      { _id: req.params.id },
      {
        $set: {
          categoryName: req.body.categoryName,
          description: req.body.description,
        },
      }
    );

    if (updated.modifiedCount === 0) {
      return res.status(404).json({
        message: "Category not found or no changes made",
      });
    }

    res.json({ message: "Category updated successfully" });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

const categoryDelete = async (req, res) => {
  try {
    const categories = await Category.findOne({
      _id: req.params.id,
    });

    if (!categories) {
      return res.status(404).json({ message: "Categories not found" });
    }
    await Category.deleteOne({ _id: req.params.id });
    res.json({ message: "Category deleted successfully" });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

module.exports = {
  categoryList,
  categoryDetails,
  categoriesAdd,
  categoryUpdate,
  categoryDelete,
};
