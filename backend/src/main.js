const express = require('express');
const multer = require('multer');
const axios = require('axios');
const FormData = require('form-data');
const produks = require('./produks');
const skins = require('./skins');
const admin = require('firebase-admin');
const serviceAccount = require('./serviceAccountKeys.json'); // Import your serviceAccountKey.json file

// Initialize Firebase Admin SDK with your service account key
admin.initializeApp({
  credential: admin.credential.cert(serviceAccount),
});

const db = admin.firestore();

// Initialize Express app
const app = express();
app.use(express.json()); // Middleware to parse JSON bodies

const storage = multer.memoryStorage();
const upload = multer({ storage: storage });


app.get('/getUserImage/:id', async (req, res) => {
    try {
        const userId = req.params.id;
        
        // Reference to the user document in Firestore
        const userRef = admin.firestore().collection('User').doc(userId);

        // Get the user document from Firestore
        const userDoc = await userRef.get();

        if (!userDoc.exists) {
            return res.status(404).send('User not found');
        }

        // Get predictedCategory from the user document
        const predictedCategory = userDoc.data().predictedCategory;

        // Retrieve the image URLs based on the predictedCategory from the produks module
        const imageUrls = produks[predictedCategory.toString()];

        if (!imageUrls || imageUrls.length === 0) {
            return res.status(404).send('Image not found for the given user features');
        }

        // Instead of fetching images, send the URLs as a JSON response
        res.json({ images: imageUrls });
    } catch (error) {
        console.error(error);
        res.status(500).send('Error fetching image URLs');
    }
});

let users = []; // Initialize an empty array for users

app.post('/addUserData', (req, res) => {
    const { id, userFeatures, predictedCategory } = req.body;

    // Check if the user with the given ID already exists
    const existingUser = users.find(user => user.id === id);
    if (existingUser) {
        return res.status(400).json({ message: 'User with this ID already exists' });
    }

    // Create a new user object
    const newUser = { id, predictedCategory };

    // Add the new user to the array
    users.push(newUser);

    // Send a response with the newly added user
    res.status(201).json({
        message: 'User data added successfully',
        data: newUser
    });
});

app.post('/detectskin/:id', upload.single('file'), async (req, res) => {
    try {
        const userId = req.params.id;
        
        // Prepare the file to send in the POST request using FormData
        const formData = new FormData();
        formData.append('file', req.file.buffer, req.file.originalname);

        const url = 'https://skin-utqhuaf4va-et.a.run.app/predict/';

        // Send the file using Axios
        const response = await axios.post(url, formData, {
            headers: {
                ...formData.getHeaders(),
            },
        });

        // Assuming response.data is an object with a key 'predicted_class'
        const predictedCategory = response.data.predicted_class;
        
        // Convert the predicted category to a number if it's a string representation of a number
        const numericCategory = Number(predictedCategory);

        // Reference to the user document in Firestore
        const userRef = db.collection('User').doc(userId);

        // Check if the user document exists before updating
        const userDoc = await userRef.get();

        if (userDoc.exists) {
            // Update the 'predictedCategory' field with the numeric value
            await userRef.update({
                predictedCategory: numericCategory
            });

            res.status(200).send(numericCategory.toString()); // Send back just the number as a string
        } else {
            // Handle the case where the user document doesn't exist
            res.status(404).send('User not found');
        }
    } catch (error) {
        console.error(error);
        res.status(500).send('Internal Server Error');
    }
});



app.get('/getSkinResult/:id', async (req, res) => {
    try {
        const userId = req.params.id;
        
        // Reference to the user document in Firestore
        const userRef = admin.firestore().collection('User').doc(userId);

        // Get the user document from Firestore
        const userDoc = await userRef.get();

        if (!userDoc.exists) {
            return res.status(404).send('User not found');
        }

        // Get predictedCategory from the user document
        const predictedCategory = userDoc.data().predictedCategory;

        // Retrieve the skin type explanation based on the predictedCategory from the skins module
        const skinExplanation = skins[predictedCategory]; // Ensure that predictedCategory is a number

        if (!skinExplanation) {
            return res.status(404).send('Skin explanation not found for the given category');
        }

        // Send the skin type explanation as a JSON response
        res.json({ skinType: skinExplanation });
    } catch (error) {
        console.error(error);
        res.status(500).send('Error fetching skin type explanation');
    }
});

// ... Rest of your server code ...

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
    console.log(`Server running on http://localhost:${PORT}`);
});

