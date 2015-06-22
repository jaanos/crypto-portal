from flask import *

app = Blueprint('steganography', __name__)

@app.route("/colors")
def colors():
    return render_template("colors.html")
