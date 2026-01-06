const { Swipe, Match, User, Profile, Preferences, Block } = require('../models');
const { Op } = require('sequelize');
const { createNotification } = require('../services/notificationService');

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

// Dışlanacak kullanıcıları getir
const getExcludedUserIds = async (userId) => {
  const swipedUsers = await Swipe.findAll({
    where: { user_id: userId },
    attributes: ['target_user_id']
  });
  const swipedIds = swipedUsers.map(s => s.target_user_id);
  
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
  
  return [...new Set([userId, ...swipedIds, ...blockedIds])];
};

// Profilleri tercihlere göre filtrele
const filterProfilesByPreferences = (profiles, myProfile, myPreferences) => {
  if (!myPreferences) return profiles;
  
  return profiles.filter(profile => {
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
};

// Keşfet servisi
const getDiscoverProfiles = async (userId, limit = 10) => {
  const myProfile = await Profile.findOne({ where: { user_id: userId } });
  const myPreferences = await Preferences.findOne({ where: { user_id: userId } });
  
  const excludeIds = await getExcludedUserIds(userId);
  
  let profiles = await Profile.findAll({
    where: { user_id: { [Op.notIn]: excludeIds } },
    include: { model: User, attributes: ['id', 'email'] }
  });
  
  profiles = filterProfilesByPreferences(profiles, myProfile, myPreferences);
  
  return profiles.slice(0, limit);
};

// Swipe kontrolü
const checkExistingSwipe = async (userId, targetUserId) => {
  return await Swipe.findOne({
    where: { user_id: userId, target_user_id: targetUserId }
  });
};

// Swipe oluştur
const createSwipe = async (userId, targetUserId, action) => {
  return await Swipe.create({
    user_id: userId,
    target_user_id: targetUserId,
    action
  });
};

// Eşleşme kontrolü
const checkMatch = async (userId, targetUserId) => {
  return await Swipe.findOne({
    where: {
      user_id: targetUserId,
      target_user_id: userId,
      action: { [Op.in]: ['like', 'super_like'] }
    }
  });
};

// Eşleşme oluştur
const createMatch = async (userId, targetUserId) => {
  const match = await Match.create({
    user_id_1: Math.min(userId, targetUserId),
    user_id_2: Math.max(userId, targetUserId)
  });
  
  // Her iki kullanıcıya bildirim gönder
  await createNotification(userId, 'match', 'Yeni Eşleşme!', 'Yeni bir eşleşmen var', { matchId: match.id });
  await createNotification(targetUserId, 'match', 'Yeni Eşleşme!', 'Yeni bir eşleşmen var', { matchId: match.id });
  
  return match;
};

// Swipe işlemi
const processSwipe = async (userId, targetUserId, action) => {
  const existingSwipe = await checkExistingSwipe(userId, targetUserId);
  
  if (existingSwipe) {
    throw new Error('Zaten swipe yaptın');
  }
  
  await createSwipe(userId, targetUserId, action);
  
  if (action === 'like' || action === 'super_like') {
    const mutualLike = await checkMatch(userId, targetUserId);
    
    if (mutualLike) {
      const match = await createMatch(userId, targetUserId);
      return { match: true, matchId: match.id };
    }
  }
  
  return { match: false };
};

module.exports = {
  getDiscoverProfiles,
  processSwipe,
  calculateDistance
};