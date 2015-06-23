from flask import render_template

def crypto_template(template, **context):
    return render_template('main.html', render_template(template, **context))
