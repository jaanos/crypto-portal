from flask import *
import auth
import json
import hmac
import sys
from hashlib import sha1

app = Blueprint('githook', __name__)

@app.route("/githook", methods=['POST'])
def githook():
    #if request.headers.get('X-GitHub-Event') == "ping":
    #    return json.dumps({'msg': 'Hi!'})
    #if request.headers.get('X-GitHub-Event') != "push":
    #    return json.dumps({'msg': "wrong event type"})
    payload = json.loads(request.data)
    signature = request.headers.get('X-Hub-Signature').split('=')[1]
    mac = hmac.new(auth.gitkey, msg=request.data, digestmod=sha1)
    if not compare_digest(mac.hexdigest(), signature):
        abort(403)
    return str(payload)

# Check if python version is less than 2.7.7
if sys.version_info < (2, 7, 7):
    # http://blog.turret.io/hmac-in-go-python-ruby-php-and-nodejs/
    def compare_digest(a, b):
        """
        ** From Django source **
        Run a constant time comparison against two strings
        Returns true if a and b are equal.
        a and b must both be the same length, or False is
        returned immediately
        """
        if len(a) != len(b):
            return False

        result = 0
        for ch_a, ch_b in zip(a, b):
            result |= ord(ch_a) ^ ord(ch_b)
        return result == 0
else:
    compare_digest = hmac.compare_digest
