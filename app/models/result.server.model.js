module.exports = function(sequelize, DataTypes) {
  var Result = sequelize.define('results', {
    id: {
      type: DataTypes.INTEGER(11),
      allowNull: false,
      primaryKey: true
    },
    RunDate: {
      type: DataTypes.DATE,
      allowNull: true,
      defaultValue: sequelize.literal('CURRENT_TIMESTAMP')
    },
    Template: {
      type: DataTypes.CHAR(4),
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
    createdAt: {
      type: DataTypes.DATE,
      allowNull: false
    },
    updatedAt: {
      type: DataTypes.DATE,
      allowNull: false
    }
  }, {
    tableName: 'results'
  });

  return Result;
};
