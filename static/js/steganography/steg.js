$(document).ready(function() {
    
    // auto-resize textarea okna glede na dolžino teksta
        var txt = $('#comments'),
        hiddenDiv = $(document.createElement('div')),
        content = null;

        txt.addClass('txtstuff');
        hiddenDiv.addClass('hiddendiv common');

        $('body').append(hiddenDiv);

        txt.on('keyup', function () {

        content = $(this).val();

        content = content.replace(/\n/g, '<br>');
        hiddenDiv.html(content + '<br class="lbr">');

        $(this).css('height', hiddenDiv.height());
        });
    
    // pop-up navodila
        
        $("#pop-up").click(function(){
            $("#myModal").css("display", "block");
        });
            
        $("#cl").click(function() {
            $("#myModal").css("display", "none");
        })
        
    // override default html gumba za izbiro slike
        
        ;(function($) {

		  var multipleSupport = typeof $('<input/>')[0].multiple !== 'undefined',
		      isIE = /msie/i.test( navigator.userAgent );

		  $.fn.customFile = function() {

		    return this.each(function() {
              var $buttonLabel = $('#buttonLabel').text();
              $( "#buttonLabel" ).hide();

		      var $file = $(this).addClass('custom-file-upload-hidden'), // the original file input
		          $wrap = $('<div class="file-upload-wrapper">'),
		          $input = $('<input type="text" class="file-upload-input" />'),
		          // Button that will be used in non-IE browsers
                  $button = $('<button type="button" class="file-upload-button">'+$buttonLabel+'</button>'),
                  // Hack for IE
                  $label = $('<label class="file-upload-button" for="' + $file[0].id + '">'+$buttonLabel+'</label>');

		      // Hide by shifting to the left so we
		      // can still trigger events
		      $file.css({
		        position: 'absolute',
		        left: '-9999px'
		      });

		      $wrap.insertAfter( $file )
		        .append( $file, $input, ( isIE ? $label : $button ) );

		      // Prevent focus
		      $file.attr('tabIndex', -1);
		      $button.attr('tabIndex', -1);

		      $button.click(function () {
		        $file.focus().click(); // Open dialog
		      });

		      $file.change(function() {

		        var files = [], fileArr, filename;

		        // If multiple is supported then extract
		        // all filenames from the file array
		        if ( multipleSupport ) {
		          fileArr = $file[0].files;
		          for ( var i = 0, len = fileArr.length; i < len; i++ ) {
		            files.push( fileArr[i].name );
		          }
		          filename = files.join(', ');

		        // If not supported then just take the value
		        // and remove the path to just show the filename
		        } else {
		          filename = $file.val().split('\\').pop();
		        }

		        $input.val( filename ) // Set the value
		          .attr('title', filename) // Show filename in title tootlip
		          .focus(); // Regain focus

		      });

		      $input.on({
		        blur: function() { $file.trigger('blur'); },
		        keydown: function( e ) {
		          if ( e.which === 13 ) { // Enter
		            if ( !isIE ) { $file.trigger('click'); }
		          } else if ( e.which === 8 || e.which === 46 ) { // Backspace & Del
		            // On some browsers the value is read-only
		            // with this trick we remove the old input and add
		            // a clean clone with all the original events attached
		            $file.replaceWith( $file = $file.clone( true ) );
		            $file.trigger('change');
		            $input.val('');
		          } else if ( e.which === 9 ){ // TAB
		            return;
		          } else { // All other keys
		            return false;
		          }
		        }
		      });

		    });

		  };

		  // Old browser fallback
		  if ( !multipleSupport ) {
		    $( document ).on('change', 'input.customfile', function() {

		      var $this = $(this),
		          // Create a unique ID so we
		          // can attach the label to the input
		          uniqId = 'customfile_'+ (new Date()).getTime(),
		          $wrap = $this.parent(),

		          // Filter empty input
		          $inputs = $wrap.siblings().find('.file-upload-input')
		            .filter(function(){ return !this.value }),

		          $file = $('<input type="file" id="'+ uniqId +'" name="'+ $this.attr('name') +'"/>');

		      // 1ms timeout so it runs after all other events
		      // that modify the value have triggered
		      setTimeout(function() {
		        // Add a new input
		        if ( $this.val() ) {
		          // Check for empty fields to prevent
		          // creating new inputs when changing files
		          if ( !$inputs.length ) {
		            $wrap.after( $file );
		            $file.customFile();
		          }
		        // Remove and reorganize inputs
		        } else {
		          $inputs.parent().remove();
		          // Move the input so it's always last on the list
		          $wrap.appendTo( $wrap.parent() );
		          $wrap.find('input').focus();
		        }
		      }, 1);

		    });
		  }

}(jQuery));

$('input[type=file]').customFile();


});

function handleFileSelect(evt) {
    var img = document.getElementById("img"),
        cover = document.getElementById("cover"),
        f = document.getElementById("file").files[0];
    modal1 = document.getElementById('myModal1');
    modal2 = document.getElementById('myModal2');
    close1 = document.getElementById('cl1');
    close2 = document.getElementById('cl2');
    close1.onclick = function() {
        modal1.style.display = "none";
    };
    close2.onclick = function() {
        modal2.style.display = "none";
    };

    window.onclick = function(event) {
        if (event.target == modal1||event.target == modal2) {
            modal1.style.display = "none";
            modal2.style.display = "none";
        }
    };

    var fsize = f.size||f.fileSize;
    if(fsize > 2000000)
    {
        modal2.style.display = "block";
        return;
    }
    var name = document.getElementById("file").files[0].name;
    var ext = name.split('.').pop().toLowerCase();
    if(jQuery.inArray(ext, ['gif','png','jpg','jpeg']) == -1)
    {
        modal1.style.display = "block";
        return;
    }

    var files = evt.target.files; // FileList object

    // Loop through the FileList and render image files as thumbnails.
    for (var i = 0, f; f = files[i]; i++) {

        // Only process image files.
        if (!f.type.match('image.*')) {
            continue;
        }
        var read = "";
        var reader = new FileReader();
        var image = new Image();
        image.addEventListener("load", function () {
            if(image.width>1000 || image.height>1000)
            {
                modal6 = document.getElementById('myModal6');
                close6 = document.getElementById('cl6');
                modal6.style.display = "block";
                close6.onclick = function() {
                    modal6.style.display = "none";
                };

                window.onclick = function(event) {
                    if (event.target == modal6) {
                        modal6.style.display = "none";
                    }
                };
                return;
            }
            img.src = read;
        });

        // Closure to capture the file information.
        reader.onload = (function(theFile) {
            return function(e) {
                image.src = e.target.result;
                read = e.target.result;
                img.title = escape(theFile.name);
                cover.src = "";
            };
        })(f);

        // Read in the image file as a data URL.
        reader.readAsDataURL(f);
        updateCapacity();
    }
}



function hide() {
    var hid = document.getElementById("hidden"),
        f = document.getElementById("file").files[0],
        img = document.getElementById("img"),
        cover = document.getElementById("cover"),
        textarea = document.getElementById("text"),
        download = document.getElementById("download");
        dlink = document.getElementById("dlink");
    if(typeof f === "undefined"){
        modal5 = document.getElementById('myModal5');
        close5 = document.getElementById('cl5');
        modal5.style.display = "block";
        close5.onclick = function() {
            modal5.style.display = "none";
        };

        window.onclick = function(event) {
            if (event.target == modal5) {
                modal5.style.display = "none";
            }
        };
        return;
    }
	if(textarea.value.length==0){
		modal4 = document.getElementById('myModal4');
        close4 = document.getElementById('cl4');
        modal4.style.display = "block";
        close4.onclick = function() {
            modal4.style.display = "none";
        };

        window.onclick = function(event) {
            if (event.target == modal4) {
                modal4.style.display = "none";
            }
        };
        return;
	}
    if(textarea.value.length > steg.getHidingCapacity(img)){
        modal3 = document.getElementById('myModal3');
        close3 = document.getElementById('cl3');
        modal3.style.display = "block";
        close3.onclick = function() {
            modal3.style.display = "none";
        };

        window.onclick = function(event) {
            if (event.target == modal3) {
                modal3.style.display = "none";
            }
        };
        return;
    }
    hid.style.display = 'block';
    download.style.display = "block";
    if(img && textarea) {
        var a = img.width;
        var b = img.height;
        cover.src = steg.encode(textarea.value, img, {"width": img.width, "height": img.height});
        document.getElementById('text').value = "";
        dlink.href=cover.src.replace("image/png", "image/octet-stream");
    }
}

function read() {
    var img = document.getElementById("img"),
        cover = document.getElementById("cover"),
        textarea = document.getElementById("text");
    if(img && textarea) {
        textarea.innerHTML = steg.decode(img);
        if(textarea.innerHTML !== "") {
            textarea.value = textarea.innerHTML;
            updateCapacity();
        }
    }
}

function difference(){
    var canvas1 = document.createElement('canvas');
    var ctx1    = canvas1.getContext('2d');
    var canvas2 = document.createElement('canvas');
    var ctx2   = canvas2.getContext('2d');
    var canvas3 = document.getElementById('myCanvas3');
    canvas3.style.visibility = 'visible';
    var ctx3    = canvas3.getContext('2d');
    var myImgElement1 = document.getElementById('img');
    var width = myImgElement1.width, height=myImgElement1.height;
    canvas1.width = width;
    canvas1.height = height;
    canvas2.width = width;
    canvas2.height = height;
    canvas3.width = width;
    canvas3.height = height;
    ctx1.drawImage( myImgElement1, 0, 0 );
    var myImgElement2 = document.getElementById('cover');
    ctx2.drawImage( myImgElement2, 0, 0);
    var img1 = ctx1.getImageData(0, 0, width,height),
        img2 = ctx2.getImageData(0, 0, width,height),
        diff = ctx3.createImageData(width, height);

    pixelmatch(img1.data, img2.data, diff.data, width, height, {threshold: 0.0001});

    ctx3.putImageData(diff, 0, 0);
    document.getElementById('diffH').style.display = 'block';
}

function updateCapacity() {
    var img = document.getElementById('img'),
        textarea = document.getElementById('text');
    if(img && text)
        var $znakovLabel = $('#znakovLabel').text();
        $( "#znakovLabel" ).hide();
        document.getElementById('capacity').innerHTML='('+textarea.value.length + '/' + steg.getHidingCapacity(img) +$znakovLabel+")";
}



 window.onload = function(){
			document.getElementById('file').addEventListener('change', handleFileSelect, false);
			document.getElementById('hide').addEventListener('click', hide, false);
			document.getElementById('read').addEventListener('click', read, false);
			document.getElementById('diff').addEventListener('click', difference, false);
			document.getElementById('text').addEventListener('keyup', updateCapacity, false);
			updateCapacity();
            document.getElementById('myCanvas3').style.visibility='hidden';
		};
