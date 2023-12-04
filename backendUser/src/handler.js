
const { nanoid } = require('nanoid');

const skins = require('./skin');
const userResult = require('./user');



// Function to save user result
const addUserResult = (request, response) => {
    const {
      userFeatures,predictedCategory
    } = request.body;
  
    const id = nanoid(8);
    const user = {
        id,
        userFeatures,
        predictedCategory
    };

    // Add the user result to the array
    userResult.push(user);

    // Send a response back to the client
    response.status(201).json({
      status: 'success',
      message: 'User result successfully added',
      data: {
        userId: id,
      },
    });
}


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
