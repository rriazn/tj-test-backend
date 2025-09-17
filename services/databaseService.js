import mysql from 'mysql2/promise';
import dotenv from 'dotenv';

dotenv.config();

async function connectDB() {
  try {
    const con = await mysql.createConnection({
      host: process.env.DBHOST,
      user: process.env.DBUSER,
      password: process.env.DBPW,
      database: process.env.DBNAME
    });

    console.log('Connected to MySQL2 database');
    return con;
  } catch (err) {
    console.error('Error connecting to MySQL2:', err);
    process.exit(1); // exit process on error
  }
}


(async () => {
  const db = await connectDB();
  const [rows] = await db.query('SELECT * FROM competitions');
  console.log('Query result:', rows);
})();


exports.getCompetitions = async () => {
    let [comps] = await db.query('SELECT * FROM competitions');
    comps = JSON.stringify(comps);
    comps.array.forEach(async comp => {
        // get all groups
        let [compGroups] = await db.query(`SELECT Name AS title FROM competitionGroups WHERE competiton = ${comp.ID}`);
        compGroups = JSON.stringify(compGroups);

        // get participants for each group
        compGroups.forEach(async group => {
            let [participants] = await db.query(`SELECT firstName, lastName, birthDate, Club AS affilitation
                                                FROM Participants JOIN Participation ON Participants.ID = Participation.Participant
                                                JOIN CompetitionGroup ON Participation.CompetitionGroup = CompetitionGroup.ID
                                                WHERE CompetitionGroup.Name = ${group.name} AND Participation.Competition = ${comp.ID}`);
            participants = JSON.stringify(participants);                                  
            participants.forEach(async parts => {
                let [scores] = await db.query(``)
            });
        });
    });
}