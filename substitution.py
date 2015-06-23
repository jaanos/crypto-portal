from flask import *

app = Blueprint('substitution', __name__)

@app.route("/")
def index():
    return "TODO"

@app.route("/<difficulty>")
def play(difficulty):
    return "TODO"
