#!/usr/bin/python
# -*- coding: utf-8 -*-
from flask import redirect, render_template, Blueprint

app = Blueprint('steganography', __name__, static_folder='static')

@app.route('/')
def index():
    return redirect("steganography/images")

@app.route('/images')
def images():
    return render_template('steganography.images.html')

@app.route("/colors")
def colors():
    return render_template("steganography.colors.html", nav = "steganography")
