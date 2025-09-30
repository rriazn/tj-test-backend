dotenv = require('dotenv');
mysql = require('mysql2/promise');

dotenv.config();

let db = null;

exports.connectDB = async () => {
  try {
    const con = await mysql.createConnection({
      host: process.env.DBHOST,
      user: process.env.DBUSER,
      password: process.env.DBPW,
      database: process.env.DBNAME
    });

    console.log('Connected to MySQL2 database');
    db = con;
    return con;
  } catch (err) {
    console.error('Error connecting to MySQL2:', err);
    process.exit(1);
  }
}

exports.getAllUsernames = async () => {
  const [usernames] = await db.query('SELECT username \
                                      FROM judges');
  const values = usernames.map(obj => obj.username);
  return values;
}

exports.getAllUsers = async () => {
  const [values] = await db.query('SELECT username, judgefunction \
                                  FROM judges');
  return values;
}

exports.getUser = async (username) => {
  const [user] = await db.query("SELECT * \
                                FROM judges \
                                WHERE username = ?",
    [username]);
  return user;
}

exports.getAdmin = async () => {
  return this.getUser('admin');
}

exports.addUser = async (username, pwHash, func) => {
  await db.query("INSERT INTO judges (username, passwordhash, judgefunction) \
                  VALUES (?, ?, ?)",
     [username, pwHash, func]);
}

exports.replaceUser = async(username, pwHash, func) => {
  await db.query("UPDATE judges \
                  SET passwordHash = ?, judgeFunction = ? \
                  WHERE username = ?",
      [pwHash, func, username]);
}

exports.deleteUser = async (username) => {
  await db.query("DELETE FROM judges \
                  WHERE username = ?", 
                  [username]);
}