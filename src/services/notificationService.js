const { Notification } = require('../models');

const getNotifications = async (userId)  => {
  const notifications = await Notification.findAll({
      where: { user_id: userId },
      order: [['created_at', 'DESC']],
      limit: 50
    });

    return notifications;
};

const markAsRead = async (notificationId) => {
    await Notification.update(
      { is_read: true },
      { where: { id: notificationId, user_id: req.user.id } }
    );

    return true;
};


const markAllAsRead = async (userId) => {
await Notification.update(
      { is_read: true },
      { where: { user_id: userId, is_read: false } }
    );

    return true;
};


const createNotification = async (userId, type, title, message, data = null) => {
  try {
    await Notification.create({
      user_id: userId,
      type,
      title,
      message,
      data
    });
  } catch (error) {
    console.error('Bildirim oluşturulamadı:', error);
  }
};



module.exports = { getNotifications, markAsRead, markAllAsRead, createNotification };