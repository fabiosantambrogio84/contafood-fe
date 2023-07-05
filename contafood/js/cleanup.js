var baseUrl = "/contafood-be/";

$(document).ready(function() {
    if($('#authorizationModal') !=  null && $('#authorizationModal') != undefined && $('#authorizationModal').length != 0){

        var token = $('body').attr('data-auth');
        if(token != null && token != undefined && token != ""){
            var bytes  = CryptoJS.AES.decrypt(token.toString(), 'contafood');
            var auth = bytes.toString(CryptoJS.enc.Utf8);

            $.fn.loadCleanupTable(auth);
        } else {
            $('#authorizationModal').modal('show');
        }
    }
});

$(document).on('click','.annullaAuthorizationModal', function(){
    $('#authorizationModal').modal('hide');

    var alertContent = '<div id="alertParametroContent" class="alert alert-danger alert-dismissible fade show" role="alert">';
    alertContent = alertContent + '<strong>Accesso negato</strong>\n' + '<button type="button" class="close" data-dismiss="alert" aria-label="Close"><span aria-hidden="true">&times;</span></button></div>';
    $('#alertCleanup').empty().append(alertContent);
});

$(document).on('submit','#authorizationForm', function(event){
    event.preventDefault();

    var username = $('#username').val();
    var password = $('#password').val();
    var auth = "Basic " + btoa(username + ":" + password);

    $.fn.loadCleanupTable(auth);
});

$.fn.loadCleanupTable = function(auth){
    $('#cleanupTable').DataTable({
        "ajax": {
            "url": baseUrl + "configurazione/cleanup",
            "type": "GET",
            "content-type": "json",
            "cache": false,
            "headers": {
                "Content-Type": "application/json",
                "Authorization": auth
            },
            "dataSrc": function(data) {
                $('#authorizationModal').modal('hide');
                $('#cleanupMainDiv').removeClass('d-none');
                return data;
            },
            "error": function(jqXHR, textStatus, errorThrown) {
                console.log('Response text: ' + jqXHR.status+', '+textStatus+', '+errorThrown);

                $('#authorizationModal').modal('hide');

                var alertContent = '<div id="alertProprietaContent" class="alert alert-danger alert-dismissible fade show" role="alert">';
                alertContent = alertContent + '<strong>Accesso negato</strong>\n' +
                    '            <button type="button" class="close" data-dismiss="alert" aria-label="Close"><span aria-hidden="true">&times;</span></button></div>';
                $('#alertCleanup').empty().append(alertContent);
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
            "emptyTable": "Nessuna azione disponibile",
            "zeroRecords": "Nessuna azione disponibile"
        },
        "pageLength": 20,
        "lengthChange": false,
        "info": false,
        "autoWidth": false,
        "order": [
            [0, 'asc']
        ],
        "columns": [
            {"name": "label", "data": "label"},
            {"data": null, "orderable":false, "width":"5%", render: function ( data, type, row ) {

                var token = CryptoJS.AES.encrypt(auth, 'contafood');
                var links = '<a class="runAction pr-2" data-action="'+data.action+'" data-token='+token+' href="#"><i class="fas fa-play"></i></a>';
                return links;
            }}
        ]
    });
}

$(document).on('click','.runAction', function(){
    var action = $(this).attr('data-action');
    var token = $(this).attr('data-token');
    if(action === 'DELETE_ORDINI_CLIENTI'){
        $('#confirmDeleteOrdiniClienti').attr('data-token', token);
        $('#deleteOrdiniClientiModal').modal('show');
    }
});

$(document).on('click','#confirmDeleteOrdiniClienti', function(){
    $('#deleteOrdiniClientiModal').modal('hide');
    var token = $(this).attr('data-token');
    var days = $("input[id='numeroGiorni']").val();

    var alertContent = '<div id="alertCleanupContent" class="alert alert-warning alert-dismissible fade show" role="alert">';
    alertContent = alertContent +  '<strong>Cancellazione Ordini Clienti in corso...</strong>\n' +
        '<button type="button" class="close" data-dismiss="alert" aria-label="Close"><span aria-hidden="true">&times;</span></button></div>';
    $('#alertCleanup').empty().append(alertContent);

    var bytes  = CryptoJS.AES.decrypt(token.toString(), 'contafood');
    var auth = bytes.toString(CryptoJS.enc.Utf8);

    $.ajax({
        url: baseUrl + "configurazione/cleanup/ordini-clienti/evasi-expired?days="+days,
        type: 'GET',
        headers: {
            "Content-Type": "application/json",
            "Authorization": auth
        },
        success: function() {
            var alertContent = '<div id="alertCleanupContent" class="alert alert-success alert-dismissible fade show" role="alert">';
            alertContent = alertContent + '<strong>Ordini Clienti</strong> cancellati con successo.\n' +
                '            <button type="button" class="close" data-dismiss="alert" aria-label="Close"><span aria-hidden="true">&times;</span></button></div>';
            $('#alertCleanup').empty().append(alertContent);

            $('#cleanupTable').DataTable().ajax.reload();
        },
        error: function(jqXHR, textStatus, errorThrown) {
            console.log('Response text: ' + jqXHR.responseText);

            var alertContent = '<div id="alertCausaleContent" class="alert alert-danger alert-dismissible fade show" role="alert">';
            alertContent = alertContent + '<strong>Errore</strong> nella cancellazione degli Ordini Clienti' +
                '            <button type="button" class="close" data-dismiss="alert" aria-label="Close"><span aria-hidden="true">&times;</span></button></div>';
            $('#alertCleanup').empty().append(alertContent);

            $('#cleanupTable').DataTable().ajax.reload();
        }
    });
});

$.fn.getProprieta = function(idProprieta, token){
    var alertContent = '<div id="alertProprietaContent" class="alert alert-danger alert-dismissible fade show" role="alert">';
    alertContent = alertContent +  '<strong>Errore nel recupero della proprietà.</strong>\n' +
        '<button type="button" class="close" data-dismiss="alert" aria-label="Close"><span aria-hidden="true">&times;</span></button></div>';

    var bytes  = CryptoJS.AES.decrypt(token.toString(), 'contafood');
    var auth = bytes.toString(CryptoJS.enc.Utf8);
    //console.log(auth);

    // remove the token parameter from the url
    /*var uri = window.location.toString();
    if (uri.indexOf("&token") > 0) {
        var clean_uri = uri.substring(0, uri.indexOf("&token"));
        window.history.replaceState({}, document.title, clean_uri);
    }*/

    $.ajax({
        url: baseUrl + "configurazione/proprieta/" + idProprieta,
        type: 'GET',
        dataType: 'json',
        headers: {
            "Content-Type": "application/json",
            "Authorization": auth
        },
        success: function (result) {
            if (result != null && result != undefined && result != '') {

                $('#hiddenIdProprieta').attr('value', result.id);
                $('#nome').attr('value', result.nome);
                $('#descrizione').val(result.descrizione);
                $('#valore').attr('value', result.valore);

                $('#annullaProprietaButton').attr('data-auth', token);
            };
        },
        error: function(jqXHR, textStatus, errorThrown) {
            $('#alertProprieta').append(alertContent);
            $('#updateProprietaButton').attr('disabled', true);
            console.log('Response text: ' + jqXHR.responseText);
        }
    });
}

$(document).on('click','#annullaProprietaButton', function(event){
    event.preventDefault();

    window.location = 'proprieta.html?token=' + $(this).attr('data-auth');
    //$.fn.loadParametriTable(auth);
});

$(document).on('submit','#updateProprietaForm', function(event) {
    event.preventDefault();

    var token = $('#annullaProprietaButton').attr('data-auth');
    var bytes  = CryptoJS.AES.decrypt(token.toString(), 'contafood');
    var auth = bytes.toString(CryptoJS.enc.Utf8);

    var proprieta = new Object();
    proprieta.id = $('#hiddenIdProprieta').val();
    proprieta.nome = $('#nome').val();
    proprieta.descrizione = $('#descrizione').val();
    proprieta.valore = $('#valore').val();

    var proprietaJson = JSON.stringify(proprieta);

    var alertContent = '<div id="alertProprietaContent" class="alert alert-@@alertResult@@ alert-dismissible fade show" role="alert">';
    alertContent = alertContent + '<strong>@@alertText@@</strong>\n' +
        '<button type="button" class="close" data-dismiss="alert" aria-label="Close"><span aria-hidden="true">&times;</span></button></div>';

    $.ajax({
        url: baseUrl + "configurazione/proprieta/" + $('#hiddenIdProprieta').val(),
        type: 'PUT',
        contentType: "application/json",
        headers: {
            "Content-Type": "application/json",
            "Authorization": auth
        },
        dataType: 'json',
        data: proprietaJson,
        success: function(result) {
            $('#alertProprieta').empty().append(alertContent.replace('@@alertText@@','Proprietà modificata con successo').replace('@@alertResult@@', 'success'));

            // Returns to the list page
            setTimeout(function() {
                window.location.href = "proprieta.html?token=" + token;
            }, 1000);

        },
        error: function(jqXHR, textStatus, errorThrown) {
            $('#alertProprieta').empty().append(alertContent.replace('@@alertText@@','Errore nella modifica della proprietà').replace('@@alertResult@@', 'danger'));
        }
    });
});
