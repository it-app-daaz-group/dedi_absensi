const db = require("../models");
const HRSettings = db.hrSettings;
const Holiday = db.holiday;

// Get Settings (Create default if not exists)
exports.getSettings = async (req, res) => {
  try {
    let settings = await HRSettings.findOne();
    if (!settings) {
      settings = await HRSettings.create({});
    }
    res.send(settings);
  } catch (err) {
    res.status(500).send({
      message: err.message || "Error retrieving HR settings."
    });
  }
};

// Update Settings
exports.updateSettings = async (req, res) => {
  try {
    let settings = await HRSettings.findOne();
    if (!settings) {
      settings = await HRSettings.create(req.body);
    } else {
      await settings.update(req.body);
    }
    res.send({ message: "Settings updated successfully.", data: settings });
  } catch (err) {
    res.status(500).send({
      message: err.message || "Error updating HR settings."
    });
  }
};

// Get All Holidays
exports.getHolidays = async (req, res) => {
  try {
    const holidays = await Holiday.findAll({ order: [['date', 'ASC']] });
    res.send(holidays);
  } catch (err) {
    res.status(500).send({
      message: err.message || "Error retrieving holidays."
    });
  }
};

// Add Holiday
exports.addHoliday = async (req, res) => {
  try {
    const holiday = await Holiday.create(req.body);
    res.send(holiday);
  } catch (err) {
    res.status(500).send({
      message: err.message || "Error adding holiday."
    });
  }
};

// Delete Holiday
exports.deleteHoliday = async (req, res) => {
  const id = req.params.id;
  try {
    const num = await Holiday.destroy({ where: { id: id } });
    if (num == 1) {
      res.send({ message: "Holiday was deleted successfully!" });
    } else {
      res.send({ message: `Cannot delete Holiday with id=${id}.` });
    }
  } catch (err) {
    res.status(500).send({
      message: "Could not delete Holiday with id=" + id
    });
  }
};
