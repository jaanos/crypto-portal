# Adding a new alphabet

If you want to add a new alphabet to the site, follow these steps:

1. images must be named after the character they are representing
    - e.g., the image that represents `a` must be named `a.png`
2. images must be in the folder `[alphabet name]` named after the alphabet (e.g., `flags`, `greek`,...)
3. the `alphabet` table in the database must contain a row with the alphabet name in the `name` column, and a string containing valid letters for the alphabet (without spaces) in the `alphabet` column
    - e.g., if valid letters for the alphabet are `a`, `b`, `c` and `d`, then the row must contain the string `abcd`
4. in `header.html`, add:
```html
<li><a href="{{url_for('alphabet.[alphabet name]')}}">[alphabet name slo]</a></li>
```
   for the drop down menu

5. in `alphabet.py`, add:
```python
      @app.route("/[alphabet name]")
      def [alphabet name](selected_alphabet = "[alphabet name]", mode = "easy", level = "easy"):
      # check if folder with images exists
      if (alphabet_exists(selected_alphabet)):
        return render_template("alphabet.generic.html", nav = "alphabet", alphabet = getValidLetters(selected_alphabet), intro = "1", alphabetForLearning="[alphabet name]")
      else:
        return "Unknown alphabet"
```
6. additional advice: for better design, choose images with transparent background
