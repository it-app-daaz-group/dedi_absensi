const { authJwt } = require("../middleware");
const controller = require("../controllers/user.controller");

module.exports = function(app) {
  app.use(function(req, res, next) {
    res.header(
      "Access-Control-Allow-Headers",
      "x-access-token, Origin, Content-Type, Accept"
    );
    next();
  });

  // Create new user (Admin only)
  app.post(
    "/api/users",
    [authJwt.verifyToken, authJwt.isAdmin],
    controller.create
  );

  // Retrieve all users (Admin only)
  app.get(
    "/api/users",
    [authJwt.verifyToken, authJwt.isAdmin],
    controller.findAll
  );

  // Retrieve a single user
  app.get(
    "/api/users/:id",
    [authJwt.verifyToken], // Both admin and user (self) can view, but simpler to just verify token for now
    controller.findOne
  );

  // Update a user (Admin only)
  app.put(
    "/api/users/:id",
    [authJwt.verifyToken, authJwt.isAdmin],
    controller.update
  );

  // Delete a user (Admin only)
  app.delete(
    "/api/users/:id",
    [authJwt.verifyToken, authJwt.isAdmin],
    controller.delete
  );
};
