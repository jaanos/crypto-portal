$( document ).ready(function() {

    // Close modals with ESC
    window.addEventListener("keydown", function (e) {
        if(e.which == 27) $(".modal").each(function() {
            $(this).css("display", "none");
        });
    });

});
