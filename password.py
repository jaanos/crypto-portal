from flask import *
from zxcvbn import zxcvbn

app = Blueprint('password', __name__)

warn_dic = {
    'Straight rows of keys are easy to guess.': 'Ravnih vrstic tipk ni težko uganiti.',
    'Short keyboard patterns are easy to guess.': 'Kratke vzorce na tipkovnici se hitro ugane.',
    'Repeats like "aaa" are easy to guess.': 'Zaporedij istih znakov, kot je "aaa", ni zežko uganiti.',
    'Repeats like "abcabcabc" are only slightly harder to guess than "abc".': 'Ponovitve zaporedij znakov, kot je "abcabcabc", je le malo težje uganiti kot "abc".',
    'Sequences like "abc" or "6543" are easy to guess.': 'Zaporedja, kot so "abc" ali "6543", je zelo lahko uganiti.',
    'Recent years are easy to guess.': 'Nedavne letnice je lahko uganiti.',
    'Dates are often easy to guess.': 'Datume se pogosto hitro ugane.',
    'This is a top-10 common password.': 'To je eno izmed 10 najpogostejših gesel.',
    'This is a top-100 common password.': 'To je eno izmed 100 najpogostejših gesel.',
    'This is a very common password.': 'To je zelo pogosto geslo.',
    'This is similar to a commonly used password.': 'To je podobno pogosto uporabljenim geslom.',
    'A word by itself is easy to guess.': 'Same besede ni težko uganiti.',
    'Names and surnames by themselves are easy to guess.': 'Imena in priimke je lahko uganiti.',
    'Common names and surnames are easy to guess.': 'Pogosta imena in priimke je lahko uganiti.',
    '': '/',
}

sugg_dic = {
    'Use a few words, avoid common phrases.': 'Uporabi nekaj besed, izogibaj se običajnim frazam.',
    'No need for symbols, digits, or uppercase letters.': 'Ni potrebe po simbolih, števkah ali velikih črkah',
    'Add another word or two. Uncommon words are better.': 'Dodaj še kakšno besedo. Neobičajne besede so boljše.',
    'Use a longer keyboard pattern with more turns.': 'Uporabi daljši vzorec tipk z več spremembami smeri.',
    'Avoid repeated words and characters.': 'Izogibaj se ponavljanju besed in znakov.',
    'Avoid sequences.': 'Izogibaj se zaporedjem.',
    'Avoid recent years.': 'Izogibaj se nedavnim letnicam.',
    'Avoid years that are associated with you.': 'Izogibaj se letnicam, ki so povezane s tabo.',
    'Avoid dates and years that are associated with you.': 'Izogibaj se datumom in letnicam, ki so povezane s tabo.',
    "Capitalization doesn't help very much.": 'Pisanje z veliko začetnico ne pomaga veliko.',
    'All-uppercase is almost as easy to guess as all-lowercase.': 'Napisano vse z velikimi črkami je skoraj tako lahko uganiti, kot če bi bilo napisano vse z malimi črkami.',
    "Reversed words aren't much harder to guess.": 'Obrnjene besede ni dosti težje uganiti.',
    "Predictable substitutions like '@' instead of 'a' don't help very much.": 'Predvidljive zamenjave, kot je "@" namesto "a", ne pomagajo dosti.',
    '': '/',
}

time_dic = {
    'second': ["sekund", "sekunda", "sekundi", "sekunde"],
    'minute': ["minut", "minuta", "minuti", "minute"],
    'hour': ["ur", "ura", "uri", "ure"],
    'day': ["dni", "dan", "dneva", "dni"],
    'month': ["mesecev", "mesec", "meseca", "meseci"],
    'year': ["let", "leto", "leti", "leta"],
}

@app.route("/", methods=['GET', 'POST'])
def index():
    # print("INDEX")
    if request.method == 'POST':
        print(request.form['pass'])

    return render_template("password.meter.html", nav="password")

@app.route("/check", methods=['POST'])
def check():
    pwd = request.form.get('pass', '', type=str)
    results = zxcvbn(pwd)

    score = results['score']
    est_gues = int(results['guesses'])
    est_time = results['crack_times_display']['offline_fast_hashing_1e10_per_second']

    warn = results['feedback']['warning']
    sugg = results['feedback']['suggestions']

    if est_time == 'less than a second':
        est_time = 'manj kot sekunda'
    elif est_time == 'centuries':
        est_time = 'stoletja'
    else:
        try:
            tm, unit = est_time.split(" ")
            digit = int(tm[-2:])
            if digit == 4:
                digit = 3
            elif digit > 4:
                digit = 0
            if unit[-1] == 's':
                unit = unit[:-1]
            est_time = "%s %s" % (tm, time_dic[unit][digit])
        except:
            pass

    warnlist = []
    if isinstance(warn, str):
        warnlist.append(warn_dic[warn])
    elif isinstance(warn, list):
        for s in sugg:
            warnlist.append(warn_dic[s])

    suglist = []
    if isinstance(sugg, str):
        suglist.append(sugg_dic[sugg])
    elif isinstance(sugg, list):
        for s in sugg:
            suglist.append(sugg_dic[s])

    return jsonify(result=[score, est_gues, est_time, warnlist, suglist])
