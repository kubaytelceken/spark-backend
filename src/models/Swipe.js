const { DataTypes } = require('sequelize');

module.exports = (sequelize) =>{
    const Swipe = sequelize.define('Swipe',{
        id : {
            type : DataTypes.INTEGER,
            primaryKey : true,
            autoIncrement: true
        },
        user_id : {
            type : DataTypes.INTEGER,
            allowNull: false
        },
        target_user_id : {
            type : DataTypes.INTEGER,
            allowNull: false
        },
       action: {
  type: DataTypes.STRING(20),
  allowNull: false
}
        
    },
{
    tableName: 'swipes',
    timestamps: true,
    createdAt: 'created_at',

  });
  return Swipe;
}


