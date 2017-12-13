#!/usr/bin/python
# -*- coding: utf-8 -*-
import base64

from flask import request, redirect, url_for, render_template, Blueprint
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

app = Blueprint('steganography', __name__, static_folder='static')

# Dovoljeni formati
ALLOWED_EXTENSIONS = set(['png', 'jpg', 'jpeg', 'gif'])

@app.route('/')
def index():
    return redirect("steganography/images")

@app.route('/images')
def images():
    return render_template('steganography.images.html')

@app.route("/colors")
def colors():
    return render_template("steganography.colors.html", nav = "steganography")

@app.route("/visual")
def visual():
    return render_template("visual.crypto.html")

# 1. upload
@app.route("/visual", methods=["POST"])
def upload_image():

    file = request.form['file']
    print(file)
    file_like = StringIO(base64.decodestring(decode(file.split(',')[1])))
    image_file = Image.open(file_like)
    image = image_file.convert('1', dither=Image.NONE)  # pretvori v crno-belo

    width, height = image.size

    new_width = 200  # določi novo širino na 200px
    # izračuna novo višino tako, da se ohrani razmerje stranic
    new_height = int(height*(new_width/float(width)))

    image = image.resize((new_width, new_height))

    # poveča dimenzije za fakotr 2
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
    outfile = Image.new("1", outfile1.size)  # transparency maska

    for x in range(outfile1.width):
        for y in range(outfile1.height):
            # prekrij istoloežne piksle obeh slik
            outfile.putpixel((x, y), min(outfile1.getpixel((x, y)),
                                         outfile2.getpixel((x, y))))

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

@app.route("/visual/upload", methods=["POST"])
def upload():
    form = request.form

    upload_key = str(uuid4())  # unikaten ID

    # Ajax ali POST
    is_ajax = False
    if form.get("__ajax", None) == "true":
        is_ajax = True

    for key, value in form.items():
        print(key, "=>", value)

    files = []
    for upload in request.files.getlist("file"):
        if allowed_file(upload.filename):
            files.append(upload)

    if is_ajax:
        return ajax_response(True, upload_key)
    else:
        return redirect(url_for("steganography.visual.upload_complete", uuid=upload_key))


@app.route("/visual/files/<uuid>")
def upload_complete(uuid):
    root = app.static_folder+"/uploads/{}".format(uuid)
    if not os.path.isdir(root):
        return "Error: UUID not found!"

    files = []
    for file in glob.glob("{}/*.*".format(root)):
        fname = file.split(os.sep)[-1]
        files.append(fname)

    return render_template("visual.crypto.html",
                           uuid=uuid,
                           files=files,
                           time=time.time()
                           )


def ajax_response(status, msg):
    status_code = "ok" if status else "error"
    return json.dumps(dict(
        status=status_code,
        msg=msg,
    ))

def allowed_file(filename):
    return '.' in filename and \
           filename.rsplit('.', 1)[1] in ALLOWED_EXTENSIONS
