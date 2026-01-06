const { Preferences } = require("../models");

const getPreferences = async (userId) => {
  let preferences = await Preferences.findOne({ where: { user_id: userId } });

  if (!preferences) {
    preferences = await Preferences.create({ user_id: userId });
  }

  return preferences;
};

const updatePreferences = async ({userId, age_min, age_max, distance_max, interested_genders }) => {
 let preferences = await Preferences.findOne({ where: { user_id: userId } });
    
    if (!preferences) {
      preferences = await Preferences.create({
        user_id: userId,
        age_min,
        age_max,
        distance_max,
        interested_genders
      });
    } else {
      await Preferences.update(
        { age_min, age_max, distance_max, interested_genders },
        { where: { user_id: userId } }
      );
      preferences = await Preferences.findOne({ where: { user_id: userId } });
    }

    return preferences;
};

module.exports = { getPreferences, updatePreferences };