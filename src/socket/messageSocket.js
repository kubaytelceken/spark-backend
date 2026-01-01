const jwt = require('jsonwebtoken');
const { Message, Match } = require('../models');

const setupSocket = (io) => {
  // Token doğrulama middleware
  io.use((socket, next) => {
    const token = socket.handshake.auth.token; //Bağlantıdan gelen token 
    
    if (!token) {
      return next(new Error('Token gerekli'));
    }
    
    try {
      const decoded = jwt.verify(token, process.env.JWT_SECRET);
      socket.userId = decoded.id;
      next();
    } catch (error) {
      next(new Error('Geçersiz token'));
    }
  });

  io.on('connection', (socket) => {
    // Birisi bağlandığında burası çalışır
    console.log(`✅ Kullanıcı bağlandı: ${socket.userId}`);
    
    // Kullanıcıyı kendi odasına ekle (bildirimler için)
    socket.join(`user_${socket.userId}`);

    // Match odasına katıl
    socket.on('join_match', (matchId) => {
      socket.join(`match_${matchId}`);
      console.log(`Kullanıcı ${socket.userId} match_${matchId} odasına katıldı`);
    });

    // Match odasından ayrıl
    socket.on('leave_match', (matchId) => {
      socket.leave(`match_${matchId}`);
    });

    // Mesaj gönder
    socket.on('send_message', async (data) => {
      try {
        const { matchId, content } = data;
        
        // Mesajı veritabanına kaydet
        const message = await Message.create({
          match_id: matchId,
          sender_id: socket.userId,
          content
        });
        
        // Odadaki herkese gönder
        io.to(`match_${matchId}`).emit('receive_message', {
          id: message.id,
          match_id: matchId,
          sender_id: socket.userId,
          content,
          is_read: false,
          created_at: message.created_at
        });
      } catch (error) {
        console.error('Mesaj gönderilemedi:', error);
        socket.emit('error', { message: 'Mesaj gönderilemedi' });
      }
    });

    // Yazıyor göstergesi
    socket.on('typing', (matchId) => {
      socket.to(`match_${matchId}`).emit('user_typing', {
        userId: socket.userId
      });
    });

    // Yazmayı bıraktı
    socket.on('stop_typing', (matchId) => {
      socket.to(`match_${matchId}`).emit('user_stop_typing', {
        userId: socket.userId
      });
    });

    // Mesaj okundu
    socket.on('mark_read', async (data) => {
      const { matchId, messageId } = data;
      
      await Message.update(
        { is_read: true },
        { where: { id: messageId } }
      );
      
      io.to(`match_${matchId}`).emit('message_read', { messageId });
    });

    // Bağlantı koptu
    socket.on('disconnect', () => {
      console.log(`❌ Kullanıcı ayrıldı: ${socket.userId}`);
    });
  });
};

module.exports = setupSocket;