const express = require('express');
const { addUserResult, getUserSkinID,getAllSkinsHandler } = require('./handler'); // Adjust the path
const app = express();
const port = 3000; // Choose a port number

app.use(express.json()); // Middleware to parse JSON requests

// Define routes
app.post('/skin', addUserResult);
app.post('/skin', getAllSkinsHandler);
app.get('/skin/:id', getUserSkinID);

// Start the server
app.listen(port, () => {
    console.log(`Server is running on http://localhost:${port}`);
});
