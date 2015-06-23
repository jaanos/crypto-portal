from flask import *
from common import *

app = Blueprint('steganography', __name__)

@app.route("/colors")
def colors():
    return crypto_template("colors.html")
