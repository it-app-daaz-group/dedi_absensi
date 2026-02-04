const express = require("express");
require("dotenv").config();
const cors = require("cors");
const helmet = require("helmet");
const morgan = require("morgan");
const db = require("./models");

const app = express();

app.use(cors());
app.use(helmet());
app.use(morgan("dev"));
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use('/uploads', express.static('uploads'));

if (process.env.NODE_ENV !== 'production') {
  // db.sequelize.sync({ alter: true }).then(() => {
  //   console.log("Database synced successfully.");
  // }).catch((err) => {
  //   console.error("Failed to sync database: " + err.message);
  // });
  
  db.sequelize.authenticate()
    .then(() => {
      console.log('Connection to TiDB Cloud has been established successfully.');
      // Only sync if necessary, avoid alter on TiDB for now to prevent "can't change column constraint" error
      return db.sequelize.sync(); 
    })
    .then(() => {
      console.log("Database synced successfully.");
    })
    .catch(err => {
      console.error('Unable to connect to the database:', err);
    });
}

app.get("/", (req, res) => {
  res.json({ message: "Welcome to LaragonDocs Absensi API." });
});

// Routes
require("./routes/auth.routes")(app);
require("./routes/user.routes")(app);
require("./routes/hr.routes")(app); // HR Routes
require("./routes/attendance.routes")(app);

// Handle 404 for API routes
app.use("/api/*", (req, res) => {
  res.status(404).json({ 
    message: "API Route not found (Express)", 
    path: req.originalUrl,
    method: req.method 
  });
});

const PORT = process.env.PORT || 8080;

if (require.main === module) {
  app.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}.`);
  });
}

module.exports = app;
