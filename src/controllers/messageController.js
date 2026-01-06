const messageService = require("../services/messageService");

// Mesajları getir
const getMessages = async (req, res) => {
  try {
    const { matchId } = req.params;
    const messages = await messageService.getMessages(matchId);
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
    
    const message = await messageService.sendMessage({userId,matchId,content});
    
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
    
    await messageService.markAsRead(messageId);
    
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
    
    await messageService.deleteMessage(messageId);
    
    res.json({ success: true });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Mesaj silinemedi' });
  }
};

module.exports = { getMessages, sendMessage, markAsRead, deleteMessage };