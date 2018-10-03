const child_process = require('child_process');

const clients_count = process.argv[2];
for(let i = 0; i<clients_count; i++) {
    child_process.exec('node  client-files.js D:/cwp-03/ D:/lab3/', 
    	(error, stdout, stderr) => {
        if (error) {
            console.error(`exec error: ${error}`);
        }
        console.log(`stdout: ${stdout}`);
    });
}