# -*- coding: utf-8 -*-
from flask import *
from database import database
import random
import json
import re

app = Blueprint('substitution', __name__)

abc = u"ABCČDEFGHIJKLMNOPQRSŠTUVWXYZŽ"

def indices(level):
    db = database.dbcon()
    cur = db.cursor()
    cur.execute("SELECT id FROM substitution WHERE level = %s ORDER BY id",
                [0 if level == 2 else level])
    ids = [x[0] for x in cur.fetchall()]
    cur.close()
    if level == 2:
        random.seed("Random seed:)")
        random.shuffle(ids)
        random.seed()
    return ids

def getText(id):
    db = database.dbcon()
    cur = db.cursor()
    cur.execute("SELECT text FROM substitution WHERE id = %s", [id])
    txt = cur.fetchone()
    cur.close()
    return txt[0].decode("UTF-8")

def crypt(text):
    xyz = [x for x in abc]
    random.shuffle(xyz)
    return ''.join([xyz[abc.index(x)] if x in abc else x for x in text.upper()])

@app.route("/")
def index():
    return redirect('substitution/easy')

@app.route("/<difficulty>")
@app.route("/<difficulty>/<int:idx>")
def play(difficulty, idx=-1):
    if (difficulty == "ready"):
        level = 3
    elif (difficulty == "hard"):
        level = 2
    elif (difficulty == "medium"):
        level = 1
    else:
        level = 0
    texts = indices(level)
    if idx < 0 and level == 3:
        return render_template("substitution.ready.html", num=len(texts))
    if idx < 0 or idx >= len(texts):
        idx = random.randrange(len(texts))
    text = getText(texts[idx])
    if level == 2:
        text = re.sub(r'\s', '', text)
    if level == 3:
        cipher = text
    else:
        cipher = crypt(text)
    return render_template("substitution.play.html",
        nav = "substitution", next = (idx+1) % len(texts),
        difficulty = difficulty, level = level, input = json.dumps(cipher),
        foreign = len(set(['Q', 'W', 'X', 'Y']).intersection(text.upper())) > 0)
    
