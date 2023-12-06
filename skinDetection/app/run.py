from fastapi import FastAPI, UploadFile, File
from PIL import Image
import io
import numpy as np

from tensorflow.keras.models import load_model
from tensorflow.keras.preprocessing import image
from tensorflow.keras.applications.mobilenet_v2 import preprocess_input

# Load the saved model
def load_ml_model():
    return load_model('model_v1d2_checkp.h5')  # Update with your actual model filename

app = FastAPI()
model = load_ml_model()

@app.post("/predict/")
async def predict(file: UploadFile = File(...)):
    # Read the image file
    img_data = await file.read()
    img = Image.open(io.BytesIO(img_data))

    # Preprocess the image
    img = img.resize((150, 150))
    img_array = image.img_to_array(img)
    img_array = np.expand_dims(img_array, axis=0)
    img_array = preprocess_input(img_array)

    # Make a prediction
    predictions = model.predict(img_array)
    predicted_class = np.argmax(predictions)

    # Return the prediction
    return {"predicted_class": int(predicted_class)}
