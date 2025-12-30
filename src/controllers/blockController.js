const { Block, User, Profile } = require('../models');

// Engelle
const blockUser = async (req, res) => {
  try {
    const userId = req.user.id;
    const { blockedUserId } = req.params;
    
    if (userId === parseInt(blockedUserId)) {
      return res.status(400).json({ error: 'Kendini engelleyemezsin' });
    }
    
    await Block.create({
      user_id: userId,
      blocked_user_id: blockedUserId
    });
    
    res.json({ success: true, message: 'Kullanıcı engellendi' });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Engelleme başarısız' });
  }
};

// Engeli kaldır
const unblockUser = async (req, res) => {
  try {
    const userId = req.user.id;
    const { blockedUserId } = req.params;
    
    await Block.destroy({
      where: {
        user_id: userId,
        blocked_user_id: blockedUserId
      }
    });
    
    res.json({ success: true, message: 'Engel kaldırıldı' });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Engel kaldırılamadı' });
  }
};

// Engellenen kullanıcıları listele
const getBlockedUsers = async (req, res) => {
  try {
    const userId = req.user.id;
    
    const blocks = await Block.findAll({
      where: { user_id: userId },
      include: {
        model: User,
        as: 'blocked',
        include: [Profile]
      }
    });
    
    res.json(blocks);
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Liste getirilemedi' });
  }
};

module.exports = { blockUser, unblockUser, getBlockedUsers };