const path = require('path');
const express = require('express');
const app = express();
// const server = require('http').Server(app);
// const io = require('socket.io')(server)
// const sqlite3 = require('sqlite3').verbose();
// const SerialPort = reequire('serialport');
// const moment = require('moment');
const hostname = 'localhost';
const port = 3000;

// følgende linje hvis brug af socket io
// server.listen(port, () => console.log(`GreenSense app listening at http://${hostname}:${port}`));
app.listen(port, () => console.log(`GreenSense app listening at http://${hostname}:${port}`));

app.get('/', (req, res) => res.sendFile(path.join(__dirname, 'template.html')));

app.get('/minprofil', (req, res) => res.sendFile(path.join(__dirname, 'profil-template.html')));

app.get('/logo.png', (req, res) => res.sendFile(path.join(__dirname, 'logo.png')));
