const fileService = require('../services/fileServices');
const dbService = require('../services/databaseService');
const { userKeys, userNames, userNumbers } = require('../services/userService');

exports.saveUser = async (req, resp) => {
    const username = req.body.user.username;
    const pwHash = req.body.user.pwHash;
    const func = req.body.user.function;
    const displayName = req.body.user.displayName;
    const replace = req.body.replace;

    try {
        if(replace) {
            await dbService.replaceUser(username, pwHash, func, displayName);
        } else {
            await dbService.addUser(username, pwHash, func, displayName);
        }
    } catch(err) {
        resp.sendStatus(500);
        throw(err);
    }
    userNumbers.set(username, 0);
    resp.sendStatus(200);
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
}

exports.getUsers = async (req, resp) => {
    let users = [];
    
    try {
        users = await dbService.getAllUsers();
    } catch(err) {
        resp.sendStatus(500);
        throw(err);
    }

    users = users.map(({username, judgefunction, displayName}) => ({
        name: username,
        function: judgefunction,
        displayName: displayName
    }));

    resp.status(200).json(users);
}