const { Preferences } = require('../models');

// Tercihleri getir
const getPreferences = async (req, res) => {
  try {
    const userId = req.user.id;
    
    let preferences = await Preferences.findOne({ where: { user_id: userId } });
    
    if (!preferences) {
      preferences = await Preferences.create({ user_id: userId });
    }
    
    res.json(preferences);
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Tercihler getirilemedi' });
  }
};

// Tercihleri güncelle
const updatePreferences = async (req, res) => {
  try {
    const userId = req.user.id;
    const { age_min, age_max, distance_max, interested_genders } = req.body;
    
    let preferences = await Preferences.findOne({ where: { user_id: userId } });
    
    if (!preferences) {
      preferences = await Preferences.create({
        user_id: userId,
        age_min,
        age_max,
        distance_max,
        interested_genders
      });
    } else {
      await Preferences.update(
        { age_min, age_max, distance_max, interested_genders },
        { where: { user_id: userId } }
      );
      preferences = await Preferences.findOne({ where: { user_id: userId } });
    }
    
    res.json(preferences);
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Tercihler güncellenemedi' });
  }
};

module.exports = { getPreferences, updatePreferences };