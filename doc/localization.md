# Adding new locale (link: https://blog.miguelgrinberg.com/post/the-flask-mega-tutorial-part-xiii-i18n-and-l10n)
1. Run pybabel init -i messages.pot -d translations -l LANG
(where LANG is changed with the short of the locale to be added)
2. Make the translation in translations/LANG/LC_MESSAGES/messages.mo file
3. pybabel compile -d translations
 

# Adding any contect to the portal that will (eventualy) be shown to the user
1. If the content is static .html, surround it with {{_(" ... ")}} .
EXAMPLE1: 
<input class="form-control" autocomplete="off" data-val-length-max="60" data-val-length-min="1" data-val-required="Vpisati morate geslo" name="pass" id="pass" placeholder="Vpišite geslo" rows="12" type="text" />

change to

<input class="form-control" autocomplete="off" data-val-length-max="60" data-val-length-min="1" data-val-required="{{_("Vpisati morate geslo")}}" name="pass" id="pass" placeholder="{{_("Vpišite geslo")}}" rows="12" type="text" />

EXAMPLE2:
<li><a href="{{url_for('timestamp.index')}}">Kaj je časovni žig?</a></li>

change to

<li><a href="{{url_for('timestamp.index')}}">{{_("Kaj je časovni žig?")}}</a></li>

EXAMPLE3:

<h1>Hi, {{current_user.username}}</h1>

change to 

<h1>{{ _('Hi, %(username)s!', username=current_user.username) }}</h1>


2. Run: pybabel extract -F babel.cfg -k _l -o messages.pot .
3. Run: pybabel update -i messages.pot -d translations
4. Make the translation changes/additions in translations/LANG/LC_MESSAGES/messages.mo file
5. Run: pybabel compile -d translations