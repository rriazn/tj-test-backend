const express = require('express');
const router = express.Router();
const competitionsController = require('../controllers/competitionsController');
const checkAdmin = require('../middleware/admin-auth');


router.get('/get-competitions', checkAdmin, competitionsController.getCompetitions);

router.post('/save-competition', checkAdmin, competitionsController.saveCompetition);

router.post('/delete-competition', checkAdmin, competitionsController.deleteCompetition);

module.exports = router