const db = require("../models");
const Attendance = db.attendance;
const User = db.user;
const HRSettings = db.hrSettings;
const Op = db.Sequelize.Op;

// Helper to get current date string YYYY-MM-DD in Jakarta Time
const getTodayDate = () => {
  return new Date().toLocaleString('en-CA', { timeZone: 'Asia/Jakarta' }).split(',')[0];
};

// Helper to get current time string HH:MM:SS in Jakarta Time
const getCurrentTime = () => {
  return new Date().toLocaleString('en-GB', { timeZone: 'Asia/Jakarta' }).split(', ')[1];
};

exports.clockIn = async (req, res) => {
  try {
    const userId = req.userId;
    const today = getTodayDate();
    const now = getCurrentTime();
    
    // Check if already clocked in
    const existingAttendance = await Attendance.findOne({
      where: {
        userId: userId,
        date: today
      }
    });

    if (existingAttendance) {
      return res.status(400).send({ message: "You have already clocked in today." });
    }

    // Check HR Settings for lateness
    const settings = await HRSettings.findOne();
    let isLate = false;
    
    if (settings) {
      const workStart = settings.work_start_time; // e.g. "08:00:00"
      const tolerance = settings.late_tolerance_minutes;
      
      // Convert time to minutes for comparison
      const [nowH, nowM] = now.split(':').map(Number);
      const [startH, startM] = workStart.split(':').map(Number);
      
      const nowMinutes = nowH * 60 + nowM;
      const startMinutes = startH * 60 + startM;
      
      if (nowMinutes > (startMinutes + tolerance)) {
        isLate = true;
      }
    }

    // Handle file upload (photo)
    let photoUrl = null;
    if (req.file) {
      photoUrl = req.protocol + '://' + req.get('host') + '/uploads/attendance/' + req.file.filename;
    }

    const attendance = {
      userId: userId,
      date: today,
      check_in_time: now,
      check_in_location: req.body.location, // lat,long
      check_in_photo: photoUrl,
      status: req.body.status || 'hadir',
      is_late: isLate,
      notes: req.body.notes
    };

    const result = await Attendance.create(attendance);
    res.send({ message: "Clock in successful.", data: result });

  } catch (err) {
    res.status(500).send({
      message: err.message || "Error occurred during clock in."
    });
  }
};

exports.clockOut = async (req, res) => {
  try {
    const userId = req.userId;
    const today = getTodayDate();
    const now = getCurrentTime();

    const attendance = await Attendance.findOne({
      where: {
        userId: userId,
        date: today
      }
    });

    if (!attendance) {
      return res.status(404).send({ message: "No attendance record found for today. Please clock in first." });
    }

    if (attendance.check_out_time) {
      return res.status(400).send({ message: "You have already clocked out today." });
    }

    await attendance.update({
      check_out_time: now,
      check_out_location: req.body.location
    });

    res.send({ message: "Clock out successful.", data: attendance });

  } catch (err) {
    res.status(500).send({
      message: err.message || "Error occurred during clock out."
    });
  }
};

exports.getHistory = async (req, res) => {
  try {
    const userId = req.userId;
    const { month, year } = req.query; // Optional filters

    let condition = { userId: userId };
    
    if (month && year) {
      condition.date = {
        [Op.like]: `${year}-${month}%`
      };
    }

    const history = await Attendance.findAll({
      where: condition,
      order: [['date', 'DESC']],
      limit: 31 // Limit to last 31 records by default
    });

    res.send(history);
  } catch (err) {
    res.status(500).send({
      message: err.message || "Error retrieving attendance history."
    });
  }
};

exports.getTodayStatus = async (req, res) => {
    try {
        const userId = req.userId;
        const today = getTodayDate();

        const attendance = await Attendance.findOne({
            where: {
                userId: userId,
                date: today
            }
        });

        res.send(attendance || null);
    } catch (err) {
        res.status(500).send({
            message: err.message || "Error retrieving today's status."
        });
    }
};

// NEW: Get All Attendance for Reports (Admin/HR)
exports.getAllAttendance = async (req, res) => {
  try {
    const { startDate, endDate, department } = req.query;
    
    let condition = {};
    
    // Date Range Filter
    if (startDate && endDate) {
      condition.date = {
        [Op.between]: [startDate, endDate]
      };
    } else if (startDate) {
      condition.date = {
        [Op.gte]: startDate
      };
    } else if (endDate) {
      condition.date = {
        [Op.lte]: endDate
      };
    }

    // User/Department Filter
    let userCondition = {};
    if (department) {
      userCondition.department = department;
    }

    const attendances = await Attendance.findAll({
      where: condition,
      include: [
        {
          model: User,
          as: "user",
          attributes: ["id", "nip", "name", "department", "position"],
          where: userCondition
        }
      ],
      order: [['date', 'DESC'], ['check_in_time', 'ASC']]
    });

    res.send(attendances);
  } catch (err) {
    res.status(500).send({
      message: err.message || "Error retrieving attendance reports."
    });
  }
};
