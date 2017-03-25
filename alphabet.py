# -*- coding: utf-8 -*-
from flask import *

app = Blueprint('alphabet', __name__)

abc = u"abcdefghijklmnopqrstuvwxyz"

@app.route("/")
@app.route("/<selected_alphabet>")
@app.route("/<selected_alphabet>/<mode>")
def index(selected_alphabet = "flags", mode = "easy", level = "easy"):
    return redirect("alphabet/flags/read/easy")

@app.route("/<selected_alphabet>/<mode>/<level>")
def display_excercise(selected_alphabet = "flags", mode = "read", level = "easy"):
    if (selected_alphabet == "flags"):
        return render_template("alphabet.flags.html", 
            nav = "alphabet", mode = mode, level = level)
    else:
        return "Te abecede pa (še) ne poznam!"

