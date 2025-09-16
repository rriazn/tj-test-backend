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
