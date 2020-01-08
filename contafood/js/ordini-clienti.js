var baseUrl = "/contafood-be/";

$(document).ready(function() {

	$('#ordiniClientiTable').DataTable({
		"ajax": {
			"url": baseUrl + "ordini-clienti",
			"type": "GET",
			"content-type": "json",
			"cache": false,
			"dataSrc": "",
			"error": function(jqXHR, textStatus, errorThrown) {
				console.log('Response text: ' + jqXHR.responseText);
				var alertContent = '<div id="alertOrdineClienteContent" class="alert alert-danger alert-dismissible fade show" role="alert">';
				alertContent = alertContent + '<strong>Errore nel recupero degli ordini clienti</strong>\n' +
					'            <button type="button" class="close" data-dismiss="alert" aria-label="Close"><span aria-hidden="true">&times;</span></button></div>';
				$('#alertOrdineCliente').empty().append(alertContent);
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
			"emptyTable": "Nessun ordine cliente disponibile",
			"zeroRecords": "Nessun ordine cliente disponibile"
		},
		"pageLength": 20,
		"lengthChange": false,
		"info": false,
		"autoWidth": false,
		"order": [
			[0, 'desc']
		],
		"columns": [
			{"name": "codice", "data": "codice"},
			{"name":"cliente", "data": null, render: function ( data, type, row ) {
				if(data.cliente != null){
					var clienteHtml = '';

					if(data.cliente.dittaIndividuale){
						clienteHtml += data.cliente.cognome + ' - ' + data.cliente.nome;
					} else {
						clienteHtml += data.cliente.ragioneSociale;
					}
					return clienteHtml;
				} else {
					return '';
				}
			}},
			{"name":"puntoConsegna", "data": null, render: function ( data, type, row ) {
				if(data.puntoConsegna != null){
					var puntoConsegnaHtml = '';

					if(data.puntoConsegna.indirizzo != null){
						puntoConsegnaHtml += data.puntoConsegna.indirizzo;
					}
					if(data.puntoConsegna.localita != null){
						puntoConsegnaHtml += ' ' + data.puntoConsegna.localita;
					}
					return puntoConsegnaHtml;
				} else {
					return '';
				}
			}},
			{"name": "dataConsegna", "data": null, render: function ( data, type, row ) {
				if(data.dataConsegna != null){
					var a = moment(data.dataConsegna);
					return a.format('DD/MM/YYYY');
				} else {
					return '';
				}
			}},
			{"name":"autista", "data": null, render: function ( data, type, row ) {
				if(data.autista != null){
					var autistaHtml = '';

					if(data.autista.nome){
						autistaHtml += data.autista.nome;
					}
					if(data.autista.cognome){
						autistaHtml += ' ' + data.autista.cognome;
					}
					return autistaHtml;
				} else {
					return '';
				}
			}},
			{"name":"agente", "data": null, render: function ( data, type, row ) {
				if(data.agente != null){
					var agenteHtml = '';

					if(data.agente.nome){
						agenteHtml += data.agente.nome;
					}
					if(data.agente.cognome){
						agenteHtml += ' ' + data.agente.cognome;
					}
					return agenteHtml;
				} else {
					return '';
				}
			}},
			{"data": null, "orderable":false, "width":"5%", render: function ( data, type, row ) {
				var links = '<a class="detailsOrdineCliente pr-2" data-id="'+data.id+'" href="#"><i class="fas fa-info-circle" title="Dettagli"></i></a>';
				links += '<a class="updateOrdineCliente pr-2" data-id="'+data.id+'" href="ordini-clienti-edit.html?idOrdineCliente=' + data.id + '"><i class="far fa-edit"></i></a>';
				links += '<a class="deleteOrdineCliente" data-id="'+data.id+'" href="#"><i class="far fa-trash-alt"></i></a>';
				return links;
			}}
		]
	});

	$(document).on('click','.detailsOrdineCliente', function(){
		var idOrdineCliente = $(this).attr('data-id');

		var alertContent = '<div id="alertOrdineClienteContent" class="alert alert-danger alert-dismissible fade show" role="alert">';
		alertContent = alertContent + '<strong>Errore nel recupero dell ordine cliente.</strong></div>';

		$.ajax({
			url: baseUrl + "ordini-clienti/" + idOrdineCliente,
			type: 'GET',
			dataType: 'json',
			success: function(result) {
				if(result != null && result != undefined && result != ''){

					var codice = '<p><strong>Cliente: </strong>' + $.fn.printVariable(result.codice)+'</p>';

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

					var dataConsegna = '<p><strong>Data consegna: </strong>';
					if(result.dataConsegna){
						dataConsegna += $.fn.printVariable(moment(result.dataConsegna).format('DD/MM/YYYY'))+'</p>';
					}

					var autista = '<p><strong>Autista: </strong>';
					if(result.autista != null){
						var autistaHtml = '';
						if(result.autista.nome != null){
							autistaHtml += result.autista.nome;
						}
						if(result.autista.cognome != null){
							autistaHtml += ' ' + result.autista.cognome;
						}
					}
					autista += $.fn.printVariable(autistaHtml)+'</p>';

					var agente = '<p><strong>Agente: </strong>';
					if(result.agente != null){
						var agenteHtml = '';
						if(result.agente.nome != null){
							agenteHtml += result.agente.nome;
						}
						if(result.agente.cognome != null){
							agenteHtml += ' ' + result.agente.cognome;
						}
					}
					agente += $.fn.printVariable(agenteHtml)+'</p>';

					var note = '<p><strong>Note: </strong>' + $.fn.printVariable(result.note)+'</p>';

					var contentDetails = codice + cliente + puntoConsegna + dataConsegna + autista + agente + note;

					$('#detailsOrdineClienteModal').empty().append(contentDetails);

				} else{
					$('#detailsOrdineClienteModal').empty().append(alertContent);
				}
			},
			error: function(jqXHR, textStatus, errorThrown) {
				$('#detailsOrdineClienteModal').append(alertContent);
				console.log('Response text: ' + jqXHR.responseText);
			}
		});

		$('#detailsOrdineClienteModal').modal('show');
	});


	$(document).on('click','.deleteOrdineCliente', function(){
		var idOrdineCliente = $(this).attr('data-id');
		$('#confirmDeleteOrdineCliente').attr('data-id', idOrdineCliente);
		$('#deleteOrdineClienteModal').modal('show');
	});

	$(document).on('click','#confirmDeleteOrdineCliente', function(){
		$('#deleteOrdineClienteModal').modal('hide');
		var idOrdineCliente = $(this).attr('data-id');

		$.ajax({
			url: baseUrl + "ordini-clienti/" + idOrdineCliente,
			type: 'DELETE',
			success: function() {
				var alertContent = '<div id="alertOrdineClienteContent" class="alert alert-success alert-dismissible fade show" role="alert">';
				alertContent = alertContent + '<strong>Ordine cliente</strong> cancellato con successo.\n' +
					'            <button type="button" class="close" data-dismiss="alert" aria-label="Close"><span aria-hidden="true">&times;</span></button></div>';
				$('#alertOrdineCliente').empty().append(alertContent);

				$('#ordiniClientiTable').DataTable().ajax.reload();
			},
			error: function(jqXHR, textStatus, errorThrown) {
				console.log('Response text: ' + jqXHR.responseText);
			}
		});
	});

	if($('#updateOrdineClienteButton') != null && $('#updateOrdineClienteButton') != undefined){
		$(document).on('submit','#updateOrdineClienteForm', function(event){
			event.preventDefault();

			var ordineCliente = new Object();
			ordineCliente.id = $('#hiddenIdOrdineCliente').val();
			ordineCliente.codice =$('#hiddenCodiceOrdineCliente').val();

			var cliente = new Object();
			cliente.id = $('#cliente option:selected').val();
			ordineCliente.cliente = cliente;

			var puntoConsegna = new Object();
			puntoConsegna.id = $('#puntoConsegna option:selected').val();
			ordineCliente.puntoConsegna = puntoConsegna;

			var autista = new Object();
			autista.id = $('#autista option:selected').val();
			ordineCliente.autista = autista;

			var agenteId = $('#agente option:selected').val();
			if(agenteId != null && agenteId != '-1'){
				var agente = new Object();
				agente.id = agenteId;
				ordineCliente.agente = agente;
			}
			ordineCliente.dataConsegna = $('#dataConsegna').val();
			ordineCliente.note = $('#note').val();

			var articoliLength = $('.formRowArticolo').length;
			if(articoliLength != null && articoliLength != undefined && articoliLength != 0){
				var ordineClienteArticoli = [];
				$('.formRowArticolo').each(function(i, item){
					var ordineClienteArticolo = {};
					var ordineClienteArticoloId = new Object();
					var articoloId = item.id.replace('formRowArticolo_','');
					ordineClienteArticoloId.articoloId = articoloId;
					ordineClienteArticolo.id = ordineClienteArticoloId;
					ordineClienteArticolo.numeroPezziOrdinati = $('#pezziArticolo_'+articoloId).val();

					ordineClienteArticoli.push(ricettaIngrediente);
				});
				ordineCliente.ordineClienteArticoli = ordineClienteArticoli;
			}

			var ordineClienteJson = JSON.stringify(ordineCliente);

			var alertContent = '<div id="alertOrdineClienteContent" class="alert alert-@@alertResult@@ alert-dismissible fade show" role="alert">';
			alertContent = alertContent + '<strong>@@alertText@@</strong>\n' +
				'<button type="button" class="close" data-dismiss="alert" aria-label="Close"><span aria-hidden="true">&times;</span></button></div>';

			$.ajax({
				url: baseUrl + "ordini-clienti/" + $('#hiddenIdOrdineCliente').val(),
				type: 'PUT',
				contentType: "application/json",
				dataType: 'json',
				data: ordineClienteJson,
				success: function(result) {
					$('#alertOrdineCliente').empty().append(alertContent.replace('@@alertText@@','Ordine cliente modificato con successo').replace('@@alertResult@@', 'success'));
				},
				error: function(jqXHR, textStatus, errorThrown) {
					$('#alertOrdineCliente').empty().append(alertContent.replace('@@alertText@@','Errore nella modifica dell ordine cliente').replace('@@alertResult@@', 'danger'));
				}
			});
		});
	}

	if($('#newOrdineClienteButton') != null && $('#newOrdineClienteButton') != undefined){
		$(document).on('submit','#newOrdineClienteForm', function(event){
			event.preventDefault();

			var ordineCliente = new Object();

			var cliente = new Object();
			cliente.id = $('#cliente option:selected').val();
			ordineCliente.cliente = cliente;

			var puntoConsegna = new Object();
			puntoConsegna.id = $('#puntoConsegna option:selected').val();
			ordineCliente.puntoConsegna = puntoConsegna;

			var autista = new Object();
			autista.id = $('#autista option:selected').val();
			ordineCliente.autista = autista;

			var agenteId = $('#agente option:selected').val();
			if(agenteId != null && agenteId != '-1'){
				var agente = new Object();
				agente.id = agenteId;
				ordineCliente.agente = agente;
			}
			ordineCliente.dataConsegna = $('#dataConsegna').val();
			ordineCliente.note = $('#note').val();

			var articoliLength = $('.formRowArticolo').length;
			if(articoliLength != null && articoliLength != undefined && articoliLength != 0){
				var ordineClienteArticoli = [];
				$('.formRowArticolo').each(function(i, item){
					var ordineClienteArticolo = {};
					var ordineClienteArticoloId = new Object();
					var articoloId = item.id.replace('formRowArticolo_','');
					ordineClienteArticoloId.articoloId = articoloId;
					ordineClienteArticolo.id = ordineClienteArticoloId;
					ordineClienteArticolo.numeroPezziOrdinati = $('#pezziArticolo_'+articoloId).val();

					ordineClienteArticoli.push(ordineClienteArticolo);
				});
				ordineCliente.ordineClienteArticoli = ordineClienteArticoli;
			}

			var ordineClienteJson = JSON.stringify(ordineCliente);

			var alertContent = '<div id="alertOrdineClienteContent" class="alert alert-@@alertResult@@ alert-dismissible fade show" role="alert">';
			alertContent = alertContent + '<strong>@@alertText@@</strong>\n' +
				'<button type="button" class="close" data-dismiss="alert" aria-label="Close"><span aria-hidden="true">&times;</span></button></div>';

			$.ajax({
				url: baseUrl + "ordini-clienti",
				type: 'POST',
				contentType: "application/json",
				dataType: 'json',
				data: ordineClienteJson,
				success: function(result) {
					$('#alertOrdineCliente').empty().append(alertContent.replace('@@alertText@@','Ordine cliente creato con successo').replace('@@alertResult@@', 'success'));
				},
				error: function(jqXHR, textStatus, errorThrown) {
					$('#alertOrdineCliente').empty().append(alertContent.replace('@@alertText@@','Errore nella creazione dell ordine cliente').replace('@@alertResult@@', 'danger'));
				}
			});
		});
	}

	$(document).on('click','#addArticolo', function(){
		$('#addArticoloModal').modal('show');

		$('#addArticoloModalTable').DataTable({
			"ajax": {
				"url": baseUrl + "articoli",
				"type": "GET",
				"content-type": "json",
				"cache": false,
				"dataSrc": "",
				"error": function(jqXHR, textStatus, errorThrown) {
					var alertContent = '<div id="alertOrdineClienteContent" class="alert alert-danger alert-dismissible fade show" role="alert">';
					alertContent = alertContent + '<strong>Errore nel recupero degli articoli</strong>\n' +
						'            <button type="button" class="close" data-dismiss="alert" aria-label="Close"><span aria-hidden="true">&times;</span></button></div>';
					$('#alertOrdineClienteAddIngrediente').empty().append(alertContent);
				}
			},
			"language": {
				"search": "Cerca",
				"emptyTable": "Nessun articolo disponibile",
				"zeroRecords": "Nessun articolo disponibile"
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
						'data-prezzo="'+data.prezzoListinoBase+'" id="checkbox_'+data.id+'" class="addArticoloCheckbox">';
					return checkboxHtml;
				}},
				{"name": "codice", "data": "codice"},
				{"name": "descrizione", "data": "descrizione"},
				{"name": "prezzoListinoBase", "data": "prezzoListinoBase"}
			]
		});
	});

	$(document).on('click','#confirmAddArticoloModal', function(){
		var numChecked = $('.addArticoloCheckbox:checkbox:checked').length;
		if(numChecked == null || numChecked == undefined || numChecked == 0){
			var alertContent = '<div id="alertOrdineClienteAddArticoloContent" class="alert alert-danger alert-dismissible fade show" role="alert">';
			alertContent = alertContent + '<strong>Selezionare almeno un articolo</strong>\n' +
				'            <button type="button" class="close" data-dismiss="alert" aria-label="Close"><span aria-hidden="true">&times;</span></button></div>';
			$('#alertOrdineClienteAddArticolo').empty().append(alertContent);
		} else{
			var alreadyAddedRows = $('.formRowArticolo').length;
			if(alreadyAddedRows == null || alreadyAddedRows == undefined){
				alreadyAddedRows = 0;
			}
			if(alreadyAddedRows != 0){
				var rowsIdPresent = [];
				$('.formRowArticolo').each(function(i,item){
					var itemId = item.id;
					rowsIdPresent.push(itemId.replace('formRowArticolo_',''));
				});
			}
			$('.addArticoloCheckbox:checkbox:checked').each(function(i, item){
				var id = item.id.replace('checkbox_','');
				var codice = $('#'+item.id).attr('data-codice');

				if($.inArray(id, rowsIdPresent) != -1){
					var alertContent = '<div id="alertOrdineClienteAddArticoloContent" class="alert alert-danger alert-dismissible fade show" role="alert">';
					alertContent = alertContent + '<strong>L articolo '+codice+' &egrave; gi&agrave; stato selezionato</strong>\n' +
						'            <button type="button" class="close" data-dismiss="alert" aria-label="Close"><span aria-hidden="true">&times;</span></button></div>';
					$('#alertOrdineClienteAddArticolo').empty().append(alertContent);
				} else{
					var descrizione = $('#'+item.id).attr('data-descrizione');
					var prezzoListinoBase = $('#'+item.id).attr('data-prezzo');

					var rowHtml = '<div class="form-row formRowArticolo" data-id="'+id+'" id="formRowArticolo_'+id+'">' +
						'<div class="form-group col-md-2">';

					if(i == 0 && alreadyAddedRows == 0){
						rowHtml = rowHtml + '<label for="codiceArticolo">Codice</label>';
					}
					rowHtml = rowHtml + '<input type="text" class="form-control" id="codiceArticolo_'+id+'" disabled value="'+codice+'"></div>';
					rowHtml = rowHtml + '<div class="form-group col-md-4">';

					if(i == 0 && alreadyAddedRows == 0){
						rowHtml = rowHtml + '<label for="descrizioneArticolo">Descrizione</label>';
					}
					rowHtml = rowHtml + '<input type="text" class="form-control" id="descrizioneArticolo_'+id+'" disabled value="'+descrizione+'"></div>';
					rowHtml = rowHtml + '<div class="form-group col-md-2">';

					if(i == 0 && alreadyAddedRows == 0){
						rowHtml = rowHtml + '<label for="prezzoArticolo">Prezzo listino base (&euro;)</label>';
					}
					rowHtml = rowHtml + '<input type="number" class="form-control" id="prezzoArticolo_'+id+'" disabled value="'+prezzo+'"></div>';
					rowHtml = rowHtml + '<div class="form-group col-md-2">';

					if(i == 0 && alreadyAddedRows == 0){
						rowHtml = rowHtml + '<label for="pezziArticolo">Numero pezzi</label>';
					}
					rowHtml = rowHtml + '<div class="input-group">';
					rowHtml = rowHtml + '<input type="number" class="form-control pezziArticolo" id="pezziArticolo_'+id+'" step="1" min="0">';
					rowHtml = rowHtml + '<div class="input-group-append ml-1 mt-1"><a class="deleteAddArticolo" data-id="'+id+'"><i class="far fa-trash-alt"></a>';
					rowHtml = rowHtml + '</div></div></div>';
					rowHtml = rowHtml + '</div>';

					$('#formRowArticoli').append(rowHtml);

					$('#addArticoloModalTable').DataTable().destroy();
					$('#alertOrdineClienteAddArticoloContent').alert('close');
					$('#addArticoloModal').modal('hide');
				}
			});
		}
	});

	$(document).on('click','.annullaAddArticoloModal', function(){
		$('#addArticoloModalTable').DataTable().destroy();
		$('#alertOrdineClienteAddArticoloContent').alert('close');
		$('#addArticoloModal').modal('hide');
	});

	$(document).on('click','.deleteAddArticolo', function(){
		var firstId = $('.formRowArticolo').first().attr('data-id');
		if(firstId == null || firstId == undefined){
			firstId = -1;
		}
		var id = $(this).attr('data-id');
		$('#formRowarticolo_'+id).remove();
		if(id == firstId){
			var firstRow = $('.formRowArticolo').first();
			if(firstRow != null && firstRow != undefined && firstRow.length != 0){
				$('#'+firstRow.attr('id')).find('input').each(function(i, item){
					var id = item.id;
					var label = '';
					if(id.indexOf('codice') != '-1'){
						label = '<label for="codiceArticolo">Codice</label>';
					} else if(id.indexOf('descrizione') != '-1'){
						label = '<label for="descrizioneArticolo">Descrizione</label>';
					} else if(id.indexOf('prezzo') != '-1'){
						label = '<label for="prezzoArticolo">Prezzo listino base (&euro;)</label>';
					} else{
						label = '<label for="pezziArticolo">Numero pezzi</label>';
					}
					if(id.indexOf('pezzi') != '-1'){
						$('#'+id).parent().before(label);
					} else {
						$('#'+id).before(label);
					}
				});
			}
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
					$('#alertOrdineCliente').empty().append(alertContent.replace('@@alertText@@','Errore nel caricamento dei punti di consegna').replace('@@alertResult@@', 'danger'));
				}
			});

		} else {
			$('#puntoConsegna').empty();
			$('#puntoConsegna').attr('disabled', true);
			$('#loadingDiv').addClass('d-none');
		}
	});

});

$.fn.printVariable = function(variable){
	if(variable != null && variable != undefined && variable != ""){
		return variable;
	}
	return "";
}

$.fn.extractIdOrdineClienteFromUrl = function(){
	var pageUrl = window.location.search.substring(1);

	var urlVariables = pageUrl.split('&'),
		paramNames,
		i;

	for (i = 0; i < urlVariables.length; i++) {
		paramNames = urlVariables[i].split('=');

		if (paramNames[0] === 'idOrdineCliente') {
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

$.fn.getAutisti = function(){
	$.ajax({
		url: baseUrl + "autisti",
		type: 'GET',
		dataType: 'json',
		success: function(result) {
			if(result != null && result != undefined && result != ''){
				$.each(result, function(i, item){
					var label = item.cognome + ' ' + item.nome;
					$('#autista').append('<option value="'+item.id+'">'+label+'</option>');
				});
			}
		},
		error: function(jqXHR, textStatus, errorThrown) {
			console.log('Response text: ' + jqXHR.responseText);
		}
	});
}

$.fn.getAgenti = function(){
	$.ajax({
		url: baseUrl + "agenti",
		type: 'GET',
		dataType: 'json',
		success: function(result) {
			if(result != null && result != undefined && result != ''){
				$.each(result, function(i, item){
					var label = item.cognome + ' ' + item.nome;
					$('#agente').append('<option value="'+item.id+'">'+label+'</option>');
				});
			}
		},
		error: function(jqXHR, textStatus, errorThrown) {
			console.log('Response text: ' + jqXHR.responseText);
		}
	});
}


$.fn.getOrdineCliente = function(idOrdineCliente){

	var alertContent = '<div id="alertOrdineClienteContent" class="alert alert-danger alert-dismissible fade show" role="alert">';
	alertContent = alertContent +  '<strong>Errore nel recupero dell ordine cliente.</strong>\n' +
    					'<button type="button" class="close" data-dismiss="alert" aria-label="Close"><span aria-hidden="true">&times;</span></button></div>';

	$.ajax({
        url: baseUrl + "ordini-clienti/" + idOrdineCliente,
        type: 'GET',
        dataType: 'json',
        success: function(result) {
          if(result != null && result != undefined && result != ''){

			$('#hiddenIdOrdineCliente').attr('value', result.id);
			$('#hiddenCodiceOrdineCliente').attr('value', result.codice);
			if(result.cliente != null && result.cliente != undefined){
				$('#cliente option[value="' + result.cliente.id +'"]').attr('selected', true);
			};
			if(result.puntoConsegna != null && result.puntoConsegna != undefined){
				$('#puntoConsegna option[value="' + result.puntoConsegna.id +'"]').attr('selected', true);
			};
			if(result.autista != null && result.autista != undefined){
				$('#autista option[value="' + result.autista.id +'"]').attr('selected', true);
			};
			if(result.agente != null && result.agente != undefined){
				$('#agente option[value="' + result.agente.id +'"]').attr('selected', true);
			};
			$('#dataConsegna').attr('value', result.dataConsegna);
			$('#note').val(result.note);

			if(result.ordineClienteArticoli != null && result.ordineClienteArticoli != undefined && result.ordineClienteArticoli.length != 0){
				result.ordineClienteArticoli.forEach(function(item, i){
					var id = item.id.articoloId;
					var codice = item.articolo.codice;
					var descrizione = item.articolo.descrizione;
					var prezzo = item.articolo.prezzoListinoBase;
					var pezzi = item.numeroPezziOrdinati;

					var rowHtml = '<div class="form-row formRowArticolo" data-id="'+id+'" id="formRowArticolo_'+id+'">' +
						'<div class="form-group col-md-2">';

					if(i == 0){
						rowHtml = rowHtml + '<label for="codiceArticolo">Codice</label>';
					}
					rowHtml = rowHtml + '<input type="text" class="form-control" id="codiceArticolo_'+id+'" disabled value="'+codice+'"></div>';
					rowHtml = rowHtml + '<div class="form-group col-md-4">';

					if(i == 0){
						rowHtml = rowHtml + '<label for="descrizioneArticolo">Descrizione</label>';
					}
					rowHtml = rowHtml + '<input type="text" class="form-control" id="descrizioneArticolo_'+id+'" disabled value="'+descrizione+'"></div>';
					rowHtml = rowHtml + '<div class="form-group col-md-2">';

					if(i == 0){
						rowHtml = rowHtml + '<label for="prezzoArticolo">Prezzo listino base (&euro;)</label>';
					}
					rowHtml = rowHtml + '<input type="number" class="form-control" id="prezzoArticolo_'+id+'" disabled value="'+prezzo+'"></div>';
					rowHtml = rowHtml + '<div class="form-group col-md-2">';

					if(i == 0){
						rowHtml = rowHtml + '<label for="pezziArticolo">Numero pezzi</label>';
					}
					rowHtml = rowHtml + '<div class="input-group">';
					rowHtml = rowHtml + '<input type="number" class="form-control pezziArticolo" id="pezziArticolo_'+id+'" step="1" min="0" value="'+pezzi+'">';
					rowHtml = rowHtml + '<div class="input-group-append ml-1 mt-1"><a class="deleteAddArticolo" data-id="'+id+'"><i class="far fa-trash-alt"></a>';
					rowHtml = rowHtml + '</div></div></div>';
					rowHtml = rowHtml + '</div>';

					$('#formRowArticoli').append(rowHtml);
				});
			}
          } else{
            $('#alertOrdineCliente').empty().append(alertContent);
          }
        },
        error: function(jqXHR, textStatus, errorThrown) {
            $('#alertOrdineCliente').append(alertContent);
            $('#updateOrdineClienteButton').attr('disabled', true);
            console.log('Response text: ' + jqXHR.responseText);
        }
    });
}


