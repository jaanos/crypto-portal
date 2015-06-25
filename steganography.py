# -*- coding: utf-8 -*-
from flask import *
from database import database
from PIL import Image
from StringIO import StringIO

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

@app.route("/show/<int:idx>")
def show(idx):
    db = database.dbcon()
    cur = db.cursor()
    cur.execute("SELECT width, height, mode, data FROM slika WHERE id = %s", idx)
    r = cur.fetchone()
    cur.close()
    if r == None:
        abort(404)
    width, height, mode, data = r
    img = Image.frombytes(mode, (width, height), data)
    out = StringIO()
    img.save(out, format="PNG")
    contents = out.getvalue()
    out.close()
    response = make_response(contents)
    response.headers['Content-Type'] = 'image/png'
    return response
