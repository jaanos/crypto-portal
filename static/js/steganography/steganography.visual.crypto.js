$(document).ready(function() {
    
    // pop-up navodila
        
        $("#pop-up").click(function(){
            $("#myModal").css("display", "block");
        });
            
        $("#cl").click(function() {
            $("#myModal").css("display", "none");
        })
    
    // animacija (2. upload)
    
    $("#animation-btn-2").click(function() {
        $("#dropbox-1").animate({marginLeft: "210px"}, 2000, "linear");
        $("#dropbox-2").animate({marginLeft: "-430px"}, 2000, "linear");
    });
    
    
    // upload gumb disabled dokler slika ni izbrana
        
    $('input[type=file][name="file"]').change(function(){
        var hasNoFiles = this.files.length == 0;
            $(this).closest('form') 
                .find('input[type=submit]') 
                .prop('disabled', hasNoFiles); 
    });
        
        
    // animacija slik (1. upload)
        
    $('#noise-btn').click(function() {
        $("#img-right").css("display", "inline-block");
        $("#img-left").css("display", "inline-block");
    });
        
    $('#animation-btn').click(function() {
        $("#img-left").animate({marginLeft: "210px"}, 2000, "linear");
        $("#img-right").animate({marginLeft: "-400px"}, 2000, "linear");
        $("#img-container").delay(2600).show(0);
        $('#img-container').animate({"height":"100%"},9000, "linear");
        $('#img-result').css("display", "block");
        $('#img-container').css("position", "absolute");
        $('#img-container').css("margin-left", "210px");

    });
        
        
    // override default html gumba za izbiro slike
        
        (function($) {

		  var multipleSupport = typeof $('<input/>')[0].multiple !== 'undefined',
		      isIE = /msie/i.test( navigator.userAgent );

		  $.fn.customFile = function() {

		    return this.each(function() {

		      var $file = $(this).addClass('custom-file-upload-hidden'), // the original file input
		          $wrap = $('<div class="file-upload-wrapper">'),
		          $input = $('<input type="text" class="file-upload-input" />'),
		          // Button that will be used in non-IE browsers
		          $button = $('<button type="button" class="file-upload-button">Izberi</button>'),
		          // Hack for IE
		          $label = $('<label class="file-upload-button" for="'+ $file[0].id +'">Izberi</label>');

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
                  
        
        // prikaz slike namesto generične
        
        $(document).on('change', '#file', function(){
        var modal1 = document.getElementById('myModal1');
        var modal2 = document.getElementById('myModal2');
        var modal3 = document.getElementById('myModal3');
        var close1 = document.getElementById('cl1');
        var close2 = document.getElementById('cl2');
        var close3 = document.getElementById('cl3');
        var picture = document.querySelector('#img-1');
        var name = document.getElementById("file").files[0].name;
        var form_data = new FormData();
        var ext = name.split('.').pop().toLowerCase();
        var oFReader = new FileReader();
        oFReader.readAsDataURL(document.getElementById("file").files[0]);
        var f = document.getElementById("file").files[0];
        var fsize = f.size||f.fileSize;
        if(jQuery.inArray(ext, ['gif','png','jpg','jpeg']) == -1) 
        {
            modal1.style.display = "block";
        }
        else if(fsize > 2000000)
        {
            modal2.style.display = "block";
        }
        else
        {
            oFReader.addEventListener("load", function () {
                picture.src = oFReader.result;
        }, false);
            modal3.style.display = "block";
        }

        close1.onclick = function() {
            modal1.style.display = "none";
        };
        close2.onclick = function() {
            modal2.style.display = "none";
        };
        close3.onclick = function() {
            modal3.style.display = "none";
        };

        window.onclick = function(event) {
            if (event.target == modal1||event.target == modal2) {
                modal1.style.display = "none";
                modal2.style.display = "none";
            }
        }
        
        });
    
});
        