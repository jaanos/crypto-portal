from flask import * 

from auth import sesskey, debug
from githook import app as githook_app
from steganography import app as steganography_app

app = Flask(__name__)
app.debug = debug
app.register_blueprint(githook_app)
app.register_blueprint(steganography_app, url_prefix = '/steganography')

@app.route("/")
def main():
    return "Under construction!"
