const { Swipe, Match, User, Profile } = require('../models');
const { Op } = require('sequelize');

// Keşfet - Swipe yapılacak profilleri getir
const discover = async (req, res) => {
  try {
    const userId = req.user.id;
    
    // Daha önce swipe yaptıklarımı bul
    const swipedUsers = await Swipe.findAll({
      where: { user_id: userId },
      attributes: ['target_user_id']
    });
    const swipedIds = swipedUsers.map(s => s.target_user_id);
    swipedIds.push(userId); // Kendimi de hariç tut
    
    // Swipe yapılmamış profilleri getir
    const profiles = await Profile.findAll({
      where: { user_id: { [Op.notIn]: swipedIds } },
      limit: 10
    });
    
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
    const { targetUserId, action } = req.body; // action: 'like', 'pass', 'super_like'
    
    // Swipe kaydet
    await Swipe.create({
      user_id: userId,
      target_user_id: targetUserId,
      action
    });
    
    // Eğer like ise, karşı taraf da like yapmış mı kontrol et
    if (action === 'like' || action === 'super_like') {
      const mutualLike = await Swipe.findOne({
        where: {
          user_id: targetUserId,
          target_user_id: userId,
          action: { [Op.in]: ['like', 'super_like'] }
        }
      });
      
      // Eşleşme var!
      if (mutualLike) {
        await Match.create({
          user_id_1: Math.min(userId, targetUserId),
          user_id_2: Math.max(userId, targetUserId)
        });
        return res.json({ match: true, message: 'Eşleşme!' });
      }
    }
    
    res.json({ match: false });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Swipe başarısız' });
  }
};

module.exports = { discover, swipe };