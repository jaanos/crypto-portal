# -*- coding: utf-8 -*-
from flask import *
import hashlib
import requests
from database import database
from datetime import datetime
from Crypto.PublicKey import RSA
from Crypto.Cipher import PKCS1_OAEP
from Crypto.Signature import PKCS1_v1_5
from Crypto.Hash import SHA256
from base64 import b64encode, b64decode
from auth import timestamp_public as public
from auth import timestamp_private as private
from flask_babel import Babel, _, lazy_gettext as _l

app = Blueprint('timestamp', __name__)

TIME_FORMAT = '%Y-%m-%d %H:%M:%S'

def encrypt(message, pub_key):
    cipher = PKCS1_OAEP.new(pub_key)
    ciphertext = cipher.encrypt(message)
    return ciphertext

def decrypt(ciphertext, priv_key):
    cipher = PKCS1_OAEP.new(priv_key)
    return cipher.decrypt(ciphertext)

def sign(message, priv_key):
    global hash
    signer = PKCS1_v1_5.new(priv_key)
    digest = SHA256.new()
    digest.update(message)
    return b64encode(signer.sign(digest))

def verify(message, signature, pub_key):
    signer = PKCS1_v1_5.new(pub_key)
    digest = SHA256.new()
    digest.update(message)
    return signer.verify(digest, b64decode(signature))

def getHashFile():
    file = returnFile()
    hashFile = hashlib.sha256(file.read()).hexdigest()
    return hashFile

def getHashPortal():
    page = requests.get('http://www.rtvslo.si')
    hashPortal = hashlib.sha256(page.text.encode('utf-8')).hexdigest()
    return hashPortal

def getSignature():
    fileHash = getHashFile()
    portalHash = getHashPortal()
    time = datetime.now()
    return (fileHash, portalHash, time)

def returnFile():
    file = request.files['fname']
    return file

@app.route('/')
def index():
    return render_template('timestamp.desc.html')

@app.route('/signature')
def signature():
    return render_template('timestamp.signature.html')

@app.route('/upload_file', methods=['POST'])
def output():
    signature = getSignature()
    db = database.dbcon()
    cur = db.cursor()
    cur.execute("INSERT INTO timestamps (hashPortal, hashFile, date) VALUES (%s, %s, %s)", (signature[1], signature[0], signature[2]))
    db.commit()
    time = signature[2].strftime(TIME_FORMAT)
    text = ','.join([signature[0], signature[1], time])
    return redirect(url_for('timestamp.file', hash=signature[0], text=text, time=time))

@app.route('/file')
def file():
    hash = request.args['hash']
    text = request.args['text']
    time = request.args['time']
    return render_template('timestamp.file.html', hash=hash, text=text, time=time)

@app.route('/downloadCert', methods=['POST'])
def downloadCert():
    text = request.form['data']
    plaintext_bytes = text.encode('utf-8')
    pub_key = False
    try:
        with open(public, "rb") as myfile:
            private_key = RSA.importKey(myfile.read())
    except:
        #Signature, change public and private keys so that
        #we can encrypt with private and decrypt with public...
        #It is done due to implementation reasons as the py module does not
        #allow encryption with (real RSA) private key.

        #We just publish RSA private key insted of public 
        # #-- It is not good, but works for now.
        #publish one for verification
        #key = RSA.generate(2048)
        #f = open(public,'wb')
        #f.write(key.exportKey('PEM'))
        #f.close()
        #store one for signing
        #f = open(private,'wb')
        #f.write(key.publickey().exportKey('PEM'))
        #f.close()
        ###########################################
        #pub_key = key
        #private_key = key.publickey()
        pass
        
    
    encrypted = encrypt(plaintext_bytes, private_key)
    return Response(encrypted , mimetype="text/plain", headers={"Content-Disposition":"attachment;filename=Certificate.tsr"})

@app.route('/checking')
def checking():
    return render_template('timestamp.checking.html')

@app.route('/pubkey')
def pubkey():
    with open(public, "r") as myfile:
        key = myfile.read()
    return render_template('timestamp.publickey.html', key = key)

@app.route('/downloadKey', methods=['POST'])
def downloadKey():
    with open(public, "r") as myfile:
        key = myfile.read()
    return Response(key, mimetype="text/plain", headers={"Content-Disposition": "attachment;filename=PublicKey.cert"})

@app.route('/check_file', methods=['POST'])
def check_file():
    file = returnFile()
    read = file.read()
    try:
        with open(public, "r") as myfile:
                key = RSA.importKey(myfile.read())
        decrypted = decrypt(read, key).decode('utf-8')
        items = decrypted.split(",")
        db = database.dbcon()
        cur = db.cursor()
            #n = cur.execute("SELECT date, hashFile FROM timestamps WHERE hashPortal = %s AND hashFile = %s AND date = %s", (items[1], items[0], datetime.strptime(items[2], TIME_FORMAT)))
        n = cur.execute("SELECT date, hashFile FROM timestamps WHERE hashPortal = %s AND hashFile = %s", (items[1], items[0]))
        cur.close()
        if n == 0:
            return render_template('timestamp.file.html',
                                error=_l("No document has been found with a certificate given."))
        else:
            s1 = _l("Document with hash ")
            s2 = _l(" has been signed at ")
            return render_template('timestamp.file.html', check=s1 + items[0] +s2 +items[2])
    except:
       pass
    return render_template('timestamp.file.html',
                           error=_l('The error occured when checking the certificate, or the certificate is invalid. Try again.'))

@app.route('/check_hash', methods=['POST'])
def check_hash():
    fileHash = getHashFile()
    return fileHash
