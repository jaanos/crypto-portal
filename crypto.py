from flask import * 

import auth
from githook import app as githook_app
from steganography import app as steganography_app

app = Flask(__name__)
app.register_blueprint(githook_app)
app.register_blueprint(steganography_app, url_prefix = '/steganography')

@app.route("/")
def main():
    return "The site is currently under construction!"

@route('/static/<filename:path>')
def static(filename):
    return static_file(filename, root='static')

@route('/favicon.ico')
def favicon():
    return static_file('favicon.ico', root='static')
