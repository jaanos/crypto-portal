from flask import *

app = Blueprint('steganography', __name__)

@app.route("/")
def index():
    return "TODO"

@app.route("/colors")
def colors():
    return render_template("colors.html", nav = "steganography")

@app.route("/images")
def images():
    return "TODO"
