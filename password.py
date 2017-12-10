from flask import *
import os

from zxcvbn import zxcvbn

app = Blueprint('password', __name__)


@app.route("/", methods=['GET', 'POST'])
def index():
    # print("INDEX")
    if request.method == 'POST':
        print(request.form['pass'])

    return render_template("passwordmeter.html", nav="password")


@app.route("/check")
def check():
    pwd = request.args.get('pass', '', type=str)
    results = zxcvbn(pwd)



    score = results['score']
    est_gues = results['guesses']
    est_time = results['crack_times_display']['offline_fast_hashing_1e10_per_second']

    warn_dic = {'Straight rows of keys are easy to guess.': 'Ravnih vrstic tipk ni težko uganiti.'}
    warn_dic['Short keyboard patterns are easy to guess.'] = 'Kratke vzorce na tipkovnici se hitro ugane.'
    warn_dic['Repeats like "aaa" are easy to guess.'] = 'Zaporedij istih znakov, kot je "aaa" ni zežko uganiti.'
    warn_dic['Repeats like "abcabcabc" are only slightly harder to guess than "abc".'] = 'Ponovitve zaporedij znakov, kot je "abcabcabc" je le malo težje uganiti kot "abc".'
    warn_dic['Sequences like "abc" or "6543" are easy to guess.'] = 'Zaporedja, kot so "abc" ali "6543" je zelo lahko uganiti.'
    warn_dic["Recent years are easy to guess."] = 'Nedavne letnice je lahko uganiti.'
    warn_dic["Dates are often easy to guess."] = 'Datume se pogosto hitro ugane.'
    warn_dic['This is a top-10 common password.'] = 'To je eno izmed 10 najpogostejših gesel.'
    warn_dic['This is a top-100 common password.'] = 'To je eno izmed 100 najpogostejših gesel.'
    warn_dic['This is a very common password.'] = 'To je zelo pogosto geslo.'
    warn_dic['This is similar to a commonly used password.'] = 'To je podobno pogosto uporabljenim geslom.'
    warn_dic['A word by itself is easy to guess.'] = 'Same besede ni težko uganiti.'
    warn_dic['Names and surnames by themselves are easy to guess.'] = 'Imena in priimke je lahko uganiti.'
    warn_dic['Common names and surnames are easy to guess.'] = 'Običajna imena in priimke je lahko uganiti.'
    warn_dic[''] = '/'

    sugg_dic = {'Use a few words, avoid common phrases.': 'Uporabi nekaj besed, izogibaj se običajnim frazam.'}
    sugg_dic["No need for symbols, digits, or uppercase letters."] = 'Ni potrebe po simbolih, števkah ali velikih črkah'
    sugg_dic['Add another word or two. Uncommon words are better.'] = 'Dodaj še kakšno besedo. Neobičajne besede so boljše.'
    sugg_dic['Use a longer keyboard pattern with more turns.'] = 'Uporabi daljši vzorec tipk z več spremembami smeri.'
    sugg_dic['Avoid repeated words and characters.'] = 'Izogibaj se ponavljanju besed in znakov.'
    sugg_dic['Avoid sequences.'] = 'Izogibaj se zaporedjem.'
    sugg_dic['Avoid recent years.'] = 'Izogibaj se nedavnih letnic.'
    sugg_dic['Avoid years that are associated with you.'] = 'Izogibaj se letnicam, ki so povezane s tabo.'
    sugg_dic['Avoid dates and years that are associated with you.'] = 'Izogibaj se datumom in letnicam, ki so povezane s tabo.'
    sugg_dic["Capitalization doesn't help very much."] = 'Pisanje z veliko začetnico ne pomaga veliko.'
    sugg_dic["All-uppercase is almost as easy to guess as all-lowercase."] = 'Napisano vse z velikimi črkami je skoraj tako lahko uganiti, kot če bi bilo napisano vse z majhnimi črkami.'
    sugg_dic["Reversed words aren't much harder to guess."] = 'Obrnjene besede ni dosti težje uganiti.'
    sugg_dic["Predictable substitutions like '@' instead of 'a' don't help very much."] = 'Predvidljive zamenjave, kot je "@" namesto "a" ne pomagajo dosti.'
    sugg_dic[''] = '/'

    warn = results['feedback']['warning']
    sugg = results['feedback']['suggestions']

    if est_time == 'less than a second':
        est_time = 'manj kot sekunda'
    elif est_time == 'centuries':
        est_time = 'stoletja'
    else:
        list = est_time.split(" ")
        if 'second' in list[1]:
            if list[0] == '1':
                est_time = '1 sekunda'
            if list[0] == '2':
                est_time = '2 sekundi'
            if list[0] == '3':
                est_time = '3 sekunde'
            else:
                est_time = list[0] + ' sekund'
        elif 'minute' in list[1]:
            if list[0] == '1':
                est_time = '1 minuta'
            elif list[0] == '2':
                est_time = '2 minuti'
            elif list[0] == '3':
                est_time = '3 minute'
            else:
                est_time = list[0] + ' minut'
        elif 'hour' in list[1]:
            if list[0] == '1':
                est_time = '1 ura'
            elif list[0] == '2':
                est_time = '2 uri'
            elif list[0] == '3':
                est_time = '3 ure'
            else:
                est_time = list[0] + ' ur'
        elif 'day' in list[1]:
            if list[0] == '1':
                est_time = '1 dan'
            elif list[0] == '2':
                est_time = '2 dneva'
            else:
                est_time = list[0] + ' dni'
        elif 'month' in list[1]:
            if list[0] == '1':
                est_time = '1 mesec'
            elif list[0] == '2':
                est_time = '2 meseca'
            elif list[0] == '3':
                est_time = '3 mesece'
            else:
                est_time = list[0] + ' mesecov'
        elif 'year' in list[1]:
            if list[0] == '1':
                est_time = '1 leto'
            elif list[0] == '2':
                est_time = '2 leti'
            elif list[0] == '3':
                est_time = '3 leta'
            else:
                est_time = list[0] + ' let'


    warnlist = []
    if type(warn).__name__ == 'str':
        warnlist.append(warn_dic[warn])
    elif type(sugg).__name__ == 'list':
        for s in sugg:
            warnlist.append(warn_dic[s])

    suglist = []
    if type(sugg).__name__ == 'str':
        suglist.append(sugg_dic[sugg])
    elif type(sugg).__name__ == 'list':
        for s in sugg:
            suglist.append(sugg_dic[s])


    return jsonify(result=[score, est_gues, est_time, warnlist, suglist])

