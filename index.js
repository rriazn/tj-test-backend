const express = require('express');
const { readFile, writeFile } = require('fs');
const cors = require('cors');
const crypto = require('crypto');

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
            const hash = crypto.createHash('sha256');
            hash.update(input.user.password);
            const hashedPassword = hash.digest('hex');
            if (hashedPassword === auth.pwHash) {
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


// set up map with tokens for users
const userNames = new Map();
const userKeys = new Map()
readFile('./users.json', 'utf-8', (err, json) => {
    if(err) {
        console.error("error reading ./users.json");
    }
    try {
        const users = JSON.parse(json);
        for (const username in users) {
            const key = crypto.randomBytes(32).toString('hex');
            userNames[key] = username;
            userKeys[username] = key;
        }
    } catch (e) {
        console.error("error setting up key map");
    } 
});
app.listen(3000, () => console.log('Server running on http://localhost:3000'));
