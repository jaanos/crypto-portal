from bs4 import BeautifulSoup,Comment, NavigableString
import re

BEGIN = "{{_(\""
END = "\")}}"

html = """<p class="description" dir="ltr">Name is a fine man.<br>"""+BEGIN+"""Name is cool</p>"""
rootdir = "templates/"
filename = "password.meter.html"

soup = BeautifulSoup(open(rootdir+filename),"lxml")
#comments=soup.find_all(string=lambda text: isinstance(text,Comment))

for node in soup.find_all(text=lambda x: x.rstrip()): 
    if node.parent.name == 'script' or isinstance(node, Comment):
        continue
    if not node:
        continue
    if node.startswith(BEGIN):
        continue
    if node.__contains__('{#'):
        print(node)
        continue

    # If you need to use the regex more than once it is suggested to compile it.
    pattern = re.compile(r"{%.*%}")
    result = pattern.sub("", node)

    node_new = node
    if result != node:#
        #print(node)
        if not result.rstrip():#if there is only this (tetx in {% ... %}) and
                                # nothing alse, do not do anything.
            continue
        else:
            this = node.replace("{%", BEGIN+"{%")
            this = this.replace("%}", "%}"+END)
            node_new = NavigableString(this)
            #node.replace_with(("{}").format(node_new))
            print("bootstrap code ie else", node)

    if node_new.startswith("{{"):
        node_new = node_new.replace("{{", "")

    if node_new.endswith("}}"):
        this = node_new.replace("}}", "")
        this = "\'%(content)s\', content="+this
        node_new = NavigableString(this)
    print(type(node))
    node.replace_with(("{{{{_(\"{}\")}}}}").format(node_new))
#print (soup.prettify())

""" for text in soup.find_all(text=True):
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
 """

filename = 'dev/'+filename
with open(filename, "w") as file:
    file.write(soup.prettify())