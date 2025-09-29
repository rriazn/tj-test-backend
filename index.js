const express = require('express');
const { mkdir } = require('fs');
const cors = require('cors');

const userService = require('./services/userService');
const competitionsRoutes = require('./routes/competitions');
const usersRoutes = require('./routes/users');
const authRoutes = require('./routes/auth');
const activeCompRoutes = require('./routes/activeComps');
const dbService = require('./services/databaseService');

const app = express();

app.use(cors());
app.use(express.json());

app.use('/competitions', competitionsRoutes);
app.use('/users', usersRoutes);
app.use('/auth', authRoutes);
app.use('/activeComps', activeCompRoutes);

mkdir('./data/competitions', { recursive: true }, (err) => {
    if(err) {
        throw(err);
    }
});

async function main() {
    await dbService.connectDB();       
    await userService.loadUsers();           

    app.listen(3000, () => {
        console.log('Server running on http://localhost:3000');
    });
}


main().catch(err => {
    console.error("Startup failed:", err);
});


