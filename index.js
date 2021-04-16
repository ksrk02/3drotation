const express = require('express');
const app = express();
const server = require('http').Server(app);
const io = require('socket.io')(server);
const SerialPort = require('serialport');
const port = 3000;
const portName = 'COM3';

app.use(express.static('public'));

server.listen(port, function() {
    console.log('Port:', port, 'Connected');
});


const serialport = new SerialPort(portName, {
    baudRate: 115200,
    dataBits: 8,
});

const Readline = SerialPort.parsers.Readline;
const parser = new Readline();
serialport.pipe(parser);

parser.on('data', function(data) {
    io.emit("StoC", data);
    //console.log(data);
});

io.on('connection', function(socket) {
    socket.on('disconnect', function() {
        console.log('Disconnected');
    });
});