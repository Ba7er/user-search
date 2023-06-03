const { search, addFriend, removeFriend } = require('./user-service');

const searchFriends = async (req, res) => {
  const query = req.params.query;
  const userId = parseInt(req.params.userId);
  try {
    const data = await search({ query, userId });
    res.statusCode = 200;
    res.json({
      success: true,
      users: data,
    });
  } catch (error) {
    res.statusCode = 500;
    return res.json({ success: false, error: err });
  }
};

const addFreindship = async (req, res) => {
  try {
    const userId = parseInt(req.params.userId);
    const friendId = parseInt(req.params.friendId);

    const data = await addFriend({ userId, friendId });

    res.statusCode = 200;
    res.json({
      success: true,
      users: data,
    });
  } catch (error) {
    res.statusCode = 500;
    return res.json({ success: false, error: err });
  }
};
const removeFreindship = async (req, res) => {
  try {
    const userId = parseInt(req.params.userId);
    const friendId = parseInt(req.params.friendId);
    const data = await removeFriend({ userId, friendId });
    res.statusCode = 200;
    res.json({
      success: true,
      users: data,
    });
  } catch (error) {
    res.statusCode = 500;
    return res.json({ success: false, error: err });
  }
};

module.exports = {
  searchFriends,
  addFreindship,
  removeFreindship,
};
