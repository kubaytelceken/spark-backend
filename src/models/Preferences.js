const { DataTypes } = require('sequelize');

module.exports = (sequelize) => {
  const Preferences = sequelize.define('Preferences', {
    id: {
      type: DataTypes.INTEGER,
      primaryKey: true,
      autoIncrement: true
    },
    user_id: {
      type: DataTypes.INTEGER,
      allowNull: false,
      unique: true
    },
    age_min: {
      type: DataTypes.INTEGER
    },
    age_max: {
      type: DataTypes.INTEGER
    },
    distance_max: {
      type: DataTypes.INTEGER
    },
    interested_genders: {
      type: DataTypes.STRING(100)
    }
  }, {
    tableName: 'preferences',
    timestamps: true,
    createdAt: false,
    updatedAt: 'updated_at'
  });

  return Preferences;
};