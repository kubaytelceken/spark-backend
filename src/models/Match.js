const { DataTypes } = require('sequelize');

module.exports = (sequelize) => {
  const Match = sequelize.define('Match', {
    id: {
      type: DataTypes.INTEGER,
      primaryKey: true,
      autoIncrement: true
    },
    user_id_1: {
      type: DataTypes.INTEGER,
      allowNull: false
    },
    user_id_2: {
      type: DataTypes.INTEGER,
      allowNull: false
    },
    matched_at: {
      type: DataTypes.DATE,
      defaultValue: DataTypes.NOW
    }
  }, {
    tableName: 'matches',
    timestamps: false
  });
  
  return Match;
};