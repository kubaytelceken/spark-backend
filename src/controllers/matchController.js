const { Match, User, Profile, Message } = require('../models');
const { Op } = require('sequelize');

// Eşleşmelerimi getir
const getMatches = async (req, res) => {
  try {
    const userId = req.user.id;
    
    const matches = await Match.findAll({
      where: {
        [Op.or]: [
          { user_id_1: userId },
          { user_id_2: userId }
        ]
      },
      include: [
        { model: User, as: 'user1', include: [Profile] },
        { model: User, as: 'user2', include: [Profile] }
      ]
    });
    
    res.json(matches);
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Eşleşmeler getirilemedi' });
  }
};

// Tek eşleşme detayı
const getMatch = async (req, res) => {
  try {
    const { matchId } = req.params;
    
    const match = await Match.findByPk(matchId, {
      include: [
        { model: User, as: 'user1', include: [Profile] },
        { model: User, as: 'user2', include: [Profile] }
      ]
    });
    
    if (!match) {
      return res.status(404).json({ error: 'Eşleşme bulunamadı' });
    }
    
    res.json(match);
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Eşleşme getirilemedi' });
  }
};

module.exports = { getMatches, getMatch };