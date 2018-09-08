from bs4 import BeautifulSoup
import re

BEGIN = "{{_(\""
END = "\")}}"

html = """<p class="description" dir="ltr">Name is a fine man.<br>"""+BEGIN+"""Name is cool</p>"""
rootdir = "templates/"
filename = "alphabet.flags.html"

soup = BeautifulSoup(open(rootdir+filename),"lxml")
#soup = BeautifulSoup(html,"lxml")

print(soup.find_all(text=True))
#target = soup.find_all(text=re.compile(r'Name'))
for text in soup.find_all(text=True):
    #https://stackoverflow.com/questions/35472835/how-does-one-get-the-text-from-html-while-ignoring-formatting-tags-using-beautif
    #ako nije već sourr
    rstrip_text = text.rstrip()
    if not rstrip_text:
        continue
    if text.rstrip().startswith(BEGIN):
        continue
    # If you need to use the regex more than once it is suggested to compile it.
    pattern = re.compile(r"{%.*%}")

    result = pattern.sub("", text)
    if result != text:
        if not result.rstrip():#if there is only this (tetx in {% ... %}) and
                                # nothing alse, do not do anything.
            continue
    text.replace_with(BEGIN+text+END)


with open(filename, "w") as file:
    file.write(str(soup))