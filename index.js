const express = require('express');
const { readdir, writeFileSync, unlinkSync, readFile, mkdir, open } = require('fs');
const cors = require('cors');
const crypto = require('crypto');
const fs = require('fs');

const app = express();

app.use(cors());
app.use(express.json());


//login and authentication

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




// competition setup data



app.get('/get-competitions', (req, res) => {
    const token = req.get('Authorization');
    let data = [];
    if(userNames[token] == 'admin') {
        fs.readdirSync("./competitions").forEach(file => {
            const content = fs.readFileSync("./competitions/".concat(file), 'utf-8');
            try {
                const json = JSON.parse(content);
                data.push(json);
            } catch (err) {
                console.error(`Could not parse JSON in file ${file}:`, err);
            }
        });

        res.status(200).send(JSON.stringify(data, null, 2));
    } else {
        resp.sendStatus(401);
    }
});

app.post('/delete-competition', (req, resp) => {
    const token = req.get('Authorization');
    if(userNames[token] == 'admin') {
        const input = req.body.id
        const fileName = 'competition-'.concat(input).concat('.json');
        try {
            unlinkSync('./competitions/'.concat(fileName));
        } catch(err) {
            resp.sendStatus(500);
            throw err;
        }
        resp.sendStatus(200);
    } else {
        resp.sendStatus(401);
    }
});


app.post('/save-competition', (req, resp) => {
    const token = req.get('Authorization');
    if(userNames[token] == 'admin') {
        const input = req.body.competition;
        const fileName = 'competition-'.concat(input.id).concat('.json');
        try {
            writeFileSync('./competitions/'.concat(fileName), JSON.stringify(input, null, 2));
        } catch (err) {
            if (err.code != 'EEXIST') {
                resp.sendStatus(500);
                throw err;
            }
        }
        resp.sendStatus(200);
    } else {
        resp.sendStatus(401);
    }
});


//competition execution data

activeCompID = null;

app.post('/set-active-comp', (req, resp) => {
    const token = req.get('Authorization');
    if(userNames[token] == 'admin') {
        activeCompID = req.body.id;
        
        resp.sendStatus(200);
    } else {
        resp.sendStatus(401);
    }
});


app.get('/get-active-comp', (req, resp) => {
    const token = req.get('Authorization');
    if(userNames[token] != null && activeCompID != null) {
        const path = './competitions/competition-'.concat(activeCompID).concat('.json');
        readFile(path, 'utf-8', (err, json) => {
            if(err) {
                resp.sendStatus(500);
            }
            try {
                const compData = JSON.parse(json);
                resp.status(200).json(compData);
            } catch(err) {
                console.error(err);
                resp.sendStatus(500);
            }
        });
    } else {
        resp.sendStatus(401);
    }
})

app.get('/stop-active-comp', (req, resp) => {
    const token = req.get('Authorization');
    if(userNames[token] == 'admin') {
        activeCompID = null;
        resp.sendStatus(200);
    } else {
        resp.sendStatus(401);
    }
});

// group execution

activeGroup = null;

app.post('/set-active-group', (req, resp) => {
    const token = req.get('Authorization');
    if(userNames[token] == 'admin') {
        activeGroup = req.body.group;
        resp.sendStatus(200);
    } else {
        resp.sendStatus(401);
    }
});

app.get('/get-active-group', (req, resp) => {
    const token = req.get('Authorization');
    if(userNames[token] != null && activeGroup != null) {
        resp.status(200).json(activeGroup);
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
