# -*- coding: utf-8 -*-
from flask import *
import random
from random import randint
from database import database

app = Blueprint('alphabet', __name__)

available_alphabets = ["flags","sign","greek"]

words = None

# get words from database
def get_all_words():
    db = database.dbcon()
    cur = db.cursor()
    cur.execute("SELECT Word FROM Words")
    row = cur.fetchone()
    
    listOfWords = ""
    max = 0
    while row is not None:
        if(len(row[0]) > max):
            max = len(row[0])
        if listOfWords != "":
            listOfWords += ","
        listOfWords += (row[0])
        row = cur.fetchone()
    
    #print(max)
    return listOfWords

# get alphabet from database
def getValidLetters(selectedAlphabet):
    db = database.dbcon()
    cur = db.cursor()
    cur.execute("SELECT alphabet FROM alphabet WHERE name = %s", [selectedAlphabet])
    alphabet = cur.fetchone()[0]
    return alphabet

def getIntro(selectedAlphabet):
    db = database.dbcon()
    cur = db.cursor()
    cur.execute("SELECT intro FROM alphabet WHERE name = %s", [selectedAlphabet])
    introText = cur.fetchone()[0]
    return introText
    
def select_word(list_words):
    return list_words[randint(0, len(list_words)-1)]

def select_letter(abc):
    return abc[randint(0, len(abc) - 1)]
    
def return_choices(letter, abc):
    numChoices = 4
    choices = random.sample(range(0, len(abc)), numChoices)
    for i in range(0, numChoices):
        choices[i] = abc[choices[i]]
    if letter not in choices:
        choices[0] = letter
        random.shuffle(choices)
    return choices

def alphabet_exists(alphabet):
    return alphabet in available_alphabets

@app.route("/")
@app.route("/<selected_alphabet>/")
def index(selected_alphabet = "flags", mode = "easy", level = "easy"):
    # check if folder with images exists
    if (alphabet_exists(selected_alphabet)):
        abc = getValidLetters(selected_alphabet)
        if(selected_alphabet=="flags"): return render_template("alphabet.flags.html", nav = "alphabet", alphabet = abc, intro = "1")
        else: return render_template("alphabet.generic.html", nav = "alphabet", alphabet = abc, intro = "1", introText = getIntro(selected_alphabet), alphabetForLearning=selected_alphabet)
    else:
        return "Te abecede pa (se) ne poznam!"

@app.route("/flags")
def flags(selected_alphabet = "flags", mode = "easy", level = "easy"):
    # check if folder with images exists
    if (alphabet_exists(selected_alphabet)):
        return render_template("alphabet.flags.html", nav = "alphabet", alphabet = getValidLetters(selected_alphabet), intro = "1")
    else:
        return "Te abecede pa (se) ne poznam!"
        
@app.route("/sign")
def sign(selected_alphabet = "sign", mode = "easy", level = "easy"):
    # check if folder with images exists
    if (alphabet_exists(selected_alphabet)):
        return render_template("alphabet.generic.html", nav = "alphabet", alphabet = getValidLetters(selected_alphabet), intro = "1",introText = getIntro(selected_alphabet), alphabetForLearning="sign")
    else:
        return "Te abecede pa (se) ne poznam!"

@app.route("/greek")
def greek(selected_alphabet = "greek", mode = "easy", level = "easy"):
    # check if folder with images exists
    if (alphabet_exists(selected_alphabet)):
        return render_template("alphabet.generic.html", nav = "alphabet", alphabet = getValidLetters(selected_alphabet), intro = "1",introText = getIntro(selected_alphabet), alphabetForLearning="greek")
    else:
        return "Te abecede pa (se) ne poznam!"


@app.route("/<selected_alphabet>/<mode>/")
def redirect_to_intro(selected_alphabet = "flags", mode = "read"):
    return redirect("alphabet/" + selected_alphabet)

@app.route("/<selected_alphabet>/<mode>/<level>/")
def display_excercise(selected_alphabet = "flags", mode = "read", level = "easy"):
    if words is None:
        words = get_all_words()
    if (alphabet_exists(selected_alphabet)):
        abc = getValidLetters(selected_alphabet)
        letter = select_letter(abc)
        if(selected_alphabet == "flags"):
            return render_template("alphabet.flags.html", intro = "0",
            nav = "alphabet", mode = mode, level = level, letter = letter,
            choices = return_choices(letter, abc), word=select_word(words),
            alphabet = abc, words = words, alphabetForLearning=selected_alphabet )
        else : 
            return render_template("alphabet.generic.html", intro = "0",
            nav = "alphabet", mode = mode, level = level, letter = letter,
            choices = return_choices(letter, abc), word=select_word(words),
            alphabet = abc, words = words, alphabetForLearning=selected_alphabet )
    else:
        return "Te abecede pa (se) ne poznam!"
