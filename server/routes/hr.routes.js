const { authJwt } = require("../middleware");
const controller = require("../controllers/hr.controller");

module.exports = function(app) {
  app.use(function(req, res, next) {
    res.header(
      "Access-Control-Allow-Headers",
      "x-access-token, Origin, Content-Type, Accept"
    );
    next();
  });

  // Settings
  app.get(
    "/api/hr/settings",
    [authJwt.verifyToken],
    controller.getSettings
  );

  app.put(
    "/api/hr/settings",
    [authJwt.verifyToken, authJwt.isAdmin], // Only Admin/HR can update
    controller.updateSettings
  );

  // Holidays
  app.get(
    "/api/hr/holidays",
    [authJwt.verifyToken],
    controller.getHolidays
  );

  app.post(
    "/api/hr/holidays",
    [authJwt.verifyToken, authJwt.isAdmin],
    controller.addHoliday
  );

  app.delete(
    "/api/hr/holidays/:id",
    [authJwt.verifyToken, authJwt.isAdmin],
    controller.deleteHoliday
  );
};
