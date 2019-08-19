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
				var alertContent = '<div id="alertRicettaContent" class="alert alert-danger alert-dismissible fade show" role="alert">';
				alertContent = alertContent + '<strong>Errore nel recupero delle ricette</strong>\n' +
					'            <button type="button" class="close" data-dismiss="alert" aria-label="Close"><span aria-hidden="true">&times;</span></button></div>';
				$('#alertRicetta').empty().append(alertContent);
			}
		},
		"language": {
			"search": "Cerca per codice, descrizione, ingrediente",
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
		"autoWidth": false,
		"order": [
			[0, 'asc']
		],
		"columns": [
			{"name": "codice", "data": "codice"},
			{"name": "nome", "data": "nome"},
			{"name": "note", "data": "note"},
			{"data": null, "orderable":false, "width":"8%", render: function ( data, type, row ) {
				var links = '<a class="updateRicetta pr-2" data-id="'+data.id+'" href="ricette-edit.html?idRicetta=' + data.id + '"><i class="far fa-edit"></i></a>';
				links = links + '<a class="deleteRicetta" data-id="'+data.id+'" href="#"><i class="far fa-trash-alt"></i></a>';
				return links;
			}}
		]
	});

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
				var alertContent = '<div id="alertRicettaContent" class="alert alert-danger alert-dismissible fade show" role="alert">';
				alertContent = alertContent + '<strong>Ricetta</strong> cancellata con successo.\n' +
					'            <button type="button" class="close" data-dismiss="alert" aria-label="Close"><span aria-hidden="true">&times;</span></button></div>';
				$('#alertRicetta').empty().append(alertContent);

				$('#ricetteTable').DataTable().ajax.reload();
			},
			error: function(jqXHR, textStatus, errorThrown) {
				console.log('Response text: ' + jqXHR.responseText);
			}
		});
	});

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

			var alertContent = '<div id="alertRicettaContent" class="alert alert-danger alert-dismissible fade show" role="alert">';
			alertContent = alertContent + '<strong>@@alertText@@</strong>\n' +
				'<button type="button" class="close" data-dismiss="alert" aria-label="Close"><span aria-hidden="true">&times;</span></button></div>';

			$.ajax({
				url: baseUrl + "ricette/" + $('#hiddenIdRicetta').val(),
				type: 'PUT',
				contentType: "application/json",
				dataType: 'json',
				data: ricettaJson,
				success: function(result) {
					$('#alertRicetta').empty().append(alertContent.replace('@@alertText@@','Ricetta modificata con successo'));
				},
				error: function(jqXHR, textStatus, errorThrown) {
					$('#alertRicetta').empty().append(alertContent.replace('@@alertText@@','Errore nella modifica della ricetta'));
				}
			});
		});
	}

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

			var alertContent = '<div id="alertRicettaContent" class="alert alert-danger alert-dismissible fade show" role="alert">';
			alertContent = alertContent + '<strong>@@alertText@@</strong>\n' +
				'<button type="button" class="close" data-dismiss="alert" aria-label="Close"><span aria-hidden="true">&times;</span></button></div>';

			$.ajax({
				url: baseUrl + "ricette",
				type: 'POST',
				contentType: "application/json",
				dataType: 'json',
				data: ricettaJson,
				success: function(result) {
					$('#alertRicetta').empty().append(alertContent.replace('@@alertText@@','Ricetta creata con successo'));
				},
				error: function(jqXHR, textStatus, errorThrown) {
					$('#alertRicetta').empty().append(alertContent.replace('@@alertText@@','Errore nella creazione della ricetta'));
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
					var alertContent = '<div id="alertRicettaContent" class="alert alert-danger alert-dismissible fade show" role="alert">';
					alertContent = alertContent + '<strong>Errore nel recupero degli ingredienti</strong>\n' +
						'            <button type="button" class="close" data-dismiss="alert" aria-label="Close"><span aria-hidden="true">&times;</span></button></div>';
					$('#alertRicettaAddIngrediente').empty().append(alertContent);
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
			"order": [
				[1,'asc']
			],
			"autoWidth": false,
			"columns": [
				{"data": null, "orderable":false, "width": "2%", render: function ( data, type, row ) {
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
						rowHtml = rowHtml + '<label for="prezzoIngrediente">Prezzo</label>';
					}
					rowHtml = rowHtml + '<input type="number" class="form-control" id="prezzoIngrediente_'+id+'" disabled value="'+prezzo+'"></div>';
					rowHtml = rowHtml + '<div class="form-group col-md-2">';

					if(i == 0 && alreadyAddedRows == 0){
						rowHtml = rowHtml + '<label for="quantitaIngrediente">Quantita</label>';
					}
					rowHtml = rowHtml + '<div class="input-group">';
					rowHtml = rowHtml + '<input type="number" class="form-control" id="quantitaIngrediente_'+id+'" step=".01" min="0">';
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
						label = '<label for="prezzoIngrediente">Prezzo</label>';
					} else{
						label = '<label for="quantitaIngrediente">Quantita</label>';
					}
					$('#'+id).before(label);
				});
			}
		}
	});

	if($('#tempoPreparazione') != null && $('#tempoPreparazione') != undefined){
        $(document).on('change','#tempoPreparazione', function(){
            var tempoPreparazione = $('#tempoPreparazione').val();
            if(tempoPreparazione != null && tempoPreparazione != undefined && tempoPreparazione != ""){
                // TODO: costo orario
                var costoOrarioPreparazione = 2;
                var costoPreparazione;

                costoPreparazione = costoOrarioPreparazione * tempoPreparazione;

                $('#costoPreparazione').val(costoPreparazione);

            } else {
                $('#costoPreparazione').val(null);
            }
        });
    }


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

$.fn.getRicetta = function(idRicetta){

	var alertContent = '<div id="alertRicettaContent" class="alert alert-danger alert-dismissible fade show" role="alert">';
	alertContent = alertContent +  '<strong>Errore nel recupero della ricetta.</strong>\n' +
    					'<button type="button" class="close" data-dismiss="alert" aria-label="Close"><span aria-hidden="true">&times;</span></button></div>';

    // load categorie ricette
	$.fn.getCategorieRicette();

	$.ajax({
        url: baseUrl + "ricette/" + idRicetta,
        type: 'GET',
        dataType: 'json',
        success: function(result) {
          if(result != null && result != undefined && result != ''){

			$('#hiddenIdRicetta').attr('value', result.id);
			$('#codiceRicetta').attr('value', result.codice);
			$('#nome').attr('value', result.nome);
			$('#categoria option[value="' + result.categoria.id +'"]').attr('selected', true);
			$('#tempoPreparazione').attr('value', result.tempoPreparazione);
			$('#numeroPorzioni').attr('value', result.numeroPorzioni);
			$('#costoIngredienti').attr('value', result.costoIngredienti);
			$('#costoPreparazione').attr('value', result.costoPreparazione);
			$('#costoTotale').attr('value', result.costoTotale);
			$('#preparazione').val(result.preparazione);
			$('#allergeni').val(result.allergeni);
			$('#valoriNutrizionali').val(result.valoriNutrizionali);
			$('#note').val(result.note);

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
					rowHtml = rowHtml + '<label for="prezzoIngrediente">Prezzo</label>';
				}
				rowHtml = rowHtml + '<input type="number" class="form-control" id="prezzoIngrediente_'+id+'" disabled value="'+prezzo+'"></div>';
				rowHtml = rowHtml + '<div class="form-group col-md-2">';

				if(i == 0){
					rowHtml = rowHtml + '<label for="quantitaIngrediente">Quantita</label>';
				}
				rowHtml = rowHtml + '<div class="input-group">';
				rowHtml = rowHtml + '<input type="number" class="form-control" id="quantitaIngrediente_'+id+'" step=".01" min="0" value="'+quantita+'">';
				rowHtml = rowHtml + '<div class="input-group-append ml-1 mt-1"><a class="deleteAddIngrediente" data-id="'+id+'"><i class="far fa-trash-alt"></a>';
				rowHtml = rowHtml + '</div></div></div>';
				rowHtml = rowHtml + '</div>';

				$('#formRowIngredienti').append(rowHtml);
			});

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
