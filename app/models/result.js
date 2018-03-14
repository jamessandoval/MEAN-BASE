module.exports = function(sequelize, DataTypes) {
  var Result = sequelize.define('results', {
    Template: {
      type: DataTypes.CHAR(4),
      allowNull: false
    },
    Language: {
      type: DataTypes.CHAR(5),
      allowNull: true
    },
    ID: {
      type: DataTypes.INTEGER(10),
      allowNull: false
    },
    Result: {
      type: DataTypes.CHAR(5),
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
      allowNull: true
    },
    testCaseId: {
      type: DataTypes.STRING(50),
      allowNull: true
    }
  }, {
    tableName: 'results'
  });

  return Result;
};
