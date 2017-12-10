$(document).ready(function(){
    var $pass = $('#pass');
    var delay = (function(){
        var timer = 0;
        return function(callback, ms){
            clearTimeout (timer);
            timer = setTimeout(callback, ms);
        };
    })();
    /** Ko nehamo z vpisom gesla se ta poslje na server, server pa nazaj poslje moc gesla */
    $('input').keyup(function() {
        delay(function(){
            if ($pass != null && $pass.val().length > 0) {
                /** AJAX */
                $.ajax({
                    dataType: 'json',
                    url: check_url,
                    data: {pass: $('#pass').val()},
                    success: function(data) {
                        console.log(data.result[0]);
                        var progress = (data.result[0] + 1) * 20;
                        var COLORS = ['#d13131', '#fa9819', '#ffcc00', '#467892', '#26ae90']
                        var STRENGTH = ['Zelo šibko geslo', 'Šibko geslo', 'V redu geslo', 'Dobro geslo', 'Zelo dobro geslo']
                        $("#progress-bar").css({width:  progress + '%', backgroundColor: COLORS[data.result[0]], fontWeight: 'bold'}).text(STRENGTH[data.result[0]]);
                        $("#est-gues").text(data.result[1]);
                        $("#est-time").text(data.result[2]);
                        $("#opozorilo").text(data.result[3]);
                        $("#priporocilo").text('');
                        for (i = 0; i < data.result[4].length; i++) {
                            $('#priporocilo').append(data.result[4][i]);
                            if (i != data.result[4].length - 1) {
                                $('#priporocilo').append('<br>');
                            }
                        }
                    },
                    method: "POST",
                });
                return false;
            } else {
                $("#progress-bar").css({width: '0%'}).text('');
                $("#priporocilo").text('');
                $("#opozorilo").text('');
                $("#est-gues").text('');
                $("#est-time").text('');
            }
        }, 1000 );
    });

    $('input').on('keydown', function(event) {
        var x = event.which;
        if (x === 13) {
            event.preventDefault();
        }
    });

});
