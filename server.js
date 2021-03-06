// server.js
const net = require('net');
require('dotenv').config();
const fs = require('fs');
const path = require('path');
const port = 8003;
let seed = 0;
const DIR = process.env.DEFAULT_DIR;
const MAX_CONNECTIONS = parseInt(process.env.MAX_CONNECTIONS);
let connections = 0;

const server = net.createServer((client) => {
    client.setEncoding('utf8');
    client.id = Date.now() +"_seed"+ ++seed;
    client.logger = fs.createWriteStream(`client${client.id}.txt`);
    client.dir = DIR+client.id+path.sep;
    connections++;
        if(connections > MAX_CONNECTIONS){
            console.log("----Too mach users----");
            send_response(client, 'DEC');
            client.destroy();
            connections--;
        }
        
    client.on('data', (data)=>{
        writeLog(client, 'Client:'+data);
        if(data === 'FILES') {
            fs.mkdir(client.dir, ()=>{});
            send_response(client, 'ACK');
        }else if(data == 'EXIT') {
            send_response(client, 'DEC');
        }else{
            write_file(client, data);
            send_response(client, 'Wait next file...');
        }
    });
    client.on('end', () => {
        connections--;
        writeLog(client, `Client №${client.id} disconnected`);
    });
});

server.listen(port, () => {
    console.log(`Server listening on localhost:${port}`);
    console.log('======================================');
});

function write_file(client, data) {
     let parts = data.split('FILE');
     let file = fs.createWriteStream(client.dir+parts[1]);
     file.write(parts[0]);
     file.close();
}

function send_response(client, message){
    writeLog(client, 'You: ' + message);
    client.write(message);
}

function writeLog(client, message){
    client.logger.write(message+'\n');
    console.log( message);
}