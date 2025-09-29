const fileService = require('../services/fileServices');
const dbService = require('../services/databaseService');
const { loadUsers } = require('../services/userService');

exports.addUser = (req, resp) => {
    const username = req.body.user.username;
    const pwHash = req.body.user.pwHash;
    const func = req.body.user.function;
    // tryLock
    fileService.readJson('users.json', (err, json) => {
        if(err) {
            // unlock
            console.error(err);
            resp.sendStatus(500);
        } else {
            try {
                let data = JSON.parse(json);
                data[username] = {
                    "pwHash": pwHash,
                    "function": func
                };
                fileService.writeJson('users.json', data, (err) => {
                    // update User Maps
                    loadUsers();
                    // unlock
                    if(err) {
                        console.error(err);
                        resp.sendStatus(500);
                    }
                    resp.sendStatus(200);
                });
            } catch(e) {
                // unlock
                console.error(e);
                resp.sendStatus(500);
            }
        }
    });

}

exports.removeUser = (req, resp) => {
    const username = req.params.username;
    // tryLock
    fileService.readJson('users.json', (err, json) => {
        if(err) {
            // unlock
            console.error(err);
            resp.sendStatus(500);
        } else {
            try {
                let data = JSON.parse(json);
                delete data[username];
                fileService.writeJson(data, 'users.json', (err) => {
                    // update User Maps
                    loadUsers();
                    // unlock
                    if(err) {
                        console.error(err);
                        resp.sendStatus(500);
                    }
                    resp.sendStatus(200);
                });
            } catch(e) {
                // unlock
                console.error(e);
                resp.sendStatus(500);
            }
        }
    })
}

exports.getUsers = (req, resp) => {
    fileService.readJson('users.json', (err, json) => {
        if(err) {
            console.error(err);
            resp.sendStatus(500);
        } else {
            let data = JSON.parse(json);
            data = Object.entries(data).map(([key, value]) => ({
                name: key,
                function: value.function
            }));
            
            resp.status(200).json(data);
        }
    });
}