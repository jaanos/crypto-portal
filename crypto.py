from flask import *
import auth
from githook import app as githook_app
from substitution import app as substitution_app
from steganography import app as steganography_app

app = Flask(__name__)
app.register_blueprint(githook_app)
app.register_blueprint(substitution_app, url_prefix = '/substitution')
app.register_blueprint(steganography_app, url_prefix = '/steganography')

@app.route("/")
def index():
    return render_template("start.html", nav = "start")

@app.route("/favicon.ico")
def favicon():
    return redirect('static/favicon.ico')

if __name__ == '__main__':
    app.run(debug=True)
