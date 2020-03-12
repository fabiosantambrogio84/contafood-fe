var baseUrl = "/contafood-be/";

$.fn.loadDdtAcquistoTable = function(url) {
	$('#ddtTable').DataTable({
		"ajax": {
			"url": url,
			"type": "GET",
			"content-type": "json",
			"cache": false,
			"dataSrc": "",
			"error": function(jqXHR, textStatus, errorThrown) {
				console.log('Response text: ' + jqXHR.responseText);
				var alertContent = '<div id="alertDdtAcquistoContent" class="alert alert-danger alert-dismissible fade show" role="alert">';
				alertContent = alertContent + '<strong>Errore nel recupero dei DDT acquisto</strong>\n' +
					'            <button type="button" class="close" data-dismiss="alert" aria-label="Close"><span aria-hidden="true">&times;</span></button></div>';
				$('#alertDdtAcquisto').empty().append(alertContent);
			}
		},
		"language": {
			// "search": "Cerca",
			"paginate": {
				"first": "Inizio",
				"last": "Fine",
				"next": "Succ.",
				"previous": "Prec."
			},
			"emptyTable": "Nessun DDT acquisto disponibile",
			"zeroRecords": "Nessun DDT acquisto disponibile"
		},
		"searching": false,
		"responsive":true,
		"pageLength": 20,
		"lengthChange": false,
		"info": false,
		"autoWidth": false,
		"order": [
			[1, 'desc']
		],
		"columns": [
			{"data": null, "orderable":false, "width": "2%", render: function ( data, type, row ) {
				var checkboxHtml = '<input type="checkbox" data-id="'+data.id+'" id="checkbox_'+data.id+'" class="ddtAcquistoCheckbox">';
				return checkboxHtml;
			}},
			{"name": "numero", "data": "numero", "width":"5%"},
			{"name": "data", "data": null, "width":"8%", render: function ( data, type, row ) {
				var a = moment(data.data);
				return a.format('DD/MM/YYYY');
			}},
			{"name": "fornitore", "data": null, "width":"10%", render: function ( data, type, row ) {
				var fornitore = data.fornitore;
				if(fornitore != null){
					return fornitore.ragioneSociale;
				}
				return '';
			}},
			{"name": "imponibile", "data": null, "width":"8%", render: function ( data, type, row ) {
					return $.fn.formatNumber(data.totaleImponibile);
				}},
			{"name": "importo", "data": null, "width":"8%",render: function ( data, type, row ) {
				return $.fn.formatNumber(data.totale);
			}},
			{"data": null, "orderable":false, "width":"10%", render: function ( data, type, row ) {
				var stato = data.statoDdtAcquisto;

				var links = '<a class="detailsDdtAcquisto pr-1" data-id="'+data.id+'" href="#" title="Dettagli"><i class="fas fa-info-circle"></i></a>';
				links += '<a class="updateDdtAcquisto pr-1" data-id="'+data.id+'" href="ddt-acquisto-edit.html?idDdtAcquisto=' + data.id + '" title="Modifica"><i class="far fa-edit"></i></a>';
				if(stato != null && stato != undefined && stato != '' && stato.codice == 'DA_PAGARE'){
					links += '<a class="payDdtAcquisto pr-1" data-id="'+data.id+'" href="pagamenti-new.html?idDdtAcquisto=' + data.id + '" title="Pagamento"><i class="fa fa-shopping-cart"></i></a>';
				}
				if(stato != null && stato != undefined && stato != '' && stato.codice == 'DA_PAGARE') {
					links += '<a class="deleteDdtAcquisto" data-id="' + data.id + '" href="#" title="Elimina"><i class="far fa-trash-alt"></i></a>';
				}
				return links;
			}}
		],
		"createdRow": function(row, data, dataIndex,cells){
			//$(row).css('font-size', '12px');
			if(data.statoDdtAcquisto != null){
				var backgroundColor = '';
				if(data.statoDdtAcquisto.codice == 'DA_PAGARE'){
					backgroundColor = '#fcf456';
				} else if(data.statoDdtAcquisto.codice == 'PARZIALMENTE_PAGATO'){
					backgroundColor = '#fcc08b';
				} else {
					backgroundColor = 'trasparent';
				}
				$(row).css('background-color', backgroundColor);
			}
			$(cells[4]).css('text-align','right');
			$(cells[5]).css('font-weight','bold').css('text-align','right');
		}
	});
}

$(document).ready(function() {

	$.fn.loadDdtAcquistoTable(baseUrl + "ddts-acquisto");

	$('#ddtAcquistoArticoliTable').DataTable({
		"searching": false,
		"language": {
			"paginate": {
				"first": "Inizio",
				"last": "Fine",
				"next": "Succ.",
				"previous": "Prec."
			},
			"emptyTable": "",
			"zeroRecords": ""
		},
		"pageLength": 10,
		"lengthChange": false,
		"info": false,
		"autoWidth": false,
		"order": [
			[0, 'asc']
		]
	});



	$(document).on('click','.detailsDdtAcquisto', function(){
		var idDdtAcquisto = $(this).attr('data-id');

		var alertContent = '<div id="alertDdtAcquistoContent" class="alert alert-danger alert-dismissible fade show" role="alert">';
		alertContent = alertContent + '<strong>Errore nel recupero del DDT acquisto.</strong></div>';

		$.ajax({
			url: baseUrl + "ddts-acquisto/" + idDdtAcquisto,
			type: 'GET',
			dataType: 'json',
			success: function(result) {
				if(result != null && result != undefined && result != '') {
					$('#numero').text(result.numero);
					$('#data').text(moment(result.data).format('DD/MM/YYYY'));
					var fornitore = result.fornitore;
					if(fornitore != null && fornitore != undefined && fornitore != ''){
						$('#fornitore').text(fornitore.ragioneSociale);
					}
					var stato = result.statoDdtAcquisto;
					if(stato != null && stato != undefined && stato != ''){
						$('#stato').text(stato.descrizione);
					}
					$('#colli').text(result.numeroColli);
					$('#totaleImponibile').text(result.totaleImponibile);
					$('#totale').text(result.totale);
					$('#note').text(result.note);
					$('#dataInserimento').text(moment(result.dataInserimento).format('DD/MM/YYYY HH:mm:ss'));
					var dataAggiornamento = result.dataAggiornamento;
					if(dataAggiornamento != null && dataAggiornamento != undefined && dataAggiornamento != ''){
						$('#dataAggiornamento').text(moment(dataAggiornamento).format('DD/MM/YYYY HH:mm:ss'));
					}

					if(result.ddtAcquistoArticoli != null && result.ddtAcquistoArticoli != undefined){
						$('#detailsDdtAcquistoArticoliModalTable').DataTable({
							"data": result.ddtAcquistoArticoli,
							"language": {
								"paginate": {
									"first": "Inizio",
									"last": "Fine",
									"next": "Succ.",
									"previous": "Prec."
								},
								"search": "Cerca",
								"emptyTable": "Nessun articolo presente",
								"zeroRecords": "Nessun articolo presente"
							},
							"pageLength": 20,
							"lengthChange": false,
							"info": false,
							"order": [
								[0, 'asc'],
								[1, 'desc']
							],
							"autoWidth": false,
							"columns": [
								{"name": "articolo", "data": null, render: function (data, type, row) {
									var result = '';
									if (data.articolo != null) {
										result = data.articolo.codice+' - '+data.articolo.descrizione;
									}
									return result;
								}},
								{"name": "lotto", "data": "lotto"},
								{"name": "quantita", "data": "quantita"},
								{"name": "dataScadenza", "data": null, "width":"8%", render: function ( data, type, row ) {
									var a = moment(data.dataScadenza);
									return a.format('DD/MM/YYYY');
								}},
								{"name": "prezzo", "data": "prezzo"},
								{"name": "sconto", "data": "sconto"},
								{"name": "imponibile", "data": "imponibile"}
							]
						});
					}

					/*
					if(result.ddtPagamenti != null && result.ddtPagamenti != undefined){
						$('#detailsDdtPagamentiModalTable').DataTable({
							"data": result.ddtPagamenti,
							"language": {
								"paginate": {
									"first": "Inizio",
									"last": "Fine",
									"next": "Succ.",
									"previous": "Prec."
								},
								"search": "Cerca",
								"emptyTable": "Nessun pagamento presente",
								"zeroRecords": "Nessun pagamento presente"
							},
							"pageLength": 20,
							"lengthChange": false,
							"info": false,
							"order": [
								[0, 'desc'],
								[1, 'asc']
							],
							"autoWidth": false,
							"columns": [
								{"name": "data", "data": null, "width":"8%", render: function (data, type, row) {
									var a = moment(data.data);
									return a.format('DD/MM/YYYY');
								}},
								{"name": "descrizione", "data": "descrizione", "width":"15%"},
								{"name": "importo", "data": null, "width":"8%", render: function ( data, type, row ) {
									return $.fn.formatNumber(data.importo);
								}},
								{"name": "tipoPagamento", "data": null, "width":"12%", render: function ( data, type, row ) {
									var tipoPagamento = data.tipoPagamento;
									if(tipoPagamento != null && tipoPagamento != undefined && tipoPagamento != ''){
										return tipoPagamento.descrizione;
									}
									return '';
								}},
								{"name": "note", "data": null, "width":"15%", render: function ( data, type, row ) {
									var note = data.note;
									var noteTrunc = note;
									var noteHtml = '<div>'+noteTrunc+'</div>';
									if(note.length > 100){
										noteTrunc = note.substring(0, 100)+'...';
										noteHtml = '<div data-toggle="tooltip" data-placement="bottom" title="'+note+'">'+noteTrunc+'</div>';
									}

									return noteHtml;
								}}
							]
						});
					}
					*/

				} else{
					$('#detailsDdtAcquistoMainDiv').empty().append(alertContent);
				}
			},
			error: function(jqXHR, textStatus, errorThrown) {
				$('#detailsDdtAcquistoMainDiv').empty().append(alertContent);
				console.log('Response text: ' + jqXHR.responseText);
			}
		})

		$('#detailsDdtAcquistoModal').modal('show');
	});

	$(document).on('click','.closeDdtAcquisto', function(){
		$('#detailsDdtAcquistoArticoliModalTable').DataTable().destroy();
		//$('#detailsDdtPagamentiModalTable').DataTable().destroy();
		$('#detailsDdtAcquistoModal').modal('hide');
	});

	$(document).on('click','.deleteDdtAcquisto', function(){
		var idDdtAcquisto = $(this).attr('data-id');
		$('#confirmDeleteDdtAcquisto').attr('data-id', idDdtAcquisto);
		$('#deleteDdtAcquistoModal').modal('show');
	});

	$(document).on('click','#confirmDeleteDdtAcquisto', function(){
		$('#deleteDdtAcquistoModal').modal('hide');
		var idDdtAcquisto = $(this).attr('data-id');

		$.ajax({
			url: baseUrl + "ddts-acquisto/" + idDdtAcquisto,
			type: 'DELETE',
			success: function() {
				var alertContent = '<div id="alertDdtAcquistoContent" class="alert alert-success alert-dismissible fade show" role="alert">';
				alertContent = alertContent + '<strong>DDT acquisto</strong> cancellato con successo.\n' +
					'            <button type="button" class="close" data-dismiss="alert" aria-label="Close"><span aria-hidden="true">&times;</span></button></div>';
				$('#alertDdtAcquisto').empty().append(alertContent);

				$('#ddtAcquistoTable').DataTable().ajax.reload();
			},
			error: function(jqXHR, textStatus, errorThrown) {
				console.log('Response text: ' + jqXHR.responseText);
			}
		});
	});

	if($('#searchDdtAcquistoButton') != null && $('#searchDdtAcquistoButton') != undefined) {
		$(document).on('submit', '#searchDdtAcquistoForm', function (event) {
			event.preventDefault();

			var numero = $('#searchNumero').val();
			var fornitore = $('#searchFornitore').val();
			var stato = $('#searchStato option:selected').val();

			var params = {};
			if(numero != null && numero != undefined && numero != ''){
				params.numero = numero;
			}
			if(fornitore != null && fornitore != undefined && fornitore != ''){
				params.fornitore = fornitore;
			}
			if(stato != null && stato != undefined && stato != ''){
				params.stato = stato;
			}
			var url = baseUrl + "ddts-acquisto?" + $.param( params );

			$('#ddtAcquistoTable').DataTable().destroy();
			$.fn.loadDdtAcquistoTable(url);

		});

		$(document).on('click','#resetSearchDdtAcquistoButton', function(){
			$('#searchDdtAcquistoForm :input').val(null);
			$('#searchDdtAcquistoForm select option[value=""]').attr('selected', true);

			$('#ddtAcquistoTable').DataTable().destroy();
			$.fn.loadDdtAcquistoTable(baseUrl + "ddts-acquisto");
		});
	}

	if($('#newDdtButton') != null && $('#newDdtButton') != undefined){
		$(document).on('submit','#newDdtForm', function(event){
			event.preventDefault();

			var ddt = new Object();
			ddt.progressivo = $('#progressivo').val();
			ddt.annoContabile = $('#annoContabile').val();
			ddt.data = $('#data').val();

			var cliente = new Object();
			cliente.id = $('#cliente option:selected').val();
			ddt.cliente = cliente;

			var puntoConsegna = new Object();
			puntoConsegna.id = $('#puntoConsegna option:selected').val();
			ddt.puntoConsegna = puntoConsegna;

			var ddtArticoliLength = $('.rowArticolo').length;
			if(ddtArticoliLength != null && ddtArticoliLength != undefined && ddtArticoliLength != 0){
				var ddtArticoli = [];
				$('.rowArticolo').each(function(i, item){
					var articoloId = $(this).attr('data-id');

					var ddtArticolo = {};
					var ddtArticoloId = new Object();
					ddtArticoloId.articoloId = articoloId;
					ddtArticolo.id = ddtArticoloId;

					ddtArticolo.lotto = $(this).children().eq(1).children().eq(0).val();
					ddtArticolo.quantita = $(this).children().eq(3).children().eq(0).val();
					ddtArticolo.numeroPezzi = $(this).children().eq(4).children().eq(0).val();
					ddtArticolo.prezzo = $(this).children().eq(5).children().eq(0).val();
					ddtArticolo.sconto = $(this).children().eq(6).children().eq(0).val();

					ddtArticoli.push(ddtArticolo);
				});
				ddt.ddtArticoli = ddtArticoli;
			}
			ddt.fatturato = false;
			ddt.numeroColli = $('#colli').val();
			ddt.tipoTrasporto = $('#tipoTrasporto option:selected').val();
			ddt.dataTrasporto = $('#dataTrasporto').val();

			var regex = /:/g;
			var oraTrasporto = $('#oraTrasporto').val();
			if(oraTrasporto != null && oraTrasporto != ''){
				var count = oraTrasporto.match(regex);
				count = (count) ? count.length : 0;
				if(count == 1){
					ddt.oraTrasporto = $('#oraTrasporto').val() + ':00';
				} else {
					ddt.oraTrasporto = $('#oraTrasporto').val();
				}
			}
			ddt.trasportatore = $('#trasportatore').val();
			ddt.note = $('#note').val();

			var ddtJson = JSON.stringify(ddt);

			var alertContent = '<div id="alertDdtAcquistoContent" class="alert alert-@@alertResult@@ alert-dismissible fade show" role="alert">';
			alertContent = alertContent + '<strong>@@alertText@@</strong>\n' +
				'<button type="button" class="close" data-dismiss="alert" aria-label="Close"><span aria-hidden="true">&times;</span></button></div>';

			$.ajax({
				url: baseUrl + "ddts",
				type: 'POST',
				contentType: "application/json",
				dataType: 'json',
				data: ddtJson,
				success: function(result) {
					$('#alertDdt').empty().append(alertContent.replace('@@alertText@@','DDT creato con successo').replace('@@alertResult@@', 'success'));

					$('#newDdtButton').attr("disabled", true);

					// Returns to the same page
					setTimeout(function() {
						window.location.href = "ddt-new.html?dt="+ddt.dataTrasporto+"&ot="+oraTrasporto;
					}, 1000);
				},
				error: function(jqXHR, textStatus, errorThrown) {
					var errorMessage = 'Errore nella creazione del DDT';
					if(jqXHR != null && jqXHR != undefined){
						var jqXHRResponseJson = jqXHR.responseJSON;
						if(jqXHRResponseJson != null && jqXHRResponseJson != undefined && jqXHRResponseJson != ''){
							var jqXHRResponseJsonMessage = jqXHR.responseJSON.message;
							if(jqXHRResponseJsonMessage != null && jqXHRResponseJsonMessage != undefined && jqXHRResponseJsonMessage != '' && jqXHRResponseJsonMessage.indexOf('con progressivo') != -1){
								errorMessage = jqXHRResponseJsonMessage;
							}
						}
					}
					$('#alertDdt').empty().append(alertContent.replace('@@alertText@@', errorMessage).replace('@@alertResult@@', 'danger'));
				}
			});

		});
	}

	if($('#updateDdtButton') != null && $('#updateDdtButton') != undefined){
		$(document).on('submit','#updateDdtForm', function(event){
			event.preventDefault();

			var ddt = new Object();
			ddt.id = $('#hiddenIdDdt').val();
			ddt.progressivo = $('#progressivo').val();
			ddt.annoContabile = $('#annoContabile').val();
			ddt.data = $('#data').val();

			var cliente = new Object();
			cliente.id = $('#cliente option:selected').val();
			ddt.cliente = cliente;

			var puntoConsegna = new Object();
			puntoConsegna.id = $('#puntoConsegna option:selected').val();
			ddt.puntoConsegna = puntoConsegna;

			var ddtArticoliLength = $('.rowArticolo').length;
			if(ddtArticoliLength != null && ddtArticoliLength != undefined && ddtArticoliLength != 0){
				var ddtArticoli = [];
				$('.rowArticolo').each(function(i, item){
					var articoloId = $(this).attr('data-id');

					var ddtArticolo = {};
					var ddtArticoloId = new Object();
					ddtArticoloId.articoloId = articoloId;
					ddtArticolo.id = ddtArticoloId;

					ddtArticolo.lotto = $(this).children().eq(1).children().eq(0).val();
					ddtArticolo.quantita = $(this).children().eq(3).children().eq(0).val();
					ddtArticolo.numeroPezzi = $(this).children().eq(4).children().eq(0).val();
					ddtArticolo.prezzo = $(this).children().eq(5).children().eq(0).val();
					ddtArticolo.sconto = $(this).children().eq(6).children().eq(0).val();

					ddtArticoli.push(ddtArticolo);
				});
				ddt.ddtArticoli = ddtArticoli;
			}
			ddt.fatturato = false;
			ddt.numeroColli = $('#colli').val();
			ddt.tipoTrasporto = $('#tipoTrasporto option:selected').val();
			ddt.dataTrasporto = $('#dataTrasporto').val();

			var regex = /:/g;
			var oraTrasporto = $('#oraTrasporto').val();
			if(oraTrasporto != null && oraTrasporto != ''){
				var count = oraTrasporto.match(regex);
				count = (count) ? count.length : 0;
				if(count == 1){
					ddt.oraTrasporto = $('#oraTrasporto').val() + ':00';
				} else {
					ddt.oraTrasporto = $('#oraTrasporto').val();
				}
			}
			ddt.trasportatore = $('#trasportatore').val();
			ddt.note = $('#note').val();

			var ddtJson = JSON.stringify(ddt);

			var alertContent = '<div id="alertDdtAcquistoContent" class="alert alert-@@alertResult@@ alert-dismissible fade show" role="alert">';
			alertContent = alertContent + '<strong>@@alertText@@</strong>\n' +
				'<button type="button" class="close" data-dismiss="alert" aria-label="Close"><span aria-hidden="true">&times;</span></button></div>';

			$.ajax({
				url: baseUrl + "ddts/"+ddt.id,
				type: 'PUT',
				contentType: "application/json",
				dataType: 'json',
				data: ddtJson,
				success: function(result) {
					$('#alertDdt').empty().append(alertContent.replace('@@alertText@@','DDT aggiornato con successo').replace('@@alertResult@@', 'success'));

					$('#updateDdtButton').attr("disabled", true);

					// Returns to the page with the list of DDTs
					setTimeout(function() {
						window.location.href = "ddt.html";
					}, 1000);
				},
				error: function(jqXHR, textStatus, errorThrown) {
					var errorMessage = 'Errore nella modifica del DDT';
					if(jqXHR != null && jqXHR != undefined){
						var jqXHRResponseJson = jqXHR.responseJSON;
						if(jqXHRResponseJson != null && jqXHRResponseJson != undefined && jqXHRResponseJson != ''){
							var jqXHRResponseJsonMessage = jqXHR.responseJSON.message;
							if(jqXHRResponseJsonMessage != null && jqXHRResponseJsonMessage != undefined && jqXHRResponseJsonMessage != '' && jqXHRResponseJsonMessage.indexOf('con progressivo') != -1){
								errorMessage = jqXHRResponseJsonMessage;
							}
						}
					}
					$('#alertDdt').empty().append(alertContent.replace('@@alertText@@', errorMessage).replace('@@alertResult@@', 'danger'));
				}
			});
		});
	}

	$(document).on('change','.autistaDdt', function(){
		var idAutista = $(this).val();
		var ddtId = $(this).attr("data-id");

		var ddtPatched = new Object();
		ddtPatched.id = parseInt(ddtId);
		if(idAutista != null && idAutista != undefined && idAutista != ''){
			ddtPatched.idAutista = parseInt(idAutista);
		} else {
			ddtPatched.idAutista = null;
		}

		var ddtPatchedJson = JSON.stringify(ddtPatched);

		var alertContent = '<div id="alertDdtAcquistoContent" class="alert alert-@@alertResult@@ alert-dismissible fade show" role="alert">';
		alertContent = alertContent + '<strong>@@alertText@@</strong>\n' +
			'<button type="button" class="close" data-dismiss="alert" aria-label="Close"><span aria-hidden="true">&times;</span></button></div>';

		$.ajax({
			url: baseUrl + "ddts/" + ddtId,
			type: 'PATCH',
			contentType: "application/json",
			dataType: 'json',
			data: ddtPatchedJson,
			success: function(result) {
				$('#alertDdt').empty().append(alertContent.replace('@@alertText@@','Autista modificato con successo').replace('@@alertResult@@', 'success'));
				$('#ddtTable').DataTable().ajax.reload();
			},
			error: function(jqXHR, textStatus, errorThrown) {
				$('#alertDdt').empty().append(alertContent.replace('@@alertText@@','Errore nella modifica dell autista').replace('@@alertResult@@', 'danger'));
				$('#ddtTable').DataTable().ajax.reload();
			}
		});

	});

	$(document).on('change','#cliente', function(){
		$('#articolo option[value=""]').prop('selected', true);
		$('#udm').val('');
		$('#iva').val('');
		$('#lotto').val('');
		$('#quantita').val('');
		$('#pezzi').val('');
		$('#prezzo').val('');
		$('#sconto').val('');

		var cliente = $('#cliente option:selected').val();
		var idListino = $('#cliente option:selected').attr('data-id-listino');
		if(cliente != null && cliente != ''){
			$.ajax({
				url: baseUrl + "clienti/"+cliente+"/punti-consegna",
				type: 'GET',
				dataType: 'json',
				success: function(result) {
					if(result != null && result != undefined && result != ''){
						$('#puntoConsegna').empty();
						$.each(result, function(i, item){
							var label = item.nome+' - '+item.indirizzo+' '+item.localita+', '+item.cap+' ('+item.provincia+')';
							$('#puntoConsegna').append('<option value="'+item.id+'">'+label+'</option>');
						});
					} else {
						$('#puntoConsegna').empty();
					}
					$('#puntoConsegna').removeAttr('disabled');

					// load the prices of the Listino associated to the Cliente
					if(idListino != null && idListino != undefined && idListino != '-1'){
						$.ajax({
							url: baseUrl + "listini/"+idListino+"/listini-prezzi",
							type: 'GET',
							dataType: 'json',
							success: function(result) {
								$.each(result, function(i, item){
									var articoloId = item.articolo.id;
									var prezzoListino = item.prezzo;
									$("#articolo option").each(function(i){
										var articoloOptionId = $(this).val();
										if(articoloOptionId == articoloId){
											$(this).attr('data-prezzo-listino', prezzoListino);
										}
									});
								});
							},
							error: function(jqXHR, textStatus, errorThrown) {
								$('#alertDdt').empty().append(alertContent.replace('@@alertText@@', 'Errore nel caricamento dei prezzi di listino').replace('@@alertResult@@', 'danger'));
							}
						});
					} else {
						$("#articolo option").each(function(i){
							var prezzoBase = $(this).attr('data-prezzo-base');
							$(this).attr('data-prezzo-listino', prezzoBase);
						});
					}

					// load Sconti associated to the Cliente
					var data = $('#data').val();
					if(data != null && data != undefined && data != ''){
						$.fn.loadScontiArticoli(data, cliente);
					}
				},
				error: function(jqXHR, textStatus, errorThrown) {
					$('#alertDdt').empty().append(alertContent.replace('@@alertText@@','Errore nel caricamento dei punti di consegna').replace('@@alertResult@@', 'danger'));
				}
			});

		} else {
			$('#puntoConsegna').empty();
			$('#puntoConsegna').attr('disabled', true);
		}
	});

	$(document).on('change','#data', function(){
		var data = $(this).val();
		var cliente = $('#cliente option:selected').val();
		if(data != null && data != undefined && data != '' && cliente != null && cliente != undefined && cliente != ''){
			$.fn.loadScontiArticoli(data, cliente);
		}
	});

	$.fn.loadScontiArticoli = function(data, cliente){
		$.ajax({
			url: baseUrl + "sconti?idCliente="+cliente+"&data="+moment(data.data).format('YYYY-MM-DD'),
			type: 'GET',
			dataType: 'json',
			success: function(result) {
				$.each(result, function(i, item){
					var articoloId = item.articolo.id;
					var valore = item.valore;
					$("#articolo option").each(function(i){
						var articoloOptionId = $(this).val();
						if(articoloOptionId == articoloId){
							$(this).attr('data-sconto', valore);
						}
					});
				});
			},
			error: function(jqXHR, textStatus, errorThrown) {
				$('#alertDdt').empty().append(alertContent.replace('@@alertText@@', 'Errore nel caricamento degli sconti').replace('@@alertResult@@', 'danger'));
			}
		});
	}

	$(document).on('change','#articolo', function(){
		var articolo = $('#articolo option:selected').val();
		if(articolo != null && articolo != ''){
			var udm = $('#articolo option:selected').attr('data-udm');
			var iva = $('#articolo option:selected').attr('data-iva');
			var quantita = $('#articolo option:selected').attr('data-qta');
			var prezzoBase = $('#articolo option:selected').attr('data-prezzo-base');
			var prezzoListino = $('#articolo option:selected').attr('data-prezzo-listino');
			var prezzo;
			if(prezzoListino != null && prezzoListino != undefined && prezzoListino != ''){
				prezzo = prezzoListino;
			} else {
				prezzo = prezzoBase;
			}
			var sconto = $('#articolo option:selected').attr('data-sconto');

			$('#udm').val(udm);
			$('#iva').val(iva);
			$('#lotto').val('');
			$('#quantita').val(quantita);
			$('#pezzi').val('');
			$('#prezzo').val(prezzo);
			$('#sconto').val(sconto);
		} else {
			$('#udm').val('');
			$('#iva').val('');
			$('#lotto').val('');
			$('#quantita').val('');
			$('#pezzi').val('');
			$('#prezzo').val('');
			$('#sconto').val('');
		}
	});

	$(document).on('click','#addArticolo', function(event){
		event.preventDefault();

		var articoloId = $('#articolo option:selected').val();

		if(articoloId == null || articoloId == undefined || articoloId == ''){
			$('#addDdtArticoloAlert').removeClass("d-none");
			return;
		} else {
			$('#addDdtArticoloAlert').addClass("d-none");
		}

		var articolo = $('#articolo option:selected').text();
		var udm = $('#udm').val();
		var lotto = $('#lotto').val();
		var quantita = $('#quantita').val();
		var pezzi = $('#pezzi').val();
		var prezzo = $('#prezzo').val();
		var sconto = $('#sconto').val();
		var iva = $('#iva').val();

		if(lotto != null && lotto != undefined && lotto != ''){
			var lottoHtml = '<input type="text" class="form-control form-control-sm text-center compute-totale" value="'+lotto+'">';
		} else {
			var lottoHtml = '<input type="text" class="form-control form-control-sm text-center compute-totale" value="">';
		}

		var quantitaHtml = '<input type="number" step=".001" min="0" class="form-control form-control-sm text-center compute-totale" value="'+quantita+'">';
		var pezziHtml = '<input type="number" step="1" min="0" class="form-control form-control-sm text-center compute-totale" value="'+pezzi+'">';
		var prezzoHtml = '<input type="number" step=".001" min="0" class="form-control form-control-sm text-center compute-totale" value="'+prezzo+'">';
		var scontoHtml = '<input type="number" step=".001" min="0" class="form-control form-control-sm text-center compute-totale" value="'+sconto+'">';

		// check if a same articolo was already added
		var found = 0;
		var currentRowIndex;
		var currentIdArticolo;
		var currentLotto;
		var currentPrezzo;
		var currentSconto;
		var currentQuantita = 0;

		var ddtArticoliLength = $('.rowArticolo').length;
		if(ddtArticoliLength != null && ddtArticoliLength != undefined && ddtArticoliLength != 0) {
			$('.rowArticolo').each(function(i, item){

				if(found != 1){
					currentRowIndex = $(this).attr('data-row-index');
					currentIdArticolo = $(this).attr('data-id');
					currentLotto = $(this).children().eq(1).children().eq(0).val();
					currentPrezzo = $(this).children().eq(5).children().eq(0).val();
					currentSconto = $(this).children().eq(6).children().eq(0).val();

					if(currentIdArticolo == articoloId && currentLotto == lotto && currentPrezzo == prezzo && currentSconto == sconto){
						found = 1;
						currentQuantita = $(this).children().eq(3).children().eq(0).val();
					}
				}
			});
		}

		var totale = 0;
		quantita = $.fn.parseValue(quantita, 'float');
		prezzo = $.fn.parseValue(prezzo, 'float');
		sconto = $.fn.parseValue(sconto, 'float');

		var quantitaPerPrezzo = ((quantita + $.fn.parseValue(currentQuantita,'float')) * prezzo);
		var scontoValue = (sconto/100)*quantitaPerPrezzo;
		totale = Number(Math.round((quantitaPerPrezzo - scontoValue) + 'e2') + 'e-2');

		var table = $('#ddtArticoliTable').DataTable();
		if(found == 1){
			//$('tr[data-id="'+currentIdArticolo+'"]').children().eq(3).children().eq(0).val(quantita + $.fn.parseValue(currentQuantita,'float'));
			//$('tr[data-id="'+currentIdArticolo+'"]').children().eq(7).text(totale);

			var newQuantitaHtml = '<input type="number" step=".01" min="0" class="form-control form-control-sm text-center compute-totale" value="'+(quantita + $.fn.parseValue(currentQuantita,'float'))+'">';

			var rowData = table.row(currentRowIndex).data();
			rowData[3] = newQuantitaHtml;
			rowData[7] = totale;
			table.row(currentRowIndex).data(rowData).draw();
			//$('#ddtArticoliTable').DataTable().row(currentRowIndex)

		} else {
			var deleteLink = '<a class="deleteDdtArticolo" data-id="'+articoloId+'" href="#"><i class="far fa-trash-alt" title="Rimuovi"></i></a>';

			var rowNode = table.row.add( [
				articolo,
				lottoHtml,
				udm,
				quantitaHtml,
				pezziHtml,
				prezzoHtml,
				scontoHtml,
				totale,
				iva,
				deleteLink
			] ).draw( false ).node();
			$(rowNode).css('text-align', 'center');
			$(rowNode).addClass('rowArticolo');
			$(rowNode).attr('data-id', articoloId);
			$(rowNode).attr('data-row-index', $(rowNode).index());
		}
		$.fn.computeTotale();

		$('#articolo option[value=""]').prop('selected',true);
		$('#udm').val('');
		$('#iva').val('');
		$('#lotto').val('');
		$('#quantita').val('');
		$('#pezzi').val('');
		$('#prezzo').val('');
		$('#sconto').val('');

		$('#articolo').focus();
	});

	$(document).on('click','.deleteDdtArticolo', function(){
		$('#ddtArticoliTable').DataTable().row( $(this).parent().parent() )
			.remove()
			.draw();
		$('#ddtArticoliTable').focus();

		$.fn.computeTotale();
	});

	$(document).on('change','.compute-totale', function(){
		$.row = $(this).parent().parent();
		var quantita = $.row.children().eq(3).children().eq(0).val();
		quantita = $.fn.parseValue(quantita, 'float');
		var prezzo = $.row.children().eq(5).children().eq(0).val();
		prezzo = $.fn.parseValue(prezzo, 'float');
		var sconto = $.row.children().eq(6).children().eq(0).val();
		sconto = $.fn.parseValue(sconto, 'float');

		var quantitaPerPrezzo = (quantita * prezzo);
		var scontoValue = (sconto/100)*quantitaPerPrezzo;
		var totale = Number(Math.round((quantitaPerPrezzo - scontoValue) + 'e2') + 'e-2');

		//var totale = Number(Math.round(((quantita * prezzo) - sconto) + 'e2') + 'e-2');
		$.row.children().eq(7).text(totale);

		$.fn.computeTotale();
	});

});

$.fn.preloadSearchFields = function(){
	$.ajax({
		url: baseUrl + "tipi-pagamento",
		type: 'GET',
		dataType: 'json',
		success: function(result) {
			if(result != null && result != undefined && result != ''){
				$.each(result, function(i, item){
					$('#searchTipoPagamento').append('<option value="'+item.id+'" >'+item.descrizione+'</option>');
				});
			}
		},
		error: function(jqXHR, textStatus, errorThrown) {
			console.log('Response text: ' + jqXHR.responseText);
		}
	});

	$.ajax({
		url: baseUrl + "agenti",
		type: 'GET',
		dataType: 'json',
		success: function(result) {
			if(result != null && result != undefined && result != ''){
				$.each(result, function(i, item){
					$('#searchAgente').append('<option value="'+item.id+'" >'+item.nome+' '+item.cognome+'</option>');
				});
			}
		},
		error: function(jqXHR, textStatus, errorThrown) {
			console.log('Response text: ' + jqXHR.responseText);
		}
	});

	$.ajax({
		url: baseUrl + "autisti",
		type: 'GET',
		dataType: 'json',
		success: function(result) {
			if(result != null && result != undefined && result != ''){
				$.each(result, function(i, item){
					$('#searchAutista').append('<option value="'+item.id+'" >'+item.nome+' '+item.cognome+'</option>');
				});
			}
		},
		error: function(jqXHR, textStatus, errorThrown) {
			console.log('Response text: ' + jqXHR.responseText);
		}
	});

	$.ajax({
		url: baseUrl + "articoli?attivo=true",
		type: 'GET',
		dataType: 'json',
		success: function(result) {
			if(result != null && result != undefined && result != ''){
				$.each(result, function(i, item){
					$('#searchArticolo').append('<option value="'+item.id+'" >'+item.codice+' '+item.descrizione+'</option>');
				});
			}
		},
		error: function(jqXHR, textStatus, errorThrown) {
			console.log('Response text: ' + jqXHR.responseText);
		}
	});

	$.ajax({
		url: baseUrl + "stati-ddt",
		type: 'GET',
		dataType: 'json',
		success: function(result) {
			if(result != null && result != undefined && result != ''){
				$.each(result, function(i, item){
					$('#searchStato').append('<option value="'+item.id+'" >'+item.descrizione+'</option>');
				});
			}
		},
		error: function(jqXHR, textStatus, errorThrown) {
			console.log('Response text: ' + jqXHR.responseText);
		}
	});
}

$.fn.preloadFields = function(dataTrasporto, oraTrasporto){
	$.ajax({
		url: baseUrl + "ddts/progressivo",
		type: 'GET',
		dataType: 'json',
		success: function(result) {
			if(result != null && result != undefined && result != ''){
				$('#progressivo').attr('value', result.progressivo);
				$('#annoContabile').attr('value', result.annoContabile);
				$('#colli').attr('value', 1);
				$('#data').val(moment().format('YYYY-MM-DD'));

				if(dataTrasporto != null && dataTrasporto != undefined && dataTrasporto != ''){
					$('#dataTrasporto').val(dataTrasporto);
				} else {
					$('#dataTrasporto').val(moment().format('YYYY-MM-DD'));
				}

				if(oraTrasporto != null && oraTrasporto != undefined && oraTrasporto != ''){
					$('#oraTrasporto').val(oraTrasporto);
				} else {
					$('#oraTrasporto').val(moment().format('HH:mm'));
				}

				$('#cliente').focus();

				var uri = window.location.toString();
				if (uri.indexOf("?") > 0) {
					var clean_uri = uri.substring(0, uri.indexOf("?"));
					window.history.replaceState({}, document.title, clean_uri);
				}
			}
		},
		error: function(jqXHR, textStatus, errorThrown) {
			console.log('Response text: ' + jqXHR.responseText);
		}
	});
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
					label += ' - ' + item.indirizzo + ' ' + item.citta + ', ' + item.cap + ' (' + item.provincia + ')';

					var agente = item.agente;
					var idAgente = '-1';
					if(agente != null && agente != undefined) {
						idAgente = agente.id;
					}
					var listino = item.listino;
					var idListino = '-1';
					if(listino != null && listino != undefined){
						idListino = listino.id;
					}
					$('#cliente').append('<option value="'+item.id+'" data-id-agente="'+idAgente+'" data-id-listino="'+idListino+'">'+label+'</option>');
				});
			}
		},
		error: function(jqXHR, textStatus, errorThrown) {
			console.log('Response text: ' + jqXHR.responseText);
		}
	});
}

$.fn.getTipologieTrasporto = function(){
	$.ajax({
		url: baseUrl + "utils/tipologie-trasporto-ddt",
		type: 'GET',
		dataType: 'json',
		success: function(result) {
			if(result != null && result != undefined && result != ''){
				$.each(result, function(i, item){
					var tipologiaTrasporto = item;
					if(item != null && item != '' && item == 'Mittente'){
						$('#tipoTrasporto').append('<option value="'+item+'" selected>'+item+'</option>');
					} else {
						$('#tipoTrasporto').append('<option value="'+item+'">'+item+'</option>');
					}

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
		url: baseUrl + "articoli?attivo=true",
		type: 'GET',
		dataType: 'json',
		success: function(result) {
			if(result != null && result != undefined && result != ''){
				$.each(result, function(i, item){
					var dataUdm = '';
					var udm = item.unitaMisura;
					if(udm != null && udm != undefined){
						dataUdm = udm.etichetta;
					}
					var dataIva = '';
					var iva = item.aliquotaIva;
					if(iva != null && iva != undefined){
						dataIva = iva.valore;
					}
					var dataQta = item.quantitaPredefinita;
					var dataPrezzoBase = item.prezzoListinoBase;
					$('#articolo').append('<option value="'+item.id+'" data-udm="'+dataUdm+'" data-iva="'+dataIva+'" data-qta="'+dataQta+'" data-prezzo-base="'+dataPrezzoBase+'">'+item.codice+' '+item.descrizione+'</option>');

				});
			}
		},
		error: function(jqXHR, textStatus, errorThrown) {
			console.log('Response text: ' + jqXHR.responseText);
		}
	});
}

$.fn.extractIdDdtFromUrl = function(){
    var pageUrl = window.location.search.substring(1);

	var urlVariables = pageUrl.split('&'),
        paramNames,
        i;

    for (i = 0; i < urlVariables.length; i++) {
        paramNames = urlVariables[i].split('=');

        if (paramNames[0] === 'idDdt') {
        	return paramNames[1] === undefined ? null : decodeURIComponent(paramNames[1]);
        }
    }
}

$.fn.extractDataTrasportoFromUrl = function(){
	var pageUrl = window.location.search.substring(1);

	var urlVariables = pageUrl.split('&'),
		paramNames,
		i;

	for (i = 0; i < urlVariables.length; i++) {
		paramNames = urlVariables[i].split('=');

		if (paramNames[0] === 'dt') {
			return paramNames[1] === undefined ? null : decodeURIComponent(paramNames[1]);
		}
	}
}

$.fn.extractOraTrasportoFromUrl = function(){
	var pageUrl = window.location.search.substring(1);

	var urlVariables = pageUrl.split('&'),
		paramNames,
		i;

	for (i = 0; i < urlVariables.length; i++) {
		paramNames = urlVariables[i].split('=');

		if (paramNames[0] === 'ot') {
			return paramNames[1] === undefined ? null : decodeURIComponent(paramNames[1]);
		}
	}
}


$.fn.getDdt = function(idDdt){

	var alertContent = '<div id="alertDdtAcquistoContent" class="alert alert-danger alert-dismissible fade show" role="alert">';
	alertContent = alertContent +  '<strong>Errore nel recupero del DDT</strong>\n' +
		'<button type="button" class="close" data-dismiss="alert" aria-label="Close"><span aria-hidden="true">&times;</span></button></div>';

	$.ajax({
		url: baseUrl + "ddts/" + idDdt,
		type: 'GET',
		dataType: 'json',
		success: function(result) {
			if(result != null && result != undefined && result != ''){

				$('#hiddenIdDdt').attr('value', result.id);
				$('#progressivo').attr('value', result.progressivo);
				$('#annoContabile').attr('value', result.annoContabile);
				$('#data').attr('value', result.data);
				if(result.cliente != null && result.cliente != undefined){
					$('#cliente option[value="' + result.cliente.id +'"]').attr('selected', true);

					$.ajax({
						url: baseUrl + "clienti/"+result.cliente.id+"/punti-consegna",
						type: 'GET',
						dataType: 'json',
						success: function(result) {
							if(result != null && result != undefined && result != ''){
								$.each(result, function(i, item){
									var label = item.nome+' - '+item.indirizzo+' '+item.localita+', '+item.cap+'('+item.provincia+')';
									var selected = '';
									if(result.puntoConsegna != null){
										if(result.puntoConsegna.id == item.id){
											selected = 'selected';
										}
									}
									$('#puntoConsegna').append('<option value="'+item.id+'" '+selected+'>'+label+'</option>');
								});
							}
							$('#puntoConsegna').removeAttr('disabled');
						},
						error: function(jqXHR, textStatus, errorThrown) {
							$('#alertDdt').empty().append(alertContent.replace('@@alertText@@','Errore nel caricamento dei punti di consegna').replace('@@alertResult@@', 'danger'));
						}
					});
				}
				$('#colli').attr('value', result.numeroColli);
				$('#dataTrasporto').attr('value', result.dataTrasporto);
				$('#oraTrasporto').attr('value', result.oraTrasporto);
				$('#tipoTrasporto option[value="' + result.tipoTrasporto +'"]').attr('selected', true);
				$('#trasportatore').attr('value', result.trasportatore);
				$('#note').val(result.note);

				if(result.ddtArticoli != null && result.ddtArticoli != undefined && result.ddtArticoli.length != 0){
					result.ddtArticoli.forEach(function(item, i){
						var articolo = item.articolo;
						var articoloId = item.id.articoloId;
						var articoloDesc = articolo.codice+' '+articolo.descrizione;
						var udm = articolo.unitaMisura.etichetta;
						var iva = articolo.aliquotaIva.valore;
						var pezzi = item.numeroPezzi;
						var quantita = item.quantita;
						var prezzo = item.prezzo;
						var sconto = item.sconto;
						var lotto = item.lotto;
						if(lotto != null && lotto != undefined && lotto != ''){
							var lottoHtml = '<input type="text" class="form-control form-control-sm text-center compute-totale" value="'+lotto+'">';
						} else {
							var lottoHtml = '<input type="text" class="form-control form-control-sm text-center compute-totale" value="">';
						}

						var quantitaHtml = '<input type="number" step=".01" min="0" class="form-control form-control-sm text-center compute-totale" value="'+quantita+'">';
						var pezziHtml = '<input type="number" step="1" min="0" class="form-control form-control-sm text-center compute-totale" value="'+pezzi+'">';
						var prezzoHtml = '<input type="number" step=".01" min="0" class="form-control form-control-sm text-center compute-totale" value="'+prezzo+'">';
						var scontoHtml = '<input type="number" step=".01" min="0" class="form-control form-control-sm text-center compute-totale" value="'+sconto+'">';

						var totale = 0;
						quantita = $.fn.parseValue(quantita, 'float');
						prezzo = $.fn.parseValue(prezzo, 'float');
						sconto = $.fn.parseValue(sconto, 'float');
						totale = Number(Math.round(((quantita * prezzo) - sconto) + 'e2') + 'e-2');

						var deleteLink = '<a class="deleteDdtArticolo" data-id="'+articoloId+'" href="#"><i class="far fa-trash-alt" title="Rimuovi"></i></a>';

						var table = $('#ddtArticoliTable').DataTable();
						var rowNode = table.row.add( [
							articoloDesc,
							lottoHtml,
							udm,
							quantitaHtml,
							pezziHtml,
							prezzoHtml,
							scontoHtml,
							totale,
							iva,
							deleteLink
						] ).draw( false ).node();
						$(rowNode).css('text-align', 'center');
						$(rowNode).addClass('rowArticolo');
						$(rowNode).attr('data-id', articoloId);

						$.fn.computeTotale();

					});
				}
			} else{
				$('#alertDdt').empty().append(alertContent);
			}
		},
		error: function(jqXHR, textStatus, errorThrown) {
			$('#alertDdt').append(alertContent);
			$('#updateDdtButton').attr('disabled', true);
			console.log('Response text: ' + jqXHR.responseText);
		}
	});
}


$.fn.parseValue = function(value, resultType){
	if(value != null && value != undefined && value != ''){
		if(resultType == 'float'){
			return parseFloat(value);
		} else if(resultType == 'int'){
			return parseInt(value);
		} else {
			return value;
		}
	} else {
		if(resultType == 'float'){
			return 0.0;
		} else {
			return 0;
		}
	}
}

$.fn.formatNumber = function(value){
	return parseFloat(Number(Math.round(value+'e2')+'e-2')).toFixed(2);
}

$.fn.computeTotale = function() {
	var ivaMap = new Map();
	var totaleDocumento = 0;

	$('.rowArticolo').each(function(i, item){
		var quantita = $(this).children().eq(3).text();
		quantita = $.fn.parseValue(quantita, 'float');
		var pezzi = $(this).children().eq(4).text();
		pezzi = $.fn.parseValue(pezzi, 'int');
		var prezzo = $(this).children().eq(5).text();
		prezzo = $.fn.parseValue(prezzo, 'float');
		var sconto = $(this).children().eq(6).text();
		sconto = $.fn.parseValue(sconto, 'float');
		var totale = $(this).children().eq(7).text();
		totale = $.fn.parseValue(totale, 'float');
		var iva = $(this).children().eq(8).text();
		iva = $.fn.parseValue(iva, 'int');

		var totaliIva;
		if(ivaMap.has(iva)){
			totaliIva = ivaMap.get(iva);
		} else {
			totaliIva = [];
		}
		totaliIva.push(totale);
		ivaMap.set(iva, totaliIva);

	});
	ivaMap.forEach( (value, key, map) => {
		var totalePerIva = value.reduce((a, b) => a + b, 0);
		var totaleConIva = totalePerIva + (totalePerIva * key/100);

		totaleDocumento += totaleConIva;
	});

	if(totaleDocumento != null && totaleDocumento != undefined && totaleDocumento != ""){
		totaleDocumento = parseFloat(totaleDocumento);
	}
	$('#totale').val(Number(Math.round(totaleDocumento+'e2')+'e-2'));
}

