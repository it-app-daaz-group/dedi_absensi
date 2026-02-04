module.exports = (sequelize, Sequelize) => {
  const HRSettings = sequelize.define("hr_settings", {
    work_start_time: {
      type: Sequelize.TIME,
      defaultValue: '08:00:00'
    },
    work_end_time: {
      type: Sequelize.TIME,
      defaultValue: '17:00:00'
    },
    late_tolerance_minutes: {
      type: Sequelize.INTEGER,
      defaultValue: 15
    },
    overtime_rate: {
      type: Sequelize.DECIMAL(10, 2),
      defaultValue: 0
    }
  });

  return HRSettings;
};
