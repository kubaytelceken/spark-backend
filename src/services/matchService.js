const { Match, User, Profile } = require("../models");
const { Op } = require("sequelize");

const getMatches = async (userId) => {
  return Match.findAll({
    where: {
      [Op.or]: [
        { user_id_1: userId },
        { user_id_2: userId },
      ],
    },
    include: [
      { model: User, as: "user1", include: [Profile] },
      { model: User, as: "user2", include: [Profile] },
    ],
  });
};

const getMatch = async ({ matchId, userId }) => {
  const match = await Match.findByPk(matchId, {
    include: [
      { model: User, as: "user1", include: [Profile] },
      { model: User, as: "user2", include: [Profile] },
    ],
  });

  if (!match) {
    throw new Error("MATCH_NOT_FOUND");
  }

  // 🔐 Güvenlik kontrolü
  if (
    match.user_id_1 !== userId &&
    match.user_id_2 !== userId
  ) {
    throw new Error("MATCH_ACCESS_DENIED");
  }

  return match;
};

module.exports = { getMatches, getMatch };
