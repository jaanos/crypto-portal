// VARIABLES
var cookie_name = "kriptogram_alphabet_points";
var expDays = 1;
var ansHist = [];
var histPtr = 0;

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
    console.log("read, hard");
}

function write_hard() {
    console.log("write, hard");
}

$( document ).ready(function() {
    checkCookie(cookie_name);
    
    $("#choices .btn").click(function() {
       var letter = getLetterFromURL($("#picture-letter img").attr("src"));
       if ((this.innerHTML).toUpperCase() === letter.toUpperCase()) {
           //console.log("OK");
           $(this).removeClass("btn-info");
           $(this).addClass("btn-success");
           //$("#next-arrow *").css('filter', 'brightness(100%)') // <-----------------------------------UREJANJE SVETLOSTI PUSCICE
           $("#next-arrow").attr("href", "next");// <-----------------------------------DODAJANJE HREFA
           addPoints(1);
       } else {
           //console.log("ERR");
           $(this).removeClass("btn-info");
           $(this).addClass("btn-danger");
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
                document.getElementById('letterInput').disabled = true;
                $("#letterInput").css('border-color', '#000000 #000000 rgb(36, 143, 36) #000000');
                //$("#next-arrow *").css('filter', 'brightness(100%)');
                $("#next-arrow").attr("href", "next");
                addPoints(1);
            }
            else{
                console.log("napacno");
                $("#letterInput").css('border-color', '#000000 #000000 rgb(128, 0, 0) #000000');
                removePoints(1);
            }
                
        }
    });
    
    //preveri vnos gesla ko je pritisnjen enter - branje hard
    /*
        $("#input-string-hard").keypress(function(e) {
        //Enter pressed?
        if(e.which == 10 || e.which == 13) {}
        });
    */
    
    $(".imageSelectionWrap #picture-letter").click(function() {
        var url = $(this).find(".imageSelection").attr("src");
        var letterSelected = getLetterFromURL(url);
        var letter = $(".level-write-easy #letterToGuess span").text();
        console.log(letter);
        if (letterSelected.toUpperCase() === letter.toUpperCase()) {
            $(this).css("background-color", "#5cb85c");
            $(this).css("border-color", "#4cae4c");
            $("#next-arrow").attr("href", "next");
            addPoints(1);
        } else {
            $(this).css("background-color", "#c9302c");
            $(this).css("border-color", "#ac2925");
            removePoints(1);
        }
    });
    
    /*
    *   ARROW LISTENERS
    */
    
    // Listens for click on "next arrow" (read-easy)
    $(".level-read-easy #next-arrow").click(function(e) {
        e.preventDefault();
        if ($("#next-arrow").attr("href") === "next") {
            if(histPtr >= ansHist.length)
            {
                addHistoryEasy();
                selectNewLetter(window.alphabet,"easy");
                histPtr++;
            }
            else if(histPtr+1 >= ansHist.length){
                selectNewLetter(window.alphabet,"easy");
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
            if(histPtr >= ansHist.length)
            {
                addHistoryMedium();
                selectNewLetter(window.alphabet,"medium");
                histPtr++;
            }
            else if(histPtr+1 >= ansHist.length){
                selectNewLetter(window.alphabet,"medium");
                histPtr++;
            }
            else{
                histPtr++;
                document.getElementById('letterInput').disabled = true;
                $("#letterInput").css('border-color', '#000000 #000000 rgb(36, 143, 36) #000000');
                restoreHistoryMedium();
            }
        }
    });
    
    // Listens for click on "prev arrow" (read-medium)
    $(".level-read-medium #prew-arrow").click(function(e) {
        e.preventDefault();
        if ($("#prew-arrow").attr("href") === "prew") {
            histPtr--;
            document.getElementById('letterInput').disabled = true;
            $("#letterInput").css('border-color', '#000000 #000000 rgb(36, 143, 36) #000000');
            restoreHistoryMedium();
        }
    });
    
    // Listens for click on "next arrow" (read-hard)
    $(".level-read-hard #next-arrow").click(function(e) {
        e.preventDefault();
        if ($("#next-arrow").attr("href") === "next") {
            selectNewWord(window.words);
        }
    });
    
    // Listens for click on "prev arrow" (read-hard)
    $(".level-read-hard #prew-arrow").click(function(e) {
        e.preventDefault();
    });
});

// Selects new letter, displays the picture and choices
function selectNewLetter(alphabet,mode) {
    var letter = alphabet[Math.floor(Math.random() * alphabet.length)];
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
    $(".level-read-"+mode+" #picture-letter img").attr("src", flagsDir + letter + ".png");
    
    //Clears inputs and options
    if(mode === "easy"){
        var buttons = document.getElementById('choices'),button;
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
        /*$("#prew-arrow *").css('filter', 'brightness(100%)');
        $("#next-arrow *").css('filter', 'brightness(50%)');*/
        $("#next-arrow").removeAttr("href");
        $("#prew-arrow").attr("href", "prew");
    }
        
    
    else if( mode === "medium"){
        document.getElementById('letterInput').value="";
        document.getElementById('letterInput').disabled = false;
        $("#letterInput").css('border-color', '#000000 #000000 #000000 #000000');
        /*$("#prew-arrow *").css('filter', 'brightness(100%)');
        $("#next-arrow *").css('filter', 'brightness(50%)');*/
        $("#next-arrow").removeAttr("href");
        $("#prew-arrow").attr("href", "prew");
    }
}


function selectNewWord(words) {
    console.log(words);
    var word = words[Math.floor(Math.random() * words.length)];
    word=word.split("");
    for(var i = 0; i < word.length; i++){
        //dodaj crto
    }
}

/*
*   HISTORY
*/

//Function adds current answer to history - READ_EASY
function addHistoryEasy(){
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
    }
    $(".level-read-easy #next-arrow").attr("href", "next");
}

//Function adds current answer to history - READ_MEDIUM
function addHistoryMedium(){
    var input = (document.getElementById('letterInput')).value;
    ansHist.push(input);
}

// Function adds prev. answer from history - READ_MEDIUM
function restoreHistoryMedium(){
    var output = ansHist[histPtr];
    (document.getElementById('letterInput')).value = output;
    $(".level-read-medium #picture-letter img").attr("src", flagsDir + output.toLowerCase() + ".png");
    if(histPtr === 0){
    $(".level-read-medium #prew-arrow").removeAttr("href");
    }
    $(".level-read-medium #next-arrow").attr("href", "next");
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
*  Support functions
*/

function shuffle(a) {
    for (let i = a.length; i; i--) {
        let j = Math.floor(Math.random() * i);
        [a[i - 1], a[j]] = [a[j], a[i - 1]];
    }
}

/* Returns letter from image link (e. g. returns "k" from "/static/images/flags/k.png") */
function getLetterFromURL(url) {
    var image_link = url.split("/");
    var image_name = image_link[image_link.length - 1];
    var letter = image_name.split(".")[0];
    return letter;
}
