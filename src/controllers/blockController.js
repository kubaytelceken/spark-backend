
const blockService = require("../services/blockService");


// Engelle
const blockUser = async (req, res) => {
  try {
    const userId = req.user.id;
    const { blockedUserId } = req.params;

    await blockService.blockUser({
      userId,
      blockedUserId,
    });

    res.json({ success: true, message: "Kullanıcı engellendi" });
  } catch (err) {
    if (err.message === "CANNOT_BLOCK_SELF") {
      return res.status(400).json({ error: err.message });
    }

     if (err.message === "USER_NOT_FOUND") {
      return res.status(404).json({ error: err.message });
    }

    if (err.message === "USER_ALREADY_BLOCKED") {
      return res.status(409).json({ error: err.message });
    }

    console.error(err);
    res.status(500).json({ error: "BLOCK_FAILED" });
  }
};
// Engeli kaldır
const unblockUser = async (req, res) => {
  try {
    const userId = req.user.id;
    const { blockedUserId } = req.params;
    
   await blockService.unblockUser({
      userId,
      blockedUserId,
    });
    
    res.json({ success: true, message: 'Engel kaldırıldı' });
  } catch (err) {
    if (err.message === "USER_NOT_FOUND") {
      return res.status(404).json({ error: err.message });
    }
   console.error(err);
    res.status(500).json({ error: "UNBLOCK_FAILED" });
  }
};

// Engellenen kullanıcıları listele
const getBlockedUsers = async (req, res) => {
  try {
    const userId = req.user.id;
    
    const blocks = await blockService.getBlockedUsers(userId);
    
    res.json(blocks);
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Liste getirilemedi' });
  }
};

module.exports = { blockUser, unblockUser, getBlockedUsers };