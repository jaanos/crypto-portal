# Crypto portal

A portal for cryptography (for now, in Slovene) for the purposes of a summer school in cryptography and beyond.

Written in python-flask, allowing both local test runs and Apache integration through WSGI.
To run locally, rename `auth.py.template` to `auth.py` (actual login data is not needed for the majority of the site) and run `crypto.py`.

The *work* branch should contain the current working version, without specifics needed for deploying (see below). Any subprojects should start by branching off *work*, and any finished subprojects shall be merged into *work* before being deployed.

The *devel* branch is automatically pushed to the live version at https://lkrv.fri.uni-lj.si/crypto-devel (access restricted to collaborators). Merging work in progress is permitted, but please do not merge *master* into *devel*.

The *master* branch is automatically pushed to the live version at https://lkrv.fri.uni-lj.si/crypto-portal .

# Adding new alphabet
If you want to add new alphabet to site, follow this steps:
1. images must be named after the char they are representing (see example)
    -image that represents "a" must be named: a.png
2. images must be in the folder named after the alphabet (ex. flags, greek,...) [alphabet name]
3. folder must also contain "alphabet.txt" with one line input containing valid letters for alphabet (no spaces. see example)
    - if valid letters for alphabet are a, b, c and d thet "alphabet.txt" must contain one line string: abcd
4. in main.html add:
    - <li><a href="{{url_for('alphabet.[alphabet name]')}}">[alphabet name slo]</a></li>
   for drop down menu
5. in alphabet.py add:
      @app.route("/[alphabet name]")
      def greek(selected_alphabet = "[alphabet name]", mode = "easy", level = "easy"):
      # check if folder with images exists
      if (alphabet_exists(selected_alphabet)):
        return render_template("alphabet.generic.html", nav = "alphabet", alphabet = getValidLetters(selected_alphabet), intro = "1", alphabetForLearning="[alphabet name]")
      else:
        return "Unknown alphabet"

6. aditional advice: for better design choose images with transparent background