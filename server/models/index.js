const dbConfig = require("../config/db.config.js");
const Sequelize = require("sequelize");
// Explicitly require mysql2 to ensure it's included in the Vercel bundle
require('mysql2');

const sequelize = new Sequelize(dbConfig.DB, dbConfig.USER, dbConfig.PASSWORD, {
  host: dbConfig.HOST,
  port: dbConfig.PORT,
  dialect: dbConfig.dialect,
  dialectModule: require('mysql2'), // Fix for Vercel/Serverless
  dialectOptions: dbConfig.dialectOptions,
  operatorsAliases: 0,
  pool: {
    max: dbConfig.pool.max,
    min: dbConfig.pool.min,
    acquire: dbConfig.pool.acquire,
    idle: dbConfig.pool.idle
  },
  logging: false
});

const db = {};

db.Sequelize = Sequelize;
db.sequelize = sequelize;

db.user = require("./user.model.js")(sequelize, Sequelize);
db.hrSettings = require("./hrSettings.model.js")(sequelize, Sequelize);
db.holiday = require("./holiday.model.js")(sequelize, Sequelize);
db.attendance = require("./attendance.model.js")(sequelize, Sequelize);

// Associations
db.user.hasMany(db.attendance, { as: "attendances", foreignKey: "userId" });
db.attendance.belongsTo(db.user, { foreignKey: "userId", as: "user" });

module.exports = db;
