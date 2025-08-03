const Store = require("../../models/store");

const storeList = async (req, res) => {
  const start = parseInt(req.query.start);
  const length = parseInt(req.query.length);
  

  try {
    let stores = await Store.find(
      {},
      {},
      { skip: start, limit: length, sort: { createdAt: -1 }, lean: true }
    );

    stores = stores.map((elem, index) => {
      elem.seqNo = index + start + 1;
      return elem;
    });

    const total = await Store.countDocuments();

    res.json({
      status: 0,
      msg: stores.length ? "Data loaded successfully" : "No records found",
      recordsTotal: total,
      recordsFiltered: total,
      data: stores,
    });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

const storeDetails = async (req, res) => {
  try {
    const stores = await Store.findOne({
      _id: req.params.id,
      // userId: req.session.userId,
    });
    if (!stores) return res.status(404).json({ message: "Store not found" });

    res.json({ stores });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

const storeCreate = async (req, res) => {
  try {
    const { storeName, address, floor, contactNumber, description } = req.body;
    console.log("Create store data:", req.body);
    const newStore = new Store({
      storeName,
      address,
      floor,
      contactNumber,
      description,
    });
    console.log("UserID from session:", req.session.userId);
    await newStore.save();

    res.status(201).json({ message: "Store created successfully", newStore });
  } catch (error) {
    console.error("Error creating store:", error);
    res.status(500).json({ error: error.message });
  }
};

const storeUpdate = async (req, res) => {
  try {
    const updated = await Store.updateOne(
      { _id: req.params.id, userId: req.session.userId },
      {
        $set: {
          storeName: req.body.storeName,
          address: req.body.address,
          floor: req.body.floor,
          contactNumber: req.body.contactNumber,
          description: req.body.description,
        },
      }
    );

    if (updated.modifiedCount === 0) {
      return res
        .status(404)
        .json({ message: "Store not found or no changes made" });
    }

    res.json({ message: "Store updated successfully" });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

const storeDelete = async (req, res) => {
  try {
    const store = await Store.findOne({
      _id: req.params.id,
      userId: req.session.userId,
    });

    if (!store) {
      return res.status(404).json({ message: "Store not found" });
    }

    await Store.deleteOne({ _id: req.params.id });
    res.json({ message: "Store deleted successfully" });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

module.exports = {
  storeList,
  storeDetails,
  storeCreate,
  storeUpdate,
  storeDelete,
};
