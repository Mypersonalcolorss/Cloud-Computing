const express = require('express');
const fileUpload = require('express-fileupload');
const bodyParser = require('body-parser');
const axios = require('axios');
const { nanoid } = require('nanoid');


const app = express();
const port = 3000; // Change this to your desired port

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));
app.use(fileUpload());

const addUserResult = async (request, response) => {
    try {
        // Assuming 'image' is the key for the file in the request body
        const image = request.files.image;

        // Create form data and append the image
        const formData = new FormData();
        formData.append('image', image.data, { filename: image.name });

        // Make a request to your API to get the predicted category
        const apiResponse = await axios.post('https://skin-utqhuaf4va-et.a.run.app/predict/', formData, {
            headers: {
                ...formData.getHeaders(),
            },
        });

        // Extract the predicted category from the API response
        const predictedCategory = apiResponse.data.predictedCategory;

        const id = nanoid(8);
        const user = {
            id,
            predictedCategory,
            userFeatures: request.body.userFeatures, // Adjust based on your data model
        };

        // Add the user result to the array or handle it as needed
        userResult.push(user);

        // Send a response back to the client
        response.status(201).json({
            status: 'success',
            message: 'User result successfully added',
            data: {
                userId: id,
                predictedCategory,
            },
        });
    } catch (error) {
        console.error('Error making API request:', error);

        // Handle the error and send an appropriate response to the client
        response.status(500).json({
            status: 'error',
            message: 'Internal server error',
        });
    }
};




const getUserSkinID = (request, response) => {
    const { id } = request.params;

    const skin = Object.values(userResult).filter((n) => n.id === id)[0];

    if (skin !== undefined) {
        const category = skins[skin.predictedCategory];

        return response.status(200).json({
            status: 'success',
            data: {
                id : skin.id,
                feature : skin.userFeatures,
                category : category,
            },
        });
    }

    return response.status(404).json({
        status: 'fail',
        message: 'User tidak ditemukan',
    });
};

const getSkincare = (request, response) => {  
    const { id } = request.params;

    const skin = Object.values(userResult).filter((n) => n.id === id)[0];

    if (skin !== undefined) {
        const category = skins[skin.predictedCategory];

        return response.status(200).json({
            status: 'success',
            data: {
                id : skin.id,
                feature : skin.userFeatures,
                category : category,
            },
        });
    }

    return response.status(404).json({
        status: 'fail',
        message: 'User tidak ditemukan',
    });
}



module.exports = {
    addUserResult, // Corrected export name
    getUserSkinID,
};
