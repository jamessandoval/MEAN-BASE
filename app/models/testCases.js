module.exports = function(sequelize, DataTypes) {
  return sequelize.define('testCases', {
    Template: {
      type: DataTypes.CHAR(4),
      allowNull: false
    },
    Description: {
      type: "BLOB",
      allowNull: true
    },
    Live: {
      type: "BINARY(1)",
      allowNull: true
    },
    ID: {
      type: DataTypes.STRING(255),
      allowNull: false,
      primaryKey: true
    },
    TestId: {
      type: DataTypes.INTEGER(10),
      allowNull: true
    },
    Gherkin: {
      type: DataTypes.STRING(2000),
      allowNull: true
    },
    RunDate: {
      type: DataTypes.DATE,
      allowNull: true
    }
  }, {
    tableName: 'testCases'
  });
};
