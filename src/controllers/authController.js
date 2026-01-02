const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const { User, Profile } = require('../models');
const { OAuth2Client } = require('google-auth-library');
const googleClient = new OAuth2Client(process.env.GOOGLE_CLIENT_ID);
const appleSignin = require('apple-signin-auth');

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

const googleLogin = async (req, res) => {
  try {
    const { idToken } = req.body;

    const ticket = await googleClient.verifyIdToken({
      idToken,
      audience: process.env.GOOGLE_CLIENT_ID
    });

    const payload = ticket.getPayload();
    const email = payload.email;
    const googleId = payload.sub;

    let user = await User.findOne({
      where: { provider: 'google', provider_id: googleId }
    });

    if (!user) {
      user = await User.create({
        email,
        provider: 'google',
        provider_id: googleId
      });

      await Profile.create({ user_id: user.id });
      await Preferences.create({ user_id: user.id });
    }

    res.json({ token: createToken(user), user });

  } catch (err) {
    console.error(err);
    res.status(401).json({ error: 'Google login başarısız' });
  }
};

const appleLogin = async (req, res) => {
  try {
    const { identityToken } = req.body;

    const appleUser = await appleSignin.verifyIdToken(identityToken, {
      audience: process.env.APPLE_CLIENT_ID,
      ignoreExpiration: false
    });

    const appleId = appleUser.sub;
    const email = appleUser.email || null;

    let user = await User.findOne({
      where: { provider: 'apple', provider_id: appleId }
    });

    if (!user) {
      user = await User.create({
        email,
        provider: 'apple',
        provider_id: appleId
      });

      await Profile.create({ user_id: user.id });
      await Preferences.create({ user_id: user.id });
    }

    res.json({ token: createToken(user), user });

  } catch (err) {
    console.error(err);
    res.status(401).json({ error: 'Apple login başarısız' });
  }
};


module.exports = { register, login,googleLogin,appleLogin };