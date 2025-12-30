const { User, Profile, Preferences } = require('../models');
const path = require('path');

// Profil getir
const getProfile = async (req, res) => {
  try {
    const { userId } = req.params;
    
    const profile = await Profile.findOne({
      where: { user_id: userId },
      include: { model: User, attributes: ['email'] }
    });
    
    if (!profile) {
      return res.status(404).json({ error: 'Profil bulunamadı' });
    }
    
    res.json(profile);
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Profil getirilemedi' });
  }
};

// Kendi profilimi güncelle
const updateProfile = async (req, res) => {
  try {
    const userId = req.user.id;
    const { name, age, bio, gender, interested_in, latitude, longitude } = req.body;
    
    await Profile.update(
      { name, age, bio, gender, interested_in, latitude, longitude },
      { where: { user_id: userId } }
    );
    
    const profile = await Profile.findOne({ where: { user_id: userId } });
    res.json(profile);
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Profil güncellenemedi' });
  }
};

// Fotoğraf ekle
const addPhoto = async (req, res) => {
  try {
    const userId = req.user.id;
    
    if (!req.file) {
      return res.status(400).json({ error: 'Fotoğraf yüklenmedi' });
    }
    
    const photoUrl = `/uploads/${req.file.filename}`;
    
    const profile = await Profile.findOne({ where: { user_id: userId } });
    const photos = profile.photos || [];
    photos.push(photoUrl);
    
    await Profile.update({ photos }, { where: { user_id: userId } });
    
    res.json({ photoUrl, photos });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Fotoğraf eklenemedi' });
  }
};

// Fotoğraf sil
const deletePhoto = async (req, res) => {
  try {
    const userId = req.user.id;
    const { photoUrl } = req.body;
    
    const profile = await Profile.findOne({ where: { user_id: userId } });
    const photos = profile.photos.filter(p => p !== photoUrl);
    
    await Profile.update({ photos }, { where: { user_id: userId } });
    
    res.json({ photos });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Fotoğraf silinemedi' });
  }
};

module.exports = { getProfile, updateProfile, addPhoto, deletePhoto };