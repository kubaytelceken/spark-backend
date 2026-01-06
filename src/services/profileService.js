const { User, Profile } = require("../models");

const getProfileByUserId = async (userId) => {
  const profile = await Profile.findOne({
    where: { user_id: userId },
    include: {
      model: User,
      attributes: ["email"],
    },
  });

  if (!profile) {
    throw new Error("PROFILE_NOT_FOUND");
  }

  return profile;
};

const updateProfile = async (userId, data) => {
  const [updated] = await Profile.update(data, {
    where: { user_id: userId },
  });

  if (!updated) {
    throw new Error("PROFILE_NOT_FOUND");
  }

  return await Profile.findOne({ where: { user_id: userId } });
};

const addPhoto = async (userId, photoUrl) => {
  const profile = await Profile.findOne({
    where: { user_id: userId },
  });

  if (!profile) {
    throw new Error("PROFILE_NOT_FOUND");
  }

  const photos = profile.photos || [];
  photos.push(photoUrl);

  profile.photos = photos;
  await profile.save();

  return photos;
};

const deletePhoto = async (userId, photoUrl) => {
  const profile = await Profile.findOne({
    where: { user_id: userId },
  });

  if (!profile) {
    throw new Error("PROFILE_NOT_FOUND");
  }

  const photos = (profile.photos || []).filter(
    (photo) => photo !== photoUrl
  );

  profile.photos = photos;
  await profile.save();

  return photos;
};

module.exports = {
  getProfileByUserId,
  updateProfile,
  addPhoto,
  deletePhoto,
};
