const fileService = require('../services/fileServices');
const fs = require('fs');



exports.getCompetitions = (req, resp) => {
    let data = [];
    fs.readdirSync("./data/competitions").forEach(file => {
        const content = fileService.readJsonSync("competitions/".concat(file));
        data.push(content);
    });
    resp.status(200).send(JSON.stringify(data, null, 2));
}


exports.saveCompetition = (req, resp) => {
    const input = req.body.competition;
    const fileName = 'competitions/competition-'.concat(input.id).concat('.json');
    try {
        fileService.writeJsonSync(fileName, input)
    } catch (err) {
        if (err.code != 'EEXIST') {
            resp.sendStatus(500);
            throw err;
        }
    }
    resp.sendStatus(200);
}

exports.deleteCompetition = (req, resp) => {
    const compID = req.body.id
    const fileName = 'competitions/competition-'.concat(compID).concat('.json');
    try {
        fileService.unlinkSync(fileName);
    } catch(err) {
        resp.sendStatus(500);
        throw err;
    }
    resp.sendStatus(200);
}