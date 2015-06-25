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
    cur.execute("SELECT id, name, DATE_FORMAT(time, '%e.%c.%Y %H:%i') AS time FROM slika ORDER BY time DESC")
    imgs = cur.fetchall()
    cur.execute("SELECT name FROM slika WHERE id = %s", idx)
    r = cur.fetchone()
    if r == None:
        idx, name = None, None
    else:
        name = r[0]
    cur.close()
    return render_template("steganography.images.html", idx=idx, name=name, imgs=imgs)

@app.route("/show/<int:idx>")
def show(idx):
    db = database.dbcon()
    cur = db.cursor()
    cur.execute("SELECT data FROM slika WHERE id = %s", idx)
    r = cur.fetchone()
    cur.close()
    if r == None:
        abort(404)
    response = make_response(r[0])
    response.headers['Content-Type'] = 'image/png'
    return response
