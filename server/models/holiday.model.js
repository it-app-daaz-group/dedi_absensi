module.exports = (sequelize, Sequelize) => {
  const Holiday = sequelize.define("holidays", {
    name: {
      type: Sequelize.STRING,
      allowNull: false
    },
    date: {
      type: Sequelize.DATEONLY,
      allowNull: false,
      unique: true
    },
    description: {
      type: Sequelize.TEXT
    }
  });

  return Holiday;
};
