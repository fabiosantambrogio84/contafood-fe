var baseUrl = "/contafood-be/";

$(document).ready(function() {

	$('#listiniTable').DataTable({
		"processing": true,
        //"serverSide": true,
		"ajax": {
			"url": baseUrl + "listini",
			"type": "GET",
			"content-type": "json",
			"cache": false,
			"dataSrc": "",
			"error": function(jqXHR, textStatus, errorThrown) {
				console.log('Response text: ' + jqXHR.responseText);
				var alertContent = '<div id="alertListinoContent" class="alert alert-danger alert-dismissible fade show" role="alert">';
				alertContent = alertContent + '<strong>Errore nel recupero dei listini</strong>\n' +
					'            <button type="button" class="close" data-dismiss="alert" aria-label="Close"><span aria-hidden="true">&times;</span></button></div>';
				$('#alertListino').empty().append(alertContent);
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
			"emptyTable": "Nessun listino disponibile",
			"zeroRecords": "Nessun listino disponibile",
			"processing": "<i class='fas fa-spinner fa-spin'></i>"
		},
		"pageLength": 20,
		"lengthChange": false,
		"info": false,
		"autoWidth": false,
		"order": [
			[0, 'asc'],
            [1, 'asc']
		],
		"columns": [
            {"name": "tipologia", "data": "tipologia", "visible": false},
		    {"name": "nome", "data": "nome"},
			{"data": null, "orderable":false, "width":"15%", render: function ( data, type, row ) {
				var links = '<a class="detailsListino pr-2" data-id="'+data.id+'" href="#"><i class="fas fa-info-circle"></i></a>';
				links = links + '<a class="updateListino pr-2" data-id="'+data.id+'" href="listini-edit.html?idListino=' + data.id + '"><i class="far fa-edit"></i></a>';
				links = links + '<a class="refreshListino pr-2" data-id="'+data.id+'" href="listini-refresh.html?idListino=' + data.id + '"><i class="fas fa-sync"></i></a>';
				links = links + '<a class="deleteListino" data-id="'+data.id+'" href="#"><i class="far fa-trash-alt"></i></a>';
				return links;
			}}
		],
        "createdRow": function(row, data, dataIndex){
            if(data.tipologia == 'BASE'){
                $(row).addClass("listinoBaseRow");
            }
        }
	});

	$(document).on('click','.deleteListino', function(){
		var idListino = $(this).attr('data-id');
		$('#confirmDeleteListino').attr('data-id', idListino);
		$('#deleteListinoModal').modal('show');
	});

	$(document).on('click','#confirmDeleteListino', function(){
		$('#deleteListinoModal').modal('hide');
		var idListino = $(this).attr('data-id');

		$.ajax({
			url: baseUrl + "listini/" + idListino,
			type: 'DELETE',
			success: function() {
				var alertContent = '<div id="alertListinoContent" class="alert alert-success alert-dismissible fade show" role="alert">';
				alertContent = alertContent + '<strong>Listino</strong> cancellato con successo.\n' +
					'            <button type="button" class="close" data-dismiss="alert" aria-label="Close"><span aria-hidden="true">&times;</span></button></div>';
				$('#alertListino').empty().append(alertContent);

				$('#listiniTable').DataTable().ajax.reload();
			},
			error: function(jqXHR, textStatus, errorThrown) {
				console.log('Response text: ' + jqXHR.responseText);

				var alertContent = '<div id="alertListinoContent" class="alert alert-danger alert-dismissible fade show" role="alert">';
                alertContent = alertContent + '<strong>Errore</strong> nella cancellazione del listino' +
                    '            <button type="button" class="close" data-dismiss="alert" aria-label="Close"><span aria-hidden="true">&times;</span></button></div>';
                $('#alertListino').empty().append(alertContent);

                $('#listiniTable').DataTable().ajax.reload();
			}
		});
	});

    $(document).on('click','.detailsListino', function(){
        var idListino = $(this).attr('data-id');

        var alertContent = '<div id="alertFornitoreContent" class="alert alert-danger alert-dismissible fade show" role="alert">';
        alertContent = alertContent + '<strong>Errore nel recupero del listino.</strong></div>';

        $('#detailsListinoModal').modal('show');

        $('#detailsListinoModalTable').DataTable({
            "ajax": {
                "url": baseUrl + "listini/" + idListino + '/listini-prezzi',
                "type": "GET",
                "content-type": "json",
                "cache": false,
                "dataSrc": "",
                "error": function(jqXHR, textStatus, errorThrown) {
                    $('#detailsListinoMainDiv').append(alertContent);
                }
            },
            "language": {
                "search": "Cerca",
                "emptyTable": "Nessun listino prezzo disponibile",
                "zeroRecords": "Nessun listino prezzo disponibile"
            },
            "paging": false,
            "lengthChange": false,
            "info": false,
            "order": [
                [0,'asc'],
                [1,'asc']
            ],
            "autoWidth": false,
            "columns": [
                {"name": "articolo", "data": null, render: function ( data, type, row ) {
                    var result = '';
                    if(data.articolo != null){
                        result = data.articolo.codice + ' - ' + data.articolo.descrizione;
                    }
                    return result;
                }},
                {"name": "fornitore", "data": null,  render: function ( data, type, row ) {
                    var result = '';
                    if(data.articolo != null){
                        if(data.articolo.fornitore != null){
                            result = data.articolo.fornitore.codice + ' - ' + data.articolo.fornitore.ragioneSociale;
                        }
                    }
                    return result;
                }},
                {"name": "prezzo", "data": "prezzo"}
            ]
        });
    });

    $(document).on('click','.closeDetailsListino', function(){
    		$('#detailsListinoModalTable').DataTable().destroy();
    		$('#detailsListinoModal').modal('hide');
    	});

	if($('#updateListinoButton') != null && $('#updateListinoButton') != undefined){
		$('#articoloVariazione').selectpicker();

		$(document).on('submit','#updateListinoForm', function(event){
			event.preventDefault();

			var listino = new Object();
			listino.id = $('#hiddenIdListino').val();
			listino.nome = $('#nome').val();
			var tipologia = $('input[name="tipologia"]:checked').val();
			listino.tipologia = tipologia;
			if(tipologia != null && tipologia == 'STANDARD'){
				if($('#tipologiaVariazionePrezzo option:selected').val() != '-1'){
					listino.tipologiaVariazionePrezzo = $('#tipologiaVariazionePrezzo option:selected').val();
					listino.variazionePrezzo = $('#variazionePrezzo').val();
					if($('#categoriaArticoloVariazione option:selected').val() != '-1'){
						var categoriaArticoloVariazione = new Object();
						categoriaArticoloVariazione.id = $('#categoriaArticoloVariazione option:selected').val();
						listino.categoriaArticoloVariazione = categoriaArticoloVariazione;
					} else {
						listino.categoriaArticoloVariazione = null;
					}
					if($('#fornitoreVariazione option:selected').val() != '-1'){
						var fornitoreVariazione = new Object();
						fornitoreVariazione.id = $('#fornitoreVariazione option:selected').val();
						listino.fornitoreVariazione = fornitoreVariazione;
					} else {
						listino.fornitoreVariazione = null;
					}
				} else {
					listino.tipologiaVariazionePrezzo = null;
					listino.variazionePrezzo = null;
					listino.categoriaArticoloVariazione = null;
					listino.fornitoreVariazione = null;
				}
			} else {
				listino.tipologiaVariazionePrezzo = null;
				listino.variazionePrezzo = null;
				listino.categoriaArticoloVariazione = null;
				listino.fornitoreVariazione = null;
			}

			var listinoJson = JSON.stringify(listino);

			var alertContent = '<div id="alertListinoContent" class="alert alert-@@alertResult@@ alert-dismissible fade show" role="alert">';
			alertContent = alertContent + '<strong>@@alertText@@</strong>\n' +
				'<button type="button" class="close" data-dismiss="alert" aria-label="Close"><span aria-hidden="true">&times;</span></button></div>';

			$.ajax({
				url: baseUrl + "listini/" + $('#hiddenIdListino').val(),
				type: 'PUT',
				contentType: "application/json",
				dataType: 'json',
				data: listinoJson,
				success: function(result) {
					$('#alertListino').empty().append(alertContent.replace('@@alertText@@','Listino modificato con successo').replace('@@alertResult@@', 'success'));
				},
				error: function(jqXHR, textStatus, errorThrown) {
					var exceptionMessage = jqXHR.responseJSON.message;
					var errorMessage = 'Errore nella modifica del listino';
					if(exceptionMessage.indexOf("a listino with type") != -1){
                        errorMessage += '. Esiste gia un listino base'
                    }
				    $('#alertListino').empty().append(alertContent.replace('@@alertText@@',errorMessage).replace('@@alertResult@@', 'danger'));
				}
			});
		});
	}

	if($('#newListinoButton') != null && $('#newListinoButton') != undefined){
		$('#articoloVariazione').selectpicker();

		$(document).on('submit','#newListinoForm', function(event){
			event.preventDefault();

			var listino = new Object();
            listino.nome = $('#nome').val();
            var tipologia = $('input[name="tipologia"]:checked').val();
            listino.tipologia = tipologia;
			if(tipologia != null && tipologia == 'STANDARD'){
				if($('#tipologiaVariazionePrezzo option:selected').val() != '-1'){
					listino.tipologiaVariazionePrezzo = $('#tipologiaVariazionePrezzo option:selected').val();
				}
				listino.variazionePrezzo = $('#variazionePrezzo').val();
				if($('#categoriaArticoloVariazione option:selected').val() != '-1'){
					var categoriaArticoloVariazione = new Object();
					categoriaArticoloVariazione.id = $('#categoriaArticoloVariazione option:selected').val();
					listino.categoriaArticoloVariazione = categoriaArticoloVariazione;
				}
				if($('#fornitoreVariazione option:selected').val() != '-1'){
					var fornitoreVariazione = new Object();
					fornitoreVariazione.id = $('#fornitoreVariazione option:selected').val();
					listino.fornitoreVariazione = fornitoreVariazione;
				}
			}

			var listinoJson = JSON.stringify(listino);

			var alertContent = '<div id="alertListinoContent" class="alert alert-@@alertResult@@ alert-dismissible fade show" role="alert">';
			alertContent = alertContent + '<strong>@@alertText@@</strong>\n' +
				'<button type="button" class="close" data-dismiss="alert" aria-label="Close"><span aria-hidden="true">&times;</span></button></div>';

			$.ajax({
				url: baseUrl + "listini",
				type: 'POST',
				contentType: "application/json",
				dataType: 'json',
				data: listinoJson,
				success: function(result) {
					$('#alertListino').empty().append(alertContent.replace('@@alertText@@','Listino creato con successo').replace('@@alertResult@@', 'success'));
				},
				error: function(jqXHR, textStatus, errorThrown) {
					$('#alertListino').empty().append(alertContent.replace('@@alertText@@','Errore nella creazione del listino').replace('@@alertResult@@', 'danger'));
				}
			});
		});
	}

	if($('#refreshListinoButton') != null && $('#refreshListinoButton') != undefined){
		$('#articoloVariazione').selectpicker();

		$(document).on('submit','#refreshListinoForm', function(event){
			event.preventDefault();

			var listino = new Object();
			listino.id = $('#hiddenIdListino').val();
			listino.nome = $('#hiddenNomeListino').val();
			var tipologia = $('#hiddenTipologiaListino').val();
			listino.tipologia = tipologia;
			if(tipologia != null && tipologia == 'STANDARD'){
				if($('#tipologiaVariazionePrezzo option:selected').val() != '-1'){
					listino.tipologiaVariazionePrezzo = $('#tipologiaVariazionePrezzo option:selected').val();
					listino.variazionePrezzo = $('#variazionePrezzo').val();
					if($('#categoriaArticoloVariazione option:selected').val() != '-1'){
						var categoriaArticoloVariazione = new Object();
						categoriaArticoloVariazione.id = $('#categoriaArticoloVariazione option:selected').val();
						listino.categoriaArticoloVariazione = categoriaArticoloVariazione;
					} else {
						listino.categoriaArticoloVariazione = null;
					}
					if($('#fornitoreVariazione option:selected').val() != '-1'){
						var fornitoreVariazione = new Object();
						fornitoreVariazione.id = $('#fornitoreVariazione option:selected').val();
						listino.fornitoreVariazione = fornitoreVariazione;
					} else {
						listino.fornitoreVariazione = null;
					}
				} else {
					listino.tipologiaVariazionePrezzo = null;
					listino.variazionePrezzo = null;
					listino.categoriaArticoloVariazione = null;
					listino.fornitoreVariazione = null;
				}
			} else {
				listino.tipologiaVariazionePrezzo = null;
				listino.variazionePrezzo = null;
				listino.categoriaArticoloVariazione = null;
				listino.fornitoreVariazione = null;
			}

			var listinoJson = JSON.stringify(listino);

			var alertContent = '<div id="alertListinoContent" class="alert alert-@@alertResult@@ alert-dismissible fade show" role="alert">';
			alertContent = alertContent + '<strong>@@alertText@@</strong>\n' +
				'<button type="button" class="close" data-dismiss="alert" aria-label="Close"><span aria-hidden="true">&times;</span></button></div>';

			$.ajax({
				url: baseUrl + "listini/" + $('#hiddenIdListino').val(),
				type: 'PUT',
				contentType: "application/json",
				dataType: 'json',
				data: listinoJson,
				success: function(result) {
					$('#alertListino').empty().append(alertContent.replace('@@alertText@@','Listino modificato con successo').replace('@@alertResult@@', 'success'));
				},
				error: function(jqXHR, textStatus, errorThrown) {
					var exceptionMessage = jqXHR.responseJSON.message;
					var errorMessage = 'Errore nella modifica del listino';
					if(exceptionMessage.indexOf("a listino with type") != -1){
						errorMessage += '. Esiste gia un listino base'
					}
					$('#alertListino').empty().append(alertContent.replace('@@alertText@@',errorMessage).replace('@@alertResult@@', 'danger'));
				}
			});
		});
	}
});

$(document).on('change','input[name="tipologia"]', function(){
	var tipologia = $('input[name="tipologia"]:checked').val();

	if(tipologia == 'BASE'){
		$('#tipologiaVariazionePrezzo').parent().addClass('d-none');
		$('#variazionePrezzo').parent().addClass('d-none');
		$('#categoriaArticoloVariazione').parent().addClass('d-none');
		$('#fornitoreVariazione').parent().addClass('d-none');
	} else {
		$('#tipologiaVariazionePrezzo').parent().removeClass('d-none');
		$('#variazionePrezzo').parent().removeClass('d-none');
		$('#categoriaArticoloVariazione').parent().removeClass('d-none');
		$('#fornitoreVariazione').parent().removeClass('d-none');

	}
	$('#tipologiaVariazionePrezzo option[value="-1"]').attr('selected',true);
	$('#variazionePrezzo').val(null);
	$('#categoriaArticoloVariazione option[value="-1"]').attr('selected',true);
	$('#fornitoreVariazione option[value="-1"]').attr('selected',true);

});

$(document).on('change','#tipologiaVariazionePrezzo', function(){
	var tipologiaVariazionePrezzo = $('#tipologiaVariazionePrezzo option:selected').val();
	var label = $('label[for=variazionePrezzo]').text();
	label = label.replace(' (€)', '');
	label = label.replace(' (%)', '');
	if(tipologiaVariazionePrezzo != '-1'){
		if(tipologiaVariazionePrezzo == 'EURO'){
			label += ' (€)';
		} else {
			label += ' (%)';
		}
	}
	$('label[for=variazionePrezzo]').text(label);
});

$(document).on('change','#fornitoreVariazione', function(){
    $('#loadingDiv').removeClass('d-none');
    var fornitore = $('#fornitoreVariazione option:selected').val();
    if(fornitore != null && fornitore != ''){
        $.ajax({
            url: baseUrl + "fornitori/"+fornitore+"/articoli",
            type: 'GET',
            dataType: 'json',
            success: function(result) {
                if(result != null && result != undefined && result != ''){
                    $.each(result, function(i, item){
                        var label = item.codice+'-'+item.descrizione;
                        $('#articoloVariazione').append('<option value="'+item.id+'">'+label+'</option>');
                    });
                }
                $('#articoloVariazione').removeAttr('disabled');
                $('#loadingDiv').addClass('d-none');
            },
            error: function(jqXHR, textStatus, errorThrown) {
                $('#alertListino').empty().append(alertContent.replace('@@alertText@@','Errore nel caricamento degli articoli').replace('@@alertResult@@', 'danger'));
            }
        });

    } else {
        $('#articoloVariazione').empty();
        $('#articoloVariazione').append('<option value="-1">Tutti gli articoli</option>');
        $('#articoloVariazione').attr('disabled', true);
        $('#loadingDiv').addClass('d-none');
    }

});

$.fn.extractIdListinoFromUrl = function(){
    var pageUrl = window.location.search.substring(1);

	var urlVariables = pageUrl.split('&'),
        paramNames,
        i;

    for (i = 0; i < urlVariables.length; i++) {
        paramNames = urlVariables[i].split('=');

        if (paramNames[0] === 'idListino') {
        	return paramNames[1] === undefined ? null : decodeURIComponent(paramNames[1]);
        }
    }
}

$.fn.getTipologieVariazioniPrezzo = function(){
	$.ajax({
		url: baseUrl + "utils/tipologie-listini-prezzi-variazioni",
		type: 'GET',
		dataType: 'json',
		success: function(result) {
			if(result != null && result != undefined && result != ''){
				$.each(result, function(i, item){
					$('#tipologiaVariazionePrezzo').append('<option value="'+item+'">'+item+'</option>');
				});
			}
		},
		error: function(jqXHR, textStatus, errorThrown) {
			console.log('Response text: ' + jqXHR.responseText);
		}
	});
}

$.fn.getArticoli = function(){
	$.ajax({
		url: baseUrl + "articoli",
		type: 'GET',
		dataType: 'json',
		success: function(result) {
			if(result != null && result != undefined && result != ''){
				$.each(result, function(i, item){
					$('#articoloVariazione').append('<option value="'+item.id+'">'+item.codice+' '+item.descrizione+'</option>');
				});
			}
		},
		error: function(jqXHR, textStatus, errorThrown) {
			console.log('Response text: ' + jqXHR.responseText);
		}
	});
}

$.fn.getFornitori = function(){
	$.ajax({
		url: baseUrl + "fornitori",
		type: 'GET',
		dataType: 'json',
		success: function(result) {
			if(result != null && result != undefined && result != ''){
				$.each(result, function(i, item){
					$('#fornitoreVariazione').append('<option value="'+item.id+'">'+item.codice+' - '+item.ragioneSociale+'</option>');
				});
			}
		},
		error: function(jqXHR, textStatus, errorThrown) {
			console.log('Response text: ' + jqXHR.responseText);
		}
	});
}

$.fn.getListino = function(idListino, withRecap){

	var alertContent = '<div id="alertListinoContent" class="alert alert-danger alert-dismissible fade show" role="alert">';
	alertContent = alertContent + '<strong>Errore nel recupero del listino.</strong>\n' +
    					'<button type="button" class="close" data-dismiss="alert" aria-label="Close"><span aria-hidden="true">&times;</span></button></div>';

	if(withRecap){
		$.ajax({
			url: baseUrl + "listini/" + idListino,
			type: 'GET',
			dataType: 'json',
			success: function(result) {
				if(result != null && result != undefined && result != '') {

					var listinoRow = '<td>'+result.nome+'</td>';
					listinoRow = listinoRow + '<td>'+result.tipologia+'</td>';

					$('#listinoRow').append(listinoRow);

					$('#hiddenNomeListino').attr('value', result.nome);
					$('#hiddenTipologiaListino').attr('value', result.tipologia);
				}
			},
			error: function(jqXHR, textStatus, errorThrown) {
				$('#alertListino').empty().append(alertContent);
				console.log('Response text: ' + jqXHR.responseText);
			}
		});
	}

    $.ajax({
        url: baseUrl + "listini/" + idListino,
        type: 'GET',
        dataType: 'json',
        success: function(result) {
          if(result != null && result != undefined && result != ''){

			$('#hiddenIdListino').attr('value', result.id);
			$('#nome').attr('value', result.nome);
            if(result.tipologia == 'BASE'){
                $('#tipologiaBase').attr('checked', true);

				$('#tipologiaVariazionePrezzo').parent().addClass('d-none');
				$('#variazionePrezzo').parent().addClass('d-none');
				$('#categoriaArticoloVariazione').parent().addClass('d-none');
				$('#fornitoreVariazione').parent().addClass('d-none');

				$('#tipologiaVariazionePrezzo option[value="-1"]').attr('selected',true);
				$('#variazionePrezzo').val(null);
				$('#categoriaArticoloVariazione option[value="-1"]').attr('selected',true);
				$('#fornitoreVariazione option[value="-1"]').attr('selected',true);
            } else {
                $('#tipologiaStandard').attr('checked', true);

				if(result.tipologiaVariazionePrezzo != null){
					$('#tipologiaVariazionePrezzo option[value="'+result.tipologiaVariazionePrezzo+'"]').attr('selected',true);
				} else {
					$('#tipologiaVariazionePrezzo option[value="-1"]').attr('selected',true);
				}
				$('#variazionePrezzo').attr('value',result.variazionePrezzo);
				if(result.categoriaArticoloVariazione != null){
					$('#categoriaArticoloVariazione option[value="'+result.categoriaArticoloVariazione.id+'"]').attr('selected',true);
				} else {
					$('#categoriaArticoloVariazione option[value="-1"]').attr('selected',true);
				}
				if(result.fornitoreVariazione != null){
					$('#fornitoreVariazione option[value="'+result.fornitoreVariazione.id+'"]').attr('selected',true);
				} else {
					$('#fornitoreVariazione option[value="-1"]').attr('selected',true);
				}
			}

          } else{
            $('#alertListino').empty().append(alertContent);
          }
        },
        error: function(jqXHR, textStatus, errorThrown) {
            $('#alertListino').empty().append(alertContent);
            $('#updateListinoButton').attr('disabled', true);
            console.log('Response text: ' + jqXHR.responseText);
        }
    });
}
