const db = require("./models");
const User = db.user;
const bcrypt = require("bcryptjs");

const seed = async () => {
  try {
    await db.sequelize.sync();
    
    const adminExists = await User.findOne({ where: { role: 'admin' } });
    if (adminExists) {
      console.log("Admin user already exists.");
      process.exit();
    }

    await User.create({
      nip: "admin",
      name: "Admin Utama",
      email: "admin@laragondocs.com",
      password: bcrypt.hashSync("admin123", 8),
      role: "admin",
      status: "active",
      department: "IT",
      position: "Administrator"
    });

    console.log("Admin user created successfully.");
    console.log("NIP: admin");
    console.log("Password: admin123");
  } catch (error) {
    console.error("Seed failed:", error);
  } finally {
    process.exit();
  }
};

seed();
