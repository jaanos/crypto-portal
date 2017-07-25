# -*- coding: utf-8 -*-
from flask import *
from database import database
from datetime import datetime, tzinfo
import random
import json
import re
import hashlib

app = Blueprint('substitution', __name__)

abc = u"ABCČDEFGHIJKLMNOPQRSŠTUVWXYZŽ"

foreign = {'sl': set(['Q', 'W', 'X', 'Y']),
           'en': set([u'Č', u'Š', u'Ž'])}

level_trans = {2: 0, -1: 1}

def indices(level, language=None):
    db = database.dbcon()
    cur = db.cursor()
    if language == None:
        cur.execute("SELECT id FROM substitution WHERE level = %s ORDER BY id",
                    [level_trans.get(level, level)])
    else:
        cur.execute("SELECT id FROM substitution WHERE level = %s AND language = %s ORDER BY id",
                    [level_trans.get(level, level), language])
    ids = [x[0] for x in cur.fetchall()]
    cur.close()
    if level in level_trans:
        random.seed("Random seed:)%d" % level)
        random.shuffle(ids)
        random.seed()
    return ids

def getText(id):
    db = database.dbcon()
    cur = db.cursor()
    cur.execute("SELECT text, language FROM substitution WHERE id = %s", [id])
    txt = cur.fetchone()
    cur.close()
    return (txt[0].decode("UTF-8"), txt[1])

def crypt(text, level):
    xyz = [x for x in abc]
    if level < 0:
        r = random.randrange(len(xyz))
        xyz = xyz[r:] + xyz[:r]
    else:
        random.shuffle(xyz)
    return ''.join([xyz[abc.index(x)] if x in abc else x for x in text.upper()])

@app.route("/")
def index():
    return redirect('substitution/easy')

@app.route("/<difficulty>")
@app.route("/<difficulty>/<int:idx>")
@app.route("/<difficulty>/<language>/<int:idx>")
@app.route("/<difficulty>/<language>")
def play(difficulty, idx=-1, language=None):
    if (difficulty == "ready"):
        level = 3
    elif (difficulty == "hard"):
        level = 2
    elif (difficulty == "medium"):
        level = 1
    elif (difficulty == "caesar"):
        level = -1
    else:
        level = 0
    texts = indices(level, language)
    if idx < 0 and level == 3:
        return render_template("substitution.ready.html", num=len(texts))
    if idx < 0 or idx >= len(texts):
        idx = random.randrange(len(texts))
    text, lang = getText(texts[idx])
    if level in [-1, 2]:
        text = re.sub(r'\s', '', text)
    if level == 3:
        cipher = text
    else:
        cipher = crypt(text, level)

    text_hash = hashlib.md5(text.upper().encode('utf-8')).hexdigest()
    return render_template(
        "substitution.play.html", nav="substitution",
        next=(idx+1) % len(texts), lang=lang, difficulty=difficulty,
        level=level, input=json.dumps(cipher), text_hash=text_hash,
        foreign=len(foreign[lang].intersection(text.upper())) > 0
    )

@app.route("/leaderboard_insert", methods=['POST'])
def leaderboard_insert():
    name = request.form['name']
    time = int(request.form['time_solved'])
    print time
    time_solved = datetime.utcfromtimestamp(time)
    print time_solved
    difficulty = request.form['difficulty']

    db = database.dbcon()
    cur = db.cursor()
    query = 'INSERT INTO crypto_leaderboard (name, difficulty, time_solved) VALUES (%s, %s, %s)'
    cur.execute(query, (name, difficulty, time_solved))
    cur.execute('COMMIT')
    cur.close()
    return json.dumps({'status': 'OK'})

@app.route("/leaderboard")
def leaderboard():
    db = database.dbcon()
    cur = db.cursor()
    query = 'SELECT * FROM crypto_leaderboard'
    cur.execute(query)
    users = [[x[1], x[2], x[3].strftime('%H:%M:%S')] for x in cur.fetchall()]
    return render_template("substitution.leaderboard.html", users=users)
