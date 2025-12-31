const sequelize = require('../config/database');  // Bu satırı değiştir

// Modelleri içe aktar
const UserModel = require('./User');
const ProfileModel = require('./Profile');
const SwipeModel = require('./Swipe');
const MatchModel = require('./Match');
const MessageModel = require('./Message');
const PreferencesModel = require('./Preferences');
const BlockModel = require('./Block');
const NotificationModel = require('./Notification');

// Modelleri sequelize bağlantısıyla oluştur
const User = UserModel(sequelize);
const Profile = ProfileModel(sequelize);
const Swipe = SwipeModel(sequelize);
const Match = MatchModel(sequelize);
const Message = MessageModel(sequelize);
const Preferences = PreferencesModel(sequelize);
const Block = BlockModel(sequelize);
const Notification = NotificationModel(sequelize);

// İLİŞKİLER (Relationships)


User.hasMany(Notification, { foreignKey: 'user_id' });
Notification.belongsTo(User, { foreignKey: 'user_id' });


// User - Profile (1'e 1)
User.hasOne(Profile, { foreignKey: 'user_id' });
Profile.belongsTo(User, { foreignKey: 'user_id' });

// User - Swipe (1'e çok)
User.hasMany(Swipe, { foreignKey: 'user_id', as: 'swipesMade' });
User.hasMany(Swipe, { foreignKey: 'target_user_id', as: 'swipesReceived' });
Swipe.belongsTo(User, { foreignKey: 'user_id', as: 'swiper' });
Swipe.belongsTo(User, { foreignKey: 'target_user_id', as: 'target' });

// User - Match (1'e çok)
User.hasMany(Match, { foreignKey: 'user_id_1', as: 'matchesAsUser1' });
User.hasMany(Match, { foreignKey: 'user_id_2', as: 'matchesAsUser2' });
Match.belongsTo(User, { foreignKey: 'user_id_1', as: 'user1' });
Match.belongsTo(User, { foreignKey: 'user_id_2', as: 'user2' });

// Match - Message (1'e çok)
Match.hasMany(Message, { foreignKey: 'match_id' });
Message.belongsTo(Match, { foreignKey: 'match_id' });

// User - Message (1'e çok)
User.hasMany(Message, { foreignKey: 'sender_id' });
Message.belongsTo(User, { foreignKey: 'sender_id', as: 'sender' });



User.hasOne(Preferences, { foreignKey: 'user_id' });
Preferences.belongsTo(User, { foreignKey: 'user_id' });


User.hasMany(Block, { foreignKey: 'user_id', as: 'blockedUsers' });
User.hasMany(Block, { foreignKey: 'blocked_user_id', as: 'blockedBy' });
Block.belongsTo(User, { foreignKey: 'user_id', as: 'blocker' });
Block.belongsTo(User, { foreignKey: 'blocked_user_id', as: 'blocked' });


// Dışa aktar
module.exports = {
  User,
  Profile,
  Swipe,
  Match,
  Message,
  Preferences,
  Block,
  Notification,
  sequelize
};