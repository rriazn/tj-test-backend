const dbService = require('../services/databaseService');
const { userNames, userNumbers, userKeys } = require('../services/userService');
const crypto = require('crypto');

exports.login = async (req, resp) => {
    const input = req.body;
    let userData = await dbService.getUser(input.user.username);
    if(userData.length == 0) {
        resp.sendStatus(401);
        return;
    }
    if(input.user.passwordHash == userData[0].passwordHash) {
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