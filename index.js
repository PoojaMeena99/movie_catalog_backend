const express = require('express');
const cors = require('cors');
const fs = require('fs');
const app = express();
const port = 3010;

app.use(cors());
app.use(express.json());

app.listen(port, () => {
    console.log(`Server is running on http://localhost:${port}`);
});

// Register API
app.post('/register', (req, res) => {
    const { email, password } = req.body;

    if (!email || !password) {
        return res.status(200).json({ success: false, message: 'Email and password are required' });
    }

    const dataPath = './data.json';

    // Read existing data
    fs.readFile(dataPath, (err, data) => {
        if (err && err.code !== 'ENOENT') {
            return res.status(500).json({ success: false, message: 'An error occurred while reading the file' });
        }

        const existingData = data ? JSON.parse(data) : [];

        // Check if the email already exists
        const emailExists = existingData.some(user => user.email === email);

        if (emailExists) {
            return res.status(200).json({ success: false, message: 'Email already exists' });
        }

        // Add new user data
        const user = { email, password };
        existingData.push(user);

        // Write updated data to file
        fs.writeFile(dataPath, JSON.stringify(existingData, null, 2), (err) => {
            if (err) {
                return res.status(500).json({ success: false, message: 'An error occurred while writing the file' });
            }

            res.status(200).json({ success: true, message: 'User registered successfully' });
        });
    });
});

// Login API
app.post('/login', (req, res) => {
    const { email, password } = req.body;

    if (!email || !password) {
        return res.status(200).json({ success: false, message: 'Email and password are required' });
    }

    const dataPath = './data.json';

    // Read existing data
    fs.readFile(dataPath, (err, data) => {
        if (err) {
            return res.status(500).json({ success: false, message: 'An error occurred while reading the file' });
        }

        const existingData = data ? JSON.parse(data) : [];

        // Check if user exists and password matches
        const user = existingData.find(user => user.email === email && user.password === password);

        if (user) {
            res.status(200).json({ success: true, message: 'Login successful' });
        } else {
            res.status(200).json({ success: false, message: 'Invalid email or password' });
        }
    });
});
