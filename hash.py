#!/usr/bin/python
# -*- coding: utf-8 -*-
from flask import redirect, render_template, Blueprint

app = Blueprint('hash', __name__)

@app.route('/')
def index():
    return render_template('hash.description.html')

@app.route('/examples')
def examples():
    return render_template('hash.examples.html')
