var baseUrl = "http://localhost:8090/contafood-be/";

$(document).ready(function() {

	$('#ricetteTable').DataTable({
		"ajax": {
			"url": baseUrl + "ricette",
			"type": "GET",
			"content-type": "json",
			"cache": false,
			"dataSrc": "",
			"error": function(jqXHR, textStatus, errorThrown) {
				console.log('Response text: ' + jqXHR.responseText);
				var alertContent = '<strong>Errore nel recupero delle ricette</strong>\n' +
					'            <button type="button" class="close" data-dismiss="alert" aria-label="Close"><span aria-hidden="true">&times;</span></button>';
				$('#alertRicetta').addClass('alert alert-danger alert-dismissible fade show').attr('role','alert');
				$('#alertRicetta').html(alertContent);
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
			"emptyTable": "Nessuna ricetta disponibile",
			"zeroRecords": "Nessuna ricetta disponibile"
		},
		"pageLength": 20,
		"lengthChange": false,
		"info": false,
		"columns": [
			{"name": "codice", "data": "codice"},
			{"name": "nome", "data": "nome"},
			{"name": "note", "data": "note"},
			{"data": null, render: function ( data, type, row ) {
				//var links = '<a class="detailsFornitore pr-2" data-id="'+data.id+'" href="#"><i class="fas fa-info-circle"></i></a>';
				var links = '<a class="updateRicetta pr-2" data-id="'+data.id+'" href="ricette-edit.html?idRicetta=' + data.id + '"><i class="far fa-edit"></i></a>';
				links = links + '<a class="deleteRicetta" data-id="'+data.id+'" href="#"><i class="far fa-trash-alt"></i></a>';
				return links;
			}}
		]
	});

	/*
	$(document).on('click','.detailsFornitore', function(){
        var idFornitore = $(this).attr('data-id');

        var alertContent = '<strong>Errore nel recupero del fornitore.</strong>';

        $.ajax({
            url: baseUrl + "fornitori/" + idFornitore,
            type: 'GET',
            dataType: 'json',
            success: function(result) {
              if(result != null && result != undefined && result != ''){
              	var contentDetails = '<p><strong>Codice fornitore: </strong>'+result.codice+'</p>';
				  contentDetails = contentDetails + '<p><strong>Ragione sociale: </strong>'+result.ragioneSociale+'</p>';
				  contentDetails = contentDetails + '<p><strong>Ragione sociale 2: </strong>'+result.ragioneSociale2+'</p>';
				  contentDetails = contentDetails + '<p><strong>Ditta individuale: </strong>';
				  if(result.dittaIndividuale === true){
					contentDetails = contentDetails + 'Si';
				  } else{
				  	contentDetails = contentDetails + 'No';
				  }
				  contentDetails = contentDetails + '<p><strong>Nome: </strong>'+result.nome+'</p>';
				  contentDetails = contentDetails + '<p><strong>Cognome: </strong>'+result.cognome+'</p>';
				  contentDetails = contentDetails + '<p><strong>Indirizzo: </strong>'+result.indirizzo+'</p>';
				  contentDetails = contentDetails + '<p><strong>Citt&agrave;: </strong>'+result.citta+'</p>';
				  contentDetails = contentDetails + '<p><strong>Provincia: </strong>'+result.provincia+'</p>';
				  contentDetails = contentDetails + '<p><strong>Cap: </strong>'+result.cap+'</p>';
				  contentDetails = contentDetails + '<p><strong>Nazione: </strong>'+result.nazione+'</p>';
				  contentDetails = contentDetails + '<p><strong>Partita IVA: </strong>'+result.partitaIva+'</p>';
				  contentDetails = contentDetails + '<p><strong>Codice fiscale: </strong>'+result.codiceFiscale+'</p>';
				  contentDetails = contentDetails + '<p><strong>Telefono: </strong>'+result.telefono+'</p>';
				  contentDetails = contentDetails + '<p><strong>Telefono2: </strong>'+result.telefono2+'</p>';
				  contentDetails = contentDetails + '<p><strong>Telefono3: </strong>'+result.telefono3+'</p>';
				  contentDetails = contentDetails + '<p><strong>Email: </strong>'+result.email+'</p>';
				  contentDetails = contentDetails + '<p><strong>Email PEC: </strong>'+result.emailPec+'</p>';
				  contentDetails = contentDetails + '<p><strong>Codice univoco SDI: </strong>'+result.codiceUnivocoSdi+'</p>';
				  contentDetails = contentDetails + '<p><strong>Iban: </strong>'+result.iban+'</p>';
				  contentDetails = contentDetails + '<p><strong>Pagamento: </strong>'+result.pagamento+'</p>';
				  contentDetails = contentDetails + '<p><strong>Note: </strong>'+result.note+'</p>';

				  $('#detailsFornitoreMainDiv').attr('style', 'overflow-y: auto; max-height: 500px;');
				  $('#detailsFornitoreMainDiv').append(contentDetails);

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
	*/

	$(document).on('click','.deleteRicetta', function(){
		var idRicetta = $(this).attr('data-id');
		$('#confirmDeleteRicetta').attr('data-id', idRicetta);
		$('#deleteRicettaModal').modal('show');
	});

	$(document).on('click','#confirmDeleteRicetta', function(){
		$('#deleteRicettaModal').modal('hide');
		var idRicetta = $(this).attr('data-id');

		$.ajax({
			url: baseUrl + "ricette/" + idRicetta,
			type: 'DELETE',
			success: function() {
				var alertContent = '<strong>Ricetta</strong> cancellata con successo.\n' +
					'            <button type="button" class="close" data-dismiss="alert" aria-label="Close"><span aria-hidden="true">&times;</span></button>';
				$('#alertRicetta').addClass('alert alert-success alert-dismissible fade show').attr('role','alert');
				$('#alertRicetta').html(alertContent);

				$('#ricetteTable').DataTable().ajax.reload();
			},
			error: function(jqXHR, textStatus, errorThrown) {
				console.log('Response text: ' + jqXHR.responseText);
			}
		});
	});

	if($('#updateRicettaButton') != null && $('#updateRicettaButton') != undefined){
		$(document).on('click','#updateRicettaButton', function(event){
			event.preventDefault();

			var ricetta = new Object();
			ricetta.id = $('#hiddenIdRicetta').val();

			var ricettaJson = JSON.stringify(ricetta);

			var alertContent = '<strong>@@alertText@@</strong>\n' +
				'<button type="button" class="close" data-dismiss="alert" aria-label="Close"><span aria-hidden="true">&times;</span></button>';

			$.ajax({
				url: baseUrl + "ricette/" + $('#hiddenIdRicetta').val(),
				type: 'PUT',
				contentType: "application/json",
				dataType: 'json',
				data: fornitoreJson,
				success: function(result) {
					$('#alertRicetta').addClass('alert alert-success alert-dismissible fade show').attr('role','alert');
					$('#alertRicetta').html(alertContent.replace('@@alertText@@','Ricetta modificata con successo'));
				},
				error: function(jqXHR, textStatus, errorThrown) {
					$('#alertRicetta').addClass('alert alert-danger alert-dismissible fade show').attr('role','alert');
					$('#alertRicetta').html(alertContent.replace('@@alertText@@','Errore nella modifica della ricetta'));
				}
			});
		});
	}

	if($('#newRicettaButton') != null && $('#newRicettaButton') != undefined){
		$(document).on('click','#newRicettaButton', function(event){
			event.preventDefault();

			var ricetta = new Object();
			ricetta.codice = $('#codiceRicetta').val();

			var ricettaJson = JSON.stringify(ricetta);

			var alertContent = '<strong>@@alertText@@</strong>\n' +
				'<button type="button" class="close" data-dismiss="alert" aria-label="Close"><span aria-hidden="true">&times;</span></button>';

			$.ajax({
				url: baseUrl + "ricette",
				type: 'POST',
				contentType: "application/json",
				dataType: 'json',
				data: ricetteJson,
				success: function(result) {
					$('#alertRicetta').addClass('alert alert-success alert-dismissible fade show').attr('role','alert');
					$('#alertRicetta').html(alertContent.replace('@@alertText@@','Ricetta creata con successo'));
				},
				error: function(jqXHR, textStatus, errorThrown) {
					$('#alertRicetta').addClass('alert alert-danger alert-dismissible fade show').attr('role','alert');
					$('#alertRicetta').html(alertContent.replace('@@alertText@@','Errore nella creazione della ricetta'));
				}
			});
		});
	}

	$(document).on('click','#addIngrediente', function(){
		$('#addIngredienteModal').modal('show');

		$('#addIngredienteModalTable').DataTable({
			"ajax": {
				"url": baseUrl + "ingredienti",
				"type": "GET",
				"content-type": "json",
				"cache": false,
				"dataSrc": "",
				"error": function(jqXHR, textStatus, errorThrown) {
					var alertContent = '<strong>Errore nel recupero degli ingredienti</strong>\n' +
						'            <button type="button" class="close" data-dismiss="alert" aria-label="Close"><span aria-hidden="true">&times;</span></button>';
					$('#alertRicettaAddIngrediente').addClass('alert alert-danger alert-dismissible fade show').attr('role','alert');
					$('#alertRicettaAddIngrediente').html(alertContent);
				}
			},
			"language": {
				"search": "Cerca",
				"emptyTable": "Nessuna ingrediente disponibile",
				"zeroRecords": "Nessuna ingrediente disponibile"
			},
			"paging": false,
			"lengthChange": false,
			"info": false,
			"columns": [
				{"data": null, render: function ( data, type, row ) {
					var checkboxHtml = '<input type="checkbox" data-id="'+data.id+'" data-codice="'+data.codice+'" data-descrizione="'+data.descrizione+'" ' +
						'data-prezzo="'+data.prezzo+'" id="checkbox_'+data.id+'" class="addIngredienteCheckbox">';
					return checkboxHtml;
				}},
				{"name": "codice", "data": "codice"},
				{"name": "descrizione", "data": "descrizione"},
				{"name": "prezzo", "data": "prezzo"}
			]
		});
	});

	$(document).on('click','#confirmAddIngredienteModal', function(){
		var numChecked = $('.addIngredienteCheckbox:checkbox:checked').length;
		if(numChecked == null || numChecked == undefined || numChecked == 0){
			var alertContent = '<strong>Selezionare almeno un ingrediente</strong>\n' +
				'            <button type="button" class="close" data-dismiss="alert" aria-label="Close"><span aria-hidden="true">&times;</span></button>';
			$('#alertRicettaAddIngrediente').addClass('alert alert-danger alert-dismissible fade show').attr('role','alert');
			$('#alertRicettaAddIngrediente').html(alertContent);
		} else{
			$('.addIngredienteCheckbox:checkbox:checked').each(function(i, item){
				//$('#categoria').append('<option value="'+item.id+'">'+item.nome+'</option>');
				var codice = $('#'+item.id).attr('data-codice');
				var descrizione = $('#'+item.id).attr('data-descrizione');
				var prezzo = $('#'+item.id).attr('data-prezzo');

				var rowHtml = '<div class="form-row" data-id="'+item.id+'" class="formRowIngrediente">' +
					'<div class="form-group col-md-2">';
				if(i == 0){
					rowHtml = rowHtml + '<label for="codiceIngrediente">Codice</label>';
				}
				rowHtml = rowHtml + '<input type="text" class="form-control" id="codiceIngrediente_"'+item.id+' disabled value="'+codice+'"></div>';
				rowHtml = rowHtml + '<div class="form-group col-md-4">';
				if(i == 0){
					rowHtml = rowHtml + '<label for="descrizioneIngrediente">Descrizione</label>';
				}
				rowHtml = rowHtml + '<input type="text" class="form-control" id="descrizioneIngrediente'+item.id+'" disabled value="'+descrizione+'"></div>';
				rowHtml = rowHtml + '<div class="form-group col-md-2">';
				if(i == 0){
					rowHtml = rowHtml + '<label for="prezzoIngrediente">Prezzo</label>';
				}
				rowHtml = rowHtml + '<input type="number" class="form-control" id="prezzoIngrediente'+item.id+'" disabled value="'+prezzo+'"></div>';
				rowHtml = rowHtml + '<div class="form-group col-md-2">';
				if(i == 0){
					rowHtml = rowHtml + '<label for="quantitaIngrediente">Quantita</label>';
				}
				rowHtml = rowHtml + '<input type="number" class="form-control" id="quantitaIngrediente'+item.id+'" step="1" min="0"></div>';

				rowHtml = rowHtml + '<div class="form-group col-md-1"><label for="deleteIngrediente"></label><i id="deleteIngrediente" class="far fa-trash-alt"></div>';

				rowHtml = rowHtml + '</div>';

				$('#formRowIngredienti').append(rowHtml);
				$('#addIngredienteModal').modal('hide');
			});
		}
	});
});

$.fn.getCategorieRicette = function(){
	$.ajax({
		url: baseUrl + "categorie-ricette",
		type: 'GET',
		dataType: 'json',
		success: function(result) {
			if(result != null && result != undefined && result != ''){
				//result = $.parseJSON(result);
				$.each(result, function(i, item){
					$('#categoria').append('<option value="'+item.id+'">'+item.nome+'</option>');
				});
			}
		},
		error: function(jqXHR, textStatus, errorThrown) {
			console.log('Response text: ' + jqXHR.responseText);
		}
	});
}

$.fn.extractIdRicettaFromUrl = function(){
    var pageUrl = window.location.search.substring(1);

	var urlVariables = pageUrl.split('&'),
        paramNames,
        i;

    for (i = 0; i < urlVariables.length; i++) {
        paramNames = urlVariables[i].split('=');

        if (paramNames[0] === 'idRicetta') {
        	return paramNames[1] === undefined ? null : decodeURIComponent(paramNames[1]);
        }
    }
}

$.fn.getRicetta = function(idRicetta){

    var alertContent = '<strong>Errore nel recupero della ricetta.</strong>\n' +
    					'<button type="button" class="close" data-dismiss="alert" aria-label="Close"><span aria-hidden="true">&times;</span></button>';

    $.ajax({
        url: baseUrl + "ricette/" + idRicetta,
        type: 'GET',
        dataType: 'json',
        success: function(result) {
          if(result != null && result != undefined && result != ''){
            //$('.fornitoreBody').data('fornitore', result);

			$('#hiddenIdRicetta').attr('value', result.id);
			$('#codiceRicetta').attr('value', result.codice);

          } else{
            $('#alertRicetta').addClass('alert alert-danger alert-dismissible fade show').attr('role','alert');
            $('#alertRicetta').html(alertContent);
          }
        },
        error: function(jqXHR, textStatus, errorThrown) {
            $('#alertRicetta').addClass('alert alert-danger alert-dismissible fade show').attr('role','alert');
            $('#alertRicetta').html(alertContent);
            $('#updateRicettaButton').attr('disabled', true);
            console.log('Response text: ' + jqXHR.responseText);
        }
    });

}

/*
<!-- Extra large modal -->
<button type="button" class="btn btn-primary" data-toggle="modal" data-target=".bd-example-modal-xl">Extra large modal</button>

<div class="modal fade bd-example-modal-xl" tabindex="-1" role="dialog" aria-labelledby="myExtraLargeModalLabel" aria-hidden="true">
  <div class="modal-dialog modal-xl">
    <div class="modal-content">
      ...
    </div>
  </div>
</div>

<!-- Large modal -->
<button type="button" class="btn btn-primary" data-toggle="modal" data-target=".bd-example-modal-lg">Large modal</button>

<div class="modal fade bd-example-modal-lg" tabindex="-1" role="dialog" aria-labelledby="myLargeModalLabel" aria-hidden="true">
  <div class="modal-dialog modal-lg">
    <div class="modal-content">
      ...
    </div>
  </div>
</div>

<!-- Small modal -->
<button type="button" class="btn btn-primary" data-toggle="modal" data-target=".bd-example-modal-sm">Small modal</button>

<div class="modal fade bd-example-modal-sm" tabindex="-1" role="dialog" aria-labelledby="mySmallModalLabel" aria-hidden="true">
  <div class="modal-dialog modal-sm">
    <div class="modal-content">
      ...
    </div>
  </div>
</div>

*/
