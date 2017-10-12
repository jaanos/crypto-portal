# -*- coding: utf-8 -*-
from flask import *
import hashlib
import requests
from database import database
from time import strftime, localtime
from Crypto.PublicKey import RSA
from Crypto.Cipher import PKCS1_OAEP
from Crypto.Signature import PKCS1_v1_5
from Crypto.Hash import SHA256
from base64 import b64encode, b64decode

app = Blueprint('timestamp', __name__)

public = "cert.pem"
private = "key.pem"

def encrypt(message, pub_key):
    cipher = PKCS1_OAEP.new(pub_key)
    return cipher.encrypt(message)

def decrypt(ciphertext, priv_key):
    cipher = PKCS1_OAEP.new(priv_key)
    return cipher.decrypt(ciphertext)

def sign(message, priv_key, hashAlg="SHA-256"):
    global hash
    hash = hashAlg
    signer = PKCS1_v1_5.new(priv_key)
    digest = SHA256.new()
    digest.update(message)
    return signer.sign(digest)

def verify(message, signature, pub_key):
    signer = PKCS1_v1_5.new(pub_key)
    digest = SHA256.new()
    digest.update(message)
    return signer.verify(digest, signature)

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
    time = strftime('%Y %m %d %H:%M:%S', localtime())
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
    return render_template('timestamp.file.html', text=signature)

@app.route('/download', methods=['POST'])
def download():
    text = request.form['data']
    signature = "kriptoportal podpis"
    plaintext_bytes = text.encode('utf-8')
    signature_bytes = signature.encode('utf-8')
    with open(public, "r") as myfile:
        pub_key = RSA.importKey(myfile.read())
    myfile.close()
    with open(private, "r") as myfile:
        prv_key = RSA.importKey(myfile.read())
    myfile.close()
    encrypted = encrypt(plaintext_bytes,  pub_key )
    signed = sign(signature_bytes, prv_key, "SHA-512")
    return Response(b64encode(signed+b'\r\n'+encrypted) , mimetype="text/plain", headers={"Content-Disposition":"attachment;filename=Certificate.tsr"})

@app.route('/checking')
def checking():
    return render_template('timestamp.checking.html')

@app.route('/check_file', methods=['POST'])
def check():
    file = returnFile()
    read = b64decode(file.read())
    msg = read.split(b'\r\n')
    signature = "kriptoportal podpis"
    with open(public, "r") as myfile:
        pub_key = RSA.importKey(myfile.read())
    myfile.close()
    verifyM = verify(signature.encode('utf-8'), msg[0], pub_key)
    if (verifyM):
        try:
            with open(private, "r") as myfile:
                key = RSA.importKey(myfile.read())
            myfile.close()
            decrypted = decrypt(msg[1], key).decode('utf-8')[1:-1]
            items = decrypted.split(",")
            db = database.dbcon()
            cur = db.cursor()
            cur.execute("SELECT date, hashFile FROM timestamps WHERE hashPortal = %s AND hashFile = %s AND date = %s", (items[1][2:-1], items[0][1:-1], items[2][2:-1]))
            txt = cur.fetchone()
            cur.close()
            if (txt == None):
               return render_template('timestamp.file.html',
                                    error="Z danim certifikatom ni bil potrjen noben dokument na tej strani.")
            else:
                return render_template('timestamp.file.html', check="Dokument z zgoščevalno funkcijo " + txt[1] + "je bil potrjen: "+ txt[0])
        except:
            return render_template('timestamp.file.html', error="Prišlo je do napake pri preverjanju certifikata ali pa je certifikat neveljaven, poskusite ponovno.")
    return render_template('timestamp.file.html',
                           error="Prišlo je do napake pri preverjanju certifikata ali pa je certifikat neveljaven, poskusite ponovno.")

