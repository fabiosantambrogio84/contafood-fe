var baseUrl = "http://localhost:8090/contafood-be/";

$(document).ready(function() {

	$('#produzioniTable').DataTable({
		"ajax": {
			"url": baseUrl + "produzioni",
			"type": "GET",
			"content-type": "json",
			"cache": false,
			"dataSrc": "",
			"error": function(jqXHR, textStatus, errorThrown) {
				console.log('Response text: ' + jqXHR.responseText);
				var alertContent = '<div id="alertProduzioneContent" class="alert alert-danger alert-dismissible fade show" role="alert">';
				alertContent = alertContent + '<strong>Errore nel recupero delle produzioni</strong>\n' +
					'            <button type="button" class="close" data-dismiss="alert" aria-label="Close"><span aria-hidden="true">&times;</span></button></div>';
				$('#alertProduzione').empty().append(alertContent);
			}
		},
		"language": {
			"search": "Cerca per codice, ricetta, confezione",
			"paginate": {
				"first": "Inizio",
				"last": "Fine",
				"next": "Succ.",
				"previous": "Prec."
			},
			"emptyTable": "Nessuna produzione disponibile",
			"zeroRecords": "Nessuna produzione disponibile"
		},
		"pageLength": 20,
		"lengthChange": false,
		"info": false,
		"autoWidth": false,
		"order": [
			[0, 'asc']
		],
		"columns": [
			{"name": "codice", "data": "codice"},
			{"name": "ricetta", "data": null, "orderable":false, render: function ( data, type, row ) {
				var ricettaResult = data.ricetta.codice+' - '+data.ricetta.nome;
				return ricettaResult;
			}},
			{"name": "confezione", "data": null, "orderable":false, render: function ( data, type, row ) {
				var confezioneResult = data.confezione.tipo+' '+data.confezione.peso+' gr.';
				return confezioneResult;
			}},
			{"name": "numConfezioni", "data": "numConfezioni"},
			{"data": null, "orderable":false, "width":"8%", render: function ( data, type, row ) {
				var links = '<a class="deleteProduzione" data-id="'+data.id+'" href="#"><i class="far fa-trash-alt"></i></a>';
				return links;
			}}
		]
	});

	$(document).on('click','.deleteProduzione', function(){
		var idProduzione = $(this).attr('data-id');
		$('#confirmDeleteProduzione').attr('data-id', idProduzione);
		$('#deleteProduzioneModal').modal('show');
	});

	$(document).on('click','#confirmDeleteProduzione', function(){
		$('#deleteProduzioneModal').modal('hide');
		var idProduzione = $(this).attr('data-id');

		$.ajax({
			url: baseUrl + "produzioni/" + idProduzione,
			type: 'DELETE',
			success: function() {
				var alertContent = '<div id="alertProduzioneContent" class="alert alert-success alert-dismissible fade show" role="alert">';
				alertContent = alertContent + '<strong>Produzione</strong> cancellata con successo.\n' +
					'            <button type="button" class="close" data-dismiss="alert" aria-label="Close"><span aria-hidden="true">&times;</span></button></div>';
				$('#alertProduzione').empty().append(alertContent);

				$('#produzioniTable').DataTable().ajax.reload();
			},
			error: function(jqXHR, textStatus, errorThrown) {
				console.log('Response text: ' + jqXHR.responseText);
			}
		});
	});

    /*
	if($('#updateRicettaButton') != null && $('#updateRicettaButton') != undefined){
		$(document).on('submit','#updateRicettaForm', function(event){
			event.preventDefault();

			var ricetta = new Object();
			ricetta.id = $('#hiddenIdRicetta').val();
			ricetta.codice = $('#codiceRicetta').val();
			ricetta.nome = $('#nome').val();
			var categoria = new Object();
			categoria.id = $('#categoria option:selected').val();
			ricetta.categoria = categoria;
			ricetta.tempoPreparazione = $('#tempoPreparazione').val();
			ricetta.numeroPorzioni = $('#numeroPorzioni').val();
			ricetta.costoIngredienti = $('#costoIngredienti').val();
			ricetta.costoPreparazione = $('#costoPreparazione').val();
			ricetta.costoTotale = $('#costoTotale').val();
			var ingredientiLength = $('.formRowIngrediente').length;
			if(ingredientiLength != null && ingredientiLength != undefined && ingredientiLength != 0){
				var ricettaIngredienti = [];
				$('.formRowIngrediente').each(function(i, item){
					var ricettaIngrediente = {};
					var ricettaIngredienteId = new Object();
					var ingredienteId = item.id.replace('formRowIngrediente_','');
					ricettaIngredienteId.ingredienteId = ingredienteId;
					ricettaIngrediente.id = ricettaIngredienteId;
					ricettaIngrediente.quantita = $('#quantitaIngrediente_'+ingredienteId).val();

					ricettaIngredienti.push(ricettaIngrediente);
				});
				ricetta.ricettaIngredienti = ricettaIngredienti;
			}
			ricetta.preparazione = $('#preparazione').val();
			ricetta.allergeni = $('#allergeni').val();
			ricetta.valoriNutrizionali = $('#valoriNutrizionali').val();
			ricetta.note = $('#note').val();

			var ricettaJson = JSON.stringify(ricetta);

			var alertContent = '<div id="alertRicettaContent" class="alert alert-@@alertResult@@ alert-dismissible fade show" role="alert">';
			alertContent = alertContent + '<strong>@@alertText@@</strong>\n' +
				'<button type="button" class="close" data-dismiss="alert" aria-label="Close"><span aria-hidden="true">&times;</span></button></div>';

			$.ajax({
				url: baseUrl + "ricette/" + $('#hiddenIdRicetta').val(),
				type: 'PUT',
				contentType: "application/json",
				dataType: 'json',
				data: ricettaJson,
				success: function(result) {
					$('#alertRicetta').empty().append(alertContent.replace('@@alertText@@','Ricetta modificata con successo').replace('@@alertResult@@', 'success'));
				},
				error: function(jqXHR, textStatus, errorThrown) {
					$('#alertRicetta').empty().append(alertContent.replace('@@alertText@@','Errore nella modifica della ricetta').replace('@@alertResult@@', 'danger'));
				}
			});
		});
	}
    */
    /*
	if($('#newRicettaButton') != null && $('#newRicettaButton') != undefined){
		$(document).on('submit','#newRicettaForm', function(event){
			event.preventDefault();

			var ricetta = new Object();
			ricetta.codice = $('#codiceRicetta').val();
			ricetta.nome = $('#nome').val();
			var categoria = new Object();
			categoria.id = $('#categoria option:selected').val();
			ricetta.categoria = categoria;
			ricetta.tempoPreparazione = $('#tempoPreparazione').val();
			ricetta.numeroPorzioni = $('#numeroPorzioni').val();
			ricetta.costoIngredienti = $('#costoIngredienti').val();
			ricetta.costoPreparazione = $('#costoPreparazione').val();
			ricetta.costoTotale = $('#costoTotale').val();
			var ingredientiLength = $('.formRowIngrediente').length;
			if(ingredientiLength != null && ingredientiLength != undefined && ingredientiLength != 0){
				var ricettaIngredienti = [];
				$('.formRowIngrediente').each(function(i, item){
					var ricettaIngrediente = {};
					var ricettaIngredienteId = new Object();
					var ingredienteId = item.id.replace('formRowIngrediente_','');
					ricettaIngredienteId.ingredienteId = ingredienteId;
					ricettaIngrediente.id = ricettaIngredienteId;
					ricettaIngrediente.quantita = $('#quantitaIngrediente_'+ingredienteId).val();

					ricettaIngredienti.push(ricettaIngrediente);
				});
				ricetta.ricettaIngredienti = ricettaIngredienti;
			}
			ricetta.preparazione = $('#preparazione').val();
			ricetta.allergeni = $('#allergeni').val();
			ricetta.valoriNutrizionali = $('#valoriNutrizionali').val();
			ricetta.note = $('#note').val();

			var ricettaJson = JSON.stringify(ricetta);

			var alertContent = '<div id="alertRicettaContent" class="alert alert-@@alertResult@@ alert-dismissible fade show" role="alert">';
			alertContent = alertContent + '<strong>@@alertText@@</strong>\n' +
				'<button type="button" class="close" data-dismiss="alert" aria-label="Close"><span aria-hidden="true">&times;</span></button></div>';

			$.ajax({
				url: baseUrl + "ricette",
				type: 'POST',
				contentType: "application/json",
				dataType: 'json',
				data: ricettaJson,
				success: function(result) {
					$('#alertRicetta').empty().append(alertContent.replace('@@alertText@@','Ricetta creata con successo').replace('@@alertResult@@', 'success'));
				},
				error: function(jqXHR, textStatus, errorThrown) {
					$('#alertRicetta').empty().append(alertContent.replace('@@alertText@@','Errore nella creazione della ricetta').replace('@@alertResult@@', 'danger'));
				}
			});
		});
	}
    */

    /*
	$(document).on('click','#confirmAddIngredienteModal', function(){
		var numChecked = $('.addIngredienteCheckbox:checkbox:checked').length;
		if(numChecked == null || numChecked == undefined || numChecked == 0){
			var alertContent = '<div id="alertRicettaAddIngredienteContent" class="alert alert-danger alert-dismissible fade show" role="alert">';
			alertContent = alertContent + '<strong>Selezionare almeno un ingrediente</strong>\n' +
				'            <button type="button" class="close" data-dismiss="alert" aria-label="Close"><span aria-hidden="true">&times;</span></button></div>';
			$('#alertRicettaAddIngrediente').empty().append(alertContent);
		} else{
			var alreadyAddedRows = $('.formRowIngrediente').length;
			if(alreadyAddedRows == null || alreadyAddedRows == undefined){
				alreadyAddedRows = 0;
			}
			if(alreadyAddedRows != 0){
				var rowsIdPresent = [];
				$('.formRowIngrediente').each(function(i,item){
					var itemId = item.id;
					rowsIdPresent.push(itemId.replace('formRowIngrediente_',''));
				});
			}
			$('.addIngredienteCheckbox:checkbox:checked').each(function(i, item){
				var id = item.id.replace('checkbox_','');
				var codice = $('#'+item.id).attr('data-codice');

				if($.inArray(id, rowsIdPresent) != -1){
					var alertContent = '<div id="alertRicettaAddIngredienteContent" class="alert alert-danger alert-dismissible fade show" role="alert">';
					alertContent = alertContent + '<strong>L\' ingrediente '+codice+' &egrave; gi&agrave; stato selezionato</strong>\n' +
						'            <button type="button" class="close" data-dismiss="alert" aria-label="Close"><span aria-hidden="true">&times;</span></button></div>';
					$('#alertRicettaAddIngrediente').empty().append(alertContent);
				} else{
					var descrizione = $('#'+item.id).attr('data-descrizione');
					var prezzo = $('#'+item.id).attr('data-prezzo');

					var rowHtml = '<div class="form-row formRowIngrediente" data-id="'+id+'" id="formRowIngrediente_'+id+'">' +
						'<div class="form-group col-md-2">';

					if(i == 0 && alreadyAddedRows == 0){
						rowHtml = rowHtml + '<label for="codiceIngrediente">Codice</label>';
					}
					rowHtml = rowHtml + '<input type="text" class="form-control" id="codiceIngrediente_'+id+'" disabled value="'+codice+'"></div>';
					rowHtml = rowHtml + '<div class="form-group col-md-4">';

					if(i == 0 && alreadyAddedRows == 0){
						rowHtml = rowHtml + '<label for="descrizioneIngrediente">Descrizione</label>';
					}
					rowHtml = rowHtml + '<input type="text" class="form-control" id="descrizioneIngrediente_'+id+'" disabled value="'+descrizione+'"></div>';
					rowHtml = rowHtml + '<div class="form-group col-md-2">';

					if(i == 0 && alreadyAddedRows == 0){
						rowHtml = rowHtml + '<label for="prezzoIngrediente">Prezzo (&euro;)</label>';
					}
					rowHtml = rowHtml + '<input type="number" class="form-control" id="prezzoIngrediente_'+id+'" disabled value="'+prezzo+'"></div>';
					rowHtml = rowHtml + '<div class="form-group col-md-2">';

					if(i == 0 && alreadyAddedRows == 0){
						rowHtml = rowHtml + '<label for="quantitaIngrediente">Quantita</label>';
					}
					rowHtml = rowHtml + '<div class="input-group">';
					rowHtml = rowHtml + '<input type="number" class="form-control quantitaIngrediente" id="quantitaIngrediente_'+id+'" step=".01" min="0" onchange="$.fn.computeCostoIngredienti(this);">';
					rowHtml = rowHtml + '<div class="input-group-append ml-1 mt-1"><a class="deleteAddIngrediente" data-id="'+id+'"><i class="far fa-trash-alt"></a>';
					rowHtml = rowHtml + '</div></div></div>';
					rowHtml = rowHtml + '</div>';

					$('#formRowIngredienti').append(rowHtml);

					$('#addIngredienteModalTable').DataTable().destroy();
					$('#alertRicettaAddIngredienteContent').alert('close');
					$('#addIngredienteModal').modal('hide');
				}
			});
		}
	});

	$(document).on('click','.annullaAddIngredienteModal', function(){
		$('#addIngredienteModalTable').DataTable().destroy();
		$('#alertRicettaAddIngredienteContent').alert('close');
		$('#addIngredienteModal').modal('hide');
	});

	$(document).on('click','.deleteAddIngrediente', function(){
		var firstId = $('.formRowIngrediente').first().attr('data-id');
		if(firstId == null || firstId == undefined){
			firstId = -1;
		}
		var id = $(this).attr('data-id');
		$('#formRowIngrediente_'+id).remove();
		if(id == firstId){
			var firstRow = $('.formRowIngrediente').first();
			if(firstRow != null && firstRow != undefined && firstRow.length != 0){
				$('#'+firstRow.attr('id')).find('input').each(function(i, item){
					var id = item.id;
					var label = '';
					if(id.indexOf('codice') != '-1'){
						label = '<label for="codiceIngrediente">Codice</label>';
					} else if(id.indexOf('descrizione') != '-1'){
						label = '<label for="descrizioneIngrediente">Descrizione</label>';
					} else if(id.indexOf('prezzo') != '-1'){
						label = '<label for="prezzoIngrediente">Prezzo (&euro;)</label>';
					} else{
						label = '<label for="quantitaIngrediente">Quantita</label>';
					}
					if(id.indexOf('quantita') != '-1'){
						$('#'+id).parent().before(label);
					} else {
						$('#'+id).before(label);
					}
				});
			}
		}
		$.fn.computeCostoIngredienti();
	});

	if($('#tempoPreparazione') != null && $('#tempoPreparazione') != undefined){
        $(document).on('change','#tempoPreparazione', function(){
			$.fn.computeCostoTotale($('#costoIngredienti').val(), $.fn.computeCostoPreparazione());
        });
    }
    */

});

$.fn.getCategorieRicette = function(){
	$.ajax({
		url: baseUrl + "categorie-ricette",
		type: 'GET',
		dataType: 'json',
		success: function(result) {
			if(result != null && result != undefined && result != ''){
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

$.fn.getConfezioni = function(){
	$.ajax({
		url: baseUrl + "confezioni",
		type: 'GET',
		dataType: 'json',
		success: function(result) {
			if(result != null && result != undefined && result != ''){
				$.each(result, function(i, item){
					$('#confezione').append('<option value="'+item.id+'">'+item.tipo+' '+item.peso+' gr.</option>');
				});
			}
		},
		error: function(jqXHR, textStatus, errorThrown) {
			console.log('Response text: ' + jqXHR.responseText);
		}
	});
}

$.fn.getRicetta = function(idRicetta){

	var alertContent = '<div id="alertRicettaContent" class="alert alert-danger alert-dismissible fade show" role="alert">';
	alertContent = alertContent +  '<strong>Errore nel recupero della ricetta.</strong>\n' +
    					'<button type="button" class="close" data-dismiss="alert" aria-label="Close"><span aria-hidden="true">&times;</span></button></div>';

    // load categorie ricette
	$.fn.getCategorieRicette();

	// load costo orario preparazione
	$.fn.getCostoOrarioPreparazione();

	$.ajax({
        url: baseUrl + "ricette/" + idRicetta,
        type: 'GET',
        dataType: 'json',
        success: function(result) {
          if(result != null && result != undefined && result != ''){

			$('#hiddenIdRicetta').attr('value', result.id);
			$('#codiceRicetta').attr('value', result.codice);
			$('#nome').attr('value', result.nome);
			if(result.categoria != null && result.categoria != undefined){
				$('#categoria option[value="' + result.categoria.id +'"]').attr('selected', true);
			}
			$('#tempoPreparazione').attr('value', result.tempoPreparazione);
			$('#numeroPorzioni').attr('value', result.numeroPorzioni);
			$('#costoIngredienti').attr('value', result.costoIngredienti);
			$('#costoPreparazione').attr('value', result.costoPreparazione);
			$('#costoTotale').attr('value', result.costoTotale);
			$('#preparazione').val(result.preparazione);
			$('#allergeni').val(result.allergeni);
			$('#valoriNutrizionali').val(result.valoriNutrizionali);
			$('#note').val(result.note);

			if(result.ricettaIngredienti != null && result.ricettaIngredienti != undefined && result.ricettaIngredienti.length != 0){
				result.ricettaIngredienti.forEach(function(item, i){
					var id = item.id.ingredienteId;
					var codice = item.ingrediente.codice;
					var descrizione = item.ingrediente.descrizione;
					var prezzo = item.ingrediente.prezzo;
					var quantita = item.quantita;

					var rowHtml = '<div class="form-row formRowIngrediente" data-id="'+id+'" id="formRowIngrediente_'+id+'">' +
						'<div class="form-group col-md-2">';

					if(i == 0){
						rowHtml = rowHtml + '<label for="codiceIngrediente">Codice</label>';
					}
					rowHtml = rowHtml + '<input type="text" class="form-control" id="codiceIngrediente_'+id+'" disabled value="'+codice+'"></div>';
					rowHtml = rowHtml + '<div class="form-group col-md-4">';

					if(i == 0){
						rowHtml = rowHtml + '<label for="descrizioneIngrediente">Descrizione</label>';
					}
					rowHtml = rowHtml + '<input type="text" class="form-control" id="descrizioneIngrediente_'+id+'" disabled value="'+descrizione+'"></div>';
					rowHtml = rowHtml + '<div class="form-group col-md-2">';

					if(i == 0){
						rowHtml = rowHtml + '<label for="prezzoIngrediente">Prezzo (&euro;)</label>';
					}
					rowHtml = rowHtml + '<input type="number" class="form-control" id="prezzoIngrediente_'+id+'" disabled value="'+prezzo+'"></div>';
					rowHtml = rowHtml + '<div class="form-group col-md-2">';

					if(i == 0){
						rowHtml = rowHtml + '<label for="quantitaIngrediente">Quantita</label>';
					}
					rowHtml = rowHtml + '<div class="input-group">';
					rowHtml = rowHtml + '<input type="number" class="form-control quantitaIngrediente" id="quantitaIngrediente_'+id+'" step=".01" min="0" value="'+quantita+'" onchange="$.fn.computeCostoIngredienti(this);">';
					rowHtml = rowHtml + '<div class="input-group-append ml-1 mt-1"><a class="deleteAddIngrediente" data-id="'+id+'"><i class="far fa-trash-alt"></a>';
					rowHtml = rowHtml + '</div></div></div>';
					rowHtml = rowHtml + '</div>';

					$('#formRowIngredienti').append(rowHtml);
				});
			}
          } else{
            $('#alertRicetta').empty().append(alertContent);
          }
        },
        error: function(jqXHR, textStatus, errorThrown) {
            $('#alertRicetta').append(alertContent);
            $('#updateRicettaButton').attr('disabled', true);
            console.log('Response text: ' + jqXHR.responseText);
        }
    });
}

