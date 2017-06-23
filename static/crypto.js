/* crypto.js - controls main logic flow and functinality for the cryptogram helper
 * 
 * Author: Colin Heffernan
 * Created: Dec 14 2013
 *
 */

/* Global variables to be used by all components */
var dictionary = null; // maps each letter to its substitution
var reverseDict = null; // maps each substitution to the original letter
var freeLetters = null; // letters remaining and available for substitution
var cryptedMessage = null; // original message input by user to the message box
var frequencyTable = null; // table of letter frequencies in the original message
var ALPHABET = null; // array containing the 25 letters in the english alphabet for resetting
var chartData = null;

function stripBlanks(fld) {
    var result = "";
    var c = 0;
    for (i=0; i < fld.length; i++) {
        if (fld.charAt(i) != " " || c > 0) {
            result += fld.charAt(i);
            if (fld.charAt(i) != " ") c = result.length;
        }
      }
    return result.substr(0,c);
}

/*
 * initialize - called when the begin button is pressed
 */
var ind = null;

function initialize(st){
    $('#begin').each(function() {
        $(this).remove();
    });
    ind = st;
    dictionary = new Array();
    reverseDict = new Array();
    frequencyTable = new Array();
    ALPHABET = new Array(); // constant alphabet array 
    freeLetters = new Array();
    addResetButton();
	addNextButton();
    var A = "A".charCodeAt(0);
    for (var i = 0; i < 26; i++){ // fill alphabet array
        var newChar = String.fromCharCode(A + i);
        if(lang == "sl" && !foreign && (newChar === 'Q' || newChar === 'W' || newChar === 'X' || newChar === 'Y'))    continue;
        ALPHABET.push(newChar);
        freeLetters[newChar] = true;
        if (lang == "sl" || foreign) {
            if(newChar === 'C')  ALPHABET.push('Č');
            if(newChar === 'S')  ALPHABET.push('Š');
            if(newChar === 'Z')  ALPHABET.push('Ž');
        }
    }
    if (lang == "sl" || foreign) {
        freeLetters['Č'] = true;
        freeLetters['Š'] = true;
        freeLetters['Ž'] = true;
    }
    
    //window.onresize = updateEssentials;
    updateEssentials(); // adds the letter selection, message display, and frequency tables
    loadChart();
}

/**
 * Loads the initial charts. First chart contains frequencies of the letters in
 * the encrypted text and the second contains frequencies of letters in either
 * sl/eng alphabets.
 */
function loadChart() {

    var stats_sl = { 'A':10.5, 'B':2.0, 'C':0.7, 'Č':1.5, 'D':3.4, 'E': 10.7,
        'F':0.1, 'G':1.6, 'H':1.1, 'I': 9.0, 'J':4.7, 'K':3.7, 'L':5.3, 'M':3.3,
        'N': 6.3, 'O':9.1, 'P':3.4, 'R':5.0 , 'S':5.1, 'Š':1.0, 'T':4.3, 'U':1.9,
        'V':3.8, 'Z':2.1, 'Ž':0.7};

    var stats_en = { 'A': 8.2, 'B': 1.5, 'C': 2.8, 'D': 4.2, 'E': 12.7,
        'F': 2.2, 'G': 2.0, 'H': 6.1, 'I': 7.0, 'J': 0.2, 'K': 0.8, 'L': 4.0,
        'M': 2.4, 'N': 6.7, 'O': 7.5, 'P': 1.9, 'Q': 0.1, 'R': 6.0, 'S': 6.3,
        'T': 9.1, 'U': 2.8, 'V': 1.0, 'W': 2.4, 'X': 0.2, 'Y': 2.0 ,'Z': 0.1};

    loadChartDataVariable();
    chartData.currentStats = foreign ? stats_en: stats_sl;
    chartData.plot1_data= getChartData(frequencyTable, 'frequency');
    chartData.plot2_data = getChartData(chartData.currentStats, 'static');
    addSortButton('info-btn-1', "chart1");
    addSortButton('info-btn-2', "chart2");
    drawChart('chart1', chartData.plot1_data);
    drawChart('chart2', sortChartData(chartData.plot2_data[0], chartData.plot2_data[1], 1));
    setChartInfo('chart1', chartData.plot1_data[1]);
    setChartInfo('chart2', chartData.plot2_data[1]);
    loadSlider();
}

function loadChartDataVariable() {
    chartData = (function() {
        var currentStats = null;
        var plot1 = null;
        var plot2 = null;
        var plot1_data = null;
        var plot2_data = null;
        return {
            plot1: null,
            plot2: null,
            plot1_data: null,
            plot2_data: null,
            currentStats: null
        };
    })();
}

/**
 * Returns the data for the second graph containing the sl/eng frequencies of
 * letters in the alphabet.
 * @param {dictionary} stats - Contains mapping of letters to frequencies
 * @param {string} type - Tells the type of chart data
 * @return {Array}  Returns an array containing series and ticks
 */
function getChartData(stats, type) {

    var keys = Object.keys(stats);

    var series = [];
    for (var i = 0; i < keys.length; i++) {
        series.push(stats[keys[i]]);
    }

    if (type === 'frequency') {

        var total_keys = 0;
        for (var j = 0; j < keys.length; j++) {
            total_keys += series[j];
        }
        series = series.map(function(s) {
            return s/total_keys;
        });

    }

    return [series, keys];
}

function sortChartData(series, keys, sort) {

    var tuples = [];
    for (var i = 0; i < keys.length; i++) {
        tuples.push([keys[i], series[i]]);
    }

    if (sort == 1) {
        tuples.sort(function(first, second) {
            return second[1] - first[1];
        });
    } else {
        tuples.sort(function (first, second) {
            return first[0].toString().localeCompare(second[0]);
        });
    }

    var s = [];
    var k = [];
    for (var j = 0; j < tuples.length; j++) {
        k.push(tuples[j][0]);
        s.push(tuples[j][1]);
    }
    return [s, k]
}

/**
 * Method sets the information display for each graph, depending of the chart
 * passed as the argument.
 * @param {string} chart - Id of chart
 * @param {Array} ticks - Data on x axis for dispaly
 */
function setChartInfo(chart, ticks) {

    if (chart === 'chart1') {
        $('#chart1').bind('jqplotDataHighlight',
            function (ev, seriesIndex, pointIndex, data) {
                $('#info-msg-1').html('Pojavitev črke:  <strong>' + ticks[pointIndex] + '</strong> v besedilu - ' + data[1].toFixed(1) + '%');
            }
        );

    } else  {
        $('#chart2').bind('jqplotDataHighlight',
            function (ev, seriesIndex, pointIndex, data) {
                $('#info-msg-2').html('Frekvenca črke:  <strong>' + ticks[pointIndex]  + '</strong> v slovenskem jeziku - ' + data[1].toFixed(1) + '%');
            });
    }

}

function chartOptions(ticks) {
    return {
        height: 100,
        seriesColors: ['#337ab7'],
        seriesDefaults: {
            renderer: $.jqplot.BarRenderer,
            pointLabels: {show: true, formatString: '%.1f'},
            dragable: {
                color: '#fffdf6',
                constrainTo: 'y'
            }
        },
        axes: {
            xaxis: {
                renderer: $.jqplot.CategoryAxisRenderer,
                ticks: ticks
            },
            yaxis: {
                labelRenderer: $.jqplot.CanvasAxisLabelRenderer
            }
        },
        grid: {
            backgroundColor: "#FFFFFF",
            gridLineColor: "#FFFFFF",
            gridLineWidth: 0,
            shadow: false,
            drawBorder: true,
            borderColor: '#337ab7'
        }
    };
}

/**
 * Returns the data for the second graph containing the sl/eng frequencies of
 * letters in the alphabet.
 * @param {string} chart_id - Id of chart to be drawn
 * @param {Array} data - Array containing series and ticks for display
 */
function drawChart(chart_id, data) {

    var series = data[0];
    var ticks = data[1];

    $(document).ready(function () {

        $.jqplot.config.enablePlugins = true;
        var plot = $.jqplot(chart_id, [series], chartOptions(ticks));

        $(window).resize(function() {
            plot.replot( { resetAxes: true } );
        });

        if (chart_id === 'chart1') {
            chartData.plot1_data = data;
            chartData.plot1 = plot;
        }
        else {
            chartData.plot2_data = data;
            chartData.plot2 = plot
        }
    });

}

function updateChart(chart_id, data) {

    var series = data[0];
    var ticks = data[1];

    if (chart_id == 'chart1') {
        chartData.plot1.destroy();
        chartData.plot1 = $.jqplot('chart1', [series], chartOptions(ticks))
        chartData.plot1_data = data
    }
    else {
        chartData.plot2.destroy();
        chartData.plot2 = $.jqplot('chart2', [series], chartOptions(ticks))
        chartData.plot2_data = data
    }
}

/**
 * Method adds a sort button next to the chart info display above the chart.
 * @param {string} info_btn_id - Id of the button to be added
 */
function addSortButton(info_btn_id, chart_id) {
    var info = document.getElementById(info_btn_id);
    var button;

    if (info_btn_id === 'info-btn-1') {
        button = createSortButton("chartSortButton1", chart_id,
            "sortChart(this.id);"
        );
    }
    else {
        button = createSortButton("chartSortButton2", chart_id,
            "sortChart(this.id);"
        );
    }
    info.appendChild(button);
}

/**
 * Method creates the chart sort button.
 * @param {String} button_id - Id that the button will get
 * @param {String} chart_id - Id that the button will get
 * @param {String} function_name - Function that will be called when the button
 * is clicked
 * @returns {Object} Returns the newly created button
 */
function createSortButton(button_id, chart_id, function_name) {
        var button = document.createElement("button");
        button.setAttribute("value", "0");
        button.setAttribute("id", button_id);
        button.setAttribute("data-chart-id", chart_id);
        button.setAttribute("class","btn btn-default btn-sm");
        button.setAttribute("onclick", function_name);
        button.textContent = "Sortiraj po abecedi";
        return button;
}

/**
 * Method sorts the data depending of the value of the clicked button.
 * Afer the data is sorted it is re-displayed.
 * @param {String} button_id - Id that the button
 */
function sortChart(button_id) {

    var btn = document.getElementById(button_id);
    var chart_id = btn.getAttribute("data-chart-id");
    var data;
    if (chart_id === "chart1") {
        data = sortChartData(chartData.plot1_data[0], chartData.plot1_data[1], btn.value);
    }
    else {
        data = sortChartData(chartData.plot2_data[0], chartData.plot2_data[1], btn.value);
    }


    if (btn.value === '0' ) {
        btn.setAttribute('value', '1');
        btn.textContent = "Sortiraj po frekvenci";
    }
    else {
        btn.setAttribute('value', '0');
        btn.textContent = "Sortiraj po abecedi";
    }

    updateChart(chart_id, data);
}

function loadSlider() {
    $(document).ready(function () {

        var handle = $( "#custom-handle" );
        var max = Object.keys(chartData.currentStats).length;
        $("#slider" ).slider({
            min: 0,
            max: max,
            value: 0,
            create: function() {
                handle.text( $( this ).slider( "value" ));
            },
            slide: function( event, ui ) {

                var data = chartData.plot2_data;
                var ticks = data[1].slice(0);
                var series = data[0].slice(0);

                var shifted = handle.text() - ui.value;
                console.log(shifted);
                if (shifted > 0) {
                    console.log((ticks));
                    var removed = ticks.splice(0,shifted);
                    console.log(removed);
                    console.log(ticks);
                    ticks = ticks.concat(removed);
                    console.log(ticks);
                    series = series.concat(series.splice(0,shifted));
                }
                else {
                    var remove = ticks.splice((ticks.length)-Math.abs(shifted),Math.abs(shifted));
                    ticks =  remove.concat(ticks);
                    remove = series.splice((series.length)-Math.abs(shifted), Math.abs(shifted));
                    series =  remove.concat(series);
                }

                handle.text( ui.value );
                updateChart('chart2', [series, ticks]);
            }
        });
    }
);
}

function startTimer() {
    // Update the count down every 1 second
    var x = setInterval(function() {

      // Get todays date and time
      var now = new Date().getTime();
      // Time calculations for days, hours, minutes and seconds
      var days = Math.floor(now / (1000 * 60 * 60 * 24));
      var hours = Math.floor((now % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60));
      var minutes = Math.floor((now % (1000 * 60 * 60)) / (1000 * 60));
      var seconds = Math.floor((now % (1000 * 60)) / 1000);

      // Display the result in the element with id="demo"
      document.getElementById("timer").innerHTML = days + "d " + hours + "h "
      + minutes + "m " + seconds + "s ";

      // If the count down is finished, write some text
      // if (distance < 0) {
      //   clearInterval(x);
      //   document.getElementById("demo").innerHTML = "EXPIRED";
      // }
    }, 1000);
}

function updateEssentials(){
    frequencyTable = new Array(); // frequencyTable will be handled by the getMessageDisplay method
    cryptedMessage = getCryptedMessage(); // get the latest version of the input crypted message stored in an array of words
    var coreLogic = document.getElementById("coreLogic");
    coreLogic.innerHTML = "";
    coreLogic.appendChild(newFreeLetterDisplay());
    coreLogic.appendChild(newLine());
    coreLogic.appendChild(newMessageDisplay());
    coreLogic.appendChild(newLine());
    coreLogic.appendChild(newFrequencyDisplay());
}

function updateEssentialsSecondly(){
    var coreLogic = document.getElementById("coreLogic");
    coreLogic.innerHTML = "";
    coreLogic.appendChild(newFreeLetterDisplay());
    coreLogic.appendChild(newLine());
    coreLogic.appendChild(newMessageDisplay());
    coreLogic.appendChild(newLine());
    coreLogic.appendChild(newFrequencyDisplay());
}

function bySortedValue(obj) {
    var tuples = [];
    var out = Array();

    for (var key in obj) tuples.push([key, obj[key]]);

    tuples.sort(function(a, b) { return a[1] < b[1] ? -1 : a[1] > b[1] ? 1 : 0 });

    var length = tuples.length;
    while (length--) out[tuples[length][0]] = tuples[length][1];
    return out;
}

// returns the message as an array of words for displaying the message and controlling text wrapping
function getCryptedMessage(){
    //$('#messageOutput').val("");
	$("#messageOutput").html("");
    var crypt = new Array(); // array of strings each representing a word
	
    $('#messageOutput').append(input);
    var i = 0; // index of the current character being investigated
    var currentWord = "";
    while (i < input.length){ // loop through every letter in the input
        var currentCharacter = input.charAt(i).toUpperCase();//.trim()-only deal with upper case letters (withou white space)
        if(ind === 2){
            currentCharacter = currentCharacter.trim().split(',').join("");
        }   
        appendFrequency(currentCharacter); // add the current Letter to the frequency table

        if (!(currentCharacter == ' ' || currentCharacter == '\n')){
            currentWord += currentCharacter; // add the current character to the current word
        }
        else{ // if we have a reached a space or end of the line
            if (!currentWord == ""){ // don't add empty words
                crypt.push(currentWord); 
            }
            currentWord = ""; // reset the currentWord (will not contain the current space)
        }
        if (i == input.length - 1){ // if we have reached the end of the file
            if (!currentWord == ""){ // don't add empty words
                crypt.push(currentWord);  // add the last word in
            }
            currentWord = ""; // reset the currentWord (will not contain the current space)
        }
        i++;
    }
    frequencyTable = bySortedValue(frequencyTable);
    return crypt;
}

// returns a div element full of the draggable freeLetters
function newFreeLetterDisplay(){
    var freeLetterDisplay = document.createElement("div");
    freeLetterDisplay.setAttribute("id", "freeLetterDisplay");
    for(var i = 0; i < ALPHABET.length; i++){
        if (freeLetters[ALPHABET[i]]) {
            freeLetterDisplay.appendChild(newDraggableFreeLetter(ALPHABET[i]));
        }
    }
    return freeLetterDisplay;
}

// returns the div element containing the entire display of original message beneath updated message containing substitutions
function newMessageDisplay(){
    var messageDisplay = document.createElement("div");
    messageDisplay.setAttribute("id", "messageDisplay");
    for (var i = 0; i < cryptedMessage.length; i++){
        var currentWord = cryptedMessage[i]; // current letter being examined
        //console.log(currentWord);
        messageDisplay.appendChild(newWordDisplay(currentWord));
        if (i < cryptedMessage.length - 1){ // add a space at the end of each word except for the last
            messageDisplay.appendChild(newSpace());
        }
    }
    return messageDisplay;
}

function newFrequencyDisplay(){
    var frequencyDisplay = document.createElement("div");
    frequencyDisplay.setAttribute("id", "frequencyDisplay");
    var index = 0;
    for (var letter in frequencyTable){
        index ++;
        frequencyDisplay.appendChild(newFrequency(letter, frequencyTable[letter]));
    }
    return frequencyDisplay;
}   

// helper methods for the three essential methods above

// returns a div element for the current word
function newWordDisplay(word){    
    var wordDisplay = document.createElement("div");
    wordDisplay.setAttribute("class", "wordDisplay");
    for (var i = 0; i < word.length; i++){ // index through the current word
        var currentLetter = word.charAt(i);
        if (isLetter(currentLetter)){ // if the current character is A-Z
            wordDisplay.appendChild(newEditableLetterDisplay(currentLetter)); // letterTable which can be modified for substitutions
        }
        else{ // if the current character is not A-Z
            wordDisplay.appendChild(newUneditableCharacterDisplay(currentLetter)); // letterTable which can not be modified
        }
    }
    return wordDisplay;
}

// returns a div element displaying the crypted letter from the original message and its editable substitute
function newEditableLetterDisplay(letter){
    var letterDisplay = document.createElement("div");
    letterDisplay.setAttribute("class", "letter");
    var top = document.createElement("div");
    top.setAttribute("ondragover", "allowDrop(event);"); // permit dragging and dropping from this element
    top.setAttribute("ondrop", "letterDraggedIntoMessage(event);"); // permit dragging and dropping with this letter
    top.setAttribute("ondragleave", "letterDraggedOutOfMessage(event);");
    top.setAttribute("class", "letterHolder");
    top.setAttribute("value", letter);
    top.appendChild(newEditableMessageLetter(letter));
    letterDisplay.appendChild(top);
    //~ letterDisplay.appendChild(newLine());
    //~ var bottom = document.createElement("div");
    //~ bottom.setAttribute("class", "letterHolder");
    //~ bottom.appendChild(cryptedCharacter(letter));
    //~ letterDisplay.appendChild(bottom);
    return letterDisplay;
}

// returns a div element displaying the crypted letter from the original message and its editable substitute
function newUneditableCharacterDisplay(letter){
    var letterDisplay = document.createElement("div");
    letterDisplay.setAttribute("class", "letter");
    var top = document.createElement("div");
    top.setAttribute("class", "letterHolder");
    top.appendChild(newUneditableMessageCharacter(letter));
    letterDisplay.appendChild(top);
    //~ letterDisplay.appendChild(newLine());
    /*var bottom = document.createElement("div");
    bottom.setAttribute("class", "letterHolder");
    bottom.appendChild(cryptedCharacter(letter));
    letterDisplay.appendChild(bottom);*/
    return letterDisplay;
}

// returns a div element for the uneditable non A-Z characters in a messageDisplay character table's top cell
function newUneditableMessageCharacter(character){ // div element to be in the top cell of each letter display
    var letterDisplay = document.createElement("div");
    letterDisplay.setAttribute("class", "uneditableCharacter");
    letterDisplay.setAttribute("value", character);
    letterDisplay.textContent = character;
    return letterDisplay;
}

// returns a draggable and editable letter to be added for A-Z characters in the messageDisplay letter table's top cell
function newEditableMessageLetter(letter){
    var letterDisplay = document.createElement("input");
    letterDisplay.setAttribute("original", letter); // original attribute holds the letter in the original crypted message
    letterDisplay.setAttribute("class", "decryptedCharacter");
    letterDisplay.setAttribute("draggable", true);
    letterDisplay.setAttribute("ondragstart", "letterDragged(event);");
    letterDisplay.setAttribute("onmouseenter", "highlightLetter(this);");
    letterDisplay.setAttribute("placeholder", letter);
    if (letter in dictionary){
        letterDisplay.setAttribute("value", dictionary[letter]);
        //letterDisplay.textContent = dictionary[letter];
    }
    else{
        letterDisplay.setAttribute("value", "");
        //letterDisplay.textContent = "";
    }
    return letterDisplay;
}

// returns a div element for the characters in the original crypted message
function cryptedCharacter(character){
    var characterDisplay = document.createElement("div");
    characterDisplay.setAttribute("class", "cryptedCharacter");
    characterDisplay.setAttribute("value", character);
    characterDisplay.textContent = character;
    return characterDisplay;
}

//handle all the dragging events

function allowDrop(event){
    event.preventDefault();
}

// return a letter to the free letters table when it is dragged out of the message
function letterDraggedOutOfMessage(ev){
    event.preventDefault();
    var substitution = event.dataTransfer.getData("Text"); // value of the letter being dragged
    var original = reverseDict[substitution];
    if (isLetter(substitution) && !freeLetters[substitution.toUpperCase()]){ // only add the letter to the table if it is not already there
        freeLetters[substitution.toUpperCase()] = true;
    }
    delete dictionary[original];
    delete reverseDict[substitution];
    updateEssentialsSecondly(); // rebuild the free letters tables
}

// substitute accordinly when a freeLetter is dragged into a letter slot in the message display
function letterDraggedIntoMessage(event){
    event.preventDefault();
    startTimer();
    var substitution = event.dataTransfer.getData("Text"); // value of the letter being dragged
    var original = event.currentTarget.getAttribute("value"); // cell that the letter is being dragged towards
    substitute(original, substitution);
}

function letterDragged(event){ // tell the recipient of this letter what letter is coming
    event.dataTransfer.setData("Text", event.currentTarget.getAttribute("value")); // send the substitution value
}

// returns a draggable div element to be inserted into the freeLettersDisplay
function newDraggableFreeLetter(letter){
    var letterDisplay = document.createElement("div");
    letterDisplay.textContent = letter.toLowerCase();
    letterDisplay.setAttribute("value", letter.toLowerCase());
    letterDisplay.setAttribute("class", "decryptedCharacter");
    letterDisplay.setAttribute("draggable", true);
    letterDisplay.setAttribute("ondragstart", "letterDragged(event);");
    return letterDisplay;
}

// returns a div element to display a letter and its frequency in the original crypted message
function newFrequency(letter, frequency){
    var display = document.createElement("div");
    display.setAttribute("original", letter);
    display.setAttribute("onmouseenter", "highlightLetter(this);");
    display.setAttribute("onmouseleave", "unhighlightLetter(this);");
    if (dictionary[letter] == null) {
        display.setAttribute("class", "letterFrequency");
        display.textContent = letter + " = " + frequency;
    } else {
        display.setAttribute("class", "letterFrequencySolved");
        display.textContent = dictionary[letter] + " = " + frequency;
    }
    return display;
}

function highlightLetter(element){
    var toHighlight = getElementByAttributeValue("original", element.getAttribute("original"));
    for (var i = 0; i < toHighlight.length; i++){
        currElement = toHighlight[i];
        if (currElement.getAttribute("class") == "letterFrequency" || currElement.getAttribute("class") == "letterFrequencySolved") {
            continue;
        }
        currElement.setAttribute("class", "highlightedLetter");
        currElement.setAttribute("id", "highlighted"); // tell the program which letter is highlighted
        currElement.setAttribute("onmouseleave", "unhighlightLetter(this);");
    }
    document.onkeypress = keyPressedWhileHighlighted;
}

// unhighlight the letter when the mouse exits
function unhighlightLetter(element){
    document.onkeypress = null;
    var toUnHighlight = getElementByAttributeValue("original", element.getAttribute("original"));
    for (var i = 0; i < toUnHighlight.length; i++){
        currElement = toUnHighlight[i];
        if (currElement.getAttribute("class") == "letterFrequency" || currElement.getAttribute("class") == "letterFrequencySolved") {
            continue;
        }
        currElement.setAttribute("class", "decryptedCharacter");
        currElement.removeAttribute("id"); // tell the program which letter is highlighted
    }
}

// function to be called when a key is pressed while a letter is highlighted
function keyPressedWhileHighlighted(evt) { 
  evt = evt || window.event; 
  var charCode = evt.charCode || evt.keyCode;
  var substitution = String.fromCharCode(charCode).toLowerCase();
  var lettersToChange = document.getElementsByClassName("highlightedLetter");
  var original = lettersToChange[0].getAttribute("original"); // only need the original from one of the elements 
  substitute(original, substitution);
};

// carries out a suggested substitution
function substitute(original, substitution){
    var currentSub = dictionary[original];
    var currentOriginal = reverseDict[substitution];
    delete dictionary[currentOriginal]; // the substituted value now stands for something different if at all
    delete reverseDict[currentSub]; // always removing the current substitution no matter what
    if (currentSub != null && !freeLetters[currentSub.toUpperCase()]){ // only return the letter to the free letters table if it is not  already there
        freeLetters[currentSub.toUpperCase()] = true;
    }
    if (isLetter(substitution)){
        deleteFreeLetter(substitution);
        dictionary[original] = substitution;
        reverseDict[substitution] = original;
    }
    else{ // if any other character is typed, delete the dictionary entry
        delete dictionary[original]; 
    }

    var decrypt = "";
    var c;
    for (var i = 0; i < input.length; i++) {
        c = input.charAt(i);
        if (dictionary[c] != null) {
            decrypt += dictionary[c];
        } else {
            decrypt += c;
        }
    }
    $("#messageOutput").html("");
    $('#messageOutput').append(decrypt);

    updateEssentialsSecondly();
}

// resets all relevent data in the webpage
function reset(){
    for (var i = 0; i < ALPHABET.length; i++) {
        freeLetters[ALPHABET[i]] = true;
    }
    dictionary = new Array();
    reverseDict = new Array();
    updateEssentialsSecondly();
}

// go to next cryptogram
function next(){
	initialize(ind);
}

// handles a letter's frequency value in the frequency table
function appendFrequency(letter){
    if (isLetter(letter)){ // only worry about characters that are letters
        if (frequencyTable[letter] != null){
            frequencyTable[letter] ++;
        }
        else{
            frequencyTable[letter] = 1;
        }
    }
}

// deletes a letter from the freeLetters array when it is substituted
function deleteFreeLetter(letter){
    letter = letter.toUpperCase();
    freeLetters[letter] = false;
}

// adds the reset button to the buttons panel
function addResetButton(){
    var buttons = document.getElementById("buttons");
    if (buttons.getElementsByTagName("button").length <= 1){
        buttons.appendChild(resetButton());
    }
}

// adds the next button to the buttons panel for new cryptogram
function addNextButton(){
    var buttons = document.getElementById("buttons");
    if (buttons.getElementsByTagName("button").length <= 1){
        buttons.appendChild(nextButton());
    }
}

// returns a reset button to be appended to the buttons panel
function resetButton(){
    var button = document.createElement("button");
    button.setAttribute("value", "Reset");
    button.setAttribute("id", "begin");
    button.setAttribute("class","btn btn-default btn-bg");
    button.setAttribute("onclick", "reset();");
    button.textContent = "Začni znova";
    return button;
}

// returns a next button to be appended to the buttons panel
function nextButton(){
    var button = document.createElement("button");
    button.setAttribute("value", "Next");
    button.setAttribute("id", "next");
    button.setAttribute("class","btn btn-default btn-bg");
    button.setAttribute("onclick", "location.href = next;");
    button.textContent = "Naslednji";
    return button;
}

// returns an element with a br tag
function newLine(){
    return document.createElement("br");
}

// returns an empty div element to represent a space in the messageDisplay
function newSpace(){
    var letterDisplay = document.createElement("div");
    letterDisplay.setAttribute("class", "letter");
    return letterDisplay;
}

// returns a list of all
function getElementByAttributeValue(attribute, value)
{
  var allElements = document.getElementsByTagName('*');
  var matches = new Array();
  for (var i = 0; i < allElements.length; i++){
    if (allElements[i].getAttribute(attribute) == value)
    {
      matches.push(allElements[i]);
    }
  }
    return matches;
}

/*
 * isLetter - determines whether a letter is between A and Z 
 * Note that every letter passed as an argument will be changed to uppercase
 */
function isLetter(letter){
    letter = letter.toUpperCase();
    return (letter.charCodeAt(0) < 91 && letter.charCodeAt(0) >= 65 || letter === 'Č' || letter === 'Š' || letter === 'Ž');
}

function code(letter){
    return letter.charCodeAt(0);
}

