module.exports = function(sequelize, DataTypes) {
  var Result = sequelize.define('results', {
    id: {
      type: DataTypes.INTEGER(11),
      allowNull: false,
      primaryKey: true
    },
    TestRunId: {
      type: DataTypes.CHAR(50),
      allowNull: true
    },
    RunDate: {
      type: DataTypes.DATE,
      allowNull: true
    },
    Template: {
      type: DataTypes.CHAR(4),
      allowNull: false
    },
    Language: {
      type: DataTypes.CHAR(5),
      allowNull: true
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
    }
  }, {
    tableName: 'results'
  });

  return Result;
};
