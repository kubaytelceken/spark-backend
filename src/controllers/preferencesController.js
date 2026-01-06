const preferencesService = require("../services/preferencesService");

// Tercihleri getir
const getPreferences = async (req, res) => {
  try {
    const userId = req.user.id;
    
    let preferences = await preferencesService.getPreferences(userId);
    
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
    
    let preferences = await preferencesService.updatePreferences({userId,age_min, age_max, distance_max, interested_genders});
    
    res.json(preferences);
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Tercihler güncellenemedi' });
  }
};

module.exports = { getPreferences, updatePreferences };