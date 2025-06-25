const express = require('express');
const { readFile, writeFile } = require('fs');
const cors = require('cors');
const crypto = require('crypto');

const app = express();

app.use(cors());
app.use(express.json());


const sessionKey = crypto.randomBytes(32).toString('hex');

app.post('/login', (req, resp) => {
    const input = req.body;
    console.log(input);
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
                resp.status(200).json({
                    user: input.user.username,
                    token: sessionKey
                });
            } else {
                resp.status(401).json({
                    user: null,
                    sessionKey: null
                });
            }
        } catch (e) {
            resp.status(500).send('Invalid JSON');
        }       
    })
});

app.get('/auth', (req, resp) => {
    const token = req.get('Authorization');
    if(token == sessionKey) {
        resp.sendStatus(200);
        
    } else {
        resp.sendStatus(401);
    }
});

app.listen(3000, () => console.log('Server running on http://localhost:3000'));
