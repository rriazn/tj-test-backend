const fileService = require('../services/fileServices');



let activeComp = null;
let activeGroupID = -1;
let activePartID = -1;

exports.setActiveComp = (req, resp) => {
    const compID = req.body.id;
    const fileName = 'competitions/competition-'.concat(compID).concat('.json');
    fileService.readJson(fileName, (err, json) => {
        if(err) {
            resp.sendStatus(500);
        } else {
            try {
                activeComp = JSON.parse(json);
                activeGroupID = -1;
                activePartID = -1;
                resp.sendStatus(200);
            } catch(err) {
                console.error(err);
                resp.sendStatus(500);
            }
        }
    });
}

exports.getActiveComp = (req, resp) => {
    if(activeComp != null) {
        resp.status(200).json(activeComp);
    } else {
        resp.sendStatus(401);
    }
}

exports.stopActiveComp = (req, resp) => {
    if(activeComp != null) {
        activeComp = null;
        activeGroupID = -1;
        activePartID = -1;
        resp.sendStatus(200);
    } else {
        resp.sendStatus(401);
    }
}

exports.setActiveGroup = (req, resp) => {
    if(activeComp != null) {
        activeGroupID = req.body.id;
        activePartID = 0;
        resp.sendStatus(200);
    } else {
        resp.sendStatus(401);
    }
}

exports.getActiveGroup = (req, resp) => {
    if(activeComp != null && activeGroupID != -1) {
        resp.status(200).json(activeComp.groups[activeGroupID]);
    } else {
        resp.sendStatus(401);
    }
}

exports.getActivePartID = (req, resp) => {
    if(activeComp != null && activeGroupID != -1) {
        resp.status(200).json(activePartID);
    } else {
        resp.sendStatus(401);
    }
}

exports.nextPart = (req, resp) => {
    if(activeComp != null && activeGroupID != -1) {
        if(activePartID < activeComp.groups[activeGroupID].length - 1) {
            activePartID++;
            resp.sendStatus(200);
        } else {
            resp.sendStatus(401);
        }
    } else {
        resp.sendStatus(401);
    }
}

exports.stopActiveGroup = (req, resp) => {
    if(activeComp != null && activeGroupID != -1) {
        activeGroupID = -1;
        activePartID = -1;
        resp.sendStatus(200);
    } else {
        resp.sendStatus(401);
    }
}

