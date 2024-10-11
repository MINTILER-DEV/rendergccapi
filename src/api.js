const express = require('express');
const bodyParser = require('body-parser');
const fs = require('fs');
const { exec } = require('child_process');
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

// POST endpoint to accept code
app.post('/compile', (req, res) => {
    const code = req.body.code;
    const filename = path.join(cacheDir, 'program.c');  // Save in /cache directory

    // Write the C code to a file
    fs.writeFileSync(filename, code);

    // Compile the C file using GCC, and store the compiled binary in /cache
    exec(`gcc ${filename} -o ${path.join(cacheDir, 'program')} && ${path.join(cacheDir, 'program')}`, (err, stdout, stderr) => {
        if (err) {
            // Send back the compilation errors if any
            return res.status(400).send(stderr);
        }
        // Send back the output of the program
        res.send(stdout);
    });
});

// Start the server
const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}`);
});
