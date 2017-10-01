var MAX_UPLOAD_FILE_SIZE = 1024*1024; 
var UPLOAD_URL = "/steganography/visual/upload";
var NEXT_URL   = "/steganography/visual/files/";

var PENDING_FILES  = [];

$(document).ready(function() {
    
    initDropbox();

    $("#file-picker").on("change", function() {
        handleFiles(this.files);
    });

    // Submit button 
    $("#upload-button").on("click", function(e) {
        e.preventDefault();
        doUpload();
    });


    $('#post-form').on('submit', function(event){
        event.preventDefault();
        var formData = new FormData(this);
        var fileInput = $('#img-1')[0].currentSrc;
        $(function() {
            $.ajax({
                url: '/steganography/visual',
                data: {
                    'file': fileInput
                    },
                type: 'POST',
                success: function (response) {
                    response = JSON.parse(response);
                    $('#img-left').attr( 'src', 'data:image/png;base64,'+ response['out1']);
                    $('#img-right').attr( 'src', 'data:image/png;base64,'+ response['out2']);
                    $('#img-result').attr( 'src', 'data:image/png;base64,'+ response['result']);
                },
                error: function (error) {
                    console.log(error)
                }
            });
        });
});

});


function doUpload() {
    // $("#progress").show();
    // var $progressBar   = $("#progress-bar");

    // Gray out form
    $("#upload-form :input").attr("disabled", "disabled");

    // Progress bar
    console.log(PENDING_FILES);


    var reader2 = new FileReader();

    reader1.onload = function(){
      var output = document.createElement('img');
      output.src = reader1.result;
      output.setAttribute('id', "uploaded-img-1");
      $("#dropbox-1").append(output);
    };
    reader1.readAsDataURL(PENDING_FILES[0]);

    reader2.onload = function(){
      var output = document.createElement('img');
      output.src = reader2.result;
      output.setAttribute('id', "uploaded-img-2")
      $("#dropbox-2").append(output);
    };
    reader2.readAsDataURL(PENDING_FILES[1]);

}


function collectFormData() {
    
    var fd = new FormData();

    $("#upload-form :input").each(function() {
        
    });

    return fd;
}


function handleFiles(files) {
    // Add them to the pending files list.
    for (var i = 0, ie = files.length; i < ie; i++) {
        PENDING_FILES.push(files[i]);
    }
}


function initDropbox() {
    var $dropbox1 = $("#dropbox-1");
    var $dropbox2 = $("#dropbox-2");

    // On drag enter...
    $dropbox1.on("dragenter", function(e) {
        e.stopPropagation();
        e.preventDefault();
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

        // Get the files.
        var reader1 = new FileReader();
        reader1.onload = function(){
          var output = document.createElement('img');
          output.src = reader1.result;
          output.setAttribute('id', "uploaded-img-1");
          $("#dropbox-1").append(output);
        };
        reader1.readAsDataURL(e.originalEvent.dataTransfer.files[0]);


        
    });

        // On drag enter...
    $dropbox2.on("dragenter", function(e) {
        e.stopPropagation();
        e.preventDefault();
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

        // Get the files.
        var reader1 = new FileReader();
        reader1.onload = function(){
          var output = document.createElement('img');
          output.src = reader1.result;
          output.setAttribute('id', "uploaded-img-2");
          $("#dropbox-2").append(output);
        };
        reader1.readAsDataURL(e.originalEvent.dataTransfer.files[0]);
        
    });

    function stopDefault(e) {
        e.stopPropagation();
        e.preventDefault();
    }
    $(document).on("dragenter", stopDefault);
    $(document).on("dragover", stopDefault);
    $(document).on("drop", stopDefault);
}