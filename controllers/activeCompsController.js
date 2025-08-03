const fileService = require('../services/fileServices');



let activeCompID = null;
let activeGroup = null;

exports.setActiveComp = (req, resp) => {
    activeCompID = req.body.id;
    activeGroup = null;
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
    activeCompID = null;
    activeGroup = null;
    resp.sendStatus(200);
}

exports.setActiveGroup = (req, resp) => {
    activeGroup = req.body.group;
    resp.sendStatus(200);
}

exports.getActiveGroup = (req, resp) => {
    resp.status(200).json(activeGroup);
}