/* jshint indent: 2 */

module.exports = function(sequelize, DataTypes) {
  return sequelize.define('Template', {
    Id: {
      type: DataTypes.CHAR(5),
      allowNull: false
    },
    ScenarioNumber: {
      type: DataTypes.INTEGER(11),
      allowNull: false
    }
  }, {
    tableName: 'Template'
  });
};
