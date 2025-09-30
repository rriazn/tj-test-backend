const fs = require('fs');
const path = require('path');
const dbService = require ('./databaseService')

const userNames = new Map();
const userKeys = new Map();
const userNumbers = new Map();

async function loadUsers() {
    const usernames = await dbService.getAllUsernames();
    for(const username in usernames) {
        userNumbers.set(username, 0);
    }
}

module.exports = {
    userNames,
    userKeys,
    userNumbers,
    loadUsers
};