const fileService = require('../services/fileServices');



let activeCompID = null;
let activeGroup = null;
let activePartIndex = null;

exports.setActiveComp = (req, resp) => {
    activeCompID = req.body.id;
    activeGroup = null;
    activePartIndex = null;
    resp.sendStatus(200);
}

exports.getActiveComp = (req, resp) => {
    if(activeCompID != null) {
        const fileName = 'competitions/competition-'.concat(activeCompID).concat('.json');
        fileService.readJson(fileName, (err, json) => {
            if(err) {
                resp.sendStatus(500);
            } else {
                try {
                    const compData = JSON.parse(json);
                    resp.status(200).json(compData);
                } catch(err) {
                    console.error(err);
                    resp.sendStatus(500);
                }
            }
            
        });
    } else {
        resp.sendStatus(401);
    }
}

exports.stopActiveComp = (req, resp) => {
    if(activeCompID != null) {
        activeCompID = null;
        activeGroup = null;
        activePartIndex = null;
        resp.sendStatus(200);
    } else {
        resp.sendStatus(401);
    }
}

exports.setActiveGroup = (req, resp) => {
    if(activeCompID != null) {
        activeGroup = req.body.group;
        activePartIndex = 0;
        resp.sendStatus(200);
    } else {
        resp.sendStatus(401);
    }
}

exports.getActiveGroup = (req, resp) => {
    if(activeCompID != null && activeGroup != null) {
        resp.status(200).json(activeGroup);
    } else {
        resp.sendStatus(401);
    }
}

exports.nextPart = (req, resp) => {
    if(activeCompID != null && activeGroup != null) {
        activePartIndex++;
        resp.sendStatus(200);
    } else {
        resp.sendStatus(401);
    }
}

exports.stopActiveGroup = (req, resp) => {
    if(activeCompID != null && activeGroup != null) {
        activeGroup = null;
        activePartIndex = null;
        resp.sendStatus(200);
    } else {
        resp.sendStatus(401);
    }
}

