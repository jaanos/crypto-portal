# -*- coding: utf-8 -*-
from flask import *
from auth import database
from PIL import Image

app = Blueprint('steganography', __name__)

@app.route("/")
def index():
    return "TODO"

@app.route("/colors")
def colors():
    return render_template("steganography.colors.html", nav = "steganography")

@app.route("/images")
@app.route("/images/<int:idx>")
def images(idx=1):
    db = database.dbcon()
    cur = db.cursor()
    cur.close()
    return render_template("steganography.images.html")
    
def img2data(img):
    pa = img.pixel_access()
    return ''.join([''.join([''.join([chr(pa[i, j][k])
                                        for k in range(img.bands)])
                                for j in range(img.size[1])])
                    for i in range(img.size[0])])

def data2img(data, width, height, bands, mode):
    img = Image.new(mode, (width, height))
    pa = img.getdata().pixel_access()
    k = 0
    for i in range(width):
        for j in range(height):
            pa[i, j] = tuple(ord(x) for x in data[k:k+bands])
            k += bands
    return img
