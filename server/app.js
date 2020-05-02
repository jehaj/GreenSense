const path = require('path');
const express = require('express');
const app = express();
// const server = require('http').Server(app);
// const io = require('socket.io')(server)
const sqlite3 = require('sqlite3').verbose();
const SerialPort = require('serialport');
const moment = require('moment');

const hostname = 'localhost';
const port = 3000;

const formidable = require('formidable');
const fs = require('fs');

// følgende linje hvis brug af socket io
// server.listen(port, () => console.log(`GreenSense app listening at http://${hostname}:${port}`));
app.listen(port, () => console.log(`GreenSense app listening at http://${hostname}:${port}`));

app.get('/', (req, res) => res.sendFile(path.join(__dirname, 'index.html')));
app.get('/myprofile', (req, res) => res.sendFile(path.join(__dirname, 'profile.html')));
app.get('/contact', (req, res) => res.sendFile(path.join(__dirname, 'contact.html')));
app.get('/buy', (req, res) => res.sendFile(path.join(__dirname, 'buy.html')));

app.get('/client.js', (req, res) => res.sendFile(path.join(__dirname, 'client.js')));

app.get('/img/logo.png', (req, res) => res.sendFile(path.join(__dirname, 'img', 'logo.png')));

app.get('/img/picture-*.jpg', (req, res) => res.sendFile(path.join(__dirname, req.url.replace(req.baseUrl + "/", ""))));
app.get('/img/userpicture.jpg', (req, res) => res.sendFile(path.join(__dirname, 'img', 'userpicture.jpg')));

app.get('/database', (req, res) => {
    let responseJSON;

    let sql = 'SELECT * from GreenSense;'
    db.all(sql, (err, rows) => {
        if (err) {
            return console.error(err);
        }
        res.json(JSON.stringify(rows));
    })
});

// vand plante
app.post('/waterplant', (req, res) => {
    console.log('Planten vandes nu...');
    res.send('Succes');
});

// Gør det muligt for brugeren at uploade et billede af sin plante
app.post('/myprofile/uploadnewpicture', function (req, res) {
    var form = new formidable.IncomingForm();
    form.parse(req, function (err, fields, file) {
        var oldpath = file['files[]']['path'];
        var newpath = path.join(__dirname, 'img', 'userpicture.jpg');
        fs.rename(oldpath, newpath, function (err) {
            if (err) throw err;
            console.log('Billedet er ændret.');
            res.send('File uploaded and moved!');
        });
    });
});

const usbPath = 'COM4';
const Readline = require('@serialport/parser-readline');
const usbPort = new SerialPort(usbPath, { baudRate: 9600 });

const parser = new Readline();
usbPort.pipe(parser);

let db = new sqlite3.Database('./arduinoData.db', (err) => {
    if (err) {
        console.error(err.message);
    }
    console.log('Connected to my database.');
});

parser.on('data', function (line) {
    // push new data to database
    console.log(line);
    let dataSplit = line.split(';');
    let timestamp = moment().unix();
    let temperature = dataSplit[0].split('=')[1];
    let humidity = dataSplit[1].split('=')[1];
    let photocellValue = dataSplit[2].split('=')[1];
    let values = [timestamp, temperature, humidity, photocellValue];
    let placeholder = values.join(', ');
    let sql = "INSERT INTO GreenSense (Timestamp, Temperature, Humidity, Lightsensitivity) VALUES (" + placeholder + ");";

    db.run(sql, (err) => {
        if (err) {
            return console.error(err.message);
        }
        console.log('Added data to database.');
    });
});

process.on('SIGINT', () => {
    console.log("Closing...");
    db.close((err) => {
        if (err) {
            console.error(err.message);
        }
        console.log('Disconnected from database.');
        process.exit();
    })
});