module.exports = (sequelize, Sequelize) => {
  const User = sequelize.define("users", {
    nip: {
      type: Sequelize.STRING,
      unique: true,
      allowNull: false
    },
    password: {
      type: Sequelize.STRING,
      allowNull: false
    },
    name: {
      type: Sequelize.STRING,
      allowNull: false
    },
    department: {
      type: Sequelize.STRING
    },
    position: {
      type: Sequelize.STRING
    },
    email: {
      type: Sequelize.STRING,
      validate: { isEmail: true }
    },
    phone: {
      type: Sequelize.STRING
    },
    address: {
      type: Sequelize.TEXT
    },
    photo_url: {
      type: Sequelize.STRING
    },
    status: {
      type: Sequelize.ENUM('active', 'inactive'),
      defaultValue: 'active'
    },
    role: {
      type: Sequelize.ENUM('admin', 'hr', 'employee'),
      defaultValue: 'employee'
    }
  });

  return User;
};
