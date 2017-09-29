from flask import Flask, Blueprint, request, redirect, url_for, render_template
import os
from PIL import Image, ImageOps
import random
import sys
import json
import glob
import time
from uuid import uuid4

app = Blueprint('visual', __name__)

APP_ROOT = os.path.dirname(os.path.abspath(__file__))

ALLOWED_EXTENSIONS = set(['png', 'jpg', 'jpeg', 'gif'])    

def allowed_file(filename):
    return '.' in filename and \
           filename.rsplit('.', 1)[1] in ALLOWED_EXTENSIONS

@app.route("/")
def index():
    return render_template("visual.html", time=time.time())

# handle uploada prek prvega html obrazca

@app.route("/", methods=["POST"])
def upload_image():
    
    target = "static/uploads"       
    
    if not os.path.isdir(target):       
        os.mkdir(target)
        
    for file in request.files.getlist("file"):            
        if allowed_file(file.filename):                  
            filename = file.filename
            destination = "/".join([target, filename])   
            file.save(destination)
                          
    image_file = Image.open(file)                         
    image = image_file.convert('1', dither=Image.NONE)    # pretvori v crno-belo
    
    width, height = image.size                                       
    new_width = 200                                                  # določi novo širino na 200px
    new_height = int(image.height * (new_width / image.width))       # izračuna novo višino tako, da se ohrani razmerje stranic
    image = image.resize((new_width, new_height))                    # resize slike na novo širino in višino

    #poveča dimenzije za fakotr 2
    outfile1 = Image.new("1", [dimension * 2 for dimension in image.size])      
    outfile2 = Image.new("1", [dimension * 2 for dimension in image.size])
    
    """width, height = image.size
    new_width = 400
    new_height = int(image.height * (new_width / image.width))
    image = image.resize((new_width, new_height))
    
    outfile1 = Image.new("1", image.size)          
    outfile2 = Image.new("1", image.size)"""
    
    # GENERIRAJ DELNI SLIKI (ŠUM)
    
    for x in range(0, new_width):                 # za vsak piksel na x osi
        for y in range(0, new_height):            # za vsak piksel na y osi
            source_px = image.getpixel((x, y))   
            assert source_px in (0, 255)         
            flip = random.random()                
            
            if source_px == 0:                    # če je source piksel črne barve
                if flip < .5:                    
                    outfile1.putpixel((x * 2, y * 2), source_px)          # začni s črno 
                    outfile1.putpixel((x * 2 + 1, y * 2), 1-source_px)
                    outfile1.putpixel((x * 2, y * 2 + 1), 1-source_px)
                    outfile1.putpixel((x * 2 + 1, y * 2 + 1), source_px)
                
                    outfile2.putpixel((x * 2, y * 2), 1-source_px)        # ker je source piksel črn, je položaj na drugi delni sliki ravno obraten
                    outfile2.putpixel((x * 2 + 1, y * 2), source_px)
                    outfile2.putpixel((x * 2, y * 2 + 1), source_px)
                    outfile2.putpixel((x * 2 + 1, y * 2 + 1), 1-source_px)
                    
                else:                             
                    outfile1.putpixel((x * 2, y * 2), 1-source_px)        # začni z belo
                    outfile1.putpixel((x * 2 + 1, y * 2), source_px)
                    outfile1.putpixel((x * 2, y * 2 + 1), source_px)
                    outfile1.putpixel((x * 2 + 1, y * 2 + 1), 1-source_px)
                
                    outfile2.putpixel((x * 2, y * 2), source_px)          # na drugi delni sliki ravno obratno
                    outfile2.putpixel((x * 2 + 1, y * 2), 1-source_px)
                    outfile2.putpixel((x * 2, y * 2 + 1), 1-source_px)
                    outfile2.putpixel((x * 2 + 1, y * 2 + 1), source_px)
                    
            elif source_px == 255:                # če je source piksel bele barve
                if flip < .5:                     
                    outfile1.putpixel((x * 2, y * 2), source_px)          # začni z belo
                    outfile1.putpixel((x * 2 + 1, y * 2), 1-source_px)
                    outfile1.putpixel((x * 2, y * 2 + 1), 1-source_px)
                    outfile1.putpixel((x * 2 + 1, y * 2 + 1), source_px)
                
                    outfile2.putpixel((x * 2, y * 2), source_px)          # ker je source piksel bel, je položaj na drugi delni sliki enak
                    outfile2.putpixel((x * 2 + 1, y * 2), 1-source_px)
                    outfile2.putpixel((x * 2, y * 2 + 1), 1-source_px)
                    outfile2.putpixel((x * 2 + 1, y * 2 + 1), source_px)
                else:
                    outfile1.putpixel((x * 2, y * 2), 1-source_px)        # začni s črno
                    outfile1.putpixel((x * 2 + 1, y * 2), source_px)
                    outfile1.putpixel((x * 2, y * 2 + 1), source_px)
                    outfile1.putpixel((x * 2 + 1, y * 2 + 1), 1-source_px)
                
                    outfile2.putpixel((x * 2, y * 2), 1-source_px)        # ravno obratno
                    outfile2.putpixel((x * 2 + 1, y * 2), source_px)
                    outfile2.putpixel((x * 2, y * 2 + 1), source_px)
                    outfile2.putpixel((x * 2 + 1, y * 2 + 1), 1-source_px)
                    
    outfile1.save('static/uploads/out1.png')  # prvo delno sliko shrani kot out1.png
    outfile2.save('static/uploads/out2.png')  # drugo delno sliko shrani kot out2.png
        
    infile1 = Image.open('static/uploads/out1.png')  
    infile2 = Image.open('static/uploads/out2.png')

    # PREKRIVANJE SLIK
    outfile = Image.new("1", infile1.size)  # transparency maska

    for x in range(infile1.width):        # za vsak piksel na x osi
        for y in range(infile1.height):   # za vsak piksel na y osi
            outfile.putpixel((x, y), min(infile1.getpixel((x, y)), infile2.getpixel((x, y))))   # prekrij istoloežne piksle obeh slik
    
    outfile.save("static/uploads/result.png")  # shrani kot result.png
    
    return render_template("visual.html", time = time.time())  


# handle uploadov prek drugega html obrazca (že imamo obe delni sliki)

@app.route("/upload", methods=["POST"])
def upload():
    
    form = request.form

    upload_key = str(uuid4())   


    is_ajax = False
    if form.get("__ajax", None) == "true":
        is_ajax = True

    target = "static/uploads/{}".format(upload_key)  
    try:
        os.mkdir(target)
    except:
        if is_ajax:
            return ajax_response(False, "Direktorija ni bilo mogoče ustvariti: {}".format(target))   
        else:
            return "Direktorija ni bilo mogoče ustvariti: {}".format(target)

    for key, value in form.items():    
        print(key, "=>", value)
        

    for upload in request.files.getlist("file"):        
        if allowed_file(upload.filename):                
            filename = upload.filename.rsplit("/")[0]   
            destination = "/".join([target, filename])   
            upload.save(destination)
            
    if is_ajax:
        return ajax_response(True, upload_key)
    else:
        return redirect(url_for("upload_complete", uuid=upload_key))


@app.route("/files/<uuid>")
def upload_complete(uuid):

    root = "static/uploads/{}".format(uuid)
    if not os.path.isdir(root):
        return "Error: UUID not found!"          

    files = []
    for file in glob.glob("{}/*.*".format(root)):
        fname = file.split(os.sep)[-1]
        files.append(fname)

    return render_template("visual.html",       
        uuid=uuid,
        files=files,
        time=time.time()
    )


def ajax_response(status, msg):
    status_code = "ok" if status else "error"
    return json.dumps(dict(
        status=status_code,
        msg=msg,
    ))

