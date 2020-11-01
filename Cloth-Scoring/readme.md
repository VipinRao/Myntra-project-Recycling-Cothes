# Cloth Scoring API
Flask API for calculating similarity scores between two items of clothing

## Setup
1. Install the requirements in `requirements.txt` using:
   ```
   $ pip install -r requirements.txt
   ``` 
2. Download the segmentation model from [this](https://drive.google.com/file/d/1l7PUB8uAGRyqvZ0ti0ZACoI2CzJxOVoI/view?usp=sharing) link. Save in the current directory as `save_ckp_frozen.h5`
3. To Run the flask web app, first set the environment variable as:
   ```
   $ export FLASK_APP=main
   ```
   Then, run the flask app using:
   ```
   $ flask run
   ```
   The server is now running at `http://localhost:5000` (URL)

## Usage
_Endpoints:_
- `/for_clear`
  Get score for images with clear background (taken at testing centers)
  method: `POST`
  params:
  - `img1`: first image
  - `img2`: second image

  returns:
  - JSON object: `score`: similarity score

  example:
  - Python:
  ```python
  import requests
  response = requests.post(
			   f"{URL}/for_clear", 
			   files={
				  "img1": open("dress.jpg", "rb"),
  				  "img2": open("dress_soiled.jpg", "rb")
			   })
  print(response.json())
  ```

- `/for_mask`
  Get score for images taken by user, which are needed to be segmented from background using masking
  method : `POST`
  params:
  - `img1`: first image
  - `img2`: second image

  returns:
  - JSON object: `score`: similarity score

  example:
  - Python:
  ```python
  import requests
  response = requests.post(
			   f"{URL}/for_mask",
			   files={
				  "img1": open("dress.jpg", "rb"),
				  "img2": open("dress_solied.jpg", "rb")
			   })
  print(response.json())
  ```
