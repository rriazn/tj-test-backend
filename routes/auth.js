const express = require('express');
const router = express.Router();
const authController = require('../controllers/authController');
const checkAdmin = require('../middleware/admin-auth');
const checkUser = require('../middleware/user-auth');

router.post('/login', authController.login);

router.get('/', checkUser, authController.auth);

router.get('/admin', checkAdmin, authController.admin);

router.post('/logout', checkUser, authController.logout);

module.exports = router;