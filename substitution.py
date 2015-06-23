from flask import *

app = Blueprint('substitution', __name__)

@app.route("/")
def index():
    return "TODO"

@app.route("/<difficulty>")
def play(difficulty):
    if (difficulty == "hard"):
        level = 2
    elif (difficulty == "medium"):
        level = 1
    else:
        level = 0
    return render_template("substitution.play.html", nav = "substitution", level = level)
