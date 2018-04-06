module.exports = function(sequelize, DataTypes) {
  return sequelize.define('TestPass', {
    TestPassId: {
      type: DataTypes.INTEGER(11),
      allowNull: true,
      primaryKey: true
    },
    Template: {
      type: DataTypes.CHAR(5),
      allowNull: true
    },
    Language: {
      type: DataTypes.CHAR(5),
      allowNull: true
    },
    TestCases: {
      type: DataTypes.STRING(1000),
      allowNull: true
    },
    RunDate: {
      type: DataTypes.DATEONLY,
      get: function() {
        return moment.utc(this.getDataValue('RunDate')).format('MM-DD-YY');
      }
    },
    UrlIds: {
      type: DataTypes.STRING(1000),
      allowNull: true
    }
  }, {
    tableName: 'TestPass'
  });
};
