// VARIABLES
var cookie_name = "kriptogram_alphabet_points";
var expDays = 365;
var ansHist = [];
var histPtr = 0;
var curHandPos = [4,4];
// x = [right, left]
var positions = {
        'a':[1,0],'b':[2,0],'c':[3,0],'d':[0,4],'e':[0,5],'f':[0,6],
        'g':[0,7],'h':[2,1],'i':[1,3],'j':[4,6],'k':[1,4],'l':[1,5],
        'm':[1,6],'n':[1,7],'o':[2,3],'p':[2,4],'q':[2,5],'r':[2,6],
        's':[2,7],'t':[3,4],'u':[3,5],'v':[4,7],'w':[6,5],'x':[7,5],
        'y':[3,6],'z':[7,6],' ':[0,0],'init':[4,4]
    };

function initialize_alphabet(mode, level) {
    if (mode == "read") {
        if (level == "easy") {
            read_easy();
        } else if (level == "hard") {
            read_hard();
        }
    } else if (mode == "write") {
        if (level == "easy") {
            write_easy();
        } else if (level == "hard") {
            write_hard();
        }
    }
}

function read_easy() {
    console.log("read, easy");
    
}

function write_easy() {
    console.log("write, easy");
}

function read_hard() {
    // Clean up
    $(".level-read-hard .panel-body .well").html("");
    $("#input-string-hard").html("");
    $("#next-arrow").removeAttr("href");
    $("#start-animation").removeAttr("disabled");
    
    var word = selectNewWord(window.words);
    var letters = word.split("");
    for (i = 0; i < letters.length; i++) {
        var letter = letters[i];
        $(".level-read-hard .panel-body .well").append("<img src='" + flagsDir + letter + ".png' class='hidden'>");
        $("#input-string-hard").append('<input id = "letterInput" type="text" maxlength="1">');
    }
}

var zaseden = false;

function write_hard() {
    console.log("write, hard");
    semafor(positions['init']);
}

$( document ).ready(function() {
    checkCookie(cookie_name);
    
    $("#choices .btn").click(function() {
       var letter = getLetterFromURL($("#picture-letter img").attr("src"));
       if ((this.innerHTML).toUpperCase() === letter.toUpperCase()) {
           $(this).removeClass("btn-info");
           $(this).addClass("btn-success");
           $("#next-arrow").attr("href", "next");
           buttonsDisable();
           addHistoryEasy();
           addPoints(1);
       } else {
           $(this).removeClass("btn-info");
           $(this).addClass("btn-danger");
           $(this).attr("disabled", "disabled");
           removePoints(1);
       }
    });
    
    //BRANJE-SREDNJE: ob pritisku na enter preveri vnos
    $("#letterInput").keypress(function(e) {
        //Enter pressed?
        if(e.which == 10 || e.which == 13) {
            var vnos = (document.getElementById('letterInput')).value;
            console.log("crka: "+vnos);
            //preveri ce se vpisana crka ujema z resitvijo
            var image_link = $("#picture-letter img").attr("src").split("/");
            var image_name = image_link[image_link.length - 1];
            var letter = image_name.split(".")[0];
            
            console.log("Pravilna crka: "+letter+" vnos: "+vnos);
            
            if(vnos.toUpperCase() === letter.toUpperCase()){
                console.log("pravilno");
                //document.getElementById('letterInput').disabled = true;
                //$("#letterInput").css('border-color', '#000000 #000000 rgb(36, 143, 36) #000000');
                $("#letterInput").addClass("correctInput");
                $("#letterInput").removeClass("wrongInput");
                $("#next-arrow").attr("href", "next");
                document.getElementById('letterInput').disabled = true;
                addHistoryMedium();
                addPoints(1);
            }
            else{
                console.log("napacno");
                //$("#letterInput").css('border-color', '#000000 #000000 rgb(128, 0, 0) #000000');
                $("#letterInput").addClass("wrongInput");
                $("#letterInput").removeClass("correctInput");
                removePoints(1);
            }
                
        }
    });
    
    //preveri vnos gesla ko je pritisnjen enter - branje hard
    $("#input-string-hard").keypress(function(e) {
        //Enter pressed?
        if(e.which == 10 || e.which == 13) {
            var index = 0;
            var numWrongOrUnanswered = 0;
            var numWrong = 0; var numCorrect = 0;
            $("#input-string-hard #letterInput").each(function(index) {
                var input = $(this).val();
                var letter = getLetterFromURL($(".level-read-hard img:eq(" + index + ")").attr("src"));
                if (input.toUpperCase() === letter.toUpperCase()) {
                    // Correct input
                    $(this).addClass("correctInput");
                    $(this).removeClass("wrongInput");
                    numCorrect++;
                } else {
                    if (input !== "") {
                        // Wrong input
                        $(this).addClass("wrongInput");
                        numWrong++;
                    } else {
                        // Empty input
                        $(this).removeClass("wrongInput");
                    }
                    $(this).removeClass("correctInput");
                    numWrongOrUnanswered++;
                }
                index++;
            });
            if (numWrongOrUnanswered == 0) {
                $("#next-arrow").attr("href", "next");
                addPoints(numCorrect);
                console.log("Dodajam " + numCorrect);
            } else {
                removePoints(numWrong);
            }
        }
    });
    
    // PISANJE - EASY preverjanje pravilnosti
    $(".imageSelectionWrap #picture-letter").click(function() {
        if ($(this).hasClass("not_active")) return;
        var url = $(this).find(".imageSelection").attr("src");
        var letterSelected = getLetterFromURL(url);
        var letter = $(".level-write-easy #letterToGuess span").text();
        console.log(letter);
        if (letterSelected.toUpperCase() === letter.toUpperCase()) {
            //$(this).css("background-color", "#5cb85c");
            //$(this).css("border-color", "#4cae4c");
            $(this).addClass("correctInput");
            $(this).removeClass("wrongInput");
            $("#next-arrow").attr("href", "next");
            addPoints(1);
            imageButtonsDisable($(this).parent().parent());
            addHistoryWriteEasy();
        } else {
            //$(this).css("background-color", "#c9302c");
            //$(this).css("border-color", "#ac2925");
            $(this).removeClass("correctInput");
            $(this).addClass(("wrongInput"));
            removePoints(1);
            imageOneButtonDisable(this);
        }
    });
    
    $("#start-animation").click(function() {
        $(this).attr("disabled", "disabled");
        displaySequenceOfImages(".level-read-hard .well img", 0);
    });
    
    /*
    *   ARROW LISTENERS
    */
    
    // Listens for click on "next arrow" (read-easy)
    $(".level-read-easy #next-arrow").click(function(e) {
        e.preventDefault();
        if ($("#next-arrow").attr("href") === "next") {
            if(histPtr >= ansHist.length || histPtr+1 >= ansHist.length)
            {
                selectAndDisplayNewLetter(window.alphabet,"easy");
                histPtr++;
            }
            else{
                histPtr++;
                restoreHistoryEasy();
            }
        }
        
    });
    
    // Listens for click on "prew arrow" (read-easy)
    $(".level-read-easy #prew-arrow").click(function(e) {
        e.preventDefault();
        if ($("#prew-arrow").attr("href") === "prew") {
            histPtr--;
            restoreHistoryEasy();
        }
    });
    
    // Listens for click on "next arrow" (read-medium)
    $(".level-read-medium #next-arrow").click(function(e) {
        e.preventDefault();
        if ($("#next-arrow").attr("href") === "next") {
            $("#letterInput").removeClass("correctInput");
            if(histPtr >= ansHist.length || histPtr+1 >= ansHist.length)
            {
                selectAndDisplayNewLetter(window.alphabet,"medium");
                histPtr++;
            }
            else{
                histPtr++;
                $("#letterInput").addClass("correctInput");
                restoreHistoryMedium();
            }
        }
    });
    
    // Listens for click on "prev arrow" (read-medium)
    $(".level-read-medium #prew-arrow").click(function(e) {
        e.preventDefault();
        if ($("#prew-arrow").attr("href") === "prew") {
            histPtr--;
            //document.getElementById('letterInput').disabled = true;
            //$("#letterInput").css('border-color', '#000000 #000000 rgb(36, 143, 36) #000000');
            $("#letterInput").addClass("correctInput");
            restoreHistoryMedium();
        }
    });
    
    // Listens for click on "next arrow" (read-hard)
    $(".level-read-hard #next-arrow").click(function(e) {
        e.preventDefault();
        read_hard();
    });
    
    // Listens for click on "prev arrow" (read-hard)
    $(".level-read-hard #prew-arrow").click(function(e) {
        e.preventDefault();
    });
    
    // Listens for click on "next arrow" (write-easy)
    $(".level-write-easy #next-arrow").click(function(e) {
        e.preventDefault();
        if ($("#next-arrow").attr("href") === "next") {
            if(histPtr >= ansHist.length || histPtr+1 >= ansHist.length){
                selectAndDisplayNewImage(alphabet, "easy");
                imageButtonsEnable($(this).parent().parent());
                histPtr++;
            }
            else{
                histPtr++;
                restoreHistoryWriteEasy();
            }
        }
    });
    
    // Listens for click on "prew arrow" (write-easy)
    $(".level-write-easy #prew-arrow").click(function(e) {
        e.preventDefault();
        if ($("#prew-arrow").attr("href") === "prew") {
            histPtr--;
            restoreHistoryWriteEasy();
        }
    });
    
    // WRITE-HARD CONTROLS
    // Listens for click on "left-back" (write-hard)
    $(".level-write-hard #left-back").click(function(e) {
        console.log("LEFT-BACK (NEPREVERJENO)");
        semafor([curHandPos[0],curHandPos[1]-1]);
        if ($("#left-back").attr("href") === "left_back") {
            console.log("LEFT-BACK (PREVERJENO)");
        }
    });
    
    // Listens for click on "left-forw" (write-hard)
    $(".level-write-hard #left-forw").click(function(e) {
        console.log("LEFT-FORW (NEPREVERJENO)");
        semafor([curHandPos[0],curHandPos[1]+1]);
        semafor();
        if ($("#left-forw").attr("href") === "left_forw") {
            console.log("LEFT-FORWK (PREVERJENO)");
        }
    });
    
    // Listens for click on "right-back" (write-hard)
    $(".level-write-hard #right-back").click(function(e) {
        console.log("RIGHT-BACK (NEPREVERJENO)");
        semafor([curHandPos[0]+1,curHandPos[1]]);
        if ($("#right-back").attr("href") === "rigth_back") {
            console.log("RIGHT-BACK (PREVERJENO)");
        }
    });
    
    // Listens for click on "right-forw" (write-hard)
    $(".level-write-hard #right-forw").click(function(e) {
        console.log("RIGHT-PREW (NEPREVERJENO)");
        semafor([curHandPos[0]-1,curHandPos[1]]);
        if ($("#right-forw").attr("href") === "right-forw") {
            console.log("RIGHT-FORW (PREVERJENO)");
        }
    });
    
});

// Selects new letter, displays the picture and choices
function selectAndDisplayNewLetter(alphabet, mode) {
    var letter = selectNewLetter(alphabet);
    var choices = selectChoices(alphabet, letter);
    
    $(".level-read-"+mode+" #picture-letter img").attr("src", flagsDir + letter + ".png");
    
    //Clears inputs and options
    if(mode === "easy") {
        clearSelectedOptions("choices", choices);
    } else if( mode === "medium") {
        clearInput("letterInput");
    }
}

function selectAndDisplayNewImage(alphabet, mode) {
    var letter = selectNewLetter(alphabet);
    var choices = selectChoices(alphabet, letter);
    
    $("#letterToGuess span").text(letter.toUpperCase());
    clearSelectedImages("#coreLogic #picture-letter", choices);
}

function selectNewLetter(alphabet) {
    return alphabet[Math.floor(Math.random() * alphabet.length)];
}

function selectNewWord(words) {
    words = words.split(", ");
    var word = words[Math.floor(Math.random() * words.length)];
    var re = new RegExp("&#39;", 'g');
    word = word.replace(re, "");
    word = word.replace("[","");
    word = word.replace("]","");
    return word;
}

function selectChoices(alphabet, letter) {
    var choices=[];
    choices[0] = letter;
    for(var i = 1; i < 4; i++){
        var tmp = alphabet[Math.floor(Math.random() * alphabet.length)];
        if(choices.includes(tmp)){
            i--;
            continue;
        }
        else{
           choices[i] = tmp;
        }
    }
    shuffle(choices);
    return choices;
}

function clearSelectedOptions(elementID, choices) {
    var buttons = document.getElementById(elementID),button;
    var j = 0;
    for(i = 0; i < buttons.children.length; i++){
        button = buttons.children[i];
        var buttonClass = button.className;
        if(buttonClass !== ""){
             button.className = "btn btn-info btn-letter";
             button.innerHTML = choices[j].toUpperCase();
             button.disabled=false;
             j++;
        }
    }
    $("#next-arrow").removeAttr("href");
    $("#prew-arrow").attr("href", "prew");
}

function clearSelectedImages(elementID, choices) {
    var i = 0;
    $(elementID).each(function() {
        $(this).find("img").attr("src", flagsDir + choices[i].toLowerCase() + ".png");
        $(this).removeClass("wrongInput");
        $(this).removeClass("correctInput");
        i++;
    });
    $("#next-arrow").removeAttr("href");
    $("#prew-arrow").attr("href", "prew");
}

function clearInput(elementID) {
    document.getElementById(elementID).value="";
    document.getElementById(elementID).disabled = false;
    $(elementID).removeClass("correctInput");
    $(elementID).removeClass("wrongInput");
    $("#next-arrow").removeAttr("href");
    $("#prew-arrow").attr("href", "prew");
}

/*
*   HISTORY
*/

//Function adds current answer to history - READ_EASY
function addHistoryEasy(){
    if(histPtr >= ansHist.length){
    var state="";
    var buttons = document.getElementById('choices'),button;
    for(var i = 0; i < buttons.children.length; i++){
        button = buttons.children[i];
        var buttonClass = button.className;
        var buttonLetter = button.innerHTML;
        if(state!="")state+=",";
        if(buttonClass.includes("btn-info")){
           state+=buttonLetter+"I"
        }
        else if(buttonClass.includes("btn-danger")){
            state+=buttonLetter+"D"
        }
        else if(buttonClass.includes("btn-success")){
            state+=buttonLetter+"S"
        }
    }
    ansHist.push(state);
    }
    //histPtr++;
}

// Function adds prev. answer from history - READ_EASY
function restoreHistoryEasy(){
    var ans = ansHist[histPtr].split(",");
    var buttons = document.getElementById('choices'),button;
    var j = 0;
    for(var i = 0; i < buttons.children.length; i++){
        button = buttons.children[i];
        var letter = (ans[j].split(""))[0];
        var colour = (ans[j].split(""))[1];
        if(colour == 'I'){
            button.className = "btn btn-info btn-letter";
        }
        else if(colour == 'D'){
            button.className = "btn btn-letter btn-danger";
        }
        else if(colour == 'S'){
            button.className = "btn btn-letter btn-success";
            $(".level-read-easy #picture-letter img").attr("src", flagsDir + letter.toLowerCase() + ".png");
        }
        button.innerHTML = letter;
        button.disabled=true;
        j++;
    }
    if(histPtr === 0){
        $(".level-read-easy #prew-arrow").removeAttr("href");
    }else{
        $(".level-read-easy #prew-arrow").attr("href", "prew");
    }
    $(".level-read-easy #next-arrow").attr("href", "next");
}

//Function adds current answer to history - READ_MEDIUM
function addHistoryMedium(){
    if(histPtr >= ansHist.length){
        var input = (document.getElementById('letterInput')).value;
        ansHist.push(input);
    }
}

// Function adds prev. answer from history - READ_MEDIUM
function restoreHistoryMedium(){
    var output = ansHist[histPtr];
    (document.getElementById('letterInput')).value = output;
    document.getElementById('letterInput').disabled = true;
    $(".level-read-medium #picture-letter img").attr("src", flagsDir + output.toLowerCase() + ".png");
    if(histPtr === 0){
        $(".level-read-medium #prew-arrow").removeAttr("href");
    }else{
        $(".level-read-medium #prew-arrow").attr("href", "prew");
    }
    $(".level-read-medium #next-arrow").attr("href", "next");
}

//Function adds current answer to history - WRITE_EASY
function addHistoryWriteEasy(){
    console.log("dodal bom v zgodovino");
    if(histPtr >= ansHist.length){
    var state="";
    var buttons = document.getElementById('choices');
    for(var i = 0; i < buttons.children.length; i++){
        var buttonClass = (buttons.children[i]).getElementsByTagName('div')[0].className;
        var buttonLetter = getLetterFromURL((((buttons.children[i]).getElementsByTagName('div')[0]).getElementsByTagName('img')[0].src));
        console.log("CRKA: " + buttonLetter);
        if(state!="")state+=",";
        /*if(buttonClass == 'well'){
             state+=buttonLetter+"I"
        }
        else if(buttonClass == 'well wrongInput'){
             state+=buttonLetter+"D"
        }
        else if(buttonClass == 'well correctInput'){
             state+=buttonLetter+"S"
        }*/
        if ($(buttons.children[i]).find(".image_option").hasClass("wrongInput")) {
            state+=buttonLetter+"D"
        } else if ($(buttons.children[i]).find(".image_option").hasClass("correctInput")) {
            state+=buttonLetter+"S"
        } else {
            state+=buttonLetter+"I"
        }
    }
    ansHist.push(state);
    console.log("IZHOD: " + ansHist);
    }
}

// Function adds prev. answer from history - WRITE_EASY
function restoreHistoryWriteEasy(){
    console.log("ZGODOVINA: "+ansHist[histPtr]);
    console.log(histPtr + " " + ansHist);
    var ans = ansHist[histPtr].split(",");
    var buttons = document.getElementById('choices');
    imageButtonsDisable($("#choices"));
    //console.log(buttons.children[0],buttons.children[1]);
    //console.log((buttons.children[0]).getElementsByTagName('div')[0]);//<---- NJEMU SPREMENI CLASS ZA BARVO
    //console.log(((buttons.children[0]).getElementsByTagName('div')[0]).getElementsByTagName('a'));//<---- NJEMU SPREMENI LINK
    var j = 0;
    for(var i = 0; i < buttons.children.length; i++){
        var letter = (ans[j].split(""))[0];
        var colour = (ans[j].split(""))[1];
        // id-ju picture-letter doda class
        if(colour == 'I'){
            console.log("I");
            //buttons.children[i].getElementsByTagName('div')[0].className = "well image_option";
            //buttons.children[i].getElementsByTagName('div')[0].getElementsByTagName('img')[0].src=flagsDir + letter.toLowerCase() + ".png";
            $(buttons.children[i]).find(".image_option").removeClass("wrongInput").removeClass("correctInput");
            $(buttons.children[i]).find(".image_option img").attr("src", flagsDir + letter.toLowerCase() + ".png");
        }
        else if(colour == 'D'){
            console.log("D");
            //(buttons.children[i]).getElementsByTagName('div')[0].className = "well image_option wrongInput";
            //buttons.children[i].getElementsByTagName('div')[0].getElementsByTagName('img')[0].src=flagsDir + letter.toLowerCase() + ".png";
            $(buttons.children[i]).find(".image_option").addClass("wrongInput").removeClass("correctInput");
            $(buttons.children[i]).find(".image_option img").attr("src", flagsDir + letter.toLowerCase() + ".png");
        }
        else if(colour == 'S'){
            console.log("S");
            //(buttons.children[i]).getElementsByTagName('div')[0].className = "well image_option correctInput";
            //doda sliko
            //buttons.children[i].getElementsByTagName('div')[0].getElementsByTagName('img')[0].src=flagsDir + letter.toLowerCase() + ".png";
            //doda crko
            $(buttons.children[i]).find(".image_option").addClass("correctInput").removeClass("wrongInput");
            $(buttons.children[i]).find(".image_option img").attr("src", flagsDir + letter.toLowerCase() + ".png");
            $("#letterToGuess span").text(letter.toUpperCase());
        }
        //((buttons.children[i]).getElementsByTagName('div')[0]).getElementsByTagName('img')[0].src = flagsDir + letter.toLowerCase() + ".png";
        //button.disabled=true; TO-DO : disable
        j++;
    }
    console.log("POINTER: " + histPtr);
    if(histPtr === 0){
        $(".level-write-easy #prew-arrow").removeAttr("href");
    }else{
        $(".level-write-easy #prew-arrow").attr("href", "prew");
    }
    $(".level-write-easy #next-arrow").attr("href", "next");
}

/* COOKIES - stores number of points */

function setCookie(cname, cvalue, exdays) {
    var d = new Date();
    d.setTime(d.getTime() + (exdays * 24 * 60 * 60 * 1000));
    var expires = "expires="+d.toUTCString();
    document.cookie = cname + "=" + cvalue + ";" + expires + ";path=/";
}

function getCookie(cname) {
    var name = cname + "=";
    var ca = document.cookie.split(';');
    for(var i = 0; i < ca.length; i++) {
        var c = ca[i];
        while (c.charAt(0) == ' ') {
            c = c.substring(1);
        }
        if (c.indexOf(name) == 0) {
            return c.substring(name.length, c.length);
        }
    }
    return "";
}

function checkCookie(cname) {
    var points = getCookie(cname);
    if (points != "") {
        setPoints(points);
    } else {
        points = 0;
        setCookie(cname, points, expDays);
    }
}

function setPoints(points) {
    $("#points #poits-display").text(Number(points));
}

function addPoints(pointsAdded) {
    var pointsNow = Number($("#points #poits-display").text()) + pointsAdded;
    setPoints(pointsNow);
    setCookie(cookie_name, pointsNow, expDays);
}

function removePoints(pointsRemoved) {
    var pointsNow = Number($("#points #poits-display").text()) - pointsRemoved;
    if (pointsNow < 0) {
        pointsNow = 0;
    }
    setPoints(pointsNow);
    setCookie(cookie_name, pointsNow, expDays);
}

/*
 *  Display sequence of images
 */

function displaySequenceOfImages(elements, index) {
    if (index <= $(elements).length) {
        if (index > 0) {
            $(elements + ":eq(" + (index - 1) + ")").addClass("hidden");
        }
        $(elements + ":eq(" + index + ")").removeClass("hidden");
        setTimeout(function() {
            displaySequenceOfImages(elements, (index + 1))
        }, 1000);
    }
}


/*
 *  Support functions
 */

function shuffle(a) {
    for (let i = a.length; i; i--) {
        let j = Math.floor(Math.random() * i);
        [a[i - 1], a[j]] = [a[j], a[i - 1]];
    }
}

// Disables all "choices" - buttons 
function buttonsDisable(){
    var buttons = document.getElementById('choices'),button;
    for(var i = 0; i < buttons.children.length; i++){
        button = buttons.children[i];
        button.disabled=true;
    }
}

// Disables all "choices" - ImageButtons 
function imageButtonsDisable(parent){ //doda class not_active
    console.log("P:" + parent);
    $(parent).find(".image_option").addClass("not_active");
}

function imageOneButtonDisable(element){
    $(element).addClass("not_active");
}

function imageButtonsEnable(parent) {
    $(parent).find(".image_option").removeClass("not_active");
}

/* Returns letter from image link (e. g. returns "k" from "/static/images/flags/k.png") */
function getLetterFromURL(url) {
    var image_link = url.split("/");
    var image_name = image_link[image_link.length - 1];
    var letter = image_name.split(".")[0];
    return letter;
}

/* sleep for "delay" miliseconds*/
function sleep(delay) {
    var start = new Date().getTime();
    while (new Date().getTime() < start + delay);
}


/*
*   TMP
*/

// Zacasna funkcija - test premikanja rok
function semafor(letter){
    console.log("V semaforju sem dobil: "+letter);
    console.log("trenutna pozicija rok: "+curHandPos);
    var canvas = document.getElementById("semaphoreCanvas");
    var context = canvas.getContext("2d");
    context.clearRect(0, 0, canvas.width, canvas.height);
    var crka = letter;
    drawBody();
    //drawLeftFlag(Math.abs(curHandPos[0]-4)*45);
    //drawRightFlag(Math.abs(curHandPos[1]-4)*45);
    animate(letter);
    curHandPos = letter;
    console.log("preden oddidem je nastavim curHandPos: "+curHandPos);
}

// Function for flag aimation
function animate(letter){
    zaseden = true;
    var canvas = document.getElementById("semaphoreCanvas");
    var context = canvas.getContext("2d");
    var angR =  Math.abs(curHandPos[0]-4)*45; //start angle for right flag 
    var angL = Math.abs(curHandPos[1]-4)*45;; //start angle for left flag
    var fps = 50 / 25; //number of frames per sec
    var cache = this; //cache the local copy of image element for future reference
 
    var angRend = Math.abs(letter[0]-4)*45;
    var angLend = Math.abs(letter[1]-4)*45;
    var myVar = setInterval(function () {
        context.clearRect(0, 0, canvas.width, canvas.height);
        if(angR < angRend){
            angR+=3;
        }
        if(angL < angLend){
            angL+=3;
        }  
        drawBody();
        drawRightFlag(angR);
        drawLeftFlag(angL);
        if(angR >= angRend && angL >= angLend){
            clearInterval(myVar);
            zaseden = false;
            console.log("DAL SEM ZASEDEN NA FALSE")
            return;
        }
    }, fps);
}

// Funkcije za risanje zastavic in telesa
function drawLeftFlag(ang){
    // INIT
    var canvas = document.getElementById("semaphoreCanvas");
    var context = canvas.getContext("2d");
    var centerX = canvas.width / 2;
    var centerY = canvas.height / 2;
    
    // Prop. of body
    var imgBodyWidth = canvas.width*1/4; 
    var imgBodyHeight = canvas.height*3/5;
    
    var leftFlag = new Image();
    leftFlag.src = "/static/left_flag.png";
    
    //Image prop.
    var imgWidth = canvas.width*1/5; 
    var imgHeight = canvas.height*1/2;
    
    var imgPozX = centerX + (imgBodyWidth/2);
    var imgPozY = centerY - (imgHeight);
    
    //Draw image
    leftFlag.onload = function() {
        context.save();
        context.translate(imgPozX, imgPozY+imgHeight); //Move center point of rotation in flag handle
        context.rotate(Math.PI / 180 * ang); //increment the angle and rotate the image 
        context.translate(-(imgPozX), -(imgPozY+imgHeight)); //Move center point of rotation back
        context.drawImage(leftFlag,imgPozX,imgPozY,imgWidth,imgHeight);
        context.restore();
    };
}

function drawRightFlag(ang){
     // INIT
    var canvas = document.getElementById("semaphoreCanvas");
    var context = canvas.getContext("2d");
    var centerX = canvas.width / 2;
    var centerY = canvas.height / 2;
    
    // Prop. of body
    var imgBodyWidth = canvas.width*1/4; 
    var imgBodyHeight = canvas.height*3/5;
    
    var rightFlag = new Image();
    rightFlag.src = "/static/right_flag.png";
    
    //Image prop.
    var imgWidth = canvas.width*1/5; 
    var imgHeight = canvas.height*1/2;
    
    var imgPozX = centerX - (imgWidth) - (imgBodyWidth/2) ;
    var imgPozY = centerY - (imgHeight);
    
    //Draw image
    rightFlag.onload = function() {
        context.save();
        context.translate(imgPozX+imgWidth, imgPozY+imgHeight); //Move center point of rotation in flag handle
        context.rotate(-Math.PI / 180 * ang); //increment the angle and rotate the image 
        context.translate(-(imgPozX+imgWidth), -(imgPozY+imgHeight)); //Move center point of rotation back
        context.drawImage(rightFlag,imgPozX,imgPozY,imgWidth,imgHeight);
        context.restore();
    };
}

function drawBody(){
     // INIT
    var canvas = document.getElementById("semaphoreCanvas");
    var context = canvas.getContext("2d");
    var centerX = canvas.width / 2;
    var centerY = canvas.height / 2;
    
    var imgBodyWidth = canvas.width*1/4; 
    var imgBodyHeight = canvas.height*3/5;
    
    //Body base
    var body_base = new Image();
    body_base.src = "/static/basic_figure.png";
    body_base.onload = function() {
        //Image prop.
        var imgPozX = centerX - (imgBodyWidth/2);
        var imgPozY = centerY - (imgBodyHeight/2);
        
        context.drawImage(body_base,imgPozX,imgPozY,imgBodyWidth,imgBodyHeight);
    };
}