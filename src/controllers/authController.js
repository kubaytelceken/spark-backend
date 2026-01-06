const { generateToken } = require("../utils/token");
const authService = require("../services/authService");

// REGISTER
const register = async (req, res) => {
  try {
    const { email, password, name } = req.body;

    if (!email || !password) {
      return res.status(400).json({
        error: "EMAIL_AND_PASSWORD_REQUIRED",
      });
    }

    const user = await authService.register({ email, password, name });
    // Token oluştur
    const token = generateToken(user.id);

    res.status(201).json({ token, userId: user.id });
  } catch (err) {
    if (err.message === "EMAIL_ALREADY_EXISTS") {
      return res.status(409).json({ error: err.message });
    }

    console.error(err);
    return res.status(500).json({ error: "REGISTER_FAILED" });
  }
};

// LOGIN
const login = async (req, res) => {
  try {
    const { email, password } = req.body;

    // User bul
    const user = await authService.login({ email, password });
    // Token oluştur
    const token = generateToken(user.id);
    res.json({ token, userId: user.id });
  } catch (err) {
    if (err.message === "EMAIL_NOT_FOUND") {
      return res.status(401).json({ error: err.message });
    }

    if (err.message === "EMAIL_OR_PASSWORD_WRONG") {
      return res.status(401).json({ error: err.message });
    }

    console.error(err);
    return res.status(500).json({ error: "LOGIN_FAILED" });
  }
};

const googleLogin = async (req, res) => {
  try {
    const { idToken } = req.body;
    if (!idToken) {
      return res.status(400).json({ error: "ID_TOKEN_REQUIRED" });
    }
    const user = await authService.googleLogin(idToken);
    res.json({ token: generateToken(user.id), user });
  } catch (err) {
    console.error(err);
    res.status(401).json({ error: "Google login başarısız" });
  }
};

const appleLogin = async (req, res) => {
  try {
    const { identityToken } = req.body;
    if (!identityToken) {
      return res.status(400).json({ error: "IDENTITY_TOKEN_REQUIRED" });
    }

    const user = await authService.appleLogin(identityToken);

    res.json({ token: generateToken(user.id), user });
  } catch (err) {
    console.error(err);
    res.status(401).json({ error: "Apple login başarısız" });
  }
};

module.exports = { register, login, googleLogin, appleLogin };
