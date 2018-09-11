#!/usr/bin/python
# -*- coding: utf-8 -*-
from flask import render_template,redirect, Flask
from auth import sesskey, debug
from githook import app as githook_app
from substitution import app as substitution_app
from steganography import app as steganography_app
from visual import app as visual_app
from alphabet import app as alphabet_app
from timestamp import app as timestamp_app
from password import app as password_app
import os # DODANO ZA POTREBE CLOUD9
from flask_babel import Babel, _

app = Flask(__name__)

babel = Babel(app)
@babel.localeselector
def get_locale():
    # return request.accept_languages.best_match(app.config['LANGUAGES'])
    return 'en'

app.debug = debug
app.register_blueprint(githook_app)
app.register_blueprint(substitution_app, url_prefix = '/substitution')
app.register_blueprint(steganography_app, url_prefix = '/steganography')
app.register_blueprint(visual_app, url_prefix = '/visual')
app.register_blueprint(alphabet_app, url_prefix = '/alphabet')
app.register_blueprint(timestamp_app, url_prefix = '/timestamp')
app.register_blueprint(password_app, url_prefix='/password')
app.secret_key = sesskey

app.config['MAX_CONTENT_LENGTH'] = 1024 * 1024   # limit 1 MB

@app.route("/")
def index():
    return render_template("index.html", nav = "start")

@app.route("/favicon.ico")
def favicon():
    return redirect('static/images/favicon.ico')
@app.route("/greek")
@app.route("/alphabet/greek")
def greek(selected_alphabet = "greek", mode = "easy", level = "easy"):
    # check if folder with images exists
    return render_template("alphabet.generic.html", nav = "alphabet", alphabet = {'a','b','d','z'}, intro = "1",introText = " Grški alfabet (po prvih dveh črkah alfa, beta) je nabor črk, ki ga uporablja grška pisava."
    +" Grki so jo verjetno prevzeli od Feničanov že v 8. stoletju pr.n.št., pisava pa je vplivala tudi na razvoj latinice in cirilice.", alphabetForLearning="greek")
    #if (alphabet_exists(selected_alphabet)):
    #    return render_template("alphabet.generic.html", nav = "alphabet", alphabet = getValidLetters(selected_alphabet), intro = "1",introText = getIntro(selected_alphabet), alphabetForLearning="greek")
    #else:
     #   return "Te abecede pa (se) ne poznam!"

@app.route("/alphabet/flags")
def flag(selected_alphabet = "greek", mode = "easy", level = "easy"):
    # check if folder with images exists
    return render_template("alphabet.generic.html", nav = "alphabet", alphabet = {'a','b','d','z'}, intro = "1",introText = " Grški alfabet (po prvih dveh črkah alfa, beta) je nabor črk, ki ga uporablja grška pisava."
    +" Grki so jo verjetno prevzeli od Feničanov že v 8. stoletju pr.n.št., pisava pa je vplivala tudi na razvoj latinice in cirilice.", alphabetForLearning="flags")
    #if (alphabet_exists(selected_alphabet)):
    #    return render_template("alphabet.generic.html", nav = "alphabet", alphabet = getValidLetters(selected_alphabet), intro = "1",introText = getIntro(selected_alphabet), alphabetForLearning="greek")
    #else:
     #   return "Te abecede pa (se) ne poznam!"

if __name__ == '__main__':
    app.run(debug=True) # DODANO ZA POTREBE CLOUD9
