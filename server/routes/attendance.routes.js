const { authJwt } = require("../middleware");
const controller = require("../controllers/attendance.controller");
const upload = require("../middleware/upload");

module.exports = function(app) {
  app.use(function(req, res, next) {
    res.header(
      "Access-Control-Allow-Headers",
      "x-access-token, Origin, Content-Type, Accept"
    );
    next();
  });

  app.post(
    "/api/attendance/clockin",
    [authJwt.verifyToken, upload.single("photo")],
    controller.clockIn
  );

  app.put(
    "/api/attendance/clockout",
    [authJwt.verifyToken],
    controller.clockOut
  );

  app.get(
    "/api/attendance/history",
    [authJwt.verifyToken],
    controller.getHistory
  );

  app.get(
    "/api/attendance/today",
    [authJwt.verifyToken],
    controller.getTodayStatus
  );

  app.get(
    "/api/attendance/reports",
    [authJwt.verifyToken, authJwt.isAdmin], // Admin/HR only
    controller.getAllAttendance
  );
};
