const dbService = require('../services/databaseService');
const { userNames, userNumbers, userKeys, userDisplayNames } = require('../services/userService');
const crypto = require('crypto');

exports.login = async (req, resp) => {
    const input = req.body;
    let userData = []
    try {
        userData = await dbService.getUser(input.user.username);
    } catch(err) {
        resp.sendStatus(500);
        throw(err);
    }
    
    if(userData.length == 0) {
        resp.sendStatus(401);
        return;
    }
    if(input.user.passwordHash == userData[0].passwordHash) {
        const token = crypto.randomBytes(32).toString('hex');
        userKeys.set(input.user.username, token);
        userNames.set(token, input.user.username);
        userNumbers.set(input.user.username, userNumbers.get(input.user.username) + 1);
        const displayName = userDisplayNames.get(input.user.username);
        resp.status(200).json({user: {
            username: input.user.username,
            token: userKeys.get(input.user.username),
            displayName: displayName
        }});
    } else {
        resp.sendStatus(401);
    }
}


exports.auth = (req, resp) => {
    const token = req.get('Authorization');
    resp.status(200).json({user: {
            username: userNames.get(token),
            token: token,
            displayName: userDisplayNames.get(userNames.get(token))
    }});
}


exports.admin = (req, resp) => {
    resp.sendStatus(200);
}


exports.logout = (req, resp) => {
    const token = req.get('Authorization');
    const user = userNames.get(token);
    userNumbers.set(user, userNumbers.get(user) - 1);
    if(userNumbers.get(user) === 0) {
        userNames.set(token, null);
        userKeys.set(user, null);
    }
    resp.sendStatus(200);
}