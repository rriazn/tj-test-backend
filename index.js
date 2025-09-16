const express = require('express');
const { mkdir } = require('fs');
const cors = require('cors');

const userService = require('./services/userService');
const competitionsRoutes = require('./routes/competitions');
const usersRoutes = require('./routes/users');
const activeCompRoutes = require('./routes/activeComps');
const dbService = require('./services/databaseService');

const app = express();

app.use(cors());
app.use(express.json());

app.use('/competitions', competitionsRoutes);
app.use('/users', usersRoutes);
app.use('/activeComps', activeCompRoutes);

mkdir('./data/competitions', { recursive: true }, (err) => {
    if(err) {
        throw(err);
    }
});



// set up map with tokens for users and logged in clients per user
userService.loadUsers();

app.listen(3000, () => console.log('Server running on http://localhost:3000'));


