const express = require('express');
const router = express.Router();
const usersController = require('../controllers/usersController');
const checkAdmin = require('../middleware/admin-auth');
const checkUser = require('../middleware/user-auth');

router.post('/login', usersController.login);

router.get('/auth', checkUser, usersController.auth);

router.get('/admin', checkAdmin, usersController.admin);

router.get('/logout', checkUser, usersController.logout);

module.exports = router;