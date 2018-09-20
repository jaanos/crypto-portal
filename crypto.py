#!/usr/bin/python
# -*- coding: utf-8 -*-
from flask import render_template,redirect, Flask,request,url_for, session
from auth import sesskey, debug
from githook import app as githook_app
from substitution import app as substitution_app
from steganography import app as steganography_app
from visual import app as visual_app
from alphabet import app as alphabet_app
from timestamp import app as timestamp_app
from password import app as password_app
import os # DODANO ZA POTREBE CLOUD9
from flask_babel import Babel, _, lazy_gettext as _l

app = Flask(__name__)

babel = Babel(app)

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
app.config['LANGUAGES'] = {
    'en': 'English',
    'sl': 'Slovenian'
}

#LOCALIZATION
@app.route('/<language>')
def set_language(language=None):
    session['language'] = language
    return redirect(url_for('index'))

@babel.localeselector
def get_locale():
    # if the user has set up the language manually it will be stored in the session,
    # so we use the locale from the user settings
    session['LANGUAGES'] = app.config['LANGUAGES']
    try:
        language = session['language']
    except KeyError:
        language = None
    if language is not None:
        return language
    return request.accept_languages.best_match(app.config['LANGUAGES'].keys())

@app.context_processor
def inject_conf_var():
    return dict(CURRENT_LANGUAGE=\
    session.get('language',request.accept_languages.best_match(app.config['LANGUAGES'].keys())),\
    AVAILABLE_LANGUAGES=\
    session.get('LANGUAGES',app.config['LANGUAGES'].keys()))

#ROUTES
@app.route("/")
def index():
    return render_template("index.html", nav = "start", AVAILABLE_LANGUAGES=app.config["LANGUAGES"].keys())

@app.route("/favicon.ico")
def favicon():
    return redirect('static/images/favicon.ico')

if __name__ == '__main__':
    app.run(debug=True) # DODANO ZA POTREBE CLOUD9
