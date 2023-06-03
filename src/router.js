const express = require('express');

const user = require('./user');

const router = express.Router();

router.get('/search/:userId/:query', user.searchFriends);
router.get('/friend/:userId/:friendId', user.addFreindship);
router.get('/unfriend/:userId/:friendId', user.removeFreindship);

module.exports = router;
