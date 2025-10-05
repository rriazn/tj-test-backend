const fs = require('fs');
const path = require('path');
const dbService = require ('./databaseService')

const userNames = new Map();
const userKeys = new Map();
const userNumbers = new Map();
const userDisplayNames = new Map();

async function loadUsers() {
    const usernames = await dbService.getAllUsernames();
    for(const user of usernames) {
        userNumbers.set(user.username, 0);
        userDisplayNames.set(user.username, user.displayName);
    }
}

module.exports = {
    userNames,
    userKeys,
    userNumbers,
    userDisplayNames,
    loadUsers
};