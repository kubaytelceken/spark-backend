const { Message, Match } = require('../models');

// Mesajları getir
const getMessages = async (req, res) => {
  try {
    const { matchId } = req.params;
    
    const messages = await Message.findAll({
      where: { match_id: matchId, deleted_at: null },
      order: [['created_at', 'ASC']]
    });
    
    res.json(messages);
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Mesajlar getirilemedi' });
  }
};

// Mesaj gönder
const sendMessage = async (req, res) => {
  try {
    const userId = req.user.id;
    const { matchId } = req.params;
    const { content } = req.body;
    
    const message = await Message.create({
      match_id: matchId,
      sender_id: userId,
      content
    });
    
    res.status(201).json(message);
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Mesaj gönderilemedi' });
  }
};

// Okundu işaretle
const markAsRead = async (req, res) => {
  try {
    const { messageId } = req.params;
    
    await Message.update(
      { is_read: true },
      { where: { id: messageId } }
    );
    
    res.json({ success: true });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'İşaretlenemedi' });
  }
};

// Mesaj sil
const deleteMessage = async (req, res) => {
  try {
    const { messageId } = req.params;
    
    await Message.update(
      { deleted_at: new Date() },
      { where: { id: messageId } }
    );
    
    res.json({ success: true });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Mesaj silinemedi' });
  }
};

module.exports = { getMessages, sendMessage, markAsRead, deleteMessage };