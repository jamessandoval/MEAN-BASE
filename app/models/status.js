/* jshint indent: 2 */

module.exports = function(sequelize, DataTypes) {
  return sequelize.define('Status', {
    TestRunId: {
      type: DataTypes.STRING(50),
      allowNull: false,
      primaryKey: true
    },
    Template: {
      type: DataTypes.CHAR(5),
      allowNull: false
    },
    RunDate: {
      type: DataTypes.DATE,
      allowNull: false
    },
    StartTime: {
      type: DataTypes.DATE,
      allowNull: false
    },
    EndTime: {
      type: DataTypes.DATE,
      allowNull: false
    }
  }, {
    tableName: 'Status'
  });
};
