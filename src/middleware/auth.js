const jwt = require('jsonwebtoken');
const { User } = require('../models');

const authMiddleware = async (req, res, next) => {
  try {
    // Token'ı header'dan al
    const authHeader = req.headers.authorization;
    
    if (!authHeader || !authHeader.startsWith('Bearer ')) {
      return res.status(401).json({ error: 'Token bulunamadı' });
    }
    
    // "Bearer abc123" → "abc123"
    const token = authHeader.split(' ')[1];
    
    // Token'ı doğrula
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    
    // Kullanıcıyı bul
    const user = await User.findByPk(decoded.id);
    if (!user) {
      return res.status(401).json({ error: 'Kullanıcı bulunamadı' });
    }
    
    // Kullanıcıyı request'e ekle (controller'larda req.user olarak kullanılacak)
    req.user = user;
    
    next(); // Sonraki adıma geç
  } catch (error) {
    res.status(401).json({ error: 'Geçersiz token' });
  }
};

module.exports = authMiddleware;