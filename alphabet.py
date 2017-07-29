# -*- coding: utf-8 -*-
from flask import *
import random
from random import randint
import os
from database import database

app = Blueprint('alphabet', __name__)

abc = u"abcdefghijklmnopqrstuvwxyz"

# get words from database
def get_all_words():
    db = database.dbcon()
    cur = db.cursor()
    cur.execute("SELECT Word FROM Words")
    return [row[0] for row in cur]
words = get_all_words()

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

def alphabet_exists(alphabet):
    return os.path.isdir("static/images/" + alphabet)

@app.route("/")
@app.route("/<selected_alphabet>/")
def index(selected_alphabet = "flags", mode = "easy", level = "easy"):
    #print(os.path.isdir("static/images/flags"))
    # check if folder with images exists
    if (alphabet_exists(selected_alphabet)):
        return render_template("alphabet.flags.html", nav = "alphabet", alphabet = abc, intro = "1")
    else:
        return "Te abecede pa (se) ne poznam!"


@app.route("/<selected_alphabet>/<mode>/")
def redirect_to_intro(selected_alphabet = "flags", mode = "read"):
    return redirect("alphabet/" + selected_alphabet)

@app.route("/<selected_alphabet>/<mode>/<level>/")
def display_excercise(selected_alphabet = "flags", mode = "read", level = "easy"):
    if (alphabet_exists(selected_alphabet)):
        letter = select_letter(abc)
        return render_template("alphabet.flags.html", intro = "0",
            nav = "alphabet", mode = mode, level = level, letter = letter,
            choices = return_choices(letter), word=select_word(words),
            alphabet = abc, words = words)
    else:
        return "Te abecede pa (se) ne poznam!"

