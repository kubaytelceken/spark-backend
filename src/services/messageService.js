const { Message, Match } = require("../models");

const getMessages = async (matchId) => {
  const messages = await Message.findAll({
    where: { match_id: matchId, deleted_at: null },
    order: [["created_at", "ASC"]],
  });

  return messages;
};

const sendMessage = async ({ userId, matchId, content }) => {
  const message = await Message.create({
    match_id: matchId,
    sender_id: userId,
    content,
  });

  return message;
};

const markAsRead =  async (messageId)  => {

    await Message.update(
      { is_read: true },
      { where: { id: messageId } }
    );
    return true;
};

const deleteMessage = async (messageId)  => {

    await Message.update(
      { deleted_at: new Date() },
      { where: { id: messageId } }
    );

    return true;

};

module.exports = {
  getMessages,
  sendMessage,
  markAsRead,
  deleteMessage
};
