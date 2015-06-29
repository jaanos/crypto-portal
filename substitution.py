# -*- coding: utf-8 -*-
from flask import *
import random
import json
import re

app = Blueprint('substitution', __name__)

abc = u"ABCČDEFGHIJKLMNOPQRSŠTUVWXYZŽ"
easy = [u"Med prvimi je zamisel o atomu razvil grški filozof Demokrit. Nekoč je sedel na kamnu ob morski obali, držal v roki jabolko in takole razmišljal, da če razreže jabolko na polovico, dobi pol jabolka, če nadaljuje s polovico, dobi četrtino in tako naprej. Vprašal se je, ali lahko režemo tako kar naprej. Demokrit je iz tega razmišljanja povzel, da je število delitev omejeno. Po določenem številu deljenj bi dobili delec, ki ga ne moremo deliti naprej. Ta delec je imenoval atom.",
        u"Pascal velja za enega največjih neuresničenih talentov v zgodovini matematike. Na žalost se  velikokrat ni ukvarjati z matematiko zaradi težav z zdravjem. Že kot otrok je bil Pascal velikokrat bolan. V šolo kasneje prav zaradi svojega krhkega zdravja ni hodil, pač pa je imel domačega učitelja. Njegov oče se je namreč bal, da bi se njegov sin zaradi učenja v šoli preveč izčrpal. Domačemu učitelju je celo naročil, naj da dečku predvsem dobro humanistično izobrazbo s poudarkom na latinskem in grškem jeziku, izogiba pa se naj zahtevne matematike.",
        u"Malo je ljudi v zgodovini znanosti in tehnike, ki bi toliko prispevali k splošnemu napredku človeštva kot prav Nikola Tesla. Že kot majhen otrok, si je dobro zapomnil stvari. To naj bi podedoval po materi. Zelo zgodaj je malega Nikola zanimala narava. Po opazovanju narave se je lotil tudi prvih poskusov. Še preden je bil star pet let, je skušal leteti kot ptič. Njegov polet se je končal s hudim pretresom možganov.",
        u"Ko je Nikola Tesla bil star devetnajst let, je začel študirati elektrotehniko. Pri študiju je bil zelo priden in tako zelo zagnan, da je dekan fakultete celo pisal njegovemu očetu, da naj sina vzame iz šole , ker študij škodljivo vpliva na njegovo zdravje. Očetu je moral obljubiti, da se bo tudi kaj zabaval. Začel je igrati karte. Zaradi sposobnosti kombinatornega mišljenja je večinoma dobival. Denar pa je na koncu vedno vračal tistim, ki so ga izgubili.",
        u"William Herschel se je zapisal v zgodovino astronomije kot konstruktor\ndaljnogledov, kot neumoren opazovalec neba, prvi raziskovalec Rimske ceste in drugih galaksij. Kot mladenič je iz rodne Nemčije pobegnil v Anglijo. V začetku je bil godbenik, komponist in učitelj glasbe, kasneje pa je spremenil poklic in postal eden največjih astronomov. Bil je samouk v glasbi in v astronomiji. Gradil je vse večje daljnoglede, ki jih je pošiljal na vse strani.",
        u"Kopernik je s svojim delom močno vplival na vso znanost in spremenil človekov pogled na svet. Živel in ustvarjal je na prehodu iz srednjega veka v novi vek, ko so fevdalno družbo pretresali pomembni dogodki. Znanje astronomije je bilo nujno potrebno pri trgovanju na dolgih morskih poteh. Misel o okrogli Zemlji je postajala splošno znana. Vsemu temu je sledila še  nova predstava o zgradbi vesolja. Do Kopernika so mislili, da je Zemlja nepremična, da leži v središču vesoljstva in da se vse zvezde, planeti, Sonce in Luna gibljejo okoli nje.",
        u"Rodil se je v revni kmečki družini v zasavskem hribovju. Kot matematika ga najbolj poznamo kot avtorja njegovih logaritmov, s katerimi so računali po svetu v znanosti, šolstvu in vsakdanjem življenju vse do množične uporabe elektronskih računalnikov. Kot profesor matematike na šoli je napisal matematična in fizikalna učbenika. Čeprav je Vega s svojimi logaritmi zaslovel predvsem kot matematik, je bil večji del njegovih razprav in učbenikov posvečenih fiziki. Njegova dela v fiziki zajemajo vsa področja mehanike, predvsem teorijo gravitacije in z njo povezano astronomijo.",
        u"Ideje o dveh gibanjih Zemlje, o vrtenju okoli njene osi in kroženju okoli Sonca, so izrekli že nekateri filozofi starega veka. Te misli so utonile v pozabo. Povzel jih je Kopernik, ki je postavil Sonce v središče našega planetnega sistema, Zemljo pa premaknil v vrsto planetov, ki se gibljejo okoli Sonca. Kopernikov nauk je pomenil prelom s številnimi tradicijami in dotedanjim svetovnim nazorom. Ves srednjeveški svet se je naslanjal na nespremenljivost obstoječega reda. Le drzni ljudje so si upali izreči misel o gibanju Zemlje.",
        u"William Herschel se je zapisal v zgodovino astronomije kot konstruktor daljnogledov, kot neumoren opazovalec neba, prvi raziskovalec Rimske ceste in drugih galaksij. Kot mladenič je iz rodne Nemčije pobegnil v Anglijo. V začetku je bil godbenik, komponist in učitelj glasbe, kasneje pa je spremenil poklic in postal eden največjih astronomov. Bil je samouk v glasbi in v astronomiji. Gradil je vse večje daljnoglede, ki jih je pošiljal na vse strani.",
        u"Kolmogorov se je ukvarjal s širokim poljem matematike. Opredelil je matematične osnove verjetnostne teorije in algoritmične teorije naključnosti ter prispeval ključne prispevke k osnovam statistčne mehanike, stohastičnih procesov, teorije informacije, mehanike tekočin in nelinearne dinamike. Vsa ta področja in njihovi odnosi so osnova za kompleksne sisteme, kot jih danes preučujejo.",
        u"S svojimi daljnogledi je štirikrat skrbno pregledal vse nebo, ki ga je lahko videl iz Anglije. Pri tem je našel nov planet Uran. Glavne raziskave je posvetil zvezdam. S svojimi daljnogledi je lahko prodrl globoko v vesolje. Pri tem je ugotovil, da Osončje ne miruje.",
        u"V vsakdanjem življenju imenujemo paradoks nekaj, kar je sicer resnično, pa vendar v nasprotju z našimi predstavami in izkušnjami. Sklepanje iz navidezno pravilnih dejstev, ki nas privedejo do nesmiselnega rezultata, ravno tako imenujemo paradoks.",
        u"Kako znan je bil ta priimek v svetu, pripoveduje naslednji dogodek. Ko je moral nekoč Herschel na meji pokazati potni list, je carinik začuden vzkliknil: \"Herschel, to vendar ni priimek, to je zvezda!\""]
medium = [  u"KADAR SLEDITE SVOJI SREČI SE VAM BODO ODPRLA VRATA TAM, KODER STE MISLILI, DA JIH SPLOH NI; IN KODER TUDI NI VRAT ZA NIKOGAR DRUGEGA.",
            u"Cauchyjevi matematični prispevki so bili briljantni ter so obsegali preko sedemsto člankov. S Cauchyjem se je začela doba moderne analize. V matematiko je vpeljal standarde preciznosti in strogosti, ki so presegli standarde Leibniza in Newtona.",
            u"Cauchy je najprej napisal obravnavo integralov, ki je postala osnova za moderno kompleksno analizo; nato je sledil članek o širjenju valov v tekočinah, za katerega je dobil nagrado francoske akademije; kasneje pa je napisal članek, ki predstavlja osnovo moderne teorije elastičnosti.",
            u"Cauchy je zgodnjo izobrazbo pridobil od svojega očeta, odvetnika in mojstra klasike. Najprej se je vpisal na študij inženirstva, zaradi slabega zdravja pa so mu svetovali, naj se osredotoči na matematiko. Njegova velika dela so se pričela s serijo briljantnih rešitev nekaterih težkih odprtih problemov.",
            u"Fisherjevi zapiski so opredelili statistiko kot posebno področje proučevanja, katerega metode lahko uporabimo v številnih panogah. Sistematiziral je matematično teorijo statistike in izumil številne nove metode. Slučajni primerjalni eksperiment je najbrž njegov največji dosežek.",
            u"Človeka osrečijo njegovi lastni napori, brž ko spozna potrebne prvine za srečo - preproste užitke, določeno mero poguma, nesebičnost, ljubezen do dela in predvsem čisto vest. Zdaj sem prepričana, da sreča niso le prazne sanje.",
            u"Ideje in metode, ki jih danes poznamo pod imenom statistika, so v devetnajstem in dvajsetem stoletju izumili ljudje, ki so se ukvarjali s problemi, pri katerih je bilo potrebno analizirati velike količine podatkov. Astronomija, biologija, družboslovne vede in celo geodezija lahko trdijo, da so igrale pomembno vlogo pri rojstvu statistike.",
            u"Ena izmed indijskih pravljic govori o preprostem fantu, ki je stehtal slona pri eni izmed mnogih preizkušenj, ki jih je moral prestati. Slona je zapeljal na čoln in na eni strani zaznamoval gladino vode. Nato je znosil na čoln toliko kamenja, da se je čoln znova potopil do oznake. Kamenje je seveda stehtal brez težav.",
            u"Po tem, ko se je Pascal prevrnil s konjsko vprego in komaj ostal živ, se je spremenil potek njegovega življenja. Dogodek mu je namreč predstavljal skrivnostno opozorilo, da Bogu ni všeč, da se ukvarja z matematiko. Odločil se je, da se poslej posveti izključno premišljevanju o veri in Bogu. Lotil se je pisanja zagovora krščanstva, a je njegovo delo ostalo nedokončano",
            u"Lagrange je bil sin javnega uslužbenca in se je rodil v Italiji. S šestnajstimi leti je začel študirati matematiko kot samouk in bil pri devetnajstih izbran za profesorja na kraljevski  šoli v Torinu. Naslednje leto je Lagrange poslal Eulerju rešitve nekaterih slavnih problemov, pri tem pa je uporabil nove metode, ki so se kasneje razvile v vejo analize, ki se imenuje analiza variacij."]
hard = easy[:]
random.seed("Random seed:)")
random.shuffle(hard)
texts = [easy, medium, hard]
random.seed()

def crypt(text):
    xyz = [x for x in abc]
    random.shuffle(xyz)
    return ''.join([xyz[abc.index(x)] if x in abc else x for x in text.upper()])

@app.route("/")
def index():
    return "TODO"

@app.route("/<difficulty>")
@app.route("/<difficulty>/<int:idx>")
def play(difficulty, idx=-1):
    if (difficulty == "hard"):
        level = 2
    elif (difficulty == "medium"):
        level = 1
    else:
        level = 0
    if idx < 0 or idx >= len(texts[level]):
        idx = random.randrange(len(texts[level]))
    text = texts[level][idx]
    if level == 2:
        text = re.sub(r'\s', '', text)
    return render_template("substitution.play.html",
        nav = "substitution", next = (idx+1) % len(texts[level]),
        difficulty = difficulty, level = level, input = json.dumps(crypt(text)),
        foreign = len(set(['Q', 'W', 'X', 'Y']).intersection(text.upper())) > 0)
