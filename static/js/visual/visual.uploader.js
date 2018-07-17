var PENDING_FILES  = [];

$(document).ready(function() {
    var $dropbox1 = $("#dropbox-1");
    var $dropbox2 = $("#dropbox-2");

    // On drag enter...
    $dropbox1.on("dragenter", function(e) {
        e.stopPropagation();
        e.preventDefault();
        if (merged) return;
        $(this).addClass("active");
    });

    // On drag over...
    $dropbox1.on("dragover", function(e) {
        e.stopPropagation();
        e.preventDefault();
    });

    // On drop...
    $dropbox1.on("drop", function(e) {
        e.preventDefault();
        $(this).removeClass("active");
        if (merged) return;

        // Get the files.
        var reader1 = new FileReader();
        reader1.onload = function(){
          var output = document.getElementById('uploaded-img-1');
          output.src = reader1.result;
          output.style.display = "inline-block";
          $("#dropbox-1").css("height", "auto");
          $("#downloaded-img").attr("src", "");
          checkButtons();
        };
        reader1.readAsDataURL(e.originalEvent.dataTransfer.files[0]);
    });

    // On drag enter...
    $dropbox2.on("dragenter", function(e) {
        e.stopPropagation();
        e.preventDefault();
        if (merged) return;
        $(this).addClass("active");
    });

    // On drag over...
    $dropbox2.on("dragover", function(e) {
        e.stopPropagation();
        e.preventDefault();
    });

    // On drop...
    $dropbox2.on("drop", function(e) {
        e.preventDefault();
        $(this).removeClass("active");
        if (merged) return;

        // Get the files.
        var reader1 = new FileReader();
        reader1.onload = function(){
          var output = document.getElementById('uploaded-img-2');
          output.src = reader1.result;
          output.style.display = "inline-block";
          $("#dropbox-2").css("height", "auto");
          $("#downloaded-img").attr("src", "");
          checkButtons();
        };
        reader1.readAsDataURL(e.originalEvent.dataTransfer.files[0]);
    });

    function stopDefault(e) {
        e.stopPropagation();
        e.preventDefault();
    }

    // animacija (2. upload)

    var animation2 = false;
    var merged = false;

    function showNoise2() {
        if (animation2) return;
        $('#dropbox-result').css("height", "0%");
        $('#dropbox-result').css("height", "0px");
        $('#downloaded-img').css("display", "none");
        $("#dropbox-1").css("margin", "auto");
        $("#dropbox-2").css("marginLeft", "20px");
        $("#uploaded-img-1").css("display", "inline-block");
        $("#uploaded-img-2").css("display", "inline-block");
    }

    function revealMerged2() {
        $('#dropbox-result').animate({"height": $("#downloaded-img").height()}, 2000, "linear");
        $('#downloaded-img').css("display", "block");
        checkButtons();
    }

    $('#noise-btn-2').click(function () {
        showNoise2();
        merged = false;
        checkButtons();
    });

    $("#animation-btn-2").click(function () {
        if (animation2) return;
        merged = true;
        animation2 = true;
        uploadNoise();
        showNoise2();
        setTimeout(function() { animation2 = false; }, 4500);
        $("#dropbox-1").animate({marginLeft: "210px"}, 2000, "linear");
        $("#dropbox-2").animate({marginLeft: "-404px"}, 2000, "linear");
        setTimeout(revealMerged2, 2500);
    });

    function checkButtons() {
        var both = $("#uploaded-img-1").attr("src") && $("#uploaded-img-2").attr("src");
        if (!both || merged) {
            $("#animation-btn-2").css("display", "none");
        } else {
            $("#animation-btn-2").css("display", "block");
        }
        if (!both || !merged) {
            $("#noise-btn-2").css("display", "none");
        } else {
            $("#noise-btn-2").css("display", "block");
        }
    }

    function uploadNoise() {
        $(function() {
            if ($("#downloaded-img").attr("src")) return;
            $.ajax({
                url: noiseURL,
                data: {
                    'img1': $('#uploaded-img-1').attr("src"),
                    'img2': $('#uploaded-img-2').attr("src")
                    },
                type: 'POST',
                success: function (response) {
                    response = JSON.parse(response);
                    $('#downloaded-img').attr( 'src', 'data:image/png;base64,'+ response['result']);
                },
                error: function (error) {
                    console.log(error)
                }
            });
        });
    }

    $(document).on("dragenter", stopDefault);
    $(document).on("dragover", stopDefault);
    $(document).on("drop", stopDefault);
});
