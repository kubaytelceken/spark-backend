const profileService = require("../services/profileService");

// Profil getir
const getProfile = async (req, res) => {
  try {
    const { userId } = req.params;

    const profile = await profileService.getProfileByUserId(userId);
    res.json(profile);
  } catch (error) {
    console.error(error);

    if (error.message === "PROFILE_NOT_FOUND") {
      return res.status(404).json({ error: "Profil bulunamadı" });
    }

    res.status(500).json({ error: "Profil getirilemedi" });
  }
};

// Kendi profilimi güncelle
const updateProfile = async (req, res) => {
  try {
    const userId = req.user.id;
    const {
      name,
      age,
      bio,
      gender,
      interested_in,
      latitude,
      longitude,
    } = req.body;

    const profile = await profileService.updateProfile(userId, {
      name,
      age,
      bio,
      gender,
      interested_in,
      latitude,
      longitude,
    });

    res.json(profile);
  } catch (error) {
    console.error(error);

    if (error.message === "PROFILE_NOT_FOUND") {
      return res.status(404).json({ error: "Profil bulunamadı" });
    }

    res.status(500).json({ error: "Profil güncellenemedi" });
  }
};

// Fotoğraf ekle
const addPhoto = async (req, res) => {
  try {
    const userId = req.user.id;

    if (!req.file) {
      return res.status(400).json({ error: "Fotoğraf yüklenmedi" });
    }

    const photoUrl = `/uploads/${req.file.filename}`;
    const photos = await profileService.addPhoto(userId, photoUrl);

    res.status(201).json({ photoUrl, photos });
  } catch (error) {
    console.error(error);

    if (error.message === "PROFILE_NOT_FOUND") {
      return res.status(404).json({ error: "Profil bulunamadı" });
    }

    res.status(500).json({ error: "Fotoğraf eklenemedi" });
  }
};

// Fotoğraf sil
const deletePhoto = async (req, res) => {
  try {
    const userId = req.user.id;
    const { photoUrl } = req.body;

    if (!photoUrl) {
      return res.status(400).json({ error: "Fotoğraf URL gerekli" });
    }

    const photos = await profileService.deletePhoto(userId, photoUrl);
    res.json({ photos });
  } catch (error) {
    console.error(error);

    if (error.message === "PROFILE_NOT_FOUND") {
      return res.status(404).json({ error: "Profil bulunamadı" });
    }

    res.status(500).json({ error: "Fotoğraf silinemedi" });
  }
};

module.exports = {
  getProfile,
  updateProfile,
  addPhoto,
  deletePhoto,
};
