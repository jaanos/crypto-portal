# -*- coding: utf-8 -*-
from flask import *
from database import database
from PIL import Image
from StringIO import StringIO
import json
import random

app = Blueprint('steganography', __name__)

@app.route("/")
def index():
    return "TODO"

@app.route("/colors")
def colors():
    return render_template("steganography.colors.html", nav = "steganography")

@app.route("/images")
@app.route("/images/<int:idx>", methods=['GET', 'POST'])
def images(idx=None):
    db = database.dbcon()
    cur = db.cursor()
    if request.method == 'POST':
        text = request.form["text"] + '\0'
        newname = request.form["newname"]
        try:
            offset = int(request.form["offset"])
        except:
            offset = 0
        cur.execute("SELECT data FROM slika WHERE id = %s", idx)
        r = cur.fetchone()
        inimg = Image.open(StringIO(r[0]))
        data = inimg.tobytes()
        if offset < 0 or offset > len(data) - 7:
            offset = 0
        last = min(len(text), (len(data) - (offset%8))/8)
        stego = [x for x in data]
        for i in range(last):
            o = ord(text[i])
            for j in range(8):
                stego[offset+8*i+j] = chr((ord(data[offset+8*i+j]) & 0xFE) | ((o >> (7-j)) & 1))
        try:
            outimg = Image.frombytes(inimg.mode, inimg.size, ''.join(stego))
            out = StringIO()
            outimg.save(out, format="PNG")
            png = out.getvalue()
            out.close()
            cur.execute("INSERT INTO slika (name, data) VALUES (%s, %s)", (newname, png))
            db.commit()
            return redirect(url_for(".images", idx = cur.lastrowid))
        except:
            text = text[:-1]
            error = True
    else:
        text = ""
        newname = ""
        offset = 0
        error = False
    cur.execute("SELECT id, name, DATE_FORMAT(time, '%e.%c.%Y %H:%i') AS time FROM slika ORDER BY time DESC")
    imgs = cur.fetchall()
    if idx == None and len(imgs) > 0:
        idx = min(x[0] for x in imgs)
    if idx == None:
        r = None
    else:
        cur.execute("SELECT name, data FROM slika WHERE id = %s", idx)
        r = cur.fetchone()
    cur.close()
    if r == None:
        idx, name, data = None, None, ""
    else:
        name, png = r
        img = Image.open(StringIO(png))
        data = img.tobytes()
        if newname == "":
            newname = name + str(random.randrange(1000))
    return render_template("steganography.images.html", idx=idx, name=name,
                    data=''.join("%d" % (ord(x)&1) for x in data), imgs=imgs,
                    text=text, newname=newname, offset=offset, error=error)

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
