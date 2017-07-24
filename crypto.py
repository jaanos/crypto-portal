#!/usr/bin/python
# -*- coding: utf-8 -*-
from datetime import datetime, tzinfo
from flask import *
from auth import sesskey, debug
from githook import app as githook_app
from substitution import app as substitution_app
from steganography import app as steganography_app
from database import database

app = Flask(__name__)
app.debug = debug
app.register_blueprint(githook_app)
app.register_blueprint(substitution_app, url_prefix = '/substitution')
app.register_blueprint(steganography_app, url_prefix = '/steganography')
app.secret_key = sesskey

@app.route("/")
def index():
    return render_template("start.html", nav = "start")

@app.route("/favicon.ico")
def favicon():
    return redirect('static/favicon.ico')

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

@app.route("/leaderboard_get")
def leaderboard_get():
    db = database.dbcon()
    cur = db.cursor()
    query = 'SELECT * FROM crypto_leaderboard'
    cur.execute(query)
    users = [[x[1], x[2], x[3].strftime('%H:%M:%S')] for x in cur.fetchall()]
    return render_template("leaderboard.html", users=users)


if __name__ == '__main__':
    app.run(host= '0.0.0.0', debug=True)
