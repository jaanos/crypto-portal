#!/usr/bin/python
# -*- coding: utf-8 -*-

from flask import request, redirect, url_for, render_template, Blueprint
import base64
import json
import glob
import time
from uuid import uuid4
import random
from PIL import Image
import os

try:
    from StringIO import StringIO
    decode = unicode.decode
    b64enc = lambda x: x.getvalue().encode("base64")
except ImportError:
    from io import BytesIO as StringIO
    decode = lambda x: bytes(x, "UTF-8")
    b64enc = lambda x: base64.encodestring(x.getvalue()).decode()

app = Blueprint('visual', __name__, static_folder='static')

# Dovoljeni formati
ALLOWED_EXTENSIONS = set(['png', 'jpg', 'jpeg', 'gif'])

@app.route('/')
def index():
    return render_template("visual.crypto.html")

# 1. upload
@app.route("/image", methods=["POST"])
def image():
    file = request.form['file']
    file_like = StringIO(base64.decodestring(decode(file.split(',')[1])))
    image_file = Image.open(file_like)
    image = image_file.convert('1', dither=Image.NONE)  # pretvori v crno-belo
    file_like.close()

    width, height = image.size

    new_width = 200  # določi novo širino na 200px
    # izračuna novo višino tako, da se ohrani razmerje stranic
    new_height = int(height*(new_width/float(width)))

    image = image.resize((new_width, new_height))

    # poveča dimenzije za faktor 2
    outfile1 = Image.new("1", [dimension * 2 for dimension in
                               image.size])  # transparency maska
    outfile2 = Image.new("1", [dimension * 2 for dimension in image.size])

    """width, height = image.size
    new_width = 400
    new_height = int(image.height * (new_width / image.width))
    image = image.resize((new_width, new_height))

    outfile1 = Image.new("1", image.size)          
    outfile2 = Image.new("1", image.size)"""

    # GENERIRAJ DELNI SLIKI (ŠUM)

    for x in range(0, new_width):
        for y in range(0, new_height):
            source_px = image.getpixel((x, y))
            assert source_px in (0, 255)
            flip = random.random()  # naključno obarva piksel črno ali belo

            if source_px == 0:  # če je source piksel črne barve
                if flip < .5:  # verjetnost 0.5
                    outfile1.putpixel((x * 2, y * 2),
                                      source_px)  # začni s črno
                    outfile1.putpixel((x * 2 + 1, y * 2), 1 - source_px)
                    outfile1.putpixel((x * 2, y * 2 + 1), 1 - source_px)
                    outfile1.putpixel((x * 2 + 1, y * 2 + 1), source_px)

                    outfile2.putpixel((x * 2, y * 2),
                                      1 - source_px)  # ker je source piksel črn, je položaj na drugi delni sliki ravno obraten
                    outfile2.putpixel((x * 2 + 1, y * 2), source_px)
                    outfile2.putpixel((x * 2, y * 2 + 1), source_px)
                    outfile2.putpixel((x * 2 + 1, y * 2 + 1), 1 - source_px)

                else:  # verjetnost 0.5
                    outfile1.putpixel((x * 2, y * 2),
                                      1 - source_px)  # začni z belo
                    outfile1.putpixel((x * 2 + 1, y * 2), source_px)
                    outfile1.putpixel((x * 2, y * 2 + 1), source_px)
                    outfile1.putpixel((x * 2 + 1, y * 2 + 1), 1 - source_px)

                    outfile2.putpixel((x * 2, y * 2),
                                      source_px)  # na drugi delni sliki ravno obratno
                    outfile2.putpixel((x * 2 + 1, y * 2), 1 - source_px)
                    outfile2.putpixel((x * 2, y * 2 + 1), 1 - source_px)
                    outfile2.putpixel((x * 2 + 1, y * 2 + 1), source_px)

            elif source_px == 255:  # če je source piksel bele barve
                if flip < .5:  # verjetnost 0.5
                    outfile1.putpixel((x * 2, y * 2),
                                      source_px)  # začni z belo
                    outfile1.putpixel((x * 2 + 1, y * 2), 1 - source_px)
                    outfile1.putpixel((x * 2, y * 2 + 1), 1 - source_px)
                    outfile1.putpixel((x * 2 + 1, y * 2 + 1), source_px)

                    outfile2.putpixel((x * 2, y * 2),
                                      source_px)  # ker je source piksel bel, je položaj na drugi delni sliki enak
                    outfile2.putpixel((x * 2 + 1, y * 2), 1 - source_px)
                    outfile2.putpixel((x * 2, y * 2 + 1), 1 - source_px)
                    outfile2.putpixel((x * 2 + 1, y * 2 + 1), source_px)
                else:
                    outfile1.putpixel((x * 2, y * 2),
                                      1 - source_px)  # začni s črno
                    outfile1.putpixel((x * 2 + 1, y * 2), source_px)
                    outfile1.putpixel((x * 2, y * 2 + 1), source_px)
                    outfile1.putpixel((x * 2 + 1, y * 2 + 1), 1 - source_px)

                    outfile2.putpixel((x * 2, y * 2),
                                      1 - source_px)  # ravno obratno
                    outfile2.putpixel((x * 2 + 1, y * 2), source_px)
                    outfile2.putpixel((x * 2, y * 2 + 1), source_px)
                    outfile2.putpixel((x * 2 + 1, y * 2 + 1), 1 - source_px)

    # outfile1.save(target + '/out1.png')  # prvo delno sliko shrani kot out1.png
    # outfile2.save(target + '/out2.png')  # drugo delno sliko shrani kot out2.png

    # PREKRIVANJE SLIK
    outfile = merge(outfile1, outfile2)

    # outfile.save(target + '/result.png')  # shrani kot result.png
    output = StringIO()
    outfile.save(output, "PNG")
    result = b64enc(output)
    output.close()

    output = StringIO()
    outfile1.save(output, "PNG")
    out1 = b64enc(output)
    output.close()

    output = StringIO()
    outfile2.save(output, "PNG")
    out2 = b64enc(output)
    output.close()
    return json.dumps({'result': result, 'out1': out1, 'out2': out2})

# 2. upload

@app.route("/noise", methods=["POST"])
def noise():
    file1 = StringIO(base64.decodestring(decode(request.form["img1"].split(',')[1])))
    file2 = StringIO(base64.decodestring(decode(request.form["img2"].split(',')[1])))
    image1 = Image.open(file1).convert('1', dither=Image.NONE)
    image2 = Image.open(file2).convert('1', dither=Image.NONE)
    outfile = merge(image1, image2)
    file1.close()
    file2.close()

    output = StringIO()
    outfile.save(output, "PNG")
    out = b64enc(output)
    output.close()

    return json.dumps({"result": out})

def merge(file1, file2):
    outfile = Image.new("1", file1.size)  # transparency maska

    w, h = file1.size
    for x in range(w):
        for y in range(h):
            # prekrij istoležne piksle obeh slik
            outfile.putpixel((x, y), min(file1.getpixel((x, y)),
                                         file2.getpixel((x, y))))

    return outfile

def allowed_file(filename):
    return '.' in filename and \
           filename.rsplit('.', 1)[1] in ALLOWED_EXTENSIONS
