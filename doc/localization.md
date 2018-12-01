# Requirements
To run the portal enabling localization, one needs to install all python modules
from the `requirements_localization.txt` file. After the installation, follow 
the general running instructions.

# Adding a new locale ([source](https://blog.miguelgrinberg.com/post/the-flask-mega-tutorial-part-xiii-i18n-and-l10n))
1. Run `pybabel init -i messages.pot -d translations -l LANG` LANG is in our case of form: 2 letters, lower case.
(change `LANG` to the abbreviation of the locale to be added)
2. Make the translation in `translations/LANG/LC_MESSAGES/messages.po`
3. `pybabel compile -d translations`
 

# Adding any content to the portal that will (eventually) be shown to the user
1. If the content is static HTML, surround it with `{{_(" ... ")}}`.

* EXAMPLE 1: 
```html
<input class="form-control" autocomplete="off" data-val-length-max="60" data-val-length-min="1" data-val-required="Vpisati morate geslo" name="pass" id="pass" placeholder="Vpišite geslo" rows="12" type="text" />
```
change to
```html
<input class="form-control" autocomplete="off" data-val-length-max="60" data-val-length-min="1" data-val-required="{{_(\Vpisati morate geslo")}}" name="pass" id="pass" placeholder="{{_("Vpišite geslo")}}" rows="12" type="text" />
```

* EXAMPLE 2:
```html
<li><a href="{{url_for('timestamp.index')}}">Kaj je časovni žig?</a></li>
```
change to
```html
<li><a href="{{url_for('timestamp.index')}}">{{_("Kaj je časovni žig?")}}</a></li>
```

* EXAMPLE 3:

```html
<h1>Hi, {{current_user.username}}</h1>
```
change to 
```html
<h1>{{ _('Hi, %(username)s!', username=current_user.username) }}</h1>
```

2. Run `pybabel extract -F babel.cfg -k _l -o messages.pot .`
3. Run `pybabel update -i messages.pot -d translations`
4. Make the translation changes/additions in `translations/LANG/LC_MESSAGES/messages.po`
5. Run `pybabel compile -d translations`
