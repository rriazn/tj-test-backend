const { userNames } = require('../services/userService');

module.exports = (req, res, next) => {
    const token = req.get('Authorization');
    if(userNames.get(token) === 'admin') {
        next();
    } else {
        res.sendStatus(401);
    }
}