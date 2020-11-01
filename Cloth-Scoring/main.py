import os
from flask import Flask, request, jsonify
from werkzeug.utils import secure_filename


from mlcode import compare_dresses_clear, compare_dresses_masked


app = Flask(__name__)

@app.route("/for_clear", methods=["POST"])
def upload_clear():
    if request.method == 'POST':
        f1 = request.files.get('img1')
        f2 = request.files.get('img2')
        if f2 is None or f1 is None:
        	return "No Image Uploaded!!!"

        name1 = "img/" + secure_filename(f1.filename)
        f1.save(name1)
        name2 = "img/" + secure_filename(f2.filename)
        f2.save(name2)
        score = float(compare_dresses_clear(name1, name2))
        return jsonify({"score" : score})

@app.route("/for_mask",  methods=["POST"])
def upload_unclear():
    if request.method == 'POST':
        f1 = request.files.get('img1')
        f2 = request.files.get('img2')
        if f2 is None or f1 is None:
        	return "No Image Uploaded!!!"

        name1 = "img/" + secure_filename(f1.filename)
        f1.save(name1)
        name2 = "img/" + secure_filename(f2.filename)
        f2.save(name2)
        score = float(compare_dresses_masked(name1, name2))
        return jsonify({"score" : score})
