module.exports = function(sequelize, DataTypes) {
  return sequelize.define('testCases', {
    ID: {
      type: DataTypes.INTEGER(10),
      allowNull: false,
      primaryKey: true,
      autoIncrement: true
    },
    Type: {
      type: DataTypes.CHAR(5),
      allowNull: false
    },
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
    RefersTo: {
      type: DataTypes.INTEGER(10),
      allowNull: true
    }
  }, {
    tableName: 'testCases'
  });
};
