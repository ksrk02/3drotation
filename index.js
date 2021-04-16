const express = require("express");
const app = express();
const socketIO = require("socket.io");
const SerialPort = require('serialport');
const port = 3000;
const portName = 'COM7';

app.use(express.static('public'));
app.listen(port)


const serialport = new SerialPort(portName, {
    baudRate: 115200,
    dataBits: 8,
});

const server = createServer(app);
const io = socketIO.listen(server);
io.sockets.on("connection", function(socket) {
    socket.on("disconnect", function() {
        console.log("Disconnected");
    });
});

const Readline = SerialPort.parsers.Readline;
const parser = new Readline();
serialport.pipe(parser);
parser.on('data', function(data) {
    io.sockets.emit("StoC", data);
});