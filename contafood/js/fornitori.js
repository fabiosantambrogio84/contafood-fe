var baseUrl = "http://localhost:8090/contafood-be/";

$(document).ready(function() {

	$('#fornitoriTable').DataTable({
		"ajax": {
			"url": baseUrl + "fornitori",
			"type": "GET",
			"content-type": "json",
			"cache": false,
			"dataSrc": "",
			"error": function(jqXHR, textStatus, errorThrown) {
				console.log('Response text: ' + jqXHR.responseText);
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
			"emptyTable": "Nessun fornitore disponibile",
			"zeroRecords": "Nessun fornitore disponibile"
		},
		"pageLength": 20,
		"lengthChange": false,
		"info": false,
		"columns": [
			{"name": "codice", "data": "codice"},
			{"name": "ragioneSociale", "data": "ragioneSociale"},
			{"data": null, render: function ( data, type, row ) {
				var links = '<a class="detailsFornitore pr-2" data-id="'+data.id+'" href="#"><i class="fas fa-info-circle"></i></a>';
				links = links + '<a class="updateFornitore pr-2" data-id="'+data.id+'" href="fornitori-edit.html?idFornitore=' + data.id + '"><i class="far fa-edit"></i></a>';
				links = links + '<a class="deleteFornitore" data-id="'+data.id+'" href="#"><i class="far fa-trash-alt"></i></a>';
				return links;
			}}
		]
	});

	/*
	$.ajax({
    	url: baseUrl + "fornitori",
    	type: 'GET',
    	dataType: 'json',
    	success: function(result) {
		  if(result != null && result != undefined && result != ''){
			//var jsonData = JSON.stringify(result);
			//console.log('--> ' + jsonData);
			result.forEach(function(elem, index){
				console.log("Fornitore num "+index+" - "+JSON.stringify(elem));
			});
			$('#fornitoriTable').DataTable({
				"ajax": {
					"url": baseUrl + "fornitori",
					"content-type": "json",
					"cache": false,
					"dataSrc": ""
				},
				"language": {
					"search": "Cerca",
					"paginate": {
						"first": "Inizio",
						"last": "Fine",
						"next": "Succ.",
						"previous": "Prec."
					},
					"emptyTable": "Nessun fornitore disponibile",
					"zeroRecords": "Nessun fornitore disponibile"
				},
				"pageLength": 20,
				"lengthChange": false,
				"info": false,
				"data": result,
				"columns": [
					{"name": "codice", "data": "codice"},
					{"name": "ragioneSociale", "data": "ragioneSociale"},
					{"data": null, render: function ( data, type, row ) {
						var links = '<a class="updateFornitore" data-id="'+data.id+'" href="#"><i class="far fa-edit"></i></a>';
						links = links + '<a class="deleteFornitore" data-id="'+data.id+'" href="#"><i class="far fa-trash-alt"></i></a>';
						return links;
						// <i class="far fa-edit"></i>
					}}
				]
			});

		  } else{
			//$('#fornitoriMainDiv').html('<p font-size:24px;">Nessun dato disponibile</p>')
		  }
    	},
		error: function(jqXHR, textStatus, errorThrown) {
		  console.log('Response text: ' + jqXHR.responseText);
		}
  	});
	*/

	$(document).on('click','.detailsFornitore', function(){
        var idFornitore = $(this).attr('data-id');

        var alertContent = '<strong>Errore nel recupero del fornitore.</strong>';

        $.ajax({
            url: baseUrl + "fornitori----/" + idFornitore,
            type: 'GET',
            dataType: 'json',
            success: function(result) {
              if(result != null && result != undefined && result != ''){

                //$('.fornitoreBody').data(result);

              } else{
                $('#detailsFornitoreMainDiv').addClass('alert alert-danger alert-dismissible fade show m-2').attr('role','alert');
                $('#detailsFornitoreMainDiv').html(alertContent);
              }
            },
            error: function(jqXHR, textStatus, errorThrown) {
                $('#detailsFornitoreMainDiv').addClass('alert alert-danger alert-dismissible fade show m-2').attr('role','alert');
                $('#detailsFornitoreMainDiv').html(alertContent);
                console.log('Response text: ' + jqXHR.responseText);
            }
        });

        $('#detailsFornitoreModal').modal('show');
    });

	$(document).on('click','.deleteFornitore', function(){
		var idFornitore = $(this).attr('data-id');
		$('#confirmDeleteFornitore').attr('data-id', idFornitore);
		$('#deleteFornitoreModal').modal('show');
	});

	$(document).on('click','#confirmDeleteFornitore', function(){
		$('#deleteFornitoreModal').modal('hide');
		var idFornitore = $(this).attr('data-id');

		$.ajax({
			url: baseUrl + "fornitori/" + idFornitore,
			type: 'DELETE',
			success: function() {
				var alertContent = '<strong>Fornitore</strong> cancellato con successo.\n' +
					'            <button type="button" class="close" data-dismiss="alert" aria-label="Close"><span aria-hidden="true">&times;</span></button>';
				$('#alertFornitore').addClass('alert alert-success alert-dismissible fade show').attr('role','alert');
				$('#alertFornitore').html(alertContent);

				$('#fornitoriTable').DataTable().ajax.reload();
			},
			error: function(jqXHR, textStatus, errorThrown) {
				console.log('Response text: ' + jqXHR.responseText);
			}
		});
	});

	if($('#dittaIndividuale') != null && $('#dittaIndividuale') != undefined){
		$(document).on('change','#dittaIndividuale', function(){
			var isChecked = $('#dittaIndividuale').prop('checked');
			if(isChecked){
				$('#nome').attr('disabled', false);
				$('#cognome').attr('disabled', false);
			} else{
				$('#nome').attr('disabled', true);
				$('#cognome').attr('disabled', true);
			}
		});
	}

	if($('#updateFornitoreButton') != null && $('#updateFornitoreButton') != undefined){
		$(document).on('click','#updateFornitoreButton', function(event){
			event.preventDefault();
			console.log('SALVA');
		});
	}
});

$.fn.extractIdFornitoreFromUrl = function(){
    var pageUrl = window.location.search.substring(1);

	var urlVariables = pageUrl.split('&'),
        paramNames,
        i;

    for (i = 0; i < urlVariables.length; i++) {
        paramNames = urlVariables[i].split('=');

        if (paramNames[0] === 'idFornitore') {
        	return paramNames[1] === undefined ? null : decodeURIComponent(paramNames[1]);
        }
    }
}

$.fn.getFornitore = function(idFornitore){

    var alertContent = '<strong>Errore nel recupero del fornitore.</strong>\n' +
    					'<button type="button" class="close" data-dismiss="alert" aria-label="Close"><span aria-hidden="true">&times;</span></button>';

    $.ajax({
		url: baseUrl + "util/province",
		type: 'GET',
		dataType: 'json',
		success: function(result) {
			if(result != null && result != undefined && result != ''){
				//result = $.parseJSON(result);
				$.each(result, function(i, item){
					$('#provincia').append('<option value="'+item+'">'+item+'</option>');
				});
			}
		},
		error: function(jqXHR, textStatus, errorThrown) {
			console.log('Response text: ' + jqXHR.responseText);
		}
	});

    $.ajax({
        url: baseUrl + "fornitori/" + idFornitore,
        type: 'GET',
        dataType: 'json',
        success: function(result) {
          if(result != null && result != undefined && result != ''){
            //$('.fornitoreBody').data('fornitore', result);

			$('#hiddenIdFornitore').attr('value', result.id);
			$('#codiceFornitore').attr('value', result.codice);
            $('#ragioneSociale').attr('value', result.ragioneSociale);
            $('#ragioneSociale2').attr('value', result.ragioneSociale2);
            if(result.dittaIndividuale === true){
				$('#dittaIndividuale').prop('checked', true);
				$('#nome').attr('disabled', 'false');
				$('#cognome').attr('disabled', 'false');
			}
            $('#nome').attr('value', result.nome);
            $('#cognome').attr('value', result.cognome);
            $('#indirizzo').attr('value', result.indirizzo);
            $('#citta').attr('value', result.citta);
            $('#provincia option[value="' + result.provincia +'"]').attr('selected', true);
            $('#cap').attr('value', result.cap);
            $('#nazione').attr('value', result.nazione);
            $('#partitaIva').attr('value', result.partitaIva);
            $('#codiceFiscale').attr('value', result.codiceFiscale);
			$('#telefono').attr('value', result.telefono);
			$('#telefono2').attr('value', result.telefono2);
			$('#telefono3').attr('value', result.telefono3);
			$('#email').attr('value', result.email);
			$('#emailPec').attr('value', result.emailPec);
			$('#codiceUnivocoSdi').attr('value', result.codiceUnivocoSdi);
			$('#iban').attr('value', result.iban);
			$('#pagamento').attr('value', result.pagamento);
			$('#note').attr('value', result.note);

          } else{
            $('#alertFornitore').addClass('alert alert-danger alert-dismissible fade show').attr('role','alert');
            $('#alertFornitore').html(alertContent);
          }
        },
        error: function(jqXHR, textStatus, errorThrown) {
            $('#alertFornitore').addClass('alert alert-danger alert-dismissible fade show').attr('role','alert');
            $('#alertFornitore').html(alertContent);
            $('#updateFornitoreButton').attr('disabled', true);
            console.log('Response text: ' + jqXHR.responseText);
        }
    });


}
