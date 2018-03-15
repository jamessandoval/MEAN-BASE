/* jshint indent: 2 */

module.exports = function(sequelize, DataTypes) {
  return sequelize.define('TestCase', {
    ScenarioNumber: {
      type: DataTypes.INTEGER(11),
      allowNull: false,
      primaryKey: true,
      autoIncrement: true
    },
    HashValue: {
      type: DataTypes.STRING(50),
      allowNull: false,
      unique: true
    },
    TestCaseDescription: {
      type: "BLOB",
      allowNull: false
    },
    Live: {
      type: "BINARY(1)",
      allowNull: false
    },
    Gherkin: {
      type: DataTypes.STRING(2000),
      allowNull: false
    }
  }, {
    tableName: 'TestCase'
  });
};
