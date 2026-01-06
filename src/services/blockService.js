const { Block, User, Profile } = require("../models");

const blockUser = async ({ userId, blockedUserId }) => {
  if (userId === parseInt(blockedUserId)) {
    throw new Error("CANNOT_BLOCK_SELF");
  }
  const blockedUser = await User.findByPk(blockedUserId);
  if (!blockedUser) {
    throw new Error("USER_NOT_FOUND");
  }

  const alreadyBlocked = await Block.findOne({
    where: {
      user_id: userId,
      blocked_user_id: blockedUserId,
    },
  });

  if (alreadyBlocked) {
    throw new Error("USER_ALREADY_BLOCKED");
  }
  await Block.create({
    user_id: userId,
    blocked_user_id: blockedUserId,
  });

  return true;
};

const unblockUser = async ({ userId, blockedUserId }) => {
 
  const blockedUser = await User.findByPk(blockedUserId);
  if (!blockedUser) {
    throw new Error("USER_NOT_FOUND");
  }

    await Block.destroy({
      where: {
        user_id: userId,
        blocked_user_id: blockedUserId
      }
    });
  return true;

};
const getBlockedUsers = async (userId) => {

    const blocks = await Block.findAll({
      where: { user_id: userId },
      include: {
        model: User,
        as: 'blocked',
        include: [Profile]
      }
    });

    return blocks;
};

module.exports = { blockUser, unblockUser, getBlockedUsers };
