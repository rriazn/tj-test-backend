const fileService = require('../services/fileServices');
const dbService = require('../services/databaseService');
const { userKeys, userNames, userNumbers } = require('../services/userService');

exports.saveUser = async (req, resp) => {
    const username = req.body.user.username;
    const pwHash = req.body.user.pwHash;
    const func = req.body.user.function;
    const replace = req.body.replace;

    try {
        if(replace) {
            await dbService.replaceUser(username, pwHash, func);
        } else {
            await dbService.addUser(username, pwHash, func);
        }
    } catch(err) {
        resp.sendStatus(500);
        throw(err);
    }
    userNumbers.set(username, 0);
    resp.sendStatus(200);
    

    /*
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

    */

}


exports.removeUser = async (req, resp) => {
    const username = req.params.username;

    try {
        await dbService.deleteUser(username);
    } catch(err) {
        resp.sendStatus(500);
        throw(err);
    }     
    userNumbers.delete(username);
    const key = userKeys[username];
    userKeys.delete(username);
    userNames.delete(key);
    resp.sendStatus(200);



    /*
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
    })*/
}

exports.getUsers = async (req, resp) => {
    let users = [];
    
    try {
        users = await dbService.getAllUsers();
    } catch(err) {
        resp.sendStatus(500);
        throw(err);
    }

    users = users.map(({username, judgefunction}) => ({
        name: username,
        function: judgefunction
    }))

    resp.status(200).json(users);

    /*
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
    });*/
}