const bcrypt = require("bcryptjs");
const { User, Profile,Preferences } = require("../models");
const { OAuth2Client } = require("google-auth-library");
const googleClient = new OAuth2Client(process.env.GOOGLE_CLIENT_ID);
const appleSignin = require("apple-signin-auth");

const register = async ({ email, password, name }) => {
  const existingUser = await User.findOne({ where: { email } });
  if (existingUser) {
    throw new Error("EMAIL_ALREADY_EXISTS");
  }
  const password_hash = await bcrypt.hash(password, 10);

  // User oluştur
  const user = await User.create({ email, password_hash });

  // Profil oluştur
  await Profile.create({ user_id: user.id, name });

  return user;
};

const login = async ({ email, password }) => {
  const user = await User.findOne({ where: { email } });
  if (!user) {
    throw new Error("EMAIL_NOT_FOUND");
  }

  const isMatch = await bcrypt.compare(password, user.password_hash);
  if (!isMatch) {
    throw new Error("EMAIL_OR_PASSWORD_WRONG");
  }
  return user;
};

const googleLogin = async (idToken) => {
  const ticket = await googleClient.verifyIdToken({
    idToken,
    audience: process.env.GOOGLE_CLIENT_ID,
  });

  const payload = ticket.getPayload();
  const email = payload.email;
  const googleId = payload.sub;

  let user = await User.findOne({
    where: { provider: "google", provider_id: googleId },
  });

  if (!user) {
    user = await User.create({
      email,
      provider: "google",
      provider_id: googleId,
    });

    await Profile.create({ user_id: user.id });
    await Preferences.create({ user_id: user.id });
  }

  return user;
};

const appleLogin = async (identityToken)=>{

    const appleUser = await appleSignin.verifyIdToken(identityToken, {
      audience: process.env.APPLE_CLIENT_ID,
      ignoreExpiration: false,
    });

    const appleId = appleUser.sub;
    const email = appleUser.email || null;

    let user = await User.findOne({
      where: { provider: "apple", provider_id: appleId },
    });

    if (!user) {
      user = await User.create({
        email,
        provider: "apple",
        provider_id: appleId,
      });

      await Profile.create({ user_id: user.id });
      await Preferences.create({ user_id: user.id });
    }

    return user;
}

module.exports = {
  register,
  login,
  googleLogin,
  appleLogin
};
