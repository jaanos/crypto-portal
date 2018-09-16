$(document).ready(function(){

    var selHashAlgorithm = $('#selHashAlgorithm')[0];
    var stringToHash = $('#stringToHash')[0];
    var result = $('#hashedString')[0];

    var delay = (function(){
        var timer = 0;
        return function(callback, ms){
            clearTimeout (timer);
            timer = setTimeout(callback, ms);
        };
    })();
    $('input').keyup(function() {
        delay(function(){
            if (stringToHash != null && stringToHash.value.length > 0) {
		var hashAlgorithm = selHashAlgorithm.options[selHashAlgorithm.selectedIndex].text;
		switch(hashAlgorithm)
		{
		    case 'md5':
			var hashed = CryptoJS.MD5(stringToHash.value).toString(CryptoJS.enc.Hex);
			break;
		    case 'sha1':
			var hashed = CryptoJS.SHA1(stringToHash.value).toString(CryptoJS.enc.Hex);
			break;
		    case 'sha256':
			var hashed = CryptoJS.SHA256(stringToHash.value).toString(CryptoJS.enc.Hex);
			break;
		    case 'sha224':
			var hashed = CryptoJS.SHA224(stringToHash.value).toString(CryptoJS.enc.Hex);
			break;
		    case 'sha512':
			var hashed = CryptoJS.SHA512(stringToHash.value).toString(CryptoJS.enc.Hex);
			break;
		    case 'sha384':
			var hashed = CryptoJS.SHA384(stringToHash.value).toString(CryptoJS.enc.Hex);
			break;
		    case 'sha3':
			var hashed = CryptoJS.SHA3(stringToHash.value).toString(CryptoJS.enc.Hex);
			break;
		    case 'ripemd160':
			var hashed = CryptoJS.RIPEMD160(stringToHash.value).toString(CryptoJS.enc.Hex);
			break;
		}
		
		result.innerHTML = hashed;
            } else {}
        }, 1000 );
    });

    $('input').on('keydown', function(event) {
        var x = event.which;
        if (x === 13) {
            event.preventDefault();
        }
    });

});
