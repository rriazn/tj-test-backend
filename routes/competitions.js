const express = require('express');
const router = express.Router();
const competitionsController = require('../controllers/competitionsController');
const checkAdmin = require('../middleware/admin-auth');


router.get('/', checkAdmin, competitionsController.getCompetitions);

router.post('/', checkAdmin, competitionsController.saveCompetition);

router.delete('/:id', checkAdmin, competitionsController.deleteCompetition);

module.exports = router