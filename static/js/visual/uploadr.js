// Konstantne spremenljivke
var MAX_UPLOAD_FILE_SIZE = 1024*1024; 
var PENDING_FILES  = [];

$(document).ready(function() {
    
    initDropbox();

    $("#file-picker").on("change", function() {
        handleFiles(this.files);
    });

    // Gumb potrdi
    $("#upload-button").on("click", function(e) {
        e.preventDefault();
        doUpload();
    })
});


function doUpload() {
    $("#progress").show();
    var $progressBar   = $("#progress-bar");

    // Gray out obrazca
    $("#upload-form :input").attr("disabled", "disabled");

    // Progress bar
    $progressBar.css({"width": "0%"});

    fd = collectFormData();

    // Dodaj datoteke
    for (var i = 0, ie = PENDING_FILES.length; i < ie; i++) {
        // Collect the other form data.
        // Če je št. izbranih datotek 2
        //if (PENDING_FILES.length == 1) {
            fd.append("file", PENDING_FILES[i]);
        /*}
        else {
            $dropbox1.text("Prosim izberite eno datoteko!");
        }*/
    }

    fd.append("__ajax", "true");

    var xhr = $.ajax({
        xhr: function() {
            var xhrobj = $.ajaxSettings.xhr();
            if (xhrobj.upload) {
                xhrobj.upload.addEventListener("progress", function(event) {
                    var percent = 0;
                    var position = event.loaded || event.position;
                    var total    = event.total;
                    if (event.lengthComputable) {
                        percent = Math.ceil(position / total * 100);
                    }

                    // Progress bar
                    $progressBar.css({"width": percent + "%"});
                    $progressBar.text(percent + "%");
                }, false)
            }
            return xhrobj;
        },
        url: UPLOAD_URL,
        method: "POST",
        contentType: false,
        processData: false,
        cache: false,
        data: fd,
        success: function(data) {
            $progressBar.css({"width": "100%"});
            data = JSON.parse(data);

            // Rezultat
            if (data.status === "error") {
                // Ni šlo
                window.alert(data.msg);
                $("#upload-form :input").removeAttr("disabled");
                return;
            }
            else {
                // Če je ok
                var uuid = data.msg;
                window.location = NEXT_URL + uuid;
            }
        },
    });
}


function collectFormData() {
    // Go through all the form fields and collect their names/values.
    var fd = new FormData();

    $("#upload-form :input").each(function() {
        /*var $this = $(this);
        var name  = $this.attr("name");
        var type  = $this.attr("type") || "";
        var value = $this.val();

        if (name === undefined) {
            return;
        }

        // Skip the file upload box for now.
        if (type === "file") {
            return;
        }

        fd.append(name, value);*/
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
        var files = e.originalEvent.dataTransfer.files;
        handleFiles(files);

        // Update the display to acknowledge the number of pending files.
        $dropbox1.html("<p class='js-text'>Število izbranih datotek: </p>" + PENDING_FILES.length);
        
        /*if (PENDING_FILES.length == 1) {
            $dropbox1.html("<p class='js-text'>Število izbranih datotek: </p>" + PENDING_FILES.length);
        }
        else {
            $dropbox1.html("<p class='js-text'>Prosim izberite eno datoteko!</p>");
        }*/
        
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
        var files = e.originalEvent.dataTransfer.files;
        handleFiles(files);

        // Update the display to acknowledge the number of pending files.
        $dropbox2.html("<p class='js-text'>Število izbranih datotek: </p>" + PENDING_FILES.length);
        
        /*if (PENDING_FILES.length == 1) {
            $dropbox2.html("<p class='js-text'>Število izbranih datotek: </p>" + PENDING_FILES.length);
        }
        else {
            $dropbox2.html("<p class='js-text'>Prosim izberite eno datoteko!</p>");
        }*/
        
    });

    
    // If the files are dropped outside of the drop zone, the browser will
    // redirect to show the files in the window. To avoid that we can prevent
    // the 'drop' event on the document.
    function stopDefault(e) {
        e.stopPropagation();
        e.preventDefault();
    }
    $(document).on("dragenter", stopDefault);
    $(document).on("dragover", stopDefault);
    $(document).on("drop", stopDefault);
}