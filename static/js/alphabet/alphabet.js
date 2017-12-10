// VARIABLES
var alphabet;
var cookie_name = "kriptogram_alphabet_points";
var expDays = 365;
var ansHist = [];
var histPtr = 0;
var curHandPos = [0,0]; // [right,left]
//var pointsForRightAnswerReadEasy = 3;<-- not in use
var pointsForClueReadMedium = 30;
var pointsForClueReadHard = 50;
var userAnswers = [];
var readHardTimer;
var prevLetter = "-";
var positions = {   // x = [right, left]
        'a':[225,180],'b':[270,180],'c':[315,180],'d':[0,180],'e':[180,45],'f':[180,90],
        'g':[180,135],'h':[270,225],'i':[225,315],'j':[0,90],'k':[225,0],'l':[225,45],
        'm':[225,90],'n':[225,135],'o':[270,315],'p':[270,0],'q':[270,45],'r':[270,90],
        's':[270,135],'t':[315,0],'u':[315,45],'v':[0,135],'w':[45,90],'x':[45,135],
        'y':[315,90],'z':[135,90],' ':[180,180],'init':[0,0],
    };
var middlePointRight, middlePointLeft;
var alphabetName;
var isMobile = false;
var clickCounterMobile = 0;
var lastClickedElementMobile = null;
var dragedImageData = null;
var newTaskSize = null;
var imageGeneralDir = staticDir + "images/alphabet/"


// INITIALIZATION
function initialize_alphabet(mode, level, alphabetForLearning) {
    // device detection
    if(/(android|bb\d+|meego).+mobile|avantgo|bada\/|blackberry|blazer|compal|elaine|fennec|hiptop|iemobile|ip(hone|od)|ipad|iris|kindle|Android|Silk|lge |maemo|midp|mmp|netfront|opera m(ob|in)i|palm( os)?|phone|p(ixi|re)\/|plucker|pocket|psp|series(4|6)0|symbian|treo|up\.(browser|link)|vodafone|wap|windows (ce|phone)|xda|xiino/i.test(navigator.userAgent) 
    || /1207|6310|6590|3gso|4thp|50[1-6]i|770s|802s|a wa|abac|ac(er|oo|s\-)|ai(ko|rn)|al(av|ca|co)|amoi|an(ex|ny|yw)|aptu|ar(ch|go)|as(te|us)|attw|au(di|\-m|r |s )|avan|be(ck|ll|nq)|bi(lb|rd)|bl(ac|az)|br(e|v)w|bumb|bw\-(n|u)|c55\/|capi|ccwa|cdm\-|cell|chtm|cldc|cmd\-|co(mp|nd)|craw|da(it|ll|ng)|dbte|dc\-s|devi|dica|dmob|do(c|p)o|ds(12|\-d)|el(49|ai)|em(l2|ul)|er(ic|k0)|esl8|ez([4-7]0|os|wa|ze)|fetc|fly(\-|_)|g1 u|g560|gene|gf\-5|g\-mo|go(\.w|od)|gr(ad|un)|haie|hcit|hd\-(m|p|t)|hei\-|hi(pt|ta)|hp( i|ip)|hs\-c|ht(c(\-| |_|a|g|p|s|t)|tp)|hu(aw|tc)|i\-(20|go|ma)|i230|iac( |\-|\/)|ibro|idea|ig01|ikom|im1k|inno|ipaq|iris|ja(t|v)a|jbro|jemu|jigs|kddi|keji|kgt( |\/)|klon|kpt |kwc\-|kyo(c|k)|le(no|xi)|lg( g|\/(k|l|u)|50|54|\-[a-w])|libw|lynx|m1\-w|m3ga|m50\/|ma(te|ui|xo)|mc(01|21|ca)|m\-cr|me(rc|ri)|mi(o8|oa|ts)|mmef|mo(01|02|bi|de|do|t(\-| |o|v)|zz)|mt(50|p1|v )|mwbp|mywa|n10[0-2]|n20[2-3]|n30(0|2)|n50(0|2|5)|n7(0(0|1)|10)|ne((c|m)\-|on|tf|wf|wg|wt)|nok(6|i)|nzph|o2im|op(ti|wv)|oran|owg1|p800|pan(a|d|t)|pdxg|pg(13|\-([1-8]|c))|phil|pire|pl(ay|uc)|pn\-2|po(ck|rt|se)|prox|psio|pt\-g|qa\-a|qc(07|12|21|32|60|\-[2-7]|i\-)|qtek|r380|r600|raks|rim9|ro(ve|zo)|s55\/|sa(ge|ma|mm|ms|ny|va)|sc(01|h\-|oo|p\-)|sdk\/|se(c(\-|0|1)|47|mc|nd|ri)|sgh\-|shar|sie(\-|m)|sk\-0|sl(45|id)|sm(al|ar|b3|it|t5)|so(ft|ny)|sp(01|h\-|v\-|v )|sy(01|mb)|t2(18|50)|t6(00|10|18)|ta(gt|lk)|tcl\-|tdg\-|tel(i|m)|tim\-|t\-mo|to(pl|sh)|ts(70|m\-|m3|m5)|tx\-9|up(\.b|g1|si)|utst|v400|v750|veri|vi(rg|te)|vk(40|5[0-3]|\-v)|vm40|voda|vulc|vx(52|53|60|61|70|80|81|83|85|98)|w3c(\-| )|webc|whit|wi(g |nc|nw)|wmlb|wonu|x700|yas\-|your|zeto|zte\-/i.test(navigator.userAgent.substr(0,4))) isMobile = true
    
    //console.log("naprava isMobile: " + isMobile);
    alphabetName = alphabetForLearning;
    refresh();
    // Get ready to watch user inputs
    for (var i = 0; i < alphabet.length; i++) {
        userAnswers[alphabet[i]] = 0;
    }
    if (mode == "read") {
        if (level == "easy") {
            read_easy();
        } else if (level == "medium") {
            read_medium();
        } else if (level == "hard") {
            read_hard();
        }
    } else if (mode == "write") {
        if (level == "easy") {
            write_easy();
        } else if (level == "medium") {
            if(alphabetForLearning == "flags")
                write_medium();
            else write_medium_generic();
        } else if (level == "hard") {
            if(alphabetForLearning == "flags")
                write_hard();
            else write_hard_generic();
        }
    }
}

function read_easy() {
}

function read_medium() {
    $("#read_medium_solution").removeAttr("disabled");
    setTimeout(function() {
        $("#letterInput").focus();
    }, 500);
}

function read_hard() {
    // Clean up
    $(".level-read-hard .panel-body .well").html("");
    $("#input-string-hard").html("");
    $("#next-arrow").removeAttr("href");
    $("#start-animation").removeAttr("disabled");
    $("#start-animation").removeClass("used");
    $("#start-animation").text("Začni!");
    
    var word = selectNewWord(window.words);
    while (! isValidWord(word, alphabet)) {
        word = selectNewWord(window.words);
    }
    var letters = word.split("");
    var idNumber = 1;
    $(".level-read-hard .panel-body .well").append("<img src='" + imageGeneralDir + "blank.png' class=''>");
    for (i = 0; i < letters.length; i++) {
        var letter = letters[i];
        $(".level-read-hard .panel-body .well").append("<img src='" + flagsDir + letter + ".png' class='hidden'>");
        $("#input-string-hard").append('<input id="num' + idNumber + '" class = "letterInputClass" type="text" maxlength="1" onkeyup="focusNext(event, \'#num' + (idNumber+1) + '.letterInputClass\')">');
        idNumber++;
    }
}

function write_easy() {
}

function write_medium() {
    setFigure();
    setFlagsMedium();
}

function write_hard() {
    setFigure();
}

function write_medium_generic(){
    var taskCharacter = $("#letterToGuess").text();
    //izbere 9 + 1 prava crk iz abecede
    var choices = selectNewChoiceBundle(window.alphabet, taskCharacter);
    
    var spacing = ($(".multipleImageContainer").width())/11;
    //console.log("spacing: "+spacing);
    
    //pripravi izbiro slik
    for(var i = 0; i < choices.length; i++){
        $(".multipleImageContainer").append("<div class='imgContain'><a href='active'><img class='multipleImages' src='"+flagsDir + choices[i].toLowerCase() + ".png' /></a></div>");
    }
    
    $('.imgContain a img').click(function (e) {
        e.preventDefault();
        if(isMobile){
            clickCounterMobile+=1;
            if(clickCounterMobile < 2) return;
            else if(lastClickedElementMobile != e.target){
                lastClickedElementMobile = e.target;
                clickCounterMobile = 1;
                return;
            }
            clickCounterMobile = 0;
        }
        if($(this).parent().attr("href") == "active"){
            var chosen = getLetterFromURL($(this).attr('src')).toLowerCase();
            var right = $("#letterToGuess span").text().toLowerCase();
            if(chosen == right){
                //zeleno
                $(this).parent().parent().addClass("success"); //-> disable all
                $(".multipleImageContainer .imgContain a").removeAttr("href");
                $(".multipleImageContainer .imgContain").addClass("disabled");
                $(".level-write-medium #next-arrow-generic").attr("href","next");
                $(".level-write-medium #next-arrow").attr("href", "next");
                
                // History
                if(histPtr == 0 && ansHist > 1 ){
                    addHistoryWriteMediumGeneric(0,1);
                }
                else{
                    addHistoryWriteMediumGeneric(1,1);
                }
                // Points and learning progress
                addPoints(1); 
                moveToLearnt(right);
            }
            else{
                $(this).parent().parent().addClass("err");
                $(this).parent().parent().addClass("disabled");
                $(this).parent().removeAttr("href");
                
                // History
                if(histPtr == 0 && ansHist > 1 ){
                    addHistoryWriteMediumGeneric(0,0);
                }
                else{
                    addHistoryWriteMediumGeneric(1,0);
                }
                // Points and learning progress
                removePoints(1);
                moveToNotLearnt(right,0.5);
            }
        }
    });
}

function write_hard_generic(){
    var nmb =window .alphabet.length;
    //console.log("abeceda: "+window.alphabet);
    var allChoices = [];
    for(var i = 0; i < nmb; i++){
        allChoices.push(( window .alphabet).charAt(i));
    }
    
    shuffle(allChoices);
    
    var numberOfContainer = 0;
    for(var x = 0; x <= nmb; x+=9){
        
        $(".allImageContainer").append("<div class='multipleImageContainer"+numberOfContainer+"'id='imageContainerGeneral'></div>");
        
        var z = 0, left=0;
        for(var i = 0; i < 9 && x+i < nmb; i++){
                $(".allImageContainer .multipleImageContainer"+numberOfContainer).append("<div class='imgContainHard'><a class='multipleImagesHard'><img draggable='true' ondragstart='drag(event)' id ='image"+(x+i)+"';' src='"+flagsDir + allChoices[x+i].toLowerCase() + ".png' /></a></div>");
            z++;
            left+=95; 
        }
       
       numberOfContainer++; 
    }
    
    selectAndDisplayNewWordWriteHardGeneric();
}

function selectAndDisplayNewWordWriteHardGeneric(){
    //clean
    //$(".taskContainer").html('<div dragable="false" ondrop="dropInTrash(event)" ondragover="allowDropTrash(event)" ondragleave="dragLeaveTrash(event)" class="trashCan"><a><img src="' + imageGeneralDir + 'trashCan.png"></a></div>');
    $(".taskContainer").html("");


    //doda kvadratke za vsako crko
    var word =  selectNewWord(window.words);
    var wordLength = 8;
    if(isMobile)wordLength=5;
    while (word.length > wordLength || !isValidWord(word, window.alphabet))
        word =  selectNewWord(window.words);
    //console.log("beseda: "+word);
    for(var i = 0; i < word.length; i++){
        $(".taskContainer").append("<div id='taskContainer"+i+"' class='taskLetter position"+i+"' ondrop='drop(event)' ondragover='allowDrop(event)'  ondragleave='dragLeave(event)'><span>"+(word.charAt(i)).toUpperCase()+"</span></div>");
    } 
    
    if(isMobile){
        $(".imgContainHard").click(function(e){
            //console.log("CLICK!!");
            $(this).toggleClass("activeHover");
        });
        
        $(".imgContainHard a").draggable({
          cursor: "move",
          helper: 'clone',
          revert: "invalid",
          tolerance: "fit",
          containment: "window",
          start: function(event, ui){
            if($(this).parent().hasClass("activeHover"))return false;
			$(this).draggable('instance').offset.click = {
                left: Math.floor(ui.helper.width() / 2),
                top: Math.floor(ui.helper.height() / 2)
            };
            
            dragedImageData = $(this).find("img").attr("src");
          }
        });
      
        $(".taskContainer .taskLetter").droppable({
            over: function( event, ui ) {
                //console.log("over");
                allowDrop(event);
            },
            out : function( event, ui ) {
                //console.log("out");
                dragLeave(event);
            },
            drop: function( event, ui ) {
                //implemented
            }
        });
        
        $(".taskContainer .taskLetter").draggable({
          cursor: "move",
          revert: "invalid",
          tolerance: "fit",
          containment: "window",
          helper: function() {
            //debugger;
            var bg = $(this).css('background-image');
            bg = bg.replace('url(','').replace(')','').replace(/\"/gi, "");
            return "<img src='"+bg+"' style:'width:20%'>";
          },
          start: function(event, ui){
            dragedImageData = $(this).attr('id');
            //console.log("start");
			$(this).draggable('instance').offset.click = {
                left: Math.floor(ui.helper.width() / 2),
                top: Math.floor(ui.helper.height() / 2)
            }; 
          }
        });
        
        $(".trashCan").droppable({
            over: function( event, ui ) {
                allowDropTrash(event);
            },
            end: function( event, ui ){
                dragLeaveTrash(event);
            }
        });
    }
    
    //resize task containers
    if(isMobile){
        var currWidth = $(".taskLetter").width();
        var wraperWidth = $(".taskContainer").width();
        var nmbOfchildren = $(".taskContainer").children().length;
        if(wraperWidth*0.8 < currWidth*nmbOfchildren){
            var newWidth = (wraperWidth/nmbOfchildren)*0.6;
            $(".taskLetter").css("width",newWidth);
            $(".taskLetter").css("height",newWidth);
            $(".taskContainer span").css("font-size",newWidth*0.8);
            newTaskSize = newWidth;
        }
    }
}

function selectNewChoiceBundle(standardAlphabet, taskCharacter){
    //iz vseh izbere 9 ki niso taskCharacter
    var choices=[];
    choices[0] = taskCharacter.toLowerCase();
    for(var i = 1; i < 10; i++){
        var tmp = standardAlphabet[Math.floor(Math.random() * standardAlphabet.length)];
        //console.log("izbral: "+tmp);
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


function newTaskWriteMediumGeneric(){
    //crka
    var letter = selectNewLetter(window.alphabet);
    $("#letterToGuess span").text(letter.toUpperCase());
    
    //izbira
    var choices = selectNewChoiceBundle(window.alphabet, letter);
     
    //clean
    $(".multipleImageContainer").html("");
     
    //postavitev obojega
    for(var i = 0; i < choices.length; i++){
        $(".multipleImageContainer").append("<div class='imgContain'><a href='active'><img class='multipleImages' src='"+flagsDir + choices[i].toLowerCase() + ".png' /></a></div>");
    }
    
    
    //listener
    $('.imgContain a img').click(function (e) {
        e.preventDefault();
        if(isMobile){
            clickCounterMobile+=1;
            if(clickCounterMobile < 2) return;
            else if(lastClickedElementMobile != e.target){
                lastClickedElementMobile = e.target;
                clickCounterMobile = 1;
                return;
            }
            clickCounterMobile = 0;
        }
        if($(this).parent().attr("href") == "active"){
            var chosen = getLetterFromURL($(this).attr('src')).toLowerCase();
            var right = $("#letterToGuess span").text().toLowerCase();
            if(chosen == right){
                //zeleno
                $(this).parent().parent().addClass("success"); //-> disable all
                $(".multipleImageContainer .imgContain a").removeAttr("href");
                $(".multipleImageContainer .imgContain").addClass("disabled");
                $(".level-write-medium #next-arrow-generic").attr("href","next");
                $(".level-write-medium #next-arrow").attr("href", "next");
                
                // History
                if(histPtr == 0 && ansHist > 1 ){
                    addHistoryWriteMediumGeneric(0,1);
                }
                else{
                    addHistoryWriteMediumGeneric(1,1);
                }
                // Points and learning progress
                addPoints(1); 
                moveToLearnt(right);
            }
            else{
                $(this).parent().parent().addClass("err");
                $(this).parent().parent().addClass("disabled");
                $(this).parent().removeAttr("href");
                
                // History
                if(histPtr == 0 && ansHist > 1 ){
                    addHistoryWriteMediumGeneric(0,0);
                }
                else{
                    addHistoryWriteMediumGeneric(1,0);
                }
                // Points and learning progress
                removePoints(1);
                moveToNotLearnt(right,0.5);
            }
        }
    });
}

$( document ).ready(function() {
    
    console.log("POT: " +window.location.pathname);
    
    // Listeners for key-navigation
    $( document ).keydown(function(e) {
        var next_arrow = 39;
        var left_arrow = 37;
        var enter = 13;
        
        var level_code = getLevelCode(window.location.pathname);
        
        if(level_code == "index") return;
        
        // [WRITE]
        // next
        if (event.which == next_arrow && (level_code == "we" || level_code == "gwe")) we_na(e);
        else if(event.which == next_arrow && level_code == "wm" ) wm_na(e);
        else if(event.which == next_arrow && level_code == "gwm" ) wm_nag(e);
        else if(event.which == next_arrow && level_code == "wh" ) wh_na(e);
        else if(event.which == next_arrow && level_code == "gwh" ) wh_nag(e);
        // prev
        else if(event.which == left_arrow && (level_code == "we" || level_code == "gwe")) we_pa(e);
        else if(event.which == left_arrow && level_code == "wm" ) wm_pa(e);
        else if(event.which == left_arrow && level_code == "gwm" ) wm_pag(e);
        else if(event.which == left_arrow && level_code == "wh" ) wh_pa(e);
        else if(event.which == left_arrow && level_code == "gwh" ) wh_pag(e);
        
        // [READ]
        // next
        else if(event.which == next_arrow && (level_code == "re" || level_code == "gre")) re_na(e);
        else if(event.which == next_arrow && (level_code == "rm" || level_code == "grm")) rm_na(e);
        else if(event.which == next_arrow && (level_code == "rh" || level_code == "grh")) rh_na(e);
        // prev
        else if(event.which == left_arrow && (level_code == "re" || level_code == "gre")) re_pa(e);
        else if(event.which == left_arrow && (level_code == "rm" || level_code == "grm")) rm_pa(e);
        else if(event.which == left_arrow && (level_code == "rh" || level_code == "grh")) rh_pa(e);
        
        // [CHECK]
        else if (event.which == enter && level_code == "wm" ) wm_c(e);
        else if(event.which == enter && level_code == "wh" ) wh_c(e);
        else if(event.which == enter && level_code == "gwh" ) cg(e);
        
        // [INPUT]
        else if(level_code=="rm" || level_code=="grm")li(e);
    });
    
    $(document).click(function(event) {
        lastClickedElementMobile = event.target;
    });
    
    if(window.intro == 1){
        var bodyWidth = $(".panel-body").width();
        $('.f1_card').css({'width': (bodyWidth*0.18) + 'px'});
        $('.f1_card').css({'height':(bodyWidth*0.18) + 'px'});
    }
    
    if (window.mode == "write") {
        if (window.level == "easy"){
            var bodyWidth = $(".panel-body").width();
            $('.image_option').css({'width': (bodyWidth*0.18) + 'px'});
            $('.image_option').css({'height':(bodyWidth*0.18) + 'px'});
        }
        
    }

    
    $("#checkGeneric").click(function (e){
        e.preventDefault();
        cg(e);
    });
    
    // Listens for click on "next arrow" (read-hard)
    $(".level-write-hard #next-arrow-generic").click(function(e) {
        e.preventDefault();
        wh_nag(e);
        
    });
    // Listens for click on "prev arrow" (read-hard)
    $(".level-write-hard #prew-arrow-generic").click(function(e) {
        e.preventDefault();
        wh_pag(e);
    });

    /*
     *        WRITE MEDIUM -> GENRIC
     */
    
    // Listens for click on "prew arrow" (write-hard)
    $(".level-write-medium #prew-arrow-generic").click(function(e) {
        e.preventDefault();
        wm_pag(e);
    });
    
    
    
    // Listens for click on "next arrow" (write-easy)
     $(".level-write-medium #next-arrow-generic").click(function(e) {
        e.preventDefault();
        wm_nag(e);
    });
    
    
    checkCookie(cookie_name);
    
    // flip animation (index site)
    $('.f1_container').click(function() {
        //console.log("click");
            $(this).toggleClass('active');
            
        }); 
        
    // pop-up instructions
    $("#pop-up").click(function(){
        $("#myModal").css("display", "block");
    });
    
    $("#cl").click(function() {
        $("#myModal").css("display", "none");
    })
 
    /* When the user clicks on the button, 
    toggle between hiding and showing the dropdown content */
   
    $("#writeButton").click(function(){
        $("#myDropdown").toggleClass( "show");
    });
    
    
    /* *************************************************************************** */
    /* ********************************   READ  ********************************** */
    /* *************************************************************************** */
     
    /*
     *      READ EASY
     */
    
    // Function listens for click on multiple choices
    $("#choices .btn").click(function() {
       var letter = getLetterFromURL($("#picture-letter img").attr("src"));
       if ((this.innerHTML).toUpperCase() === letter.toUpperCase()) {
             $(this).removeClass("btn-info");
            $(this).addClass("btn-success");
            $("#next-arrow").attr("href", "next");
            buttonsDisable();
            // History
            if(histPtr == 0 && ansHist.length < 1 ){
                addHistoryEasy(0,1);
            }
            else{
                addHistoryEasy(1,1);
            }
            //Points and learning progress
            //addPoints(pointsForRightAnswerReadEasy); <-- not in use
            addPoints(1);
            moveToLearnt(letter);
       } else {
            $(this).removeClass("btn-info");
            $(this).addClass("btn-danger");
            $(this).attr("disabled", "disabled");
            // History
            addHistoryEasy(1,0);
             //Points and learning progress
            removePoints(1);
            moveToNotLearnt(letter,1);
            //pointsForRightAnswerReadEasy--; <-- not in use
       }
    });
    
    
    
    // Function listens for click on "next arrow"
    $(".level-read-easy #next-arrow").click(function(e) {
        e.preventDefault();
        re_na(e);
    });
    
    // Function listens for click on "prew arrow"
    $(".level-read-easy #prew-arrow").click(function(e) {
        e.preventDefault();
        re_pa(e);
    });
    
    
    /*
     *      READ MEDIUM
     */

    
    // Function shows the correct solution
    $("#read_medium_solution").click(function(){
        $(this).attr("disabled", "disabled");
        if (getPoints() >= pointsForClueReadMedium) {
            var url = $("#picture-letter img").attr("src");
            var letterSelected = getLetterFromURL(url);
            $("#letterInput").val(letterSelected);
            $("#next-arrow").attr("href", "next");
            $("#letterInput").addClass("correctInput");
            $("#letterInput").removeClass("wrongInput");
            // History
            if(histPtr == 0 && ansHist > 1 ){
                addHistoryMedium(0,1);
            }
            else{
                addHistoryMedium(1,1);
            }
            // Points and learning progress
            removePoints(pointsForClueReadMedium);
            moveToNotLearnt(letterSelected,1);
            $("#next-arrow").focus();
        } else {
            $("#letterInput").focus();
        }
    });
    
    
    
    // Listens for click on "next arrow" (read-medium)
    $(".level-read-medium #next-arrow").click(function(e) {
        e.preventDefault();
        rm_na(e);
    });
    
    // Listens for click on "prev arrow" (read-medium)
    $(".level-read-medium #prew-arrow").click(function(e) {
        e.preventDefault();
        rm_pa(e);
    });
    
    
    /*
     *      READ HARD
     */
    
    // Function checks input when enter is pressed
    $("#input-string-hard").keypress(function(e) {
        // Enter pressed?
        if(e.which == 10 || e.which == 13) {
            //console.log("enter pressed");
            var index = 1;
            var numWrongOrUnanswered = 0;
            var numWrong = 0; var numCorrect = 0;
            $("#input-string-hard .letterInputClass").each(function(index) {
                var input = $(this).val();
                var letter = getLetterFromURL($("#picture-letter img:eq(" + (index+1) + ")").attr("src"));
                //console.log("letter<-------: "+letter);
                //console.log("input<-------: "+input);
                if (input.toUpperCase() === letter.toUpperCase()) {
                    // Correct input
                    if ($(this).attr("disabled") != "disabled") {
                        $(this).addClass("correctInput");
                        $(this).removeClass("wrongInput");
                        $(this).removeClass("tested");
                        $(this).attr("disabled", "disabled");
                        numCorrect++;
                    }
                } else {
                    if (input !== "") {
                        // Wrong input
                        if (! $(this).hasClass("tested")) {
                            $(this).addClass("wrongInput");
                            $(this).addClass("tested");
                            numWrong++;
                        }
                    } else {
                        // Empty input
                        $(this).removeClass("wrongInput");
                        $(this).removeClass("tested");
                    }
                    $(this).removeClass("correctInput");
                    numWrongOrUnanswered++;
                }
                index++;
            });
            if (numWrongOrUnanswered == 0) {
                $("#next-arrow").attr("href", "next");
                $("#next-arrow").focus();
                if(histPtr == 0 && ansHist.length < 1 ){
                    pushHistoryReadHard(1);
                }
                else{
                    setHistoryReadHard(1);
                }
            } else {
                // Sets cursor to first wrong letter
                var el = $("#num1");
                while (el.attr("disabled") == "disabled") {
                    el = el.next();
                }
                el.focus().select();
                if(histPtr == 0 && ansHist.length < 1 ){
                    pushHistoryReadHard(0);
                }
                else{
                    setHistoryReadHard(0);
                }
            }
            addPoints(numCorrect);
            removePoints(numWrong);
        } else {
            $("#input-string-hard .letterInputClass").each(function(index) {
                $(this).removeClass("tested");
            });
        }
    });
    
    // Function starts animaton
    $("#start-animation").click(function() {
        if ($(this).hasClass("used")) {
            removePoints(pointsForClueReadHard);
        }
        $(this).attr("disabled", "disabled");
        focusFirstFree("#input-string-hard #num1");
        //$(".level-read-hard .well img" + ":eq(" + (1 - 1) + ")").addClass("hidden");
        displaySequenceOfImages(".level-read-hard .well img", 0);
        $(this).addClass("used");
        $("#start-animation").text("Začni znova!");
    });
    
    // Listens for click on "next arrow" (read-hard)
    $(".level-read-hard #next-arrow").click(function(e) {
        e.preventDefault();
        rh_na(e);
    });
    
    // Listens for click on "prev arrow" (read-hard)
    $(".level-read-hard #prew-arrow").click(function(e) {
        e.preventDefault();
        rh_pa(e);
    });
    
    
    /* *************************************************************************** */
    /* *******************************   WRITE  ********************************** */
    /* *************************************************************************** */
    
    /*
     *      WRITE EASY
     */
    
    // Function checks correctness of choice
    $(".imageSelectionWrap #picture-letter").click(function() {
        if ($(this).hasClass("not_active")) return;
        var url = $(this).find(".imageSelection").attr("src");
        var letterSelected = getLetterFromURL(url);
        var letter = $(".level-write-easy #letterToGuess span").text();
        //console.log(letter);
        if (letterSelected.toUpperCase() === letter.toUpperCase()) {
            $(this).parent().addClass("correctInput");
            $(this).parent().removeClass("wrongInput");
            $("#next-arrow").attr("href", "next");
            imageButtonsDisable($(this).parent().parent());
            // History
            if(histPtr == 0 && ansHist > 1 ){
                addHistoryWriteEasy(0,1);
            }
            else{
                addHistoryWriteEasy(1,1);
            }
            // Points and learning progress
            addPoints(1); 
            moveToLearnt(letter);
        } else {
            $(this).parent().removeClass("correctInput");
            $(this).parent().addClass(("wrongInput"));
            imageOneButtonDisable(this);
            // History
            if(histPtr == 0 && ansHist > 1 ){
                addHistoryWriteEasy(0,0);
            }
            else{
                addHistoryWriteEasy(1,0);
            }
            // Points and learning progress
            removePoints(1);
            moveToNotLearnt(letter,1);
        }
    });
    
    // Listens for click on "next arrow" (write-easy)
    $(".level-write-easy #next-arrow").click(function(e) {
        e.preventDefault();
        we_na(e);
    });
    
    // Listens for click on "prew arrow" (write-easy)
    $(".level-write-easy #prew-arrow").click(function(e) {
        e.preventDefault();
        we_pa(e);
    });
    
   
    /*
     *        WRITE MEDIUM -> FLAGS
     */
    
    // Listens for click on "check" (write-medium)
    $(".level-write-medium #check").click(function(e) {
        e.preventDefault();
        wm_c(e);
    });
    
    // Listens for click on "prew arrow" (write-hard)
    $(".level-write-medium #prew-arrow").click(function(e) {
        e.preventDefault();
        wm_pa(e);
    });
    
    // Listens for click on "next arrow" (write-medium)
    $(".level-write-medium #next-arrow").click(function(e) {
        e.preventDefault();
        wm_na(e);
    });
    
    
    /*
     *        WRITE HARD -> FLAGS
     */
    
    // Listens for click on "check" (write-hard)
    $(".level-write-hard #check").click(function(e) {
        e.preventDefault();
        wh_c(e);
    });
    
    // Listens for click on "prew arrow" (write-hard)
    $(".level-write-hard #prew-arrow").click(function(e) {
        e.preventDefault();
        wh_pa(e);
    });
    
    // Listens for click on "next arrow" (write-hard)
    $(".level-write-hard #next-arrow").click(function(e) {
        e.preventDefault();
        wh_na(e);
    });
  
    /*
     *     FLAGS (drag-and-rotate) MOVEMENT
     */
    
    // RIGHT
    // Event listener for click-and-drag of right flag
    document.getElementById("imageRightFlag").addEventListener("mousedown",function(e){
         e.preventDefault();
         //console.log("mousedown!!");
        if($("#imageRightFlag").attr("href") === "enabled"){
            window.document.addEventListener("mousemove", mouseMoveRight,true);
            
            window.document.addEventListener("mouseup",function a(e){
                e.preventDefault();
                window.document.removeEventListener("mousemove", mouseMoveRight,true);
                fixPosition("right");
                window.document.removeEventListener("mouseup", a,true);
            },true);
        }
    });    

    document.getElementById("imageRightFlag").addEventListener("touchmove",function(e){
         e.preventDefault();
        if($("#imageRightFlag").attr("href") === "enabled"){
            window.document.addEventListener("touchmove", touchMoveRight,true);
            
            window.document.addEventListener("touchend",function a(e){
                e.preventDefault();
                window.document.removeEventListener("touchmove", touchMoveRight,true);
                fixPosition("right");
                window.document.removeEventListener("touchend", a,true);
            },true);
        }
    });   
    
    // Function for tracking mouse movements
    function mouseMoveRight(e) {
        //Izracun centra kroznice in pozicije miske
        var centerMis = [e.clientX, e.clientY];
        
        //Izracun kota premika
        var degree = Math.atan2(centerMis[0] - middlePointRight[0], -(centerMis[1] - (middlePointRight[1] -window.scrollY)))* (180 / Math.PI);
        
        //Rotacije za vse brskalike
        var objFlagRight = $("#imageRightFlag");
        objFlagRight.css('-moz-transform', 'rotate('+degree+'deg)');
        objFlagRight.css('-webkit-transform', 'rotate('+degree+'deg)');
        objFlagRight.css('-o-transform', 'rotate('+degree+'deg)');
        objFlagRight.css('-ms-transform', 'rotate('+degree+'deg)');
    }
    
    // Function for tracking mouse movements
    function touchMoveRight(e) {
        //Izracun centra kroznice in pozicije miske
        var centerMis = [e.touches[0].clientX, e.touches[0].clientY];
        
        //Izracun kota premika
        var degree = Math.atan2(centerMis[0] - middlePointRight[0], -(centerMis[1] - (middlePointRight[1] -window.scrollY)))* (180 / Math.PI);
        
        //Rotacije za vse brskalike
        var objFlagRight = $("#imageRightFlag");
        objFlagRight.css('-moz-transform', 'rotate('+degree+'deg)');
        objFlagRight.css('-webkit-transform', 'rotate('+degree+'deg)');
        objFlagRight.css('-o-transform', 'rotate('+degree+'deg)');
        objFlagRight.css('-ms-transform', 'rotate('+degree+'deg)');
    }
     
    // LEFT
    // Event listener for click-and-drag of right flag
    document.getElementById("imageLeftFlag").addEventListener("mousedown",function(e){
        e.preventDefault();
        if($("#imageLeftFlag").attr("href") === "enabled"){
            window.document.addEventListener("mousemove", mouseMoveLeft,true);
    
            window.document.addEventListener("mouseup",function a(e){
                e.preventDefault();
                window.document.removeEventListener("mousemove", mouseMoveLeft,true);
                fixPosition("left");
                window.document.removeEventListener("mouseup", a,true);
            },true);
        }
    });
    
    document.getElementById("imageLeftFlag").addEventListener("touchmove",function(e){
        e.preventDefault();
        if($("#imageLeftFlag").attr("href") === "enabled"){
            window.document.addEventListener("touchmove", touchMoveLeft,true);
    
            window.document.addEventListener("touchend",function a(e){
                e.preventDefault();
                window.document.removeEventListener("touchmove", touchMoveLeft,true);
                fixPosition("left");
                window.document.removeEventListener("touchend", a,true);
            },true);
        }
    });
    
    // Function for tracking mouse movements
    function mouseMoveLeft(e) {
        // Center of rotation and position of mouse
        var centerMis = [e.clientX, e.clientY];
        
        // Angle of rotation
        var radians = Math.atan2(centerMis[0] - middlePointLeft[0], centerMis[1] - (middlePointLeft[1] - window.scrollY));
        var degree = (radians * (180 / Math.PI)*-1)+180; 
        
        // Rotation for all browsers
        var objFlagLeft = $("#imageLeftFlag");
        objFlagLeft.css('-moz-transform', 'rotate('+degree+'deg)');
        objFlagLeft.css('-webkit-transform', 'rotate('+degree+'deg)');
        objFlagLeft.css('-o-transform', 'rotate('+degree+'deg)');
        objFlagLeft.css('-ms-transform', 'rotate('+degree+'deg)');
    }
    
    function touchMoveLeft(e) {
        // Center of rotation and position of mouse
        var centerMis = [e.touches[0].clientX, e.touches[0].clientY];
        
        // Angle of rotation
        var radians = Math.atan2(centerMis[0] - middlePointLeft[0], centerMis[1] - (middlePointLeft[1] - window.scrollY));
        var degree = (radians * (180 / Math.PI)*-1)+180; 
        
        // Rotation for all browsers
        var objFlagLeft = $("#imageLeftFlag");
        objFlagLeft.css('-moz-transform', 'rotate('+degree+'deg)');
        objFlagLeft.css('-webkit-transform', 'rotate('+degree+'deg)');
        objFlagLeft.css('-o-transform', 'rotate('+degree+'deg)');
        objFlagLeft.css('-ms-transform', 'rotate('+degree+'deg)');
    }
    
    
});


/* *************************************************************************** */
/* *******************************   CODE  *********************************** */
/* *************************************************************************** */

// Selects new letter, displays the picture and choices
function selectAndDisplayNewLetter(alphabet, mode) {
    var letter = selectNewLetter(alphabet);
    var choices = selectChoices(alphabet, letter);
    $("#read_medium_solution").removeAttr("disabled");
    
    displayNewLetter(letter,mode,choices);
}

// Displays given letter
function displayNewLetter(letter,mode,choices) {
    $(".level-read-"+mode+" #picture-letter img").attr("src", flagsDir + letter + ".png");

    // Clears inputs and options
    if(mode === "easy") {
        clearSelectedOptions("choices", choices);
    } else if( mode === "medium") {
        clearInput("letterInput");
    }
}

// Displays old letter (popravi sliko in izbire)
function displayOldLetter(corrLetter, choices){
    var ans = ansHist[histPtr][0].split(",");
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
        button.disabled=false;
        j++;
    }
    $(".level-read-easy #picture-letter img").attr("src", flagsDir + corrLetter.toLowerCase() + ".png");
    if(histPtr === 0){
        $(".level-read-easy #prew-arrow").removeAttr("href");
    }else{
        $(".level-read-easy #prew-arrow").attr("href", "prew");
    }
    $(".level-read-easy #next-arrow").attr("href", "next");
}
// Function for geting leters from history (Read-easy) - returns string
function getChoices(choices){
    var string = [];
    choices = choices.split(",");
    for(var i = 0; i < choices.length; i++){
        string.push(choices[i].charAt(0));
    }
    return string;
}

// Display Letter from history that has not been answ.
function displayOldLetterMedium(ansHist){
    // Display image
    $("#picture-letter img").attr("src", flagsDir + ansHist[2].toLowerCase() + ".png");
    // Display old input
    var inputClass = ansHist[0].split("-")[1];
    var ans = ansHist[0].split("-")[0];
    $("#letterInput").attr("class", inputClass);
    $("#letterInput").val(ans);
    $("#letterInput").removeAttr("disabled");
}

// Function selects and displays new letter
function selectAndDisplayNewImage(alphabet, mode) {
    var letter = selectNewLetter(alphabet);
    var choices = selectChoices(alphabet, letter);
    
    $("#letterToGuess span").text(letter.toUpperCase());
    clearSelectedImages("#coreLogic #picture-letter", choices);
}

// Function selects
function selectNewLetter(alphabet) {
    //console.log("Alphabet", alphabet);
    
    for (var i = 0; i < alphabet.length; i++) {
        //console.log(alphabet[i] + ": " + userAnswers[alphabet[i]]);
    }
    
    // Poisci najslabse poznano crko (pazi, da ni enaka prejsnji prikazani crki)
    var worseNumber;
    if (prevLetter === "a") {
        worseNumber = userAnswers["b"];
    } else {
        worseNumber = userAnswers["a"];
    }
    for (var i = 1; i < alphabet.length; i++) {
        if (userAnswers[alphabet[i]] < worseNumber && alphabet[i] !== prevLetter) {
            worseNumber = userAnswers[alphabet[i]];
        }
    }

    // ustvari novo tabelo, kamor shrani kandidate za prikaz - vse, ki imajo vrednost v tabeli (worseNumber + 1) ali manj
    var selectFrom = [];
    for (var i = 0; i < alphabet.length; i++) {
        if (userAnswers[alphabet[i]] <= worseNumber + 1 && alphabet[i] !== prevLetter) {
            selectFrom.push(alphabet[i]);
        }
    }
    //console.log("selectFrom: " + selectFrom);
    if (selectFrom.length == 0) {
        prevLetter = alphabet[Math.floor(Math.random() * alphabet.length)];
    } else {
        prevLetter = selectFrom[Math.floor(Math.random() * selectFrom.length)];
    }
    //console.log("Return letter: ", prevLetter);
    return prevLetter;
}

// Function selects new Word
function selectNewWord(words) {
    words = words.split(",");
    var word = words[Math.floor(Math.random() * words.length)];
    var re = new RegExp("&#39;", 'g');
    word = word.replace(re, "");
    word = word.replace("[","");
    word = word.replace("]","");
    //console.log("my word: "+word);
    return word;
}

function isValidWord(word, alphabet) {
    var alph_array = alphabet.split("");
    for (var i = 0; i < word.length; i++) {
        if (alph_array.indexOf(word[i]) < 0) {
            return false;
        }
    }
    return true;
}

// Function selects new choices
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

// Function clears selected options
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

// Function selects image
function clearSelectedImages(elementID, choices) {
    var i = 0;
    $(elementID).each(function() {
        $(this).find("img").attr("src", flagsDir + choices[i].toLowerCase() + ".png");
        $(this).parent().removeClass("wrongInput");
        $(this).parent().removeClass("correctInput");
        i++;
    });
    $("#next-arrow").removeAttr("href");
    $("#prew-arrow").attr("href", "prew");
}

// Function displays sequence of images
function displaySequenceOfImages(elements, index) {
    if (index == $(elements).length) {
        if (getPoints() >= pointsForClueReadHard) {
            //$(".level-read-hard .panel-body .well").append("<img src='" + imageGeneralDir + "blank.png' class=''>");
            //console.log("lahko se enkrat sprozis");
            $("#start-animation").removeAttr("disabled");
            $(elements + ":eq(" + 0 + ")").removeClass("hidden");
        }
    }
    if (index <= $(elements).length) {
        if (index > 0) {
            $(elements + ":eq(" + (index - 1) + ")").addClass("hidden");
        }
        $(elements + ":eq(" + index + ")").removeClass("hidden");

        readHardTimer = setTimeout(function() {
            displaySequenceOfImages(elements, (index + 1))
        }, 1000);
    }
}

// Function clears input
function clearInput(elementID) {
    document.getElementById(elementID).value="";
    document.getElementById(elementID).disabled = false;
    $(elementID).removeClass("correctInput");
    $(elementID).removeClass("wrongInput");
    $("#next-arrow").removeAttr("href");
    $("#prew-arrow").attr("href", "prew");
}

// Function puts focus on next wrong input
function focusNext(event, elementToFocus) {
    var char = event.which || event.keyCode;
    if (isLetter(String.fromCharCode(char))) {
        var numOfLetters = $(".letterInputClass").length;
        while (numOfLetters >= 0 && $(elementToFocus).attr("disabled") == "disabled") {
            // Find first field which is not disabled
            elementToFocus = $(elementToFocus).next(".letterInputClass");
            numOfLetters--;
        }
        $(elementToFocus).focus().select();
    }
}

// Function puts focus on first free input
function focusFirstFree(elementToFocus) {
    var numOfLetters = $(".letterInputClass").length;
    while (numOfLetters >= 0 && $(elementToFocus).attr("disabled") == "disabled") {
        // Najdi prvo polje, ki ni disabled
        elementToFocus = $(elementToFocus).next(".letterInputClass");
        numOfLetters--;
    }
    $(elementToFocus).focus().select();
}

// Function move element to learned
function moveToLearnt(element) {
    element = element.toLowerCase();
    userAnswers[element] += 1;
}

// Function move element to not learned
function moveToNotLearnt(element, substract) {
    element = element.toLowerCase();
    userAnswers[element] -= substract;
}

function refresh() {
    // Called every time when new letter/word is displayed
    // Empty, may be used later
}


/* *************************************************************************** */
/* *****************************   HISTORY  ********************************** */
/* *************************************************************************** */

//Function adds current answer to history - READ_EASY [push=0/set=1, !ans=0/ans=1]
function addHistoryEasy(set,ans){
    var state="";
    var buttons = document.getElementById('choices'),button;
    var corrLetter = getLetterFromURL($("#picture-letter img").attr('src'));
    for(var i = 0; i < buttons.children.length; i++){
        button = buttons.children[i];
        var buttonClass = button.className;
        var buttonLetter = button.innerHTML;
        if(state!="")state+=",";
        if(typeof buttonClass === 'undefined') continue;
        if($(button).hasClass("btn-info")){
           state+=buttonLetter+"I"
        }
        else if($(button).hasClass("btn-danger")){
            state+=buttonLetter+"D"
        }
        else if($(button).hasClass("btn-success")){
            state+=buttonLetter+"S"
        }
    }
    if(set == 1) ansHist[histPtr]=[state,ans,corrLetter]; // ,pointsForRightAnswerReadEasy <-- not in use
    else ansHist.push([state,ans,corrLetter]); // ,pointsForRightAnswerReadEasy <-- not in use
}

// Function adds prev. answer from history - READ_EASY
function restoreHistoryEasy(){
    var ans = ansHist[histPtr][0].split(",");
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

// Function adds current answer to history - READ_MEDIUM [push=0/set=1, !ans=0/ans=1]
function addHistoryMedium(set, ans){
    var input = (document.getElementById('letterInput')).value;
    var corrLetter = getLetterFromURL($("#picture-letter img").attr('src'));
    var stateOfAns = $("#letterInput").attr('class');
    var state = input + "-" +stateOfAns;
    if(set == 1){
        ansHist[histPtr]=[state,ans,corrLetter];
    }
    else{
        ansHist.push([state,ans,corrLetter]);
    }
}

// Function adds prev. answer from history - READ_MEDIUM
function restoreHistoryMedium(){
    var output = ansHist[histPtr][0].split("-")[0];
    (document.getElementById('letterInput')).value = output;
    document.getElementById('letterInput').disabled = true;
    $(".level-read-medium #picture-letter img").attr("src", flagsDir + output.toLowerCase() + ".png");
    if(histPtr === 0){
        $(".level-read-medium #prew-arrow").removeAttr("href");
    }else{
        $(".level-read-medium #prew-arrow").attr("href", "prew");
    }
    $(".level-read-medium #next-arrow").attr("href", "next");
    $("#read_medium_solution").attr("disabled", "disabled");
    $("#letterInput").removeClass().addClass("correctInput");
} 

// Function adds current answer to history - WRITE_EASY
function addHistoryWriteEasy(set, ans){
    var state="";
    var buttons = document.getElementById('choices');
    
    $(".image_option").each(function(){
        if(state != "")state += ",";
        
        var letter = getLetterFromURL($(this).find("img").attr('src'));
        
        if($(this).parent().hasClass("wrongInput")){
            state+=letter+"D";
        }
        else if($(this).parent().hasClass("correctInput")){
            state+=letter+"S";
        }
        else{
            state+=letter+"I";
        }
    });
    
    var corrLetter = $("#letterToGuess span").text();
    //console.log("dodal bom v zgodovino: "+state);
    if(set == 1) ansHist[histPtr]=[state,ans,corrLetter];
    else ansHist.push([state,ans,corrLetter]);
}

// Function adds current answer to history - WRITE_MEDIUM -> generic
function addHistoryWriteMediumGeneric(set, ans){
    var state="";
    
    $(".imgContain .multipleImages").each(function(e){
        if(state!="")state+=",";
        var buttonLetter = getLetterFromURL($(this).attr("src"));
        //console.log("moj class: "+ ($(this).attr("class")) +" oce: "+ ($(this).parent().parent().attr("class")));
        if($(this).parent().parent().hasClass("success")){
            state+=buttonLetter+"S";
        }
        else if($(this).parent().parent().hasClass("err")){
            state+=buttonLetter+"D";
        }
        else{
            state+=buttonLetter+"I"
        }
    });
    
    var corrLetter = $("#letterToGuess span").text();
    //console.log("dodal bom v zgodovino: "+state);
    if(set == 1) ansHist[histPtr]=[state,ans,corrLetter];
    else ansHist.push([state,ans,corrLetter]);
}

// Function adds current answer to history - WRITE_HARD -> generic
function addHistoryWriteHardGeneric(state,set, word, ans){
    if(set == 1)ansHist[histPtr] = ([word,ans,state]);
    else ansHist.push([word,ans,state]);
}

function restoreStringWriteHardGeneric(string,satte){
    //restore string
}

function restoreHistoryWriteHardGeneric(word, ans){
    word = typeof word !== 'undefined' ? word : ansHist[histPtr][0];
    ans = typeof ans !== 'undefined' ? ans : ansHist[histPtr][1];
    
    //console.log("restore for state: "+word+" -> "+ans);
    var ansArr = ans.split(",");
    //clear prew state
    //$(".taskContainer").html('<div dragable="false" ondrop="dropInTrash(event)" ondragover="allowDropTrash(event)" ondragleave="dragLeaveTrash(event)" class="trashCan"><a><img src= "' + imageGeneralDir + 'trashCan.png"></a></div>');
    $(".taskContainer").html("");
       
    for(var position in word){
        var corr = ansArr[position].charAt(1);
        if(corr == "S"){
            var letter = word.charAt(position);
            $(".taskContainer").append("<div id='taskContainer"+position+"' class='taskLetter position"+position+"' ondrop='drop(event)' ondragover='allowDrop(event)'  ondragleave='dragLeave(event)' ondragstart='return false;'><span class='halfHidden'>"+letter.toUpperCase()+"</span></div>");
            
            $(".taskContainer #taskContainer"+position).css("background-image","url("+flagsDir + letter + ".png)");
            $(".taskContainer #taskContainer"+position).css("background-repeat","no-repeat");
            $(".taskContainer #taskContainer"+position).css("background-size","contain");
            $(".taskContainer #taskContainer"+position).addClass("success disabled");
        }    
        else if(corr == "D"){
            var letter = ansArr[position].charAt(0);
            $(".taskContainer").append("<div id='taskContainer"+position+"' class='taskLetter position"+position+"' ondrop='drop(event)' ondragover='allowDrop(event)'  ondragleave='dragLeave(event)' draggable='true' ondragstart='dragFromTask(event)'><span class='hidden'>"+letter.toUpperCase()+"</span></div>");
            $(".taskContainer #taskContainer"+position).css("background-image","url("+flagsDir + letter + ".png)");
            $(".taskContainer #taskContainer"+position).css("background-repeat","no-repeat");
            $(".taskContainer #taskContainer"+position).css("background-size","contain");
            $(".taskContainer #taskContainer"+position).addClass("err");
        }
        else {
            var letter = word.charAt(position);
            $(".taskContainer").append("<div id='taskContainer"+position+"' class='taskLetter position"+position+"' ondrop='drop(event)' ondragover='allowDrop(event)'  ondragleave='dragLeave(event)'><span class=''>"+letter.toUpperCase()+"</span></div>");
            $(".taskContainer #taskContainer"+position).css("background-image","none");
            $(".taskContainer #taskContainer"+position).css("background-repeat","no-repeat");
            $(".taskContainer #taskContainer"+position).css("background-size","contain");
            $(".taskContainer #taskContainer"+position).removeClass("success disabled err");
        }
    } 
}

// Function adds sequence to hisrory [string, 0=not anws.//1=anws]
function pushHistoryReadHard(ans){
    //Najprej pridobi niz iz imen
    var pictures = $(".level-read-hard .panel-body .well").html().split(".png");
    var string="";
    for(var i = 0; i < pictures.length -1; i++){
        string+=pictures[i].slice(-1);
    }
    var state="";
    var index = 0;
    $("#input-string-hard .letterInputClass").each(function(index) {
        var input = $(this).val();
        var ansClass = $(this).attr('class');
        if(index != 0)state+=",";
        state += input+"-"+ansClass;
        index++;
        //console.log("pridobil sem info za zgodovino: "+input+" "+ansClass);
    });
    ansHist.push([string,ans,state]);
}

// Function sets history  [string, 0=not anws.//1=anws]
function setHistoryReadHard(ans){
    var pictures = $(".level-read-hard .panel-body .well").html().split(".png");
    var string="";
    for(var i = 0; i < pictures.length -1; i++){
        string+=pictures[i].slice(-1);
    }
    var state="";
    var index = 0;
    $("#input-string-hard .letterInputClass").each(function(index) {
        var input = $(this).val();
        var ansClass = $(this).attr('class');
        if(index != 0)state+=",";
        state += input+"-"+ansClass;
        index++;
        //console.log("pridobil sem info za zgodovino: "+input+" "+ansClass);
    });
    ansHist[histPtr] = [string,ans,state];
}

// Function restores and displays history on current histPtr
function restoreHistoryReadHard(){
    var string = ansHist[histPtr][0].substring(1);
    // Clean up
    $(".level-read-hard .panel-body .well").html("");
    $("#input-string-hard").html("");
    $("#start-animation").attr("disabled", "disabled");
    $("#start-animation").removeClass("used");
    $("#start-animation").text("Začni!");
    clearTimeout(readHardTimer);

    var letters = string.split("");
    var idNumber = 1;
    
    $(".level-read-hard .panel-body .well").append("<img src='" + imageGeneralDir + "blank.png' class=''>");
    
    for (i = 0; i < letters.length; i++) {
        var letter = letters[i];
        $(".level-read-hard .panel-body .well").append("<img src='" + flagsDir + letter + ".png' class='hidden'>");
        $("#input-string-hard").append('<input id="num' + idNumber + '" class = "letterInputClass correctInput" type="text" maxlength="1" value = "' + letter + '">');
        idNumber++;
    }
    // Enable input
    textFieldsDisable(".letterInputClass");
    $("#start-animation").css("visibility", "hidden");
    // Show sequence of images
    displaySequenceOfImages(".level-read-hard .well img", 0);
}

// Function restores given word as unanswered
function restoreStringReadHard(word){
    // Clean up
    //console.log("Vsebina zgodovine: "+ansHist[histPtr]);
    $(".level-read-hard .panel-body .well").html("");
    $("#input-string-hard").html("");
    $("#next-arrow").removeAttr("href");
    $("#start-animation").removeAttr("disabled");
    $("#start-animation").removeClass("used");
    $("#start-animation").text("Začni!");
    clearTimeout(readHardTimer);

    var letters = word.substring(1).split("");
    var idNumber = 1;
    var state = ansHist[histPtr][2].split(",");
    
    $(".level-read-hard .panel-body .well").append("<img src='" + imageGeneralDir + "blank.png' class=''>");
    
    for (i = 0; i < letters.length; i++) {
        var letter = letters[i];
        $(".level-read-hard .panel-body .well").append("<img src='" + flagsDir + letter + ".png' class='hidden'>");
        var prevAns = state[i].split("-")[0];
        var prevClass = state[i].split("-")[1];
        $("#input-string-hard").append('<input id="num' + idNumber + '" class = "'+prevClass+'" type="text" maxlength="1" onkeyup="focusNext(event, \'#num' + (idNumber+1) + '.letterInputClass\') "value = '+prevAns+'>');
        idNumber++;
    }
    
}

// Function adds prev. answer from history - WRITE_EASY
function restoreHistoryWriteEasy(){
    var ans = ansHist[histPtr][0].split(",");
    var buttons = document.getElementById('choices');
    imageButtonsDisable($("#choices"));
    var j = 0;
    for(var i = 0; i < buttons.children.length; i++){
        var letter = (ans[j].split(""))[0];
        var colour = (ans[j].split(""))[1];
        // adds class
        if(colour == 'I'){
            //console.log("I");
            $(buttons.children[i]).find(".image_option").parent().removeClass("wrongInput").removeClass("correctInput");
            $(buttons.children[i]).find(".image_option img").attr("src", flagsDir + letter.toLowerCase() + ".png");
        }
        else if(colour == 'D'){
            //console.log("D");
            $(buttons.children[i]).find(".image_option").parent().addClass("wrongInput").removeClass("correctInput");
            $(buttons.children[i]).find(".image_option img").attr("src", flagsDir + letter.toLowerCase() + ".png");
        }
        else if(colour == 'S'){
            //console.log("S");
            $(buttons.children[i]).find(".image_option").parent().addClass("correctInput").removeClass("wrongInput");
            $(buttons.children[i]).find(".image_option img").attr("src", flagsDir + letter.toLowerCase() + ".png");
            $("#letterToGuess span").text(letter.toUpperCase());
        }
        j++;
    }
    if(histPtr === 0){
        $(".level-write-easy #prew-arrow").removeAttr("href");
    }else{
        $(".level-write-easy #prew-arrow").attr("href", "prew");
    }
    $(".level-write-easy #next-arrow").attr("href", "next");
}

// Function adds prev. answer from history - WRITE_EASY
function restoreHistoryWriteMediumGeneric(){
    //console.log("podatki za prikaz zgodovine: "+(ansHist[histPtr][2])+" "+(ansHist[histPtr][0]));
    displayOldLetterWriteMediumGeneric(ansHist[histPtr][2], ansHist[histPtr][0],true);
}

// Function displays letter
function displayOldLetterWriteEasy(corrLetter, choices){
    var ans = choices.split(",");
    var buttons = document.getElementById('choices');
    imageButtonsDisable($("#choices"));
    var j = 0;
    for(var i = 0; i < buttons.children.length; i++){
        var letter = (ans[j].split(""))[0];
        var colour = (ans[j].split(""))[1];
        if(colour == 'I'){
            $(buttons.children[i]).find(".image_option").parent().removeClass("wrongInput correctInput")
            $(buttons.children[i]).find(".image_option").removeClass("not_active")
            $(buttons.children[i]).find(".image_option img").attr("src", flagsDir + letter.toLowerCase() + ".png");
        }
        else if(colour == 'D'){
            (buttons.children[i]).find(".image_option").parent().addClass("wrongInput");
            $(buttons.children[i]).find(".image_option").addClass("not_active");
            $(buttons.children[i]).find(".image_option img").attr("src", flagsDir + letter.toLowerCase() + ".png");
        }
        else if(colour == 'S'){
            $(buttons.children[i]).find(".image_option").parent().addClass("correctInput");
            $(buttons.children[i]).find(".image_option").addClass("not_active");
            $(buttons.children[i]).find(".image_option img").attr("src", flagsDir + letter.toLowerCase() + ".png");
        }
        j++;
    }
    $("#letterToGuess span").text(corrLetter.toUpperCase());
    if(histPtr === 0){
        $(".level-write-easy #prew-arrow").removeAttr("href");
    }else{
        $(".level-write-easy #prew-arrow").attr("href", "prew");
    }
    $(".level-write-easy #next-arrow").attr("href", "next");
}

// Function displays letter [isAnswered = true if task has been succesfully answered]
function displayOldLetterWriteMediumGeneric(corrLetter, choices, isAnswered){
    isAnswered = typeof isAnswered !== 'undefined' ? isAnswered : false;
    //najprej crko
    $(".letterToGuess span").text(corrLetter.toUpperCase());
    
    //pocisti stanje
    $(".multipleImageContainer").html("");
    
    //doda novo stanje
    var ans = choices.split(",");
    
    for(var position in ans){
        var choiceLetter = ans[position].charAt(0);
        var choiceLetterState = ans[position].charAt(1);
        
        if(choiceLetterState == "S")$(".multipleImageContainer").append("<div class='imgContain success'><a><img class='multipleImages'src='"+flagsDir + choiceLetter.toLowerCase() + ".png' /></a></div>");
        else if(choiceLetterState == "D")$(".multipleImageContainer").append("<div class='imgContain err'><a><img class='multipleImages' src='"+flagsDir + choiceLetter.toLowerCase() + ".png' /></a></div>");
        else if(isAnswered) $(".multipleImageContainer").append("<div class='imgContain'><a><img class='multipleImages' src='"+flagsDir + choiceLetter.toLowerCase() + ".png' /></a></div>");
        else $(".multipleImageContainer").append("<div class='imgContain'><a href='active'><img class='multipleImages' src='"+flagsDir + choiceLetter.toLowerCase() + ".png' /></a></div>");
    }
    
    $('.imgContain a img').click(function (e) {
        e.preventDefault();
        if(isMobile){
            clickCounterMobile+=1;
            if(clickCounterMobile < 2) return;
            else if(lastClickedElementMobile != e.target){
                lastClickedElementMobile = e.target;
                clickCounterMobile = 1;
                return;
            }
            clickCounterMobile = 0;
        }
        if($(this).parent().attr("href") == "active"){
            var chosen = getLetterFromURL($(this).attr('src')).toLowerCase();
            var right = $("#letterToGuess span").text().toLowerCase();
            if(chosen == right){
                //zeleno
                $(this).parent().parent().addClass("success"); //-> disable all
                $(".multipleImageContainer .imgContain a").removeAttr("href");
                $(".multipleImageContainer .imgContain").addClass("disabled");
                $(".level-write-medium #next-arrow-generic").attr("href","next");
                $(".level-write-medium #next-arrow").attr("href", "next");
                
                // History
                if(histPtr == 0 && ansHist > 1 ){
                    addHistoryWriteMediumGeneric(0,1);
                }
                else{
                    addHistoryWriteMediumGeneric(1,1);
                }
                // Points and learning progress
                addPoints(1); 
                moveToLearnt(right);
            }
            else{
                $(this).parent().parent().addClass("err");
                $(this).parent().parent().addClass("disabled");
                $(this).parent().removeAttr("href");
                
                // History
                if(histPtr == 0 && ansHist > 1 ){
                    addHistoryWriteMediumGeneric(0,0);
                }
                else{
                    addHistoryWriteMediumGeneric(1,0);
                }
                // Points and learning progress
                removePoints(1);
                moveToNotLearnt(right,0.5);
            }
        }
    });
    
    if(histPtr === 0){
        $(".level-write-medium #prew-arrow-generic").removeAttr("href");
    }else{
        $(".level-write-medium #prew-arrow-generic").attr("href", "prew");
    }
    $(".level-write-medium #next-arrow-generic").attr("href", "next");
}

/* *************************************************************************** */
/* *****************************  COOKIES  *********************************** */
/* *************************************************************************** */
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
    $("#points #points-display").text(Number(points));
}

function addPoints(pointsAdded) {
    var pointsNow = Number($("#points #points-display").text()) + pointsAdded;
    setPoints(pointsNow);
    setCookie(cookie_name, pointsNow, expDays);
}

function removePoints(pointsRemoved) {
    var pointsNow = Number($("#points #points-display").text()) - pointsRemoved;
    if (pointsNow < 0) {
        pointsNow = 0;
    }
    setPoints(pointsNow);
    setCookie(cookie_name, pointsNow, expDays);
}

function getPoints() {
    return Number($("#points #points-display").text());
}


/* *************************************************************************** */
/* *****************   FLAG ROTATION (WRITE - medium & hard)  **************** */
/* *************************************************************************** */

// Boolean function for checking correct position (Hard)
function checkIfCorrWrite(){
    var letter = $("#letterToGuess span").text().toLowerCase();
    if(positions[letter][0] == curHandPos[0] && positions[letter][1] == curHandPos[1]) return true;
    else return false;
}

// Function for checking if one flag is correct
function checkIfOneIsCorrWrite(){
    var letter = $("#letterToGuess span").text().toLowerCase();
    if(positions[letter][1] == curHandPos[1]){
        disableFlags("left");
        return true;
    }
    else if(positions[letter][0] == curHandPos[0]){ //-right
        disableFlags("right");
        return true;
    }
    else return false;
}

//Function checks if position is another valid letter
function checkIfOtherCorrLetterWrite(){
    for(var letter in positions){
        if(letter != "init" && positions[letter][0] == curHandPos[0] && positions[letter][1] == curHandPos[1]){
            //flash right letter
            flashRightLetter(letter);
            return true;
        }
    }
    return false;
}

//Function flashes letter that corresponds to current position
function flashRightLetter(letter){
    var letterOld = $("#letterToGuess span").text();
    
    $("#letterToGuess span").fadeOut(150, function(){
        $("#letterToGuess span").text(letter.toUpperCase());
        $("#letterToGuess span").fadeIn(150, function(){
            setTimeout(function(){
                $("#letterToGuess span").fadeOut(150, function(){
                    $("#letterToGuess span").text(letterOld.toUpperCase());
                    $("#letterToGuess span").fadeIn(150, function(){ });
                });
            }, 150);
        });
    });
}


// Function marks check image appropriately (1-corect // 0-err // 2-normal)
function markCheckControlWrite(status){
    var tmp = $("#check img").attr("src");
    if(status == 1){
        $("#check img").attr("src", imageGeneralDir + "check_correct.png");
        disableFlags("both");
    }
    else if(status == 0){
        $("#check img").attr("src", imageGeneralDir + "check_err.png");
        $("#check img").attr("href", "enabled");
    }
    else{
        $("#check img").attr("src", imageGeneralDir + "check.png");
        $("#check img").attr("href", "enabled");
    }
}

// Function for disabeling check mark
function disableCheckControlWrite(){
   $("#check").removeAttr("href");
}

// Function for enabeling check mark
function enableCheckControlWrite(){
   $("#check").attr("href","enabled");
}

//Function for geting and displaying history
function getAndDisplayHistoryWrite(){
    var letter = ansHist[histPtr][0];
    displHistWrite(letter);
    disableCheckControlWrite();
    markCheckControlWrite(1);
}

// Function for displaying history
function displHistWrite(letter){
    $("#letterToGuess span").text(letter.toUpperCase());
    setFlagPosition("right",positions[letter][0]);
    setFlagPosition("left",positions[letter][1]);
}

// Function for adding to history [letter, answ (0 - no // 1 - yes)] (Write-hard)
function pushHistoryWriteHard(state){
    var letter = $(".level-write-hard #letterToGuess span").text().toLowerCase();
    ansHist.push([letter,state]);
}

// Function for seting input in history [letter, answ (0 - no // 1 - yes)] (Write-hard)
function setHistoryWriteHard(state){
    var letter = $(".level-write-hard #letterToGuess span").text().toLowerCase();
    ansHist[histPtr]=([letter,state]);
}

// Function for adding to history [letter, answ (0 - no // 1 - yes), fixed hand (0 - right // 1 - left // 2 - both)] (Write-medium)
function pushHistoryWriteMedium(state){
    var letter = $(".level-write-medium #letterToGuess span").text().toLowerCase();
    if($("#imageLeftFlag").attr("href") !== "enabled")ansHist.push([letter,state,1]);
    else ansHist.push([letter,state,0]);
}

// Function for seting input in history [letter, answ (0 - no // 1 - yes), fixed hand (0 - right // 1 - left)] (Write-medium)
function setHistoryWriteMedium(state){
    var letter = $(".level-write-medium #letterToGuess span").text().toLowerCase();
    ansHist[histPtr]=([letter,state,2]);
}

// Function for selecting and displaying new option (Hard)
function selectAndDisplayNewLetterWriteHard(alphabet){
    var letter = selectNewLetter(alphabet);
    DisplayNewLetterWriteHard(letter);
}

// Function for displaying letter to write (Hard)
function DisplayNewLetterWriteHard(letter){
    $("#letterToGuess span").text(letter.toUpperCase());
    setFlagPosition("right",positions["init"][0]);
    setFlagPosition("left",positions["init"][1]);
    enableFlags("both");
    markCheckControlWrite(2);
    enableCheckControlWrite();
}

// Function for selecting and displaying new option (Medium)
function selectAndDisplayNewLetterWriteMedium(alphabet){
    var letter = selectNewLetter(alphabet);
    DisplayNewLetterWriteMedium(letter);
}

// Function for displaying letter to write (Medium)
function DisplayNewLetterWriteMedium(letter){
    $("#letterToGuess span").text(letter.toUpperCase());
    if(histPtr == ansHist.length){
        setFlagPosition("right",positions["init"][0]);
        setFlagPosition("left",positions["init"][1]);
        setFlagsMedium(2);
    }
    else if(ansHist[histPtr][2] == 0){
        setFlagPosition("left",positions["init"][1]);
        setFlagsMedium(0);
    }
    else{
        setFlagPosition("right",positions["init"][0]);
        setFlagsMedium(1);
    }
    markCheckControlWrite(2);
    enableCheckControlWrite();
}

// Function for fixed position of flag to nearest posible angle
function  fixPosition(flag){
    var flagElem, angle;
    if(flag === "right"){
        flagElem = $("#imageRightFlag");
        angle = calculateAngleOfFixedFlag(flagElem);
        if (angle == 360) angle = 0;
        curHandPos[0] = angle;
    }
    else if(flag === "left"){
        flagElem = $("#imageLeftFlag");
        angle = calculateAngleOfFixedFlag(flagElem);
        if (angle == 360) angle = 0;
        curHandPos[1] = angle;
    }
    flagElem.css('transform', 'rotate('+angle+'deg)');
}

// Function fo calculating angle of nearest posible position
function calculateAngleOfFixedFlag(el){
    var matrixOfTransform = el.css("transform");
    // Conversion of matrix to angle (deg)
    var values = matrixOfTransform.substring(7).split(",");
    var a = values[0], b = values[1];
    var angle = Math.round(Math.atan2(b, a) * (180/Math.PI));
    if(angle < 0)angle += 360;

    var modulo = Math.floor(angle/45); // <- bottom value (0 || 1 || ... || 7) * 45
    var reminder = angle%45;
    var fixedAngle = modulo*45;
    if(reminder > 22.5){
        fixedAngle += 45;
    }
    return fixedAngle;
}

// Function fo start position (initialization)
function setFigure(){
    var containerHeight = 300, containerWidth = 400;
    // Sets the size of div-container
    $('#imageCointainer').attr("style","height:"+containerHeight+"px; width:"+containerWidth+"px;");
    
    // Sets the base figure size adn position
    var basicFigureHeight = 2/3* containerHeight; 
    var basicFigureTop = (containerHeight - basicFigureHeight)/2;
    $("#imageBasicFigure").attr("style","height:"+basicFigureHeight+"px; top:"+basicFigureTop+"px");
    
    // Sets size adn position of right flag
    var rightFlagHeight = 1/2* containerHeight; 
    var rightFlagTop = rightFlagHeight*0.18;
    $("#imageRightFlag").attr("style","height:"+rightFlagHeight+"px; top:-"+rightFlagTop+"px"); 
    
    // Sets size adn position of right flag
    var leftFlagHeight = 1/2* containerHeight; 
    var leftFlagTop = leftFlagHeight*0.18;
    $("#imageLeftFlag").attr("style","height:"+leftFlagHeight+"px; top:-"+leftFlagTop+"px"); 
    
    // Sets center point of rotation
    var objFlagRight = $("#imageRightFlag");
    var centerKrozRight = [(objFlagRight.offset().left+(objFlagRight.width())),(objFlagRight.offset().top+objFlagRight.height())];
    middlePointRight = centerKrozRight;
    
    var objFlagLeft = $("#imageLeftFlag");
    var centerKrozLeft = [(objFlagLeft.offset().left),(objFlagLeft.offset().top+objFlagLeft.height())];
    middlePointLeft = centerKrozLeft;
    
    // Enables Flags
    enableFlags("both");
}

// Function for setting flags (Medium) [fixedSide = 0 - right, 1 - left, 2 - random]
function setFlagsMedium(fixedSide){
    if(fixedSide == 2) fixedSide = Math.round(Math.random());
    var letter = $("#letterToGuess span").text().toLowerCase();
    if(fixedSide == 1){
        //LEFT is disabled
        setFlagPosition("left",positions[letter][1]);
        disableFlags("left");
    }
    else{
        //RIGHT is disabled
        setFlagPosition("right",positions[letter][0]);
        disableFlags("right");
    }
}

// Function for seting flag in given position
function setFlagPosition(flag,deg){
    if(flag === "right"){
        $("#imageRightFlag").css("transition-duration","1s");
        $("#imageRightFlag").css('transform', 'rotate('+deg+'deg)');
        setTimeout(function() { $("#imageRightFlag").css("transition-duration","0s"); }, 1000); //1,05 sec delay
        curHandPos[0] = deg;
    }
    else if(flag === "left"){
        $("#imageLeftFlag").css("transition-duration","1s");
        $("#imageLeftFlag").css('transform', 'rotate('+deg+'deg)');
        setTimeout(function() { $("#imageLeftFlag").css("transition-duration","0s"); }, 1000); //1,05 sec delay
        curHandPos[1] = deg;
    }
}

// Function for disabling flags movement [right, left, both]
function disableFlags(flag){
    if(flag === "right"){
        $("#imageRightFlag").removeAttr("href");
    }
    else if(flag === "left"){
        $("#imageLeftFlag").removeAttr("href");
    }
    else if(flag === "both"){
        disableFlags("right");
        disableFlags("left");
    }
}

// Function for enabling flags movement [right, left, both]
function enableFlags(flag){
    if(flag === "right"){
        $("#imageRightFlag").attr("href","enabled");
    }
    else if(flag === "left"){
        $("#imageLeftFlag").attr("href","enabled");
    }
    else if(flag === "both"){
        enableFlags("right");
        enableFlags("left");
    }
}



/* *************************************************************************** */
/* **************************   SUPPORT FUNCTIONS  *************************** */
/* *************************************************************************** */

function shuffle(a) {
    for (var i = a.length; i; i--) {
        var j = Math.floor(Math.random() * i);
        [a[i - 1], a[j]] = [a[j], a[i - 1]];
    }
}

/* Disables all "choices" - buttons */
function buttonsDisable(){
    var buttons = document.getElementById('choices'),button;
    if (buttons) {
        for(var i = 0; i < buttons.children.length; i++){
            button = buttons.children[i];
            button.disabled=true;
        }
    }
}

/* Disables all "choices" - ImageButtons */
function imageButtonsDisable(parent){ //doda class not_active
    //console.log("P:" + parent);
    $(parent).find(".image_option").addClass("not_active");
}

function imageOneButtonDisable(element){
    $(element).addClass("not_active");
}

function imageButtonsEnable(parent) {
    $(parent).find(".image_option").removeClass("not_active");
}

function textFieldsDisable(selector) {
    $(selector).each(function() {
       $(this).attr("disabled", "disabled"); 
    });
}

function textFieldsEnable(selector) {
    $(selector).each(function() {
       $(this).removeAttr("disabled"); 
    });
}

/* Returns letter from image link (e. g. returns "k" from "/static/images/flags/k.png") */
function getLetterFromURL(url) {
    var image_link = url.split("/");
    var image_name = image_link[image_link.length - 1];
    var letter = image_name.split(".")[0];
    return letter;
}

/* sleep for "delay" miliseconds */
function sleep(delay) {
    var start = new Date().getTime();
    while (new Date().getTime() < start + delay);
}

function isLetter(c) {
    return c.toLowerCase() != c.toUpperCase();
}

function checkURL(url) {
    return(url.match(/\.(jpeg|jpg|gif|png)$/) != null);
}

function getLevelCode(path){
    var params = path.split("/");
    if(params.length  < 6){
        return "index";
    }
    
    // Remove first and last element as they are empty
    params.shift();
    params.pop();
    
    var code = "";
    
    if(params[1] != "flags")code+="g";
    
    if(params[2] == "read")code+="r";
    else code+="w";
    
    code += params[3].charAt(0);
    
    return code;
}

/* *************************************************************************** */
/* ****************************   DRAG AND DROP  ***************************** */
/* *************************************************************************** */



function allowDrop(ev) {
    ev.preventDefault();
    var idName= ev.target.id;
    if(idName == ""){
        $(ev.target).parent().css("border-style","dashed");
    }
    else $(ev.target).css("border-style","dashed");
}

function dragLeave(ev){
    ev.preventDefault();
    var idName= ev.target.id;
    if(idName == ""){
        $(ev.target).parent().css("border-style","solid");
    }
    else $(ev.target).css("border-style","solid");
}

function allowDropTrash(ev) {
    ev.preventDefault();
    //console.log("nad in tag name: "+$(ev.target).prop("tagName"));
    if($(ev.target).prop("tagName") == "IMG"){
        $(ev.target).parent().parent().addClass("border");
        return;
    }
    $(ev.target).addClass("border");
}

function dragLeaveTrash(ev){
    ev.preventDefault();
    //console.log("vn in tag name: "+$(ev.target).prop("tagName"));
    if($(ev.target).prop("tagName") == "IMG"){
        $(ev.target).parent().parent().removeClass("border");
        return;
    }
    $(ev.target).removeClass("border");
}


function drag(ev) {
    //$(ev.target).attr("style","transform: scale(0.7, 0.7);")
    ev.dataTransfer.setData("text", event.target.src);
    var dragIcon = document.createElement('img');
    dragIcon.src = event.target.src;
    dragIcon.width = "20%";
    ev.dataTransfer.setDragImage(dragIcon, 120, 120);
}

function drop(ev) {
    ev.preventDefault();
    var data;
    if(isMobile){
        data = dragedImageData;
        //console.log("data = "+data);
    }
    else data = ev.dataTransfer.getData("text");
    
    var idName= ev.target.id;
    
    if(!checkURL(data)){
        if(idName == ""){
            $(ev.target).parent().css("border-style","solid");
        }
        else $(ev.target).css("border-style","solid");
        return;
    }
    
    var divContainer;
    if (idName != "") {
        $("#"+idName+" span").addClass("hidden");
        divContainer = $("#"+idName);
    }
    else{
        $(ev.target).addClass("hidden");
        divContainer = $(ev.target).parent();
    }
    divContainer.attr("draggable",'true');
    if(!isMobile)divContainer.attr("ondragstart",'dragFromTask(event)');
    divContainer.attr("style","background-image: url("+data+");background-repeat:no-repeat;background-size:contain;");
    divContainer.removeClass("success err")
    if(newTaskSize != null){
        divContainer.css("width",newTaskSize);
        divContainer.css("height",newTaskSize);
    }
}

function dragFromTask(ev){
    ev.dataTransfer.setData("text", event.target.id);
}

function dropInTrash(ev){
    ev.preventDefault();
    
    $(".trashCan").removeClass("border");
    var data;
    if(isMobile){
        data = dragedImageData;
    }
    else data = ev.dataTransfer.getData("text");
    
    if(data.indexOf("taskConatiner") !== -1)return;
    
    $("#"+data).attr("style","background-image:none");
    $("#"+data).removeClass("succes err");
    $("#"+data+" span").removeClass();
    if(newTaskSize != null){
        $("#"+data).css("width",newTaskSize);
        $("#"+data).css("height",newTaskSize);
        $("#"+data+" span").css("font-size",newTaskSize*0.8)
    }
}


/* *************************************************************************** */
/* ***********************   FUNCTIONS FOR CONTROLS  ************************* */
/* *************************************************************************** */

// Write-hard next-arrow-generic
var wh_nag = function(e) {
    if ($("#next-arrow-generic").attr("href") === "next") {
        histPtr++;
        if(histPtr == ansHist.length){  // New seq
            //read_hard();
            //new word -> select and display
            selectAndDisplayNewWordWriteHardGeneric();
            refresh();
            //$("#start-animation").css("visibility", "visible");
            
            $(".level-write-hard #next-arrow-generic").removeAttr("href");
            if(histPtr != 0){
                //get state and word
                var taskWord = "";
                var state = "";
                $(".taskContainer .taskLetter span").each(function(e){
                    var letter = ($(this).text()).toLowerCase(); 
                    taskWord += letter;
                    if(state != "")state+=",";
                    state+= letter + "I";
                });
                $("#checkGeneric img").attr("src", imageGeneralDir + "check.png");
                addHistoryWriteHardGeneric(0,0,taskWord,state); // push to history and mark as unanswered
            }
        }
        
        else if(histPtr == ansHist.length-1 && ansHist[histPtr][2] == 0){   // Chosen word is not answered
            //restoreStringWriteHardGeneric(ansHist[histPtr][0],ansHist[histPtr][1]);
            $("#checkGeneric img").attr("src", imageGeneralDir + "check.png");
            restoreHistoryWriteHardGeneric(ansHist[histPtr][0],ansHist[histPtr][1]);
        }
        
        else if(histPtr == ansHist.length-1 && ansHist[histPtr][2] == 1){   // Chosen letter is answered
            $(".level-write-hard #next-arrow-generic").attr("href", "next");
            $("#checkGeneric img").attr("src", imageGeneralDir + "check_correct.png");
            restoreHistoryWriteHardGeneric();
        }
        
        else{   // Chosen letter is answered
            $("#checkGeneric img").attr("src", imageGeneralDir + "check_correct.png");
            restoreHistoryWriteHardGeneric();
        }
        
        $(".level-write-hard #prew-arrow-generic").attr("href", "prew");
        if(histPtr == ansHist.length-1 && ansHist[histPtr][2] == 0) $(".level-write-hard #next-arrow-generic").removeAttr("href");
    }
};

// Write-hard prev-arrow-generic   
var wh_pag = function(e){
    if ($("#prew-arrow-generic").attr("href") === "prew") {
        histPtr--;
        $("#checkGeneric img").attr("src", imageGeneralDir + "check_correct.png");
        restoreHistoryWriteHardGeneric();
        //textFieldsDisable(".letterInputClass");
        //$("#start-animation").css("visibility", "hidden");
        $(".level-write-hard #next-arrow-generic").attr("href", "next");
        if(histPtr == 0){
            $("#prew-arrow-generic").removeAttr("href");
        }
    }
}
    
var wm_pag = function(e){
    if ($("#prew-arrow-generic").attr("href") === "prew") {
        histPtr--;
        restoreHistoryWriteMediumGeneric();
    }
}
    
var wm_nag = function(e){
    if ($("#next-arrow-generic").attr("href") === "next") {
        histPtr++;
        if(histPtr == ansHist.length){  // New letter
            newTaskWriteMediumGeneric();
            refresh();
            if(histPtr != 0){
                addHistoryWriteMediumGeneric(0,0); // push to history and mark as unanswered
            }
        }
        else if(histPtr == ansHist.length-1 && ansHist[histPtr][1] == 0){   // Chosen letter is not answered
            displayOldLetterWriteMediumGeneric(ansHist[histPtr][2], ansHist[histPtr][0]);
        }
        else if(histPtr == ansHist.length-1 && ansHist[histPtr][1] == 1){   // Chosen letter is answered
            $(".level-write-medium #next-arrow-generic").attr("href", "next");
            restoreHistoryWriteMediumGeneric();
        }
        else{   // Chosen letter is answered
            restoreHistoryWriteMediumGeneric();
        }
        $(".level-write-medium #prew-arrow-generic").attr("href", "prew");
        if(histPtr == ansHist.length-1 && ansHist[histPtr][1] == 0)$(".level-write-medium #next-arrow-generic").removeAttr("href"); 
    }
}
    
var re_na = function(e){
    if ($("#next-arrow").attr("href") === "next") {
        histPtr++;
        if(histPtr == ansHist.length){  // New letter
            selectAndDisplayNewLetter(window.alphabet,"easy");
            //pointsForRightAnswerReadEasy = 3; <-- not in use
            if(histPtr != 0){
                addHistoryEasy(0,0); // push to history and mark as unanswered
            }
        }
        else if(histPtr == ansHist.length-1 && ansHist[histPtr][1] == 0){   // Chosen letter is not answered
            displayOldLetter(ansHist[histPtr][2], getChoices(ansHist[histPtr][0]));
            //pointsForRightAnswerReadEasy = ansHist[histPtr][3]; <-- not in use
        }
        else if(histPtr == ansHist.length-1 && ansHist[histPtr][1] == 1){   // Chosen letter is answered
            $(".level-read-easy #next-arrow").attr("href", "next");
            restoreHistoryEasy();
        }
        else{   // Chosen letter is answered
            restoreHistoryEasy();
        }
        $(".level-read-easy #prew-arrow").attr("href", "prew");
        if(histPtr == ansHist.length-1 && ansHist[histPtr][1] == 0)$(".level-read-easy #next-arrow").removeAttr("href"); 
    }
}
    
var re_pa = function(e){
    if ($("#prew-arrow").attr("href") === "prew") {
        histPtr--;
        restoreHistoryEasy();
    }
}

var rm_na = function(e){
    if ($("#next-arrow").attr("href") === "next") {
        histPtr++;
        if(histPtr == ansHist.length){  // New letter
            selectAndDisplayNewLetter(window.alphabet,"medium");
            refresh();
            $("#letterInput").removeClass()
            $("#letterInput").val("");
            $("#letterInput").focus();
            if(histPtr != 0){
                addHistoryMedium(0,0); // push to history and mark as unanswered
            }
        }
        else if(histPtr == ansHist.length-1 && ansHist[histPtr][1] == 0){   // Chosen letter is not answered
            displayOldLetterMedium(ansHist[histPtr]);
            $("#read_medium_solution").removeAttr("disabled");
        }
        else if(histPtr == ansHist.length-1 && ansHist[histPtr][1] == 1){   // Chosen letter is answered
            $(".level-read-medium #next-arrow").attr("href", "next");
            restoreHistoryMedium();
        }
        else{   // Chosen letter is answered
            restoreHistoryMedium();
        }
        $(".level-read-medium #prew-arrow").attr("href", "prew");
        if(histPtr == ansHist.length-1 && ansHist[histPtr][1] == 0)$(".level-read-medium #next-arrow").removeAttr("href"); 
    }
}

var rm_pa = function(e){
	if ($("#prew-arrow").attr("href") === "prew") {
		histPtr--;
		restoreHistoryMedium();
	}
}

var rh_na = function(e){
	if ($("#next-arrow").attr("href") === "next") {
		histPtr++;
		//console.log("next-arrow");
		if(histPtr == ansHist.length){  // New seq
			//console.log("1");
			read_hard();
			refresh();
			$("#start-animation").css("visibility", "visible");
			//console.log("Odstranil bom next arrow (1)");
			$(".level-read-hard #next-arrow").removeAttr("href");
			if(histPtr != 0){
				pushHistoryReadHard(0); // push to history and mark as unanswered
			}
		}
		
		else if(histPtr == ansHist.length-1 && ansHist[histPtr][1] == 0){   // Chosen letter is not answered
			//console.log("2");
			$("#start-animation").css("visibility", "visible");
			restoreStringReadHard(ansHist[histPtr][0]);
		}
		
		else if(histPtr == ansHist.length-1 && ansHist[histPtr][1] == 1){   // Chosen letter is answered
		//console.log("3");
			$(".level-read-hard #next-arrow").attr("href", "next");
			restoreHistoryReadHard();
		}
		
		else{   // Chosen letter is answered
		//console.log("4");
			restoreHistoryReadHard();
		}
		
		$(".level-read-hard #prew-arrow").attr("href", "prew");
		if(histPtr == ansHist.length-1 && ansHist[histPtr][1] == 0) $(".level-read-hard #next-arrow").removeAttr("href");
	}
}

var rh_pa = function(e){
	if ($("#prew-arrow").attr("href") === "prew") {
		histPtr--;
		restoreHistoryReadHard();
		textFieldsDisable(".letterInputClass");
		$("#start-animation").css("visibility", "hidden");
		$(".level-read-hard #next-arrow").attr("href", "next");
		if(histPtr == 0){
			$("#prew-arrow").removeAttr("href");
		}
	}
}

var we_na = function(e){
	if ($("#next-arrow").attr("href") === "next") {
		histPtr++;
		if(histPtr == ansHist.length){  // New letter
			selectAndDisplayNewImage(alphabet, "easy");
			refresh();
			imageButtonsEnable($(".imageSelectionWrap #picture-letter").parent().parent());
			if(histPtr != 0){
				addHistoryWriteEasy(0,0); // push to history and mark as unanswered
			}
		}
		else if(histPtr == ansHist.length-1 && ansHist[histPtr][1] == 0){   // Chosen letter is not answered
			displayOldLetterWriteEasy(ansHist[histPtr][2], ansHist[histPtr][0]);
		}
		else if(histPtr == ansHist.length-1 && ansHist[histPtr][1] == 1){   // Chosen letter is answered
			$(".level-write-easy #next-arrow").attr("href", "next");
			restoreHistoryWriteEasy();
		}
		else{   // Chosen letter is answered
			restoreHistoryWriteEasy();
		}
		$(".level-write-easy #prew-arrow").attr("href", "prew");
		if(histPtr == ansHist.length-1 && ansHist[histPtr][1] == 0)$(".level-write-easy #next-arrow").removeAttr("href"); 
	}
}

var we_pa = function(e){
	if ($("#prew-arrow").attr("href") === "prew") {
		histPtr--;
		restoreHistoryWriteEasy();
	}
}

var wm_c = function(e){
	if($("#check").attr("href") === "enabled"){
		var letter = $(".level-write-medium #letterToGuess span").text().toLowerCase();
		if(checkIfCorrWrite()){
			markCheckControlWrite(1);
			disableCheckControlWrite();
			$(".level-write-medium #next-arrow").attr("href", "next");
			// History
			if(histPtr == 0){
				pushHistoryWriteMedium(1);
			}
			else{
				setHistoryWriteMedium(1);
			}
			// Points and learning process
			moveToLearnt(letter);
			addPoints(1);
		}
		else if(checkIfOtherCorrLetterWrite()){
			markCheckControlWrite(0);
		}
		else{
			markCheckControlWrite(0);
			// Points and learning process
			removePoints(1);                
			moveToNotLearnt(letter,1);
		}
	}
}


var wm_pa = function(e){
	if ($("#prew-arrow").attr("href") === "prew") {
		disableFlags("both");
		histPtr--;
		getAndDisplayHistoryWrite();
		$(".level-write-medium #next-arrow").attr("href", "next");
		if(histPtr == 0){
			$("#prew-arrow").removeAttr("href");
		}
	}
}

var wm_na = function(e){
if ($("#next-arrow").attr("href") === "next") {
		histPtr++;
		if(histPtr == ansHist.length){  // New letter
			enableFlags("both");
			selectAndDisplayNewLetterWriteMedium(window.alphabet,"easy");
			$(".level-write-medium #next-arrow").removeAttr("href");
			if(histPtr != 0){
				pushHistoryWriteMedium(0); // push to history and mark as unanswered
			}
		}
		else if(histPtr == ansHist.length-1 && ansHist[histPtr][1] == 0){   // Chosen letter is not answered
			enableFlags("both");
			DisplayNewLetterWriteMedium(ansHist[histPtr][0]);
		}
		else if(histPtr == ansHist.length-1 && ansHist[histPtr][1] == 1){   // Chosen letter is answered
			$(".level-write-medium #next-arrow").attr("href", "next");
			getAndDisplayHistoryWrite();
		}
		else{   // Chosen letter is answered
			getAndDisplayHistoryWrite();
		}
		$(".level-write-medium #prew-arrow").attr("href", "prew");
		if(histPtr == ansHist.length-1 && ansHist[histPtr][1] == 0)$(".level-write-medium #next-arrow").removeAttr("href");
	}
}

var wh_c = function(e){
	if($("#check").attr("href") === "enabled"){
		var letter = $(".level-write-hard #letterToGuess span").text().toLowerCase();
		if(checkIfCorrWrite()){ 
			markCheckControlWrite(1);
			disableCheckControlWrite();
			$(".level-write-hard #next-arrow").attr("href", "next");
			// History
			if(histPtr == 0){
				pushHistoryWriteHard(1);
			}
			else{
				setHistoryWriteHard(1);
			}
			// Points and learning progress
			if($("#imageLeftFlag").attr("href")!="enabled" || $("#imageRightFlag").attr("href")!="enabled"){
				addPoints(1); 
			}
			else addPoints(2);
			moveToLearnt(letter);
		}
		else if(checkIfOneIsCorrWrite()){
			markCheckControlWrite(0);
			checkIfOtherCorrLetterWrite();
		}
		else if(checkIfOtherCorrLetterWrite()){}
		else{
			markCheckControlWrite(0);
			// Points and learning progress
			if($("#imageLeftFlag").attr("href")!="enabled" || $("#imageRightFlag").attr("href")!="enabled"){
				removePoints(1); 
			}
			else removePoints(2); 
			moveToNotLearnt(letter,1);
		}
	}
}

var wh_pa = function(e){
	if ($("#prew-arrow").attr("href") === "prew") {
		disableFlags("both");
		histPtr--;
		getAndDisplayHistoryWrite();
		$(".level-write-hard #next-arrow").attr("href", "next");
		if(histPtr == 0){
			$("#prew-arrow").removeAttr("href");
		}
	}
}

var wh_na = function(e){
	if ($("#next-arrow").attr("href") === "next") {
		histPtr++;
		if(histPtr == ansHist.length){  // New letter
			enableFlags("both");
			selectAndDisplayNewLetterWriteHard(window.alphabet,"easy");
			$(".level-write-hard #next-arrow").removeAttr("href");
			if(histPtr != 0){
				pushHistoryWriteHard(0); // push to history and mark as unanswered
			}
		}
		else if(histPtr == ansHist.length-1 && ansHist[histPtr][1] == 0){   // Chosen letter is not answered
			enableFlags("both");
			DisplayNewLetterWriteHard(ansHist[histPtr][0]);
		}
		else if(histPtr == ansHist.length-1 && ansHist[histPtr][1] == 1){   // Chosen letter is answered
			$(".level-write-hard #next-arrow").attr("href", "next");
			getAndDisplayHistoryWrite();
		}
		else{   // Chosen letter is answered
			getAndDisplayHistoryWrite();
		}
		$(".level-write-hard #prew-arrow").attr("href", "prew");
		if(histPtr == ansHist.length-1 && ansHist[histPtr][1] == 0)$(".level-write-hard #next-arrow").removeAttr("href");
	}
}

var li = function(e){
        if(e.which == 10 || e.which == 13) {
            var vnos = (document.getElementById('letterInput')).value;
            if ($("#picture-letter").hasClass("tested") || vnos === "") {
                // Enter was pressed without changing the letter
                // Or: input is empty
                return;
            } else {
                // Marks enter as "pressed" - pressing agen don't cause more negative points
                $("#picture-letter").addClass("tested");
            }
            
            // Checks if input letter matches with correct one
            var image_link = $("#picture-letter img").attr("src").split("/");
            var image_name = image_link[image_link.length - 1];
            var letter = image_name.split(".")[0];
            

            if(vnos.toUpperCase() === letter.toUpperCase()){
                $("#letterInput").addClass("correctInput");
                $("#letterInput").removeClass("wrongInput");
                $("#next-arrow").attr("href", "next");
                document.getElementById('letterInput').disabled = true;
                // History
                if(histPtr == 0 && ansHist.length < 1 ){
                    addHistoryMedium(0,1);
                }
                else{
                    addHistoryMedium(1,1);
                }
                
                $("#picture-letter").removeClass("tested");
                $("#next-arrow").focus();
                // Points and learning progress
                addPoints(1);
                moveToLearnt(letter);
            } else {
                $("#letterInput").addClass("wrongInput");
                $("#letterInput").removeClass("correctInput");
                $("#letterInput").focus().select();
                moveToNotLearnt(letter,1);
                if(histPtr == 0 && ansHist.length < 1 ){
                    addHistoryMedium(0,0);
                }
                else{
                    addHistoryMedium(1,0);
                }
                // Points and learning progress
                removePoints(1);
                moveToNotLearnt(letter,1);
            }
                
        } else {
            $("#picture-letter").removeClass("tested");
        }
    }
    
var cg = function(e){
    if($("#checkGeneric").attr("href")=="enabled"){
       //pridobi vsa polja in poglej kaj je gor
        
        var taskWord = "";
        $(".taskContainer .taskLetter span").each(function(e){
            taskWord += ($(this).text()).toLowerCase();
        });
        var position = 0;
        var state = "";
        var nmbOfCorrect = 0;
        $(".taskContainer .taskLetter").each(function(){
            var url = $(this).css('background-image');
            if(url != "none"){
                var letter = getLetterFromURL(url);
                if(state != "")state+=",";
                if($(this).hasClass("success")){
                    state+=letter+"S";
                    nmbOfCorrect+=1;
                    position++;
                    return;
                }
                else if(letter == taskWord.charAt(position)){
                    $(this).removeClass("err");
                    $(this).addClass("success disabled");
                    $(this).attr("ondragstart","return false;");
                    
                    addPoints(1);
                    moveToLearnt(letter);
                    
                    state+=letter+"S";
                    nmbOfCorrect+=1;
                }
                else{
                    $(this).addClass("err");
                    
                    removePoints(1);
                    moveToNotLearnt(letter,1);
                    
                    state+=letter+"D";
                }
            }
            else{
                if(state != "")state+=",";
                state+="_I";
            }
            position++;
        });
        
        if(histPtr == 0 && ansHist.length < 1 ){
            if(nmbOfCorrect == taskWord.length){
                addHistoryWriteHardGeneric(1, 0, taskWord, state);
                $(".level-write-hard #next-arrow-generic").attr("href", "next");
                $("#checkGeneric img").attr("src", imageGeneralDir + "check_correct.png");
            }
            else{
                addHistoryWriteHardGeneric(0, 0, taskWord, state);
            }
        }
        else{
            if(nmbOfCorrect == taskWord.length){
                addHistoryWriteHardGeneric(1, 1, taskWord, state);
                $(".level-write-hard #next-arrow-generic").attr("href", "next");
                $("#checkGeneric img").attr("src", imageGeneralDir + "check_correct.png");
            }
            else{
                addHistoryWriteHardGeneric(0, 1, taskWord, state);
            }
        }
        
    }
}