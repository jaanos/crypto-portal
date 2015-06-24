# -*- coding: utf-8 -*-
from flask import *
import random

app = Blueprint('substitution', __name__)

abc = u"ABCČDEFGHIJKLMNOPQRSŠTUVWXYZŽ"
textS = [u"William Herschel se je zapisal v zgodovino astronomije kot konstruktor\ndaljnogledov,kot neumoren opazovalec neba,prvi raziskovalec Rimske ceste in drugih galaksij.Kot mladenič je iz rodne Nemčije pobegnil v Anglijo.V začetku je bil godbenik,komponist in učitelj glasbe, kasneje pa je spremenil poklic in postal eden največjih astronomov.Bil je samouk v glasbi in v astronomiji. Gradil je vse večje daljnoglede,ki jih je pošiljal na vse strani.",
         u"Kopernik je s svojim delom močno vplival na vso znanost in spremenil človekov pogled na svet. Živel in ustvarjal je na prehodu iz srednjega veka v novi vek, ko so fevdalno družbo pretresali pomembni dogodki. Znanje astronomije je bilo nujno potrebno pri trgovanju na dolgih morskih poteh. Misel o okrogli Zemlji je postajala splošno znana. Vsemu temu je sledila še  nova predstava o zgradbi vesolja. Do Kopernika so mislili, da je Zemlja nepremična, da leži v središču vesoljstva in da se vse zvezde, planeti, Sonce in Luna gibljejo okoli nje.",
         u"Rodil se je v revni kmečki družini v zasavskem hribovju. Kot matematika ga najbolj poznamo kot avtorja njegovih logaritmov, s katerimi so računali po svetu v znanosti, šolstvu in vsakdanjem življenju vse do množične uporabe elektronskih računalnikov. Kot profesor matematike na šoli je napisal matematična in fizikalna učbenika. Čeprav je Vega s svojimi logaritmi zaslovel predvsem kot matematik, je bil večji del njegovih razprav in učbenikov posvečenih fiziki. Njegova dela v fiziki zajemajo vsa področja mehanike, predvsem teorijo gravitacije in z njo povezano astronomijo.",
         u"Ideje o dveh gibanjih Zemlje, o vrtenju okoli njene osi in kroženju okoli Sonca, so izrekli že nekateri filozofi starega veka. Te misli so utonile v pozabo. Povzel jih je Kopernik, ki je postavil Sonce v središče našega planetnega sistema, Zemljo pa premaknil v vrsto planetov, ki se gibljejo okoli Sonca. Kopernikov nauk je pomenil prelom s številnimi tradicijami in dotedanjim svetovnim nazorom. Ves srednjeveški svet se je naslanjal na nespremenljivost obstoječega reda. Le drzni ljudje so si upali izreči misel o gibanju Zemlje.",
         u"William Herschel se je zapisal v zgodovino astronomije kot konstruktor daljnogledov, kot neumoren opazovalec neba, prvi raziskovalec Rimske ceste in drugih galaksij. Kot mladenič je iz rodne Nemčije pobegnil v Anglijo. V začetku je bil godbenik, komponist in učitelj glasbe, kasneje pa je spremenil poklic in postal eden največjih astronomov. Bil je samouk v glasbi in v astronomiji. Gradil je vse večje daljnoglede, ki jih je pošiljal na vse strani.",
         u"Kolmogorov se je ukvarjal s širokim poljem matematike. Opredelil je matematične osnove verjetnostne teorije in algoritmične teorije naključnosti ter prispeval ključne prispevke k osnovam statistčne mehanike, stohastičnih procesov, teorije informacije, mehanike tekočin in nelinearne dinamike. Vsa ta področja in njihovi odnosi so osnova za kompleksne sisteme, kot jih danes preučujejo.",
         u"S svojimi daljnogledi je štirikrat skrbno pregledal vse nebo, ki ga je lahko videl iz Anglije. Pri tem je našel nov planet ­ Uran. Glavne raziskave je posvetil zvezdam. S svojimi daljnogledi je lahko prodrl globoko v vesolje. Pri tem je ugotovil, da Osončje ne miruje.",
         u"V vsakdanjem življenju imenujemo paradoks nekaj, kar je sicer resnično, pa vendar v nasprotju z našimi predstavami in izkušnjami. Sklepanje iz navidezno pravilnih dejstev, ki nas privedejo do nesmiselnega rezultata, ravno tako imenujemo paradoks.",
         u"Kako znan je bil ta priimek v svetu, pripoveduje naslednji dogodek. Ko je moral nekoč Herschel na meji pokazati potni list, je carinik začuden vzkliknil: \"Herschel, to vendar ni priimek, to je zvezda!\"",
         u"KADAR SLEDITE SVOJI SREČI, SE VAM BODO ODPRLA VRATA TAM, KODER STE MISLILI, DA JIH SPLOH NI; IN KODER TUDI NI VRAT ZA NIKOGAR DRUGEGA."
         u"Človeka osrečijo njegovi lastni napori, brž ko spozna potrebne prvine za srečo - preproste užitke, določeno mero poguma, nesebičnost, ljubezen do dela in predvsem čisto vest. Zdaj sem prepričana, da sreča niso le prazne sanje."];

def crypt(text):
    xyz = [x for x in abc]
    random.shuffle(xyz)
    return ''.join([xyz[abc.index(x)] if x in abc else x for x in text.upper()])

@app.route("/")
def index():
    return "TODO"

@app.route("/<difficulty>")
def play(difficulty):
    if (difficulty == "hard"):
        level = 2
    elif (difficulty == "medium"):
        level = 1
    else:
        level = 0
    text = textS[random.randrange(len(textS))]
    return render_template("substitution.play.html", nav = "substitution",
        level = level, input = crypt(text).replace('\n', '\\n'),
        foreign = len(set(['Q', 'W', 'X', 'Y']).intersection(text.upper())) > 0)
