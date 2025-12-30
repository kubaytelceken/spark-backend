const { DataTypes } = require('sequelize');

module.exports = (sequelize) => {
  const Block = sequelize.define('Block', {
    id: {
      type: DataTypes.INTEGER,
      primaryKey: true,
      autoIncrement: true
    },
    user_id: {
      type: DataTypes.INTEGER,
      allowNull: false
    },
    blocked_user_id: {
      type: DataTypes.INTEGER,
      allowNull: false
    }
  }, {
    tableName: 'blocks',
    timestamps: true,
    createdAt: 'created_at',
    updatedAt: false
  });

  return Block;
};