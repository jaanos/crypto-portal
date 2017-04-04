// VARIABLES
var points = 0;
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
    $("#choices .btn").click(function() {
       //console.log(this.innerHTML);
       var image_link = $("#picture-letter img").attr("src").split("/");
       console.log(image_link);
       var image_name = image_link[image_link.length - 1];
       console.log(image_name);
       var letter = image_name.split(".")[0];
       console.log(letter);
       if ((this.innerHTML).toUpperCase() === letter.toUpperCase()) {
           console.log("OK");
           points+=1;
           console.log(points);
           $(this).removeClass("btn-info");
           $(this).addClass("btn-success");
           $("#next-arrow *").css('filter', 'brightness(100%)')
           $("#next-arrow").attr("href", "");
           $("#points #poits-display").innerHTML=points;
       } else {
           console.log("ERR");
           $(this).removeClass("btn-info");
           $(this).addClass("btn-danger");
       }
    });
});