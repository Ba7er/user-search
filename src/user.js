const { search } = require('./user-service');

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
  return {};
};
const removeFreindship = async (req, res) => {
  return {};
};

module.exports = {
  searchFriends,
  addFreindship,
  removeFreindship,
};
