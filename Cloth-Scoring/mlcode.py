import cv2
import numpy as np
from keras.models import load_model
import tensorflow as tf
import sys
from imageio import imread
from skimage.transform import resize

saved = load_model("save_ckp_frozen.h5")

class fashion_tools(object):

    def __init__(self,imageid,model,version=1.1):
        self.imageid = imageid
        self.model   = model
        self.version = version

    def get_dress(self,stack=False):
        """limited to top wear and full body dresses (wild and studio working)"""
        """takes input rgb----> return PNG"""
        name =  self.imageid
        file = cv2.imread(name)
        file = tf.image.resize_with_pad(file,target_height=512,target_width=512)
        rgb  = file.numpy()
        file = np.expand_dims(file,axis=0)/ 255.
        seq = self.model.predict(file)
        seq = seq[3][0,:,:,0]
        seq = np.expand_dims(seq,axis=-1)
        c1x = rgb*seq
        c2x = rgb*(1-seq)
        cfx = c1x+c2x
        dummy = np.ones((rgb.shape[0],rgb.shape[1],1))
        rgbx = np.concatenate((rgb,dummy*255),axis=-1)
        rgbs = np.concatenate((cfx,seq*255.),axis=-1)
        if stack:
            stacked = np.hstack((rgbx,rgbs))
            return stacked
        else:
            return rgbs


    def get_patch(self):
        return None


def mask_image(img, mask):
    """
    Returns masked image for a given `img` and its `mask`
    """
    img = resize(img, (512, 512))
    segd = np.zeros(img.shape)
    segd = img[:,:,:]
    for i in range(3):
        segd[:,:,i] *= mask
    return segd

from keras.applications import MobileNetV2
import matplotlib.pyplot as plt
import keras.layers as L
from keras.models import Model

# embedding model
base_model = MobileNetV2(include_top=False, weights="imagenet")
x = L.GlobalAveragePooling2D()(base_model.output)
model = Model(base_model.input, x)

def get_embedding(image_name, mask):
    """
    Returns image embedding
    """
    image = imread(image_name)
    image = mask_image(image, mask)

    x = model.predict(image.reshape(1, *image.shape))
    x_flat = np.ravel(x)

    return x_flat

def get_similarity(v1, v2):
    """
    Returns cosine similarity
    """
    return v1.dot(v2) / (np.linalg.norm(v1) * np.linalg.norm(v2))

def compare_dresses_clear(d1, d2):
    """
    Returns similarity between two dresses (clear photos) with image file names `d1` and `d2`
    """
    image1 = imread(d1)
    v1 = model.predict(image1.reshape(1, *image1.shape))
    v1 = np.ravel(v1)

    image2 = imread(d2)
    v2 = model.predict(image2.reshape(1, *image2.shape))
    v2 = np.ravel(v2)

    similarityscore = get_similarity(v1, v2)

    return similarityscore

def compare_dresses_masked(d1, d2):
    """
    Returns similarity between two dresses (unclear photos) with image file names `d1` and `d2`
    """
    api1 = fashion_tools(d1, saved)
    image1 = api1.get_dress(False)
    mask1 = np.round(image1[:,:,3]/255)


    api2 = fashion_tools(d2, saved)
    image2 = api2.get_dress(False)
    mask2 = np.round(image2[:,:,3]/255)


    v1 = get_embedding(d1, mask1)
    v2 = get_embedding(d2, mask2)

    similarityscore = get_similarity(v1, v2)

    return similarityscore
