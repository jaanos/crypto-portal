from flask import render_template

def crypto_template(template, **context):
    return render_template('main.html', content = render_template(template, **context))
