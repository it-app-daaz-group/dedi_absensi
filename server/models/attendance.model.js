module.exports = (sequelize, Sequelize) => {
  const Attendance = sequelize.define("attendances", {
    date: {
      type: Sequelize.DATEONLY,
      allowNull: false
    },
    check_in_time: {
      type: Sequelize.TIME
    },
    check_out_time: {
      type: Sequelize.TIME
    },
    check_in_location: {
      type: Sequelize.STRING
    },
    check_out_location: {
      type: Sequelize.STRING
    },
    check_in_photo: {
      type: Sequelize.STRING
    },
    status: {
      type: Sequelize.ENUM('hadir', 'sakit', 'izin', 'alpha'),
      defaultValue: 'hadir'
    },
    is_late: {
      type: Sequelize.BOOLEAN,
      defaultValue: false
    },
    notes: {
      type: Sequelize.TEXT
    }
  });

  return Attendance;
};
