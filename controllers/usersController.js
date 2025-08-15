const fileService = require('../services/fileServices');
const { loadUsers, userNames, userNumbers, userKeys } = require('../services/userService');
const crypto = require('crypto');

exports.login = (req, resp) => {
    const input = req.body;
    fileService.readJson('users.json', (err, json) => {
        if(err) {
            console.error(err);
            resp.sendStatus(500);
        } else {
            try {
                const auth = JSON.parse(json)[input.user.username];
                if(auth == null) {
                    resp.sendStatus(401);
                    return;
                }
            
                if (input.user.passwordHash === auth.pwHash) {
                    const token = crypto.randomBytes(32).toString('hex');
                    userKeys[input.user.username] = token;
                    userNames[token] = input.user.username;
                    userNumbers[input.user.username] += 1;
                    resp.status(200).json({user: {
                        username: input.user.username,
                        token: userKeys[input.user.username]
                    }});
                } else {
                    resp.sendStatus(401);
                }
            } catch (e) {
                console.error(e);
                resp.sendStatus(500);
            } 
        }      
    });
}


exports.auth = (req, resp) => {
    const token = req.get('Authorization');
    resp.status(200).json({user: {
            username: userNames[token],
            token: token
    }});
}


exports.admin = (req, resp) => {
    resp.sendStatus(200);
}


exports.logout = (req, resp) => {
    const token = req.get('Authorization');
    const user = userNames[token];
    userNumbers[user] -= 1;
    if(userNumbers[user] === 0) {
        userNames[token] = null;
        userKeys[user] = null;
    }
    resp.sendStatus(200);
}

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
    const username = req.body.username;
    // tryLock
    fileService.readJson('users.json', (json, err) => {
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