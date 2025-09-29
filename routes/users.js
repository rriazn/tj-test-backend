const express = require('express');
const router = express.Router();
const usersController = require('../controllers/usersController');
const checkAdmin = require('../middleware/admin-auth');

router.post('/', checkAdmin, usersController.addUser);

router.delete('/:username', checkAdmin, usersController.removeUser);

router.get('/', checkAdmin, usersController.getUsers);

module.exports = router;