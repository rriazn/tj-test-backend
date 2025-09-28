const fs = require('fs');
const path = require('path');
const dbService = require ('./databaseService')

const userNames = new Map();
const userKeys = new Map();
const userNumbers = new Map();

async function loadUsers() {
    const usernames = await dbService.getAllUsernames();
    console.log(usernames);
    for(const username in usernames) {
        userNumbers.set(username, 0);
    }

    /*
    fs.readFile(path.join(__dirname, '../data/users.json'), 'utf-8', (err, json) => {
        if (err) {
            console.error("error reading ./data/users.json");
            return;
        }
        try {
            const users = JSON.parse(json);
            for (const username in users) {
                userNumbers.set(username, 0);
                userNames.set(username, users[username]); 
            }
        } catch (e) {
            console.error("error setting up user maps", e);
        }
    });*/
}

module.exports = {
    userNames,
    userKeys,
    userNumbers,
    loadUsers
};