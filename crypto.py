#!/usr/bin/python
# -*- coding: utf-8 -*-
from flask import render_template,redirect, Flask,request,url_for, session, abort
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
app.register_blueprint(substitution_app, url_prefix = '/<language>/substitution')
app.register_blueprint(steganography_app, url_prefix = '/<language>/steganography')
app.register_blueprint(visual_app, url_prefix = '/<language>/visual')
app.register_blueprint(alphabet_app, url_prefix = '/<language>/alphabet')
app.register_blueprint(timestamp_app, url_prefix = '/<language>/timestamp')
app.register_blueprint(password_app, url_prefix='/<language>/password')
app.secret_key = sesskey

app.config['MAX_CONTENT_LENGTH'] = 1024 * 1024   # limit 1 MB
app.config['LANGUAGES'] = {
    'en': 'English',
    'sl': 'Slovenian'
}

#LOCALIZATION
#set language in the url from the session
@app.url_defaults
def set_language(endpoint, values):
    if 'language' in values or not session['language']:
        return
    if app.url_map.is_endpoint_expecting(endpoint, 'language'):
        values['language'] = session['language']

#Set language into session from the url
#Preprocess make sure that the 'language' in the session is the one in the url.
@app.url_value_preprocessor
def get_language(endpoint, values):
    if values is not None and 'language' in values:
        session['language'] = values.pop('language', None)
    else:
        if not session.get('language'):
            session['language'] = request.accept_languages.best_match(app.config['LANGUAGES'].keys())

#Make sure that the 'language' in the session is supported.
"""
Calls url_value_preprocessors registered with the app and
the current blueprint (if any). Then calls 
before_request_funcs registered with the app and the blueprint.
"""
@app.before_request
def ensure_language_support():
    language = session['language']
    if language and language not in app.config['LANGUAGES'].keys():
        return abort(404)
###############################################################################


@babel.localeselector
def get_locale():
    # if the user has set up the language manually it will be stored in the session,
    # so we use the locale from the user settings
    if not session.get('LANGUAGES'):
        session['LANGUAGES'] = app.config['LANGUAGES']
    try:
        language = session['language']
    except KeyError:
        language = None

    if language is not None:
        return language
    if session:
        print(session)

    session['language'] = request.accept_languages.best_match(app.config['LANGUAGES'].keys())
    return session['language']

@app.context_processor
def inject_conf_var():
    return dict(CURRENT_LANGUAGE=\
    session.get('language',request.accept_languages.best_match(app.config['LANGUAGES'].keys())),\
    AVAILABLE_LANGUAGES=\
    session.get('LANGUAGES',app.config['LANGUAGES'].keys()))

#ROUTES
@app.route("/")
def init():
    return redirect(get_locale())

#ROUTES
@app.route("/<language>/")
def index():
    return render_template("index.html", nav = "start", AVAILABLE_LANGUAGES=app.config["LANGUAGES"].keys())

@app.route("/favicon.ico")
def favicon():
    return redirect('static/images/favicon.ico')

if __name__ == '__main__':
    app.run(debug=True) # DODANO ZA POTREBE CLOUD9
