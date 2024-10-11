const express = require('express');
const bodyParser = require('body-parser');
const fs = require('fs');
const { exec, spawn } = require('child_process');
const path = require('path');
const cors = require('cors'); // Import the cors package

const app = express();
app.use(cors()); // Enable CORS for all routes
app.use(bodyParser.json());

// Ensure the /cache directory exists
const cacheDir = path.join(__dirname, 'cache');
if (!fs.existsSync(cacheDir)) {
    fs.mkdirSync(cacheDir);
}

let currentProcess;

// POST endpoint to accept code
app.post('/compile', (req, res) => {
    const code = req.body.code;
    const filename = path.join(cacheDir, 'program.c');  // Save in /cache directory

    // Write the C code to a file
    fs.writeFileSync(filename, code);

    // Compile the C file using GCC, and store the compiled binary in /cache
    exec(`gcc ${filename} -o ${path.join(cacheDir, 'program')}`, (err, stdout, stderr) => {
        if (err) {
            // Send back the compilation errors if any
            return res.status(400).send(stderr);
        }

        // Start the compiled program but don't send input yet
        currentProcess = spawn(path.join(cacheDir, 'program'));

        // Capture the program output
        let output = '';
        currentProcess.stdout.on('data', (data) => {
            output += data.toString();
        });

        currentProcess.on('close', () => {
            res.send(output); // Send the initial output
        });
    });
});

// POST endpoint to handle input during program execution
app.post('/execute', (req, res) => {
    const input = req.body.input;

    if (currentProcess) {
        // Send input to the running process
        currentProcess.stdin.write(input + '\n');

        // Capture the response from the program
        let output = '';
        currentProcess.stdout.on('data', (data) => {
            output += data.toString();
        });

        currentProcess.on('close', () => {
            res.send(output);
        });
    } else {
        res.status(400).send('No process running.');
    }
});

// Start the server
const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}`);
});
