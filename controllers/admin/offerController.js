const express = require("express");
const Offer = require("../../models/offer");

const offerList = async (req, res) => {
  const start = parseInt(req.query.start);
  const length = parseInt(req.query.length);
  

  try {
    let offers = await Offer.find(
      {},
      {},
      { skip: start, limit: length, sort: { createdAt: -1 }, lean: true }
    );
    offers = offers.map((elem, index) => {
      elem.seqNo = index + start + 1;
      return elem;
    });

    const total = await Offer.countDocuments();

    res.json({
      status: 0,
      msg: offers.length ? "Data loaded successfully" : "No records found",
      recordsTotal: total,
      recordsFiltered: total,
      data: offers,
    });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

const offerDetails = async (req, res) => {
  try {
    const offers = await Offer.findOne({
      _id: req.params.id,
    });
    if (!offers) return res.status(404).json({ message: "offer not found" });

    res.json({ offers });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

const offerAdd = async (req, res) => {
  try {
    const { offerName, description, discount, startDate, endDate } = req.body;

    const offers = new Offer({
      offerName,
      description,
      discount,
      startDate,
      endDate,
    });

    await offers.save();

    res.status(201).json({ message: "Offer created successfully" }, offers);
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
};

const offerUpdate = async (req, res) => {
  try {
    const updated = await Offer.updateOne(
      { _id: req.params.id },
      {
        $set: {
          offerName: req.body.offerName,
          description: req.body.description,
          discount: req.body.discount,
          startDate: req.body.startDate,
          endDate: req.body.endDate,
        },
      }
    );
    if (updated.modifiedCount === 0) {
      return res.status(404).json({
        message: "Offer not found or no changes made",
      });
    }

    res.json({ message: "Offer updated successfully" });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

const offerDelete = async (req, res) => {
  try {
    const offers = await Offer.findOne({
      _id: req.params.id,
    });

    if (!offers) {
      return res.status(404).json({ message: "Offers not found" });
    }

    await Offer.deleteOne({ _id: req.params.id });
    res.json({ message: "Offer deleted successfully" });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

module.exports = {
  offerList,
  offerDetails,
  offerAdd,
  offerUpdate,
  offerDelete
};
