const { userNames } = require('../services/userService');

module.exports = (req, res, next) => {
    const token = req.get('Authorization');
    if(userNames[token] !== null) {
        next();
    } else {
        res.sendStatus(401);
    }
}