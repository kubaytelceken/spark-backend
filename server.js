const express = require('express');
const cors = require('cors');
const helmet = require('helmet');
const dotenv = require('dotenv');
const sequelize = require('./src/config/database');  // Bu satırı değiştir

dotenv.config();

const app = express();

// Middleware
app.use(helmet());
app.use(cors());
app.use(express.json());


// Test route
app.get('/', (req, res) => {
  res.json({ message: 'Spark API çalışıyor!' });
});


// Routes (app.get('/') satırından sonra)
app.use('/api/auth', require('./src/routes/auth'));
app.use('/api/profile', require('./src/routes/profile'));
app.use('/api/swipe', require('./src/routes/swipe'));
app.use('/api/match', require('./src/routes/match'));
app.use('/api/messages', require('./src/routes/message'));
app.use('/api/preferences', require('./src/routes/preferences'));
app.use('/api/block', require('./src/routes/block'));

app.use('/uploads', express.static('uploads'));


// Error handling
app.use((err, req, res, next) => {
  console.error(err);
  res.status(500).json({ error: 'Internal server error' });
});

// Server başlat
const PORT = process.env.PORT || 5000;
app.listen(PORT, async () => {
  try {
    await sequelize.authenticate();
    console.log('✅ Database bağlantısı başarılı');
    console.log(`🚀 Server ${PORT} portunda çalışıyor`);
  } catch (error) {
    console.error('❌ Database bağlantı hatası:', error);
  }
});

module.exports = { app, sequelize };