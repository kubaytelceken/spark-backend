const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const { User, Profile } = require('../models');

// Token oluşturma fonksiyonu
const generateToken = (userId) => {
  return jwt.sign({ id: userId }, process.env.JWT_SECRET, {
    expiresIn: process.env.JWT_EXPIRE
  });
};

// REGISTER
const register = async (req, res) => {
  try {
    const { email, password, name } = req.body;

    // Email kontrolü
    const existingUser = await User.findOne({ where: { email } });
    if (existingUser) {
      return res.status(400).json({ error: 'Bu email zaten kayıtlı' });
    }

    // Şifreyi hashle
    const password_hash = await bcrypt.hash(password, 10);

    // User oluştur
    const user = await User.create({ email, password_hash });

    // Profil oluştur
    await Profile.create({ user_id: user.id, name });

    // Token oluştur
    const token = generateToken(user.id);

    res.status(201).json({ token, userId: user.id });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Kayıt başarısız' });
  }
};

// LOGIN
const login = async (req, res) => {
  try {
    const { email, password } = req.body;

    // User bul
    const user = await User.findOne({ where: { email } });
    if (!user) {
      return res.status(401).json({ error: 'Email veya şifre hatalı' });
    }

    // Şifre kontrolü
    const isMatch = await bcrypt.compare(password, user.password_hash);
    if (!isMatch) {
      return res.status(401).json({ error: 'Email veya şifre hatalı' });
    }

    // Token oluştur
    const token = generateToken(user.id);

    res.json({ token, userId: user.id });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Giriş başarısız' });
  }
};

module.exports = { register, login };