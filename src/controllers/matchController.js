const matchService = require("../services/matchService");

const getMatches = async (req, res) => {
  try {
    const userId = req.user.id;
    const matches = await matchService.getMatches(userId);
    res.json(matches);
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: "MATCHES_FETCH_FAILED" });
  }
};

const getMatch = async (req, res) => {
  try {
    const userId = req.user.id;
    const { matchId } = req.params;

    const match = await matchService.getMatch({
      matchId,
      userId,
    });

    res.json(match);
  } catch (error) {
    if (error.message === "MATCH_NOT_FOUND") {
      return res.status(404).json({ error: error.message });
    }

    if (error.message === "MATCH_ACCESS_DENIED") {
      return res.status(403).json({ error: error.message });
    }

    console.error(error);
    res.status(500).json({ error: "MATCH_FETCH_FAILED" });
  }
};

module.exports = { getMatches, getMatch };
