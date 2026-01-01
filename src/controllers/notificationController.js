console.log('NOTIFICATION CONTROLLER LOADED');
const { Notification } = require('../models');

// Bildirimleri getir
const getNotifications = async (req, res) => {
  try {
    const userId = req.user.id;
    
    const notifications = await Notification.findAll({
      where: { user_id: userId },
      order: [['created_at', 'DESC']],
      limit: 50
    });
    
    res.json(notifications);
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Bildirimler getirilemedi' });
  }
};

// Okundu işaretle
const markAsRead = async (req, res) => {
  try {
    const { notificationId } = req.params;
    
    await Notification.update(
      { is_read: true },
      { where: { id: notificationId, user_id: req.user.id } }
    );
    
    res.json({ success: true });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'İşaretlenemedi' });
  }
};

// Tümünü okundu işaretle
const markAllAsRead = async (req, res) => {
  try {
    const userId = req.user.id;
    
    await Notification.update(
      { is_read: true },
      { where: { user_id: userId, is_read: false } }
    );
    
    res.json({ success: true });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'İşaretlenemedi' });
  }
};

// Bildirim oluştur (internal kullanım)
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