/**
 * This module is concerned with handling DOM events. All user interactions are accounted
 * for here. For example, when the edit button is clicked, that interaction is handled in
 * this file.
 */
(function(substitution) {
    var registerEncryptedLetterDraggableEvent = function(encryptedLetters) {
            $(encryptedLetters).draggable({
                start:
                    function(event, ui) {
                        $(this).data('uihelper', ui.helper);
                    },
                helper: "clone",
                showAnim: '',
                revertDuration: 0,
                revert: function(value) {
                    var uiHelper = $(this).data('uihelper');
                    uiHelper.data('dropped', value !== false);
                    if (value === false) {
                        wordLetterDroppedOutside($(this));
                        return true;
                    }
                    return false;
                },
                cancel: ''
            });
        },
        unregisterEncryptedLetterDraggableEvent = function(encryptedLetters) {
            $(encryptedLetters).draggable('destroy');
        },
        wordLetterDroppedOn = function(event, ui) {
            var from = $(ui.draggable);
            var to = $(this);
            var fromValue = from.attr('value');
            var toValue = to.attr('value');
            var toOriginal = to.attr('original');
            if (from.is('div')) {
                freeLetterDroppedOnWordLetter(fromValue,toValue, toOriginal);
            } else {
                var fromOriginal = from.attr('original');
                wordLetterDroppedOnWordLetter(fromValue,toValue, toOriginal, fromOriginal);
            }
            substitution.ui.loadSolvedMessageContainer();
            startTimer();
            checkHash();
        },
        freeLetterDroppedOnWordLetter = function(fromValue, toValue, toOriginal) {
            var encryptedLetters = substitution.ui.getEncryptedLetters()[toOriginal];
            if (toValue) {
                substitution.ui.setEncryptedLettersDisplayValue(encryptedLetters, fromValue,
                    'freeLetterDisplay', 'letterInputDisplay');
                substitution.ui.addFreeLetter(toValue);
                substitution.ui.removeFreeLetter(fromValue);
                substitution.util.setSubstitution(toOriginal, fromValue);
            }
            else {
                registerEncryptedLetterDraggableEvent(encryptedLetters);
                substitution.ui.setEncryptedLettersDisplayValue(encryptedLetters, fromValue,
                    'freeLetterDisplay', 'letterInputDisplay');
                substitution.ui.removeFreeLetter(fromValue);
                substitution.util.setSubstitution(toOriginal, fromValue);
            }
        },
        wordLetterDroppedOnWordLetter = function(fromValue, toValue, toOriginal, fromOriginal) {
            var lettersTo = substitution.ui.getEncryptedLetters()[toOriginal];
            var lettersFrom = substitution.ui.getEncryptedLetters()[fromOriginal];
            if (toValue) {
                substitution.ui.setEncryptedLettersDisplayValue(lettersTo, fromValue,
                    null, null);
                substitution.ui.setEncryptedLettersDisplayValue(lettersFrom, toValue,
                    null, null);
                substitution.util.setSubstitution(toOriginal, fromValue);
                substitution.util.setSubstitution(fromOriginal, toValue);
            }
            else {
                registerEncryptedLetterDraggableEvent(lettersTo);
                unregisterEncryptedLetterDraggableEvent(lettersFrom);
                substitution.ui.setEncryptedLettersDisplayValue(lettersTo, fromValue,
                    'freeLetterDisplay', 'letterInputDisplay');
                substitution.ui.setEncryptedLettersDisplayValue(lettersFrom, "",
                    'letterInputDisplay', 'freeLetterDisplay');

                substitution.util.setSubstitution(toOriginal, fromValue);
                substitution.util.removeSubstitution(fromOriginal);
            }
        },
        wordLetterDroppedOutside = function (from) {
            var fromValue = from.attr('value');
            var fromOriginal = from.attr('original');
            removeWordLetter(fromValue, fromOriginal);
        },
        removeWordLetter = function(fromValue, fromOriginal) {
            var lettersFrom = substitution.ui.getEncryptedLetters()[fromOriginal];
            substitution.ui.setEncryptedLettersDisplayValue(lettersFrom, "",
                    'letterInputDisplay', 'freeLetterDisplay');
            substitution.util.removeSubstitution(fromOriginal);
            substitution.ui.addFreeLetter(fromValue);
            unregisterEncryptedLetterDraggableEvent(lettersFrom);
        },
        inputLetterChangeEvent = function(event) {
            var input = $(event.originalEvent.target);
            var inputValue = input.val().toUpperCase();
            var toOriginal = input.attr('original');
            var fromValue = input.attr('value');

            if (inputValue !== "" && !substitution.util.isLetter(inputValue)) {
                input.val("");
                input.blur();
                return
            }
            if (inputValue) {
                if (fromValue) {
                    freeLetterDroppedOnWordLetter(inputValue, fromValue, toOriginal);
                } else {
                    freeLetterDroppedOnWordLetter(inputValue, "", toOriginal);
                }
            } else {
                removeWordLetter(fromValue, toOriginal);
            }
            substitution.ui.loadSolvedMessageContainer();
            input.blur();
            startTimer();
            checkHash();
        };

    substitution.event = {

        registerFreeLetterDraggableEvent: function () {
            var freeLettersDict = substitution.ui.getFreeLetters();
            for (var key in freeLettersDict) {
                if (freeLettersDict.hasOwnProperty(key)) {
                    $(freeLettersDict[key][0]).draggable({
                        helper: "clone",
                        showAnim: '',
                        revertDuration: 0,
                        revert: true
                    });
                }
            }
        },
        registerWordLetterClickEvent: function () {
            var encryptedLetterContainer = $('#encryptedLetterContainer');
            encryptedLetterContainer.children().on("click", function (event) {
                $(this).children('input').focus();
            });
        },
        registerWordLetterDroppableEvent: function () {
            var encryptedLetterDict = substitution.ui.getEncryptedLetters();
            for (var key in encryptedLetterDict) {
                if (encryptedLetterDict.hasOwnProperty(key)) {
                    $(encryptedLetterDict[key]).droppable({
                        accept: 'div, input',
                        drop: wordLetterDroppedOn
                    });
                }
            }
        },
        registerWordInputChangeEvent: function () {
            $('#encryptedLetterContainer').find('input').on(
                'input propertychange', inputLetterChangeEvent)
        }

    }
}(substitution || {}));


/**
 * Method sets events for the div element holding free letters.
 * Make the div droppable, that accepts elements from the text display.
 * @param freeLetterDisplay div element containing free letters
 */
function setFreeLetterDisplayEvent(freeLetterDisplay) {
}

/**
 * Method sets events for the div element representing a free letter
 * Make the div draggable.
 * @param freeLetter div element representing the free letter
 */
function setFreeLetterEvent(freeLetter) {
    $(freeLetter).draggable(
        {
            showAnim: '',
            revertDuration: 0,
            revert: true
        }
    );

    $(freeLetter).hover(
        function() {
            $( this ).addClass( "textInputHover-t" );
            },
        function() {
            $( this ).removeClass( "textInputHover-t" );
    });
}

function setFrequencyEvent(frequency) {
    $(frequency).hover(
       function() {
           $( this ).addClass( "textInputHover-t" );
           highlightLetter($(this).attr('original'))
       },
       function() {
           $( this ).removeClass( "textInputHover-t" );
           unhighlightLetter($(this).attr('original'))
       }
   );
}

function highlightLetter(value) {
    var array = textDictionary[value];
    for (var i = 0; i < array.length; i++) {
        $(array[i]).addClass("textInputHover-t");
    }
}

function unhighlightLetter(value) {
    var array = textDictionary[value];
    for (var i = 0; i < array.length; i++) {
        $(array[i]).removeClass( "textInputHover-t" );
    }
}

/**
 *
 * @param wordLetter
 */
function setWordLetterEvent(wordLetter) {
   $(wordLetter).droppable({accept: 'div',
        drop: letterDroppedInMessage
    } );

   $(wordLetter).hover(
       function() {
           highlightLetter($(this).find('input').attr('original'));
       },
       function() {
           unhighlightLetter($(this).find('input').attr('original'));
       }
   );
}

/**
 *
 */
function setInputLetterEvent(inputLetter){
    $(inputLetter).on("input propertychange", function (e) {

        var input = $(e.originalEvent.target);
        input.val(input.val().toUpperCase());
        if (!freeLetterDictionary[input.val()] && input.val() !== "") {
            input.val("");
            return null;
        }
        else if(freeLetterDictionary[input.val()] && freeLetterDictionary[input.val()][1]) {
            input.val(input.attr('value'));
            return null;
        }
        if (input.val() === "" && freeLetterDictionary[input.attr('value')][1] === true) {
            outLetter(input.attr('value'), input.attr('original'));
        }
        else {
            freeLetterDictionary[input.val()][1] = true;
            insertLetters($(freeLetterDictionary[input.val()]), input.parent());
        }
        $(e.originalEvent.target).blur();
    });
}

/**
 * Substitute accordinly when a freeLetter is dragged into a letter slot in the
 * message display
 */
function letterDroppedInMessage(event, ui){
    var startDate = new Date();

    var dropped = $(ui.draggable);
    var droppedOn = $(this);

    // $(droppedOn).addClass("freeLetterLook");
    // droppedOn.prop("readonly", true);
    // droppedOn.attr("class", "uneditableCharacter");

    // droppedOn.draggable({containment: '#coreLogic',
    //   // stack: '#letterDisplay-t div',
    //     helper: "clone",
    //   showAnim: '',
    //   cursor: 'move',
    //   revertDuration: 0,
    //   revert: true});
    inLetter(dropped, droppedOn);
    var endDate   = new Date();
    var seconds = (endDate.getTime() - startDate.getTime()) / 1000;
    console.log(seconds);
    return;
    event.preventDefault();
    startTimer();
    var substitution = eventLetter; // value of the letter being dragged
    var original = event.target.getAttribute("value"); // cell that the letter is being dragged towards
    // substitute(original, substitution);
    checkHash();
}

function inLetter(dropped, droppedOn) {

    var swap = (droppedOn.find('input').attr('value') !== dropped.find('input').attr('value') && droppedOn.find('input').attr('value') !== ""
    && !dropped.hasClass("freeLetter") && droppedOn.find('input').attr('value') != null);

    if (swap) {
        swapLetters(dropped, droppedOn)
    }
    else {
        var freeLetter = (dropped.hasClass("freeLetter") &&
            droppedOn.find('input').attr('value') != null && droppedOn.find('input').attr('value') !== "");
        insertLetters(dropped, droppedOn, freeLetter)
    }
}

function insertLetters(dropped, droppedOn, freeLetter) {

    startTimer();
    $(frequencyDictionary[droppedOn.find('input').attr('original')]).addClass("freeLetterDisplay-t");

    var droppedOnArray = textDictionary[droppedOn.find('input').attr('original')];
    var i;
    var moved = false;

    if (dropped.find('input').attr('original') === droppedOn.find('input').attr('original')) {
        return null;
    }
    else if (!dropped.hasClass('wordLetter-t')) {
        $(dropped).detach().css({'top': '', 'left': ''});
        console.log("fkkf");
        console.log(dropped.attr('value'));
        dictionary[droppedOn.find('input').attr('original')] = dropped.attr('value') ;
        console.log(dictionary);
    }
    else {
        moved = true;
    }

    if (freeLetter) {
        dictionary[droppedOn.find('input').attr('original')] = dropped.attr('value');
        console.log(dictionary);
        var removedLetter = $(freeLetterDictionary[droppedOn.find('input').attr("value")][0]);
        freeLetterDictionary[dropped.attr("value")][1] = true;
        freeLetterDictionary[droppedOn.find("input").val()][1] = false;
        $('#freeLetterDisplay').append(removedLetter);
        sortDivs($('#freeLetterDisplay'));
    }
    else {
        if (moved) {
            dictionary[droppedOn.find('input').attr('original')] = dropped.find('input').attr('value');
            console.log(dictionary);
            freeLetterDictionary[dropped.find('input').attr("value")][1] = true;
        }
        else {
            dictionary[droppedOn.find('input').attr('original')] = dropped.attr('value');
            console.log(dictionary);
            freeLetterDictionary[dropped.attr("value")][1] = true;
        }

    }
    console.log(dictionary);

    var letterInput;
    for(i = 0; i < droppedOnArray.length; i++) {
        letterInput = $(droppedOnArray[i]);
        letterInput.removeClass("textInputDisplay-t");
        letterInput.addClass("freeLetterDisplay-t");

        // letterInput.prop('disabled', true);

        if (moved) {
            letterInput.val(dropped.find('input').attr('value'));
            letterInput.attr('value', dropped.find('input').attr('value'));
        }
        else {
            letterInput.val(dropped.attr('value'));
            letterInput.attr('value', dropped.attr('value'));
        }

        letterInput.parent().draggable({
            containment: '#coreLogic',
            helper: "clone",
            showAnim: '',
            cursor: 'move',
            revertDuration: 0,
            revert: true
        });

        $(letterInput).on('mousedown', function (e) {
            var mdown = document.createEvent("MouseEvents");
            mdown.initMouseEvent("mousedown", true, true, window, 0, e.screenX, e.screenY, e.clientX, e.clientY, true, false, false, true, 0, null);
            // mdown = new CustomEvent("mousedown", {'buuble':true, true, window, 0, e.screenX, e.screenY, e.clientX, e.clientY, true, false, false, true, 0, null});
            $(this).closest('.wordLetter-t')[0].dispatchEvent(mdown);
        }).on('click', function (e) {
            var $draggable = $(this).closest('.wordLetter-t');
            if ($draggable.data("preventBehaviour")) {
                e.preventDefault();
                $draggable.data("preventBehaviour", false)
            }
        });
    }

    if (moved) {
        var movedArray = textDictionary[dropped.find('input').attr('original')];
        for (i = 0; i < movedArray.length; i++) {
            letterInput = $(movedArray[i]);
            letterInput.removeClass("freeLetterDisplay-t");
            letterInput.addClass("textInputDisplay-t");
            letterInput.val("");
            letterInput.attr("value", "");
            letterInput.parent().draggable("destroy");
        }
    }
    updateText();
}

function swapLetters(dropped, droppedOn) {

    startTimer();
    var droppedArray = textDictionary[dropped.find('input').attr('original')];
    var droppedOnArray = textDictionary[droppedOn.find('input').attr('original')];

    var droppedValue = dropped.find('input').attr('value');
    var droppedOnValue = droppedOn.find('input').attr('value');

    var i;
    var letterInput;
    dictionary[dropped.find('input').attr('original')] = droppedOn.find('input').attr('value') ;
    dictionary[droppedOn.find('input').attr('original')] = dropped.find('input').attr('value') ;
    for (i = 0; i < droppedArray.length; i++) {
        letterInput = $(droppedArray[i]);
        letterInput.val(droppedOnValue);
        letterInput.attr('value', droppedOnValue);
    }
    for (i = 0; i < droppedOnArray.length; i++) {
        letterInput = $(droppedOnArray[i]);
        letterInput.val(droppedValue);
        letterInput.attr('value', droppedValue);
    }
    updateText();
}

// return a letter to the free letters table when it is dragged out of the message
function letterDraggedOutOfMessage(event, ui){

    var dropped = $(ui.draggable);
    var droppedOn = $(this);

    // dropped.detach().css({'top': '', 'left': ''});
    // $(droppedOn).addClass("freeLetterLook");
    // droppedOn.prop("readonly", true);
    // droppedOn.attr("class", "uneditableCharacter");

    // droppedOn.draggable({containment: '#coreLogic',
    //   // stack: '#letterDisplay-t div',
    //     helper: "clone",
    //   showAnim: '',
    //   cursor: 'move',
    //   revertDuration: 0,
    //   revert: true});
    outLetter(dropped.find('input').val(), dropped.find('input').attr('original'));


}

function outLetter(value, original) {
    $(frequencyDictionary[original]).removeClass("freeLetterDisplay-t");


    freeLetterDictionary[value][1] = false;
    var removedLetter = $(freeLetterDictionary[value][0]);
    $('#freeLetterDisplay').append(removedLetter);
    sortDivs($('#freeLetterDisplay'));
    var letterArray = textDictionary[original];
    var letterInput;
    delete dictionary[original];
    for(var i = 0; i < letterArray.length; i++) {
        letterInput =  $(letterArray[i]);
        letterInput.removeClass("freeLetterDisplay-t");
        letterInput.addClass("textInputDisplay-t");
        letterInput.val("");
        letterInput.attr("value","");
        letterInput.parent().draggable("destroy");
    }
    updateText();
}