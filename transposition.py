# -*- coding: utf-8 -*-
from flask import *
from database import database
from datetime import datetime, tzinfo
import random
import json
import re
import hashlib

try:
    basestring
    decode = lambda x: x.decode("utf-8")
except NameError:
    decode = lambda x: x

app = Blueprint('transposition', __name__)

@app.route('/')
def index():
    return redirect('transposition/play')

@app.route('/play')
def play():
    return render_template("transposition.play.html")

@app.route('/description')
def description():
    return render_template("transposition.description.html")
