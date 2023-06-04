const UserService = require('./user-service');
const db = require('./database');
const searchFriends = async (req, res) => {
  const query = req.params.query;
  const userId = parseInt(req.params.userId);
  const userService = new UserService(db);

  try {
    const data = await userService.search({ query, userId });
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
  const userId = parseInt(req.params.userId);
  const friendId = parseInt(req.params.friendId);
  const userService = new UserService(db);

  try {
    const data = await userService.addFriend({ userId, friendId });
    res.statusCode = 200;
    res.json({
      success: true,
      users: data,
    });
  } catch (error) {
    console.log(error);
    res.statusCode = 500;
    return res.json({ success: false, error: err });
  }
};

const removeFreindship = async (req, res) => {
  const userId = parseInt(req.params.userId);
  const friendId = parseInt(req.params.friendId);
  const userService = new UserService(db);

  try {
    const data = await userService.removeFriend({ userId, friendId });
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
