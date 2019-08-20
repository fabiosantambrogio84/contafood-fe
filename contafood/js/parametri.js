var baseUrl = "http://localhost:8090/contafood-be/";

$(document).ready(function() {
    if($('#authorizationModal') !=  null && $('#authorizationModal') != undefined){
        $('#authorizationModal').modal('show');
    }
});

$(document).on('click','.annullaAuthorizationModal', function(){
    $('#authorizationModal').modal('hide');

    var alertContent = '<div id="alertParametriContent" class="alert alert-danger alert-dismissible fade show" role="alert">';
    alertContent = alertContent + '<strong>Accesso negato</strong>\n' + '<button type="button" class="close" data-dismiss="alert" aria-label="Close"><span aria-hidden="true">&times;</span></button></div>';
    $('#alertParametri').empty().append(alertContent);
});

$(document).on('submit','#authorizationForm', function(){
    event.preventDefault();

    var username = $('#username').val();
    var password = $('#password').val();

    $('#parametriTable').DataTable({
        "ajax": {
            "url": baseUrl + "parametri",
            "type": "GET",
            "content-type": "json",
            "cache": false,
            "headers": {
                //"Origin": "http://localhost:63342",
                "Content-Type": "application/json",
                "Authorization": "Basic " + btoa(username + ":" + password)
            },
            "dataSrc": function(data) {
                $('#authorizationModal').modal('hide');
                $('#parametriMainDiv').removeClass('d-none');
                return data;
            },
            "error": function(jqXHR, textStatus, errorThrown) {
                console.log('Response text: ' + jqXHR.status+', '+textStatus+', '+errorThrown);

                $('#authorizationModal').modal('hide');

                var alertContent = '<div id="alertParametriContent" class="alert alert-danger alert-dismissible fade show" role="alert">';
                alertContent = alertContent + '<strong>Accesso negato</strong>\n' +
                   '            <button type="button" class="close" data-dismiss="alert" aria-label="Close"><span aria-hidden="true">&times;</span></button></div>';
                $('#alertParametri').empty().append(alertContent);
            }
        },
        "language": {
            "search": "Cerca",
            "paginate": {
                "first": "Inizio",
                "last": "Fine",
                "next": "Succ.",
                "previous": "Prec."
            },
            "emptyTable": "Nessun parametro disponibile",
            "zeroRecords": "Nessun parametro disponibile"
        },
        "pageLength": 20,
        "lengthChange": false,
        "info": false,
        "autoWidth": false,
        "order": [
            [0, 'asc']
        ],
        "columns": [
            {"name": "nome", "data": "nome"},
            {"name": "descrizione", "data": "descrizione"},
            {"name": "valore", "data": "valore"},
            {"name": "unitaDiMisura", "data": "unitaDiMisura"},
            {"data": null, "orderable":false, "width":"8%", render: function ( data, type, row ) {
                /*
                // Encrypt
                var ciphertext = CryptoJS.AES.encrypt('my message', 'secret key 123');

                // Decrypt
                var bytes  = CryptoJS.AES.decrypt(ciphertext.toString(), 'secret key 123');
                var plaintext = bytes.toString(CryptoJS.enc.Utf8);
                */
                var auth = "Basic " + btoa(username + ":" + password);
                var token = CryptoJS.AES.encrypt(auth, 'contafood');
                var links = '<a class="updateParametro pr-2" data-id="'+data.id+'" href="parametri-edit.html?idParametro=' + data.id + '&token=' + token +'"><i class="far fa-edit"></i></a>';
                return links;
            }}
        ]
    });

});

$.fn.extractIdParametroFromUrl = function(){
    var pageUrl = window.location.search.substring(1);

	var urlVariables = pageUrl.split('&'),
        paramNames,
        i;

    for (i = 0; i < urlVariables.length; i++) {
        paramNames = urlVariables[i].split('=');

        if (paramNames[0] === 'idParametro') {
        	return paramNames[1] === undefined ? null : decodeURIComponent(paramNames[1]);
        }
    }
}

$.fn.extractTokenFromUrl = function(){
    var pageUrl = window.location.search.substring(1);

	var urlVariables = pageUrl.split('&'),
        paramNames,
        i;

    for (i = 0; i < urlVariables.length; i++) {
        paramNames = urlVariables[i].split('=');

        if (paramNames[0] === 'token') {
            return paramNames[1] === undefined ? null : decodeURIComponent(paramNames[1]);
        }
    }
}

$.fn.getParametro = function(idParametro, token){
    var bytes  = CryptoJS.AES.decrypt(token.toString(), 'contafood');
    var auth = bytes.toString(CryptoJS.enc.Utf8);
    console.log(auth);

    // remove the token parameter from the url
    var uri = window.location.toString();
    if (uri.indexOf("&token") > 0) {
        var clean_uri = uri.substring(0, uri.indexOf("&token"));
        window.history.replaceState({}, document.title, clean_uri);
    }
};

