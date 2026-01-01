const express = require('express');
const cors = require('cors');
const helmet = require('helmet');
const dotenv = require('dotenv');
const http = require('http');
const { Server } = require('socket.io');
const sequelize = require('./src/config/database');
const setupSocket = require('./src/socket/messageSocket');

dotenv.config();

const app = express();
const server = http.createServer(app);

// Socket.io
const io = new Server(server, {
  cors: { origin: '*' }
});
setupSocket(io);

// Middleware
app.use(helmet());
app.use(cors());
app.use(express.json());
app.use('/uploads', express.static('uploads'));

// Test route
app.get('/', (req, res) => {
  res.json({ message: 'Spark API çalışıyor!' });
});

// Routes
app.use('/api/auth', require('./src/routes/auth'));
app.use('/api/profile', require('./src/routes/profile'));
app.use('/api/swipe', require('./src/routes/swipe'));
app.use('/api/match', require('./src/routes/match'));
app.use('/api/messages', require('./src/routes/message'));
app.use('/api/preferences', require('./src/routes/preferences'));
app.use('/api/block', require('./src/routes/block'));
app.use('/uploads', express.static('uploads'));
app.use('/api/notifications', require('./src/routes/notification'));

// Error handling
app.use((err, req, res, next) => {
  console.error(err);
  res.status(500).json({ error: 'Internal server error' });
});

// Server başlat (app.listen yerine server.listen)
const PORT = process.env.PORT || 5000;
server.listen(PORT, async () => {
  try {
    await sequelize.authenticate();

     await sequelize.sync({ alter: true });

     
    console.log('✅ Database bağlantısı başarılı');
    console.log(`🚀 Server ${PORT} portunda çalışıyor`);
    console.log('🔌 WebSocket aktif');
  } catch (error) {
    console.error('❌ Database bağlantı hatası:', error);
  }
});
