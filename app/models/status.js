module.exports = function(sequelize, DataTypes) {
  return sequelize.define('status', {
    Type: {
      type: DataTypes.CHAR(4),
      allowNull: true
    },
    DateLastRun: {
      type: DataTypes.DATE,
      allowNull: true
    },
    StartTime: {
      type: DataTypes.DATE,
      allowNull: true
    },
    EndTime: {
      type: DataTypes.DATE,
      allowNull: true
    }
  }, {
    tableName: 'status'
  });
};
