#!/usr/bin/python
# -*- coding: utf-8 -*-
from flask import *
from auth import sesskey, debug
from githook import app as githook_app
from substitution import app as substitution_app
from steganography import app as steganography_app
from alphabet import app as alphabet_app
from timestamp import app as timestamp_app
from password import app as password_app
import os # DODANO ZA POTREBE CLOUD9

app = Flask(__name__)
app.debug = debug
app.register_blueprint(githook_app)
app.register_blueprint(substitution_app, url_prefix = '/substitution')
app.register_blueprint(steganography_app, url_prefix = '/steganography')
app.register_blueprint(alphabet_app, url_prefix = '/alphabet')
app.register_blueprint(timestamp_app, url_prefix = '/timestamp')
app.register_blueprint(password_app, url_prefix='/password')
app.secret_key = sesskey

@app.route("/")
def index():
    return render_template("index.html", nav = "start")

@app.route("/favicon.ico")
def favicon():
    return redirect('static/images/favicon.ico')

if __name__ == '__main__':
    app.run(debug=True) # DODANO ZA POTREBE CLOUD9
