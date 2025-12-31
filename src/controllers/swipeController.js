const { Swipe, Match, User, Profile, Preferences, Block } = require('../models');
const { Op } = require('sequelize');

// Mesafe hesaplama (Haversine formula)
const calculateDistance = (lat1, lon1, lat2, lon2) => {
  const R = 6371; // Dünya yarıçapı (km)
  const dLat = (lat2 - lat1) * Math.PI / 180;
  const dLon = (lon2 - lon1) * Math.PI / 180;
  const a = 
    Math.sin(dLat/2) * Math.sin(dLat/2) +
    Math.cos(lat1 * Math.PI / 180) * Math.cos(lat2 * Math.PI / 180) *
    Math.sin(dLon/2) * Math.sin(dLon/2);
  const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1-a));
  return R * c;
};

// Keşfet
const discover = async (req, res) => {
  try {
    const userId = req.user.id;
    
    // Kendi profilimi ve tercihlerimi al
    const myProfile = await Profile.findOne({ where: { user_id: userId } });
    const myPreferences = await Preferences.findOne({ where: { user_id: userId } });
    
    // Daha önce swipe yaptıklarım
    const swipedUsers = await Swipe.findAll({
      where: { user_id: userId },
      attributes: ['target_user_id']
    });
    const swipedIds = swipedUsers.map(s => s.target_user_id);
    
    // Engellediğim ve beni engelleyenler
    const blocks = await Block.findAll({
      where: {
        [Op.or]: [
          { user_id: userId },
          { blocked_user_id: userId }
        ]
      }
    });
    const blockedIds = blocks.map(b => 
      b.user_id === userId ? b.blocked_user_id : b.user_id
    );
    
    // Hariç tutulacaklar
    const excludeIds = [...new Set([userId, ...swipedIds, ...blockedIds])];
    
    // Profilleri getir
    let profiles = await Profile.findAll({
      where: { user_id: { [Op.notIn]: excludeIds } },
      include: { model: User, attributes: ['id', 'email'] }
    });
    
    // Tercihlere göre filtrele
    if (myPreferences) {
      profiles = profiles.filter(profile => {
        // Yaş filtresi
        if (myPreferences.age_min && profile.age < myPreferences.age_min) return false;
        if (myPreferences.age_max && profile.age > myPreferences.age_max) return false;
        
        // Cinsiyet filtresi
        if (myPreferences.interested_genders && profile.gender) {
          const genders = myPreferences.interested_genders.split(',');
          if (!genders.includes(profile.gender)) return false;
        }
        
        // Mesafe filtresi
        if (myPreferences.distance_max && myProfile.latitude && profile.latitude) {
          const distance = calculateDistance(
            myProfile.latitude, myProfile.longitude,
            profile.latitude, profile.longitude
          );
          if (distance > myPreferences.distance_max) return false;
        }
        
        return true;
      });
    }
    
    // İlk 10 profili döndür
    res.json(profiles.slice(0, 10));
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
    
    // Zaten swipe yapılmış mı kontrol et
    const existingSwipe = await Swipe.findOne({
      where: { user_id: userId, target_user_id: targetUserId }
    });
    
    if (existingSwipe) {
      return res.status(400).json({ error: 'Zaten swipe yaptın' });
    }
    
    // Swipe kaydet
    await Swipe.create({
      user_id: userId,
      target_user_id: targetUserId,
      action
    });
    
    // Like ise eşleşme kontrolü
    if (action === 'like' || action === 'super_like') {
      const mutualLike = await Swipe.findOne({
        where: {
          user_id: targetUserId,
          target_user_id: userId,
          action: { [Op.in]: ['like', 'super_like'] }
        }
      });
      
      if (mutualLike) {
        const match = await Match.create({
          user_id_1: Math.min(userId, targetUserId),
          user_id_2: Math.max(userId, targetUserId)
        });
        
        return res.json({ 
          match: true, 
          matchId: match.id,
          message: 'Eşleşme!' 
        });
      }
    }
    
    res.json({ match: false });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Swipe başarısız' });
  }
};

module.exports = { discover, swipe };