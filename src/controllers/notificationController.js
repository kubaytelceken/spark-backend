
const notificationService = require("../services/notificationService");

// Bildirimleri getir
const getNotifications = async (req, res) => {
  try {
    const userId = req.user.id;
    
    const notifications = await notificationService.getNotifications(userId);
    
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
    
    await await notificationService.markAsRead(notificationId);
    
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
    
    await notificationService.markAllAsRead(userId);
    
    res.json({ success: true });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'İşaretlenemedi' });
  }
};



module.exports = { getNotifications, markAsRead, markAllAsRead };