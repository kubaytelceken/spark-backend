const swipeService = require('../services/swipeService');

// Keşfet
const discover = async (req, res) => {
  try {
    const userId = req.user.id;
    const profiles = await swipeService.getDiscoverProfiles(userId);
    res.json(profiles);
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Profiller getirilemedi' });
  }
};

// Swipe yap
const swipe = async (req, res) => {
  try {
    const userId = req.user.id;
    const { targetUserId, action } = req.body;
    
    const result = await swipeService.processSwipe(userId, targetUserId, action);
    
    if (result.match) {
      return res.json({ 
        match: true, 
        matchId: result.matchId, 
        message: 'Eşleşme!' 
      });
    }
    
    res.json({ match: false });
  } catch (error) {
    console.error(error);
    
    if (error.message === 'Zaten swipe yaptın') {
      return res.status(400).json({ error: error.message });
    }
    
    res.status(500).json({ error: 'Swipe başarısız' });
  }
};

module.exports = { discover, swipe };