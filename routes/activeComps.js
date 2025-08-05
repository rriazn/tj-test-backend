const express = require('express');
const router = express.Router();
const activeCompsController = require('../controllers/activeCompsController');
const checkAdmin = require('../middleware/admin-auth');
const checkUser = require('../middleware/user-auth');

router.post('/set-active-comp', checkAdmin, activeCompsController.setActiveComp);

router.get('/get-active-comp', checkUser, activeCompsController.getActiveComp);

router.get('/stop-active-comp', checkAdmin, activeCompsController.stopActiveComp);

router.post('/set-active-group', checkAdmin, activeCompsController.setActiveGroup);

router.get('/get-active-group', checkUser, activeCompsController.getActiveGroup);

router.get('/get-active-part-id', checkUser, activeCompsController.getActivePartID)

router.get('/next-part', checkAdmin, activeCompsController.nextPart);

router.get('/stop-active-group', checkAdmin, activeCompsController.stopActiveGroup)


 
module.exports = router;

