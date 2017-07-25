# -*- coding: utf-8 -*-
from flask import *
import random
from random import randint

app = Blueprint('alphabet', __name__)

abc = u"abcdefghijklmnopqrstuvwxyz"

words = ["ananas", "banana", "cesta", "dom", "eskim", "figa"]
def select_word(list_words):
    return list_words[randint(0, len(list_words)-1)]

def select_letter(letters):
    return abc[randint(0, len(abc) - 1)]
    
def return_choices(letter):
    numChoices = 4
    choices = random.sample(range(0, len(abc)), numChoices)
    for i in range(0, numChoices):
        choices[i] = abc[choices[i]]
    if letter not in choices:
        choices[0] = letter
        random.shuffle(choices)
    return choices

@app.route("/")
@app.route("/<selected_alphabet>")
@app.route("/<selected_alphabet>/<mode>")
def index(selected_alphabet = "flags", mode = "easy", level = "easy"):
    return redirect("alphabet/flags/read/easy")

@app.route("/<selected_alphabet>/<mode>/<level>")
def display_excercise(selected_alphabet = "flags", mode = "read", level = "easy"):
    if (selected_alphabet == "flags"):
        letter = select_letter(abc)
        return render_template("alphabet.flags.html", 
            nav = "alphabet", mode = mode, level = level, letter = letter,
            choices = return_choices(letter), word=select_word(words),
            alphabet = abc, words = words)
    else:
        return "Te abecede pa (se) ne poznam!"

