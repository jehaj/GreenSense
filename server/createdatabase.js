// should try to create the database if it already exists
const fs = require('fs');

const path = './arduinoData.db';
if (fs.existsSync(path)) {
    console.log('The database already exists. Exiting...')
    process.exit();
}

// create the database if it doesnt exist (checked above)
const sqlite3 = require('sqlite3').verbose();

let db = new sqlite3.Database('./arduinoData.db', (err) => {
    if (err) {
        return console.error(err.message);
    }
    console.log('Created new database.');
});

let sql = `CREATE TABLE "GreenSense" (
            "Timestamp"	INTEGER,
            "Temperature"	REAL,
            "Humidity"	REAL,
            "Waterlevel"	REAL,
            "Lightsensitivity"	REAL,
            "Moisture"  REAL
);`

db.run(sql, (err) => {
    if (err) {
        return console.error(err);
    }
    console.log('Succesfully created database and added table with columns.');
});

db.close();