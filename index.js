const express = require('express');
const { close, readFile, mkdir, open } = require('fs');
const cors = require('cors');
const crypto = require('crypto');
const fs = require('fs');

const app = express();

app.use(cors());
app.use(express.json());


app.post('/login', (req, resp) => {
    const input = req.body;
    readFile('./users.json', 'utf-8', (err, json) => {
        if(err) {
            resp.status(500).send('Server Error');
        }
        try {
            const auth = JSON.parse(json)[input.user.username];
            if(auth == null) {
                resp.status(401).json({
                    username: null,
                    token: null
                });
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
                resp.status(401).json({
                    username: null,
                    token: null
                });
            }
        } catch (e) {
            resp.status(500).send('Invalid JSON');
        }       
    })
});

app.get('/auth', (req, resp) => {
    const token = req.get('Authorization');
    if(userNames[token] != null) {
        resp.status(200).json({user: {
            username: userNames[token],
            token: token
        }})
        
    } else {
        resp.sendStatus(401);
    }
});

app.get('/admin', (req, resp) => {
    const token = req.get('Authorization');
    if(userNames[token] == "admin") {
        
        resp.sendStatus(200);
    } else {
        resp.sendStatus(401);
    }
});

app.get('/logout', (req, resp) => {
    const token = req.get('Authorization');
    const user = userNames[token];
    if(user != null) {
        userNumbers[user] -= 1;
        if(userNumbers[user] === 0) {
            userNames[token] = null;
            userKeys[user] = null;
        }
        resp.sendStatus(200);
    } else {
        resp.sendStatus(401);
    }
});




// saving competition data


app.post('/save-competition', async (req, resp) => {
    const token = req.get('Authorization');
    if(userNames[token] == "admin") {
        const input = req.body;
        const fileName = input.competition.name.toLowerCase().replace(' ', '-').concat('.json');
        console.log(fileName);
        open(fileName, 'wx', (err, fd) => {
            if(err) {
                if(err.code != 'EEXIST') {
                    throw err;
                }
            }
            try {
                console.log(fileName);
            } finally {
                close(fd, (err) => {
                    if (err) throw err;
                });
            }
        })
        resp.sendStatus(200);
    } else {
        resp.sendStatus(401);
    }
});





// set up map with tokens for users and logged in clients per user
const userNames = new Map();
const userKeys = new Map();
const userNumbers = new Map();

readFile('./users.json', 'utf-8', (err, json) => {
    if(err) {
        console.error("error reading ./users.json");
    }
    try {
        const users = JSON.parse(json);
        for (const username in users) {
            userNumbers[username] = 0;
        }
    } catch (e) {
        console.error("error setting up key map");
    } 
});


// ensure competitions file exists

mkdir('./competitions', { recursive: true }, (err) => {
    if(err) {
        throw(err);
    }
});


app.listen(3000, () => console.log('Server running on http://localhost:3000'));
