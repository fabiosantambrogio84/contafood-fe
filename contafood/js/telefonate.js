var baseUrl = "/contafood-be/";

$(document).ready(function() {

    $('[data-toggle="tooltip"]').tooltip();

	$('#telefonateTable').DataTable({
		"processing": true,
		"ajax": {
			"url": baseUrl + "telefonate",
			"type": "GET",
			"content-type": "json",
			"cache": false,
			"dataSrc": "",
			"error": function(jqXHR, textStatus, errorThrown) {
				console.log('Response text: ' + jqXHR.responseText);
				var alertContent = '<div id="alertTelefonataContent" class="alert alert-danger alert-dismissible fade show" role="alert">';
				alertContent = alertContent + '<strong>Errore nel recupero delle telefonate</strong>\n' +
					'            <button type="button" class="close" data-dismiss="alert" aria-label="Close"><span aria-hidden="true">&times;</span></button></div>';
				$('#alertTelefonata').empty().append(alertContent);
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
			"emptyTable": "Nessuna telefonata disponibile",
			"zeroRecords": "Nessuna telefonata disponibile"
		},
		"pageLength": 20,
		"lengthChange": false,
		"info": false,
		"autoWidth": false,
		"order": [
			[1, 'asc']
		],
		"columns": [
			{"data": null, "orderable":false, "width": "2%", render: function ( data, type, row ) {
				var checkboxHtml = '<input type="checkbox" data-id="'+data.id+'" id="checkbox_'+data.id+'" class="deleteTelefonataCheckbox">';
				return checkboxHtml;
			}},
			{"name": "cliente", "data": null, render: function ( data, type, row ) {
                if(data.cliente != null){
                    var clienteHtml = '';

                    if(data.cliente.dittaIndividuale){
                        clienteHtml += data.cliente.cognome + ' - ' + data.cliente.nome;
                    } else {
                        clienteHtml += data.cliente.ragioneSociale;
                    }
                    clienteHtml += ' - ' + data.cliente.partitaIva;
                    return clienteHtml;
                } else {
                    return '';
                }
			}},
			{"name": "puntoConsegna", "data": null, render: function ( data, type, row ) {
                if(data.puntoConsegna != null){
                    var puntoConsegnaHtml = data.puntoConsegna.nome;
                    if(data.puntoConsegna.indirizzo != null && data.puntoConsegna.indirizzo != ''){
                        puntoConsegnaHtml += ' - '+data.puntoConsegna.indirizzo;
                    }
                    if(data.puntoConsegna.localita != null && data.puntoConsegna.localita != ''){
                        puntoConsegnaHtml += ', '+data.puntoConsegna.localita;
                    }
                    if(data.puntoConsegna.provincia != null && data.puntoConsegna.provincia != ''){
                        puntoConsegnaHtml += ' ('+data.puntoConsegna.provincia+')';
                    }
                    return puntoConsegnaHtml;
                } else {
                    return '';
                }
			}},
			{"name": "recapito", "data": null, render: function ( data, type, row ) {
                var recapitoHtml = data.telefono;
                if(data.telefonoTwo != null && data.telefonoTwo != ''){
                    recapitoHtml += ', '+data.telefonoTwo;
                }
                if(data.telefonoThree != null && data.telefonoThree != ''){
                    recapitoHtml += ', '+data.telefonoThree;
                }
                return recapitoHtml;
			}},
			{"name": "giorno", "data": "giorno"},
			{"name": "ora", "data": "ora"},
			{"name": "note", "data": null, render: function ( data, type, row ) {
                var note = data.note;
                var noteTrunc = note;
                if(note.length > 30){
                    noteTrunc = note.substring(0, 30)+'...';
                }
                var noteHtml = '<div data-toggle="tooltip" data-placement="bottom" title="'+note+'">'+noteTrunc+'</div>';

                $('[data-toggle="tooltip"]').tooltip();
			     //<button type="button" class="btn btn-secondary" data-toggle="tooltip" data-placement="bottom" title="Tooltip on bottom">
                 //    Tooltip on bottom
                 //  </button>

					return noteHtml;
			}},
			{"data": null, "orderable":false, "width":"10%", render: function ( data, type, row ) {
				var links = '<a class="detailsTelefonata pr-2" data-id="'+data.id+'" href="#"><i class="fas fa-info-circle" title="Dettagli"></i></a>';
				links += '<a class="updateTelefonata pr-2" data-id="'+data.id+'" href="telefonata-edit.html?idTelefonata=' + data.id + '"><i class="far fa-edit"></i></a>';
				links += '<a class="deleteTelefonata" data-id="'+data.id+'" href="#"><i class="far fa-trash-alt"></i></a>';
				return links;
			}}
		]
	});

	$(document).on('click','.detailsTelefonata', function(){
		var idTelefonata = $(this).attr('data-id');

		var alertContent = '<div id="alertTelefonataContent" class="alert alert-danger alert-dismissible fade show" role="alert">';
		alertContent = alertContent + '<strong>Errore nel recupero della telefonata.</strong></div>';

		$.ajax({
			url: baseUrl + "telefonate/" + idTelefonata,
			type: 'GET',
			dataType: 'json',
			success: function(result) {
				if(result != null && result != undefined && result != ''){
					var cliente = '<p><strong>Cliente: </strong>';
					if(result.cliente != null){
						var clienteHtml = '';
						if(result.cliente.dittaIndividuale){
							clienteHtml += result.cliente.cognome + ' - ' + result.cliente.nome;
						} else {
							clienteHtml += result.cliente.ragioneSociale;
						}
						clienteHtml += ' - ' + result.cliente.partitaIva;
					}
					cliente += $.fn.printVariable(clienteHtml)+'</p>';

					var puntoConsegna = '<p><strong>Punto consegna: </strong>';
					if(result.puntoConsegna != null){
						var puntoConsegnaHtml = result.puntoConsegna.nome;
						if(result.puntoConsegna.indirizzo != null && result.puntoConsegna.indirizzo != ''){
							puntoConsegnaHtml += ' - '+result.puntoConsegna.indirizzo;
						}
						if(result.puntoConsegna.localita != null && result.puntoConsegna.localita != ''){
							puntoConsegnaHtml += ', '+result.puntoConsegna.localita;
						}
						if(result.puntoConsegna.cap != null && result.puntoConsegna.cap != ''){
                            puntoConsegnaHtml += ' '+result.puntoConsegna.cap;
                        }
						if(result.puntoConsegna.provincia != null && result.puntoConsegna.provincia != ''){
							puntoConsegnaHtml += ' ('+result.puntoConsegna.provincia+')';
						}
					}
					puntoConsegna += $.fn.printVariable(puntoConsegnaHtml)+'</p>';

					var contentDetails = cliente + puntoConsegna;
					contentDetails += '<p><strong>Telefono: </strong>'+$.fn.printVariable(result.telefono)+'</p>';
					contentDetails += '<p><strong>Telefono 2: </strong>'+$.fn.printVariable(result.telefonoTwo)+'</p>';
					contentDetails += '<p><strong>Telefono 3: </strong>'+$.fn.printVariable(result.telefonoThree)+'</p>';
					contentDetails += '<p><strong>Giorno </strong>'+$.fn.printVariable(result.giorno)+'</p>';
					contentDetails += '<p><strong>Ora: </strong>'+$.fn.printVariable(result.ora)+'</p>';
					contentDetails += '<p><strong>Note: </strong>'+$.fn.printVariable(result.note)+'</p>';

					$('#detailsTelefonataMainDiv').empty().append(contentDetails);

				} else{
					$('#detailsTelefonataMainDiv').empty().append(alertContent);
				}
			},
			error: function(jqXHR, textStatus, errorThrown) {
				$('#detailsTelefonataMainDiv').append(alertContent);
				console.log('Response text: ' + jqXHR.responseText);
			}
		});

		$('#detailsTelefonataModal').modal('show');
	});

	$(document).on('click','.deleteTelefonata', function(){
		var idTelefonata = $(this).attr('data-id');
		$('#confirmDeleteTelefonata').attr('data-id', idTelefonata);
		$('#deleteTelefonataModal').modal('show');
	});

	$(document).on('click','#confirmDeleteTelefonata', function(){
		$('#deleteTelefonataModal').modal('hide');
		var idTelefonata = $(this).attr('data-id');

		$.ajax({
			url: baseUrl + "telefonate/" + idTelefonata,
			type: 'DELETE',
			success: function() {
				var alertContent = '<div id="alertTelefonataContent" class="alert alert-success alert-dismissible fade show" role="alert">';
				alertContent = alertContent + '<strong>Telefonata</strong> cancellato con successo.\n' +
					'            <button type="button" class="close" data-dismiss="alert" aria-label="Close"><span aria-hidden="true">&times;</span></button></div>';
				$('#alertTelefonata').empty().append(alertContent);

				$('#telefonateTable').DataTable().ajax.reload();
			},
			error: function(jqXHR, textStatus, errorThrown) {
				console.log('Response text: ' + jqXHR.responseText);

				var alertContent = '<div id="alertTelefonataContent" class="alert alert-danger alert-dismissible fade show" role="alert">';
                alertContent = alertContent + '<strong>Errore</strong> nella cancellazione della telefonata' +
                    '            <button type="button" class="close" data-dismiss="alert" aria-label="Close"><span aria-hidden="true">&times;</span></button></div>';
                $('#alertTelefonata').empty().append(alertContent);

                $('#telefonateTable').DataTable().ajax.reload();
			}
		});
	});

    $(document).on('click','#deleteTelefonateBulk', function(){
		$('#deleteTelefonateBulkModal').modal('show');
	});

	$(document).on('click','#confirmDeleteTelefonateBulk', function(){
		$('#deleteTelefonateBulkModal').modal('hide');

		var alertContent = '<div id="alertTelefonataContent" class="alert alert-@@alertResult@@ alert-dismissible fade show" role="alert">';
        alertContent = alertContent + '<strong>@@alertText@@</strong>\n' +
            '<button type="button" class="close" data-dismiss="alert" aria-label="Close"><span aria-hidden="true">&times;</span></button></div>';

		var numChecked = $('.deleteTelefonataCheckbox:checkbox:checked').length;
		if(numChecked == null || numChecked == undefined || numChecked == 0){
			var alertContent = '<div id="alertTelefonataContent" class="alert alert-danger alert-dismissible fade show" role="alert">';
			alertContent = alertContent + '<strong>Selezionare almeno una telefonata</strong>\n' +
				'            <button type="button" class="close" data-dismiss="alert" aria-label="Close"><span aria-hidden="true">&times;</span></button></div>';
			$('#alertTelefonata').empty().append(alertContent);
		} else{
			var telefonateIds = [];
			$('.deleteTelefonataCheckbox:checkbox:checked').each(function(i, item) {
				var id = item.id.replace('checkbox_', '');
                telefonateIds.push(id);
			});
            $.ajax({
                url: baseUrl + "telefonate/operations/delete",
                type: 'POST',
                contentType: "application/json",
                dataType: 'json',
                data: JSON.stringify(telefonateIds),
                success: function(result) {
                    $('#alertTelefonata').empty().append(alertContent.replace('@@alertText@@','Telefonate cancellate con successo').replace('@@alertResult@@', 'success'));

                    $('#telefonateTable').DataTable().ajax.reload();
                },
                error: function(jqXHR, textStatus, errorThrown) {
                    $('#alertTelefonata').empty().append(alertContent.replace('@@alertText@@','Errore nella cancellazione delle telefonate').replace('@@alertResult@@', 'danger'));
                }
            });
		}
	});

	$(document).on('change','#cliente', function(){
        $('#loadingDiv').removeClass('d-none');
        var cliente = $('#cliente option:selected').val();
        if(cliente != null && cliente != ''){
            $.ajax({
                url: baseUrl + "clienti/"+cliente+"/punti-consegna",
                type: 'GET',
                dataType: 'json',
                success: function(result) {
                    if(result != null && result != undefined && result != ''){
                        $.each(result, function(i, item){
                            var label = item.nome+' - '+item.indirizzo+' '+item.localita+', '+item.cap+'('+item.provincia+')';
                            $('#puntoConsegna').append('<option value="'+item.id+'">'+label+'</option>');
                        });
                    }
                    $('#puntoConsegna').removeAttr('disabled');
                    $('#loadingDiv').addClass('d-none');
                },
                error: function(jqXHR, textStatus, errorThrown) {
                    $('#alertTelefonata').empty().append(alertContent.replace('@@alertText@@','Errore nel caricamento dei punti di consegna').replace('@@alertResult@@', 'danger'));
                }
            });

        } else {
            $('#puntoConsegna').empty();
            $('#puntoConsegna').attr('disabled', true);
            $('#loadingDiv').addClass('d-none');
        }

    });

	if($('#updateTipoPagamentoButton') != null && $('#updateTipoPagamentoButton') != undefined){
		$(document).on('submit','#updateTipoPagamentoForm', function(event){
			event.preventDefault();

			var tipoPagamento = new Object();
			tipoPagamento.id = $('#hiddenIdTipoPagamento').val();
			tipoPagamento.descrizione = $('#descrizione').val();
			tipoPagamento.scadenzaGiorni = $('#scadenzaGiorni').val();

			var tipoPagamentoJson = JSON.stringify(tipoPagamento);

			var alertContent = '<div id="alertTelefonataContent" class="alert alert-@@alertResult@@ alert-dismissible fade show" role="alert">';
			alertContent = alertContent + '<strong>@@alertText@@</strong>\n' +
				'<button type="button" class="close" data-dismiss="alert" aria-label="Close"><span aria-hidden="true">&times;</span></button></div>';

			$.ajax({
				url: baseUrl + "tipi-pagamento/" + $('#hiddenIdTipoPagamento').val(),
				type: 'PUT',
				contentType: "application/json",
				dataType: 'json',
				data: tipoPagamentoJson,
				success: function(result) {
					$('#alertTelefonata').empty().append(alertContent.replace('@@alertText@@','Tipo pagamento modificato con successo').replace('@@alertResult@@', 'success'));
				},
				error: function(jqXHR, textStatus, errorThrown) {
					$('#alertTelefonata').empty().append(alertContent.replace('@@alertText@@','Errore nella modifica del tipo pagamento').replace('@@alertResult@@', 'danger'));
				}
			});
		});
	}

	if($('#newTelefonataButton') != null && $('#newTelefonataButton') != undefined){
		$(document).on('submit','#newTelefonataForm', function(event){
			event.preventDefault();

			var telefonata = new Object();

			var clienteId = $('#cliente option:selected').val();
			if(clienteId != null && clienteId != ''){
			    var cliente = new Object();
                cliente.id = clienteId;
                telefonata.cliente = cliente;
			}
			var puntoConsegnaId = $('#puntoConsegna option:selected').val();
			if(puntoConsegnaId != null && puntoConsegnaId != ''){
			    var puntoConsegna = new Object();
			    puntoConsegna.id = puntoConsegnaId;
			    telefonata.puntoConsegna = puntoConsegna;
			}
			telefonata.telefono = $('#telefono').val();
			telefonata.telefonoTwo = $('#telefono2').val();
			telefonata.telefonoThree = $('#telefono3').val();
			telefonata.giorno = $('#giorno option:selected').text();
			telefonata.giornoOrdinale = $('#giorno option:selected').val();

			var ora = $('#ora').val();
			var regex = /:/g;
            var count = ora.match(regex);
            count = (count) ? count.length : 0;
            if(count == 1){
                telefonata.ora = $('#ora').val() + ':00';
            } else {
                telefonata.ora = $('#ora').val();
            }

			telefonata.note = $('#note').val();

			var telefonataJson = JSON.stringify(telefonata);

			var alertContent = '<div id="alertTelefonataContent" class="alert alert-@@alertResult@@ alert-dismissible fade show" role="alert">';
			alertContent = alertContent + '<strong>@@alertText@@</strong>\n' +
				'<button type="button" class="close" data-dismiss="alert" aria-label="Close"><span aria-hidden="true">&times;</span></button></div>';

			$.ajax({
				url: baseUrl + "telefonate",
				type: 'POST',
				contentType: "application/json",
				dataType: 'json',
				data: telefonataJson,
				success: function(result) {
					$('#alertTelefonata').empty().append(alertContent.replace('@@alertText@@','Telefonata creata con successo').replace('@@alertResult@@', 'success'));
				},
				error: function(jqXHR, textStatus, errorThrown) {
					$('#alertTelefonata').empty().append(alertContent.replace('@@alertText@@','Errore nella creazione della telefonata').replace('@@alertResult@@', 'danger'));
				}
			});
		});
	}
});

$.fn.printVariable = function(variable){
	if(variable != null && variable != undefined && variable != ""){
		return variable;
	}
	return "";
}

$.fn.extractIdTelefonataFromUrl = function(){
    var pageUrl = window.location.search.substring(1);

	var urlVariables = pageUrl.split('&'),
        paramNames,
        i;

    for (i = 0; i < urlVariables.length; i++) {
        paramNames = urlVariables[i].split('=');

        if (paramNames[0] === 'idTelefonata') {
        	return paramNames[1] === undefined ? null : decodeURIComponent(paramNames[1]);
        }
    }
}

$.fn.getClienti = function(){
	$.ajax({
		url: baseUrl + "clienti",
		type: 'GET',
		dataType: 'json',
		success: function(result) {
			if(result != null && result != undefined && result != ''){
				$.each(result, function(i, item){
					var label = '';
					if(item.dittaIndividuale){
						label += item.cognome + ' - ' + item.nome;
					} else {
						label += item.ragioneSociale;
					}
					label += ' - ' + item.partitaIva + ' - ' + item.codiceFiscale;
					$('#cliente').append('<option value="'+item.id+'">'+label+'</option>');
				});
			}
		},
		error: function(jqXHR, textStatus, errorThrown) {
			console.log('Response text: ' + jqXHR.responseText);
		}
	});
}

$.fn.getGiorniSettimana = function(){
	$.ajax({
		url: baseUrl + "utils/giorni-settimana",
		type: 'GET',
		dataType: 'json',
		success: function(result) {
			if(result != null && result != undefined && result != ''){
				$.each(result, function(i, item){
					$.each(item, function(key, value){
                        $('#giorno').append('<option value="'+key+'">'+value+'</option>');
                    });

				});
			}
		},
		error: function(jqXHR, textStatus, errorThrown) {
			console.log('Response text: ' + jqXHR.responseText);
		}
	});
}

$.fn.getTipoPagamento = function(idTipoPagamento){

	var alertContent = '<div id="alertTelefonataContent" class="alert alert-danger alert-dismissible fade show" role="alert">';
	alertContent = alertContent + '<strong>Errore nel recupero del tipo pagamento.</strong>\n' +
    					'<button type="button" class="close" data-dismiss="alert" aria-label="Close"><span aria-hidden="true">&times;</span></button></div>';

    $.ajax({
        url: baseUrl + "tipi-pagamento/" + idTipoPagamento,
        type: 'GET',
        dataType: 'json',
        success: function(result) {
          if(result != null && result != undefined && result != ''){

			$('#hiddenIdTipoPagamento').attr('value', result.id);
			$('#descrizione').attr('value', result.descrizione);
			$('#scadenzaGiorni').attr('value', result.scadenzaGiorni);

          } else{
            $('#alertTelefonata').empty().append(alertContent);
          }
        },
        error: function(jqXHR, textStatus, errorThrown) {
            $('#alertTelefonata').empty().append(alertContent);
            $('#updateTipoPagamentoButton').attr('disabled', true);
            console.log('Response text: ' + jqXHR.responseText);
        }
    });
}
