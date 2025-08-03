const Store = require("../../models/store");

const userStoreList = async (req, res) => {

    
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

module.exports = {userStoreList};