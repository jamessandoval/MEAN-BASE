/* jshint indent: 2 */

module.exports = function(sequelize, DataTypes) {
  return sequelize.define('Result', {
    ScenarioNumber: {
      type: DataTypes.INTEGER(11),
      allowNull: false,
      references: {
        model: 'TestCase',
        key: 'ScenarioNumber'
      }
    },
    TestRunId: {
      type: DataTypes.STRING(50),
      allowNull: false
    },
    Template: {
      type: DataTypes.CHAR(5),
      allowNull: false
    },
    Language: {
      type: DataTypes.CHAR(5),
      allowNull: false
    },
    Result: {
      type: DataTypes.CHAR(4),
      allowNull: false
    },
    URLs: {
      type: DataTypes.TEXT,
      allowNull: false
    },
    Output: {
      type: "BLOB",
      allowNull: false
    },
    RunDate: {
      type: DataTypes.DATE,
      allowNull: false
    }
  }, {
    tableName: 'Result'
  });
};
