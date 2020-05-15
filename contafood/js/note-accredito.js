var baseUrl = "/contafood-be/";

$.fn.loadNoteAccreditoTable = function(url) {

	$('#noteAccreditoTable').DataTable({
		"ajax": {
			"url": url,
			"type": "GET",
			"content-type": "json",
			"cache": false,
			"dataSrc": "",
			"error": function(jqXHR, textStatus, errorThrown) {
				console.log('Response text: ' + jqXHR.responseText);
				var alertContent = '<div id="alertNoteAccreditoContent" class="alert alert-danger alert-dismissible fade show" role="alert">';
				alertContent = alertContent + '<strong>Errore nel recupero delle Note Accredito</strong>\n' +
					'            <button type="button" class="close" data-dismiss="alert" aria-label="Close"><span aria-hidden="true">&times;</span></button></div>';
				$('#alertNoteAccredito').empty().append(alertContent);
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
			"emptyTable": "Nessuna Nota Accredito disponibile",
			"zeroRecords": "Nessun Nota Accredito disponibile"
		},
		"searching": false,
		"responsive":true,
		"pageLength": 20,
		"lengthChange": false,
		"info": false,
		"autoWidth": false,
		"order": [
			[0, 'desc']
		],
		"columns": [
			{"name": "numero", "data": "progressivo", "width":"5%"},
			{"name": "data", "data": null, "width":"8%", render: function ( data, type, row ) {
				var a = moment(data.data);
				return a.format('DD/MM/YYYY');
			}},
			{"name": "cliente", "data": null, "width":"10%", render: function ( data, type, row ) {
				var cliente = data.cliente;
				if(cliente != null){
					return cliente.ragioneSociale;
				}
				return '';
			}},
			{"name": "agente", "data": null, "width":"10%", render: function ( data, type, row ) {
				var cliente = data.cliente;
				if(cliente != null){
					var agente = cliente.agente;
					if(agente != null){
						return agente.nome + ' ' + agente.cognome;
					}
				}
				return '';
			}},
			{"name": "importo", "data": null, "width":"8%",render: function ( data, type, row ) {
				return $.fn.formatNumber(data.totale);
			}},
			{"data": null, "orderable":false, "width":"17%", render: function ( data, type, row ) {
				var acconto = data.totaleAcconto;
				if(acconto == null || acconto == undefined || acconto == ''){
					acconto = 0;
				}
				var totale = data.totale;
				if(totale == null || totale == undefined || totale == ''){
					totale = 0;
				}
				var stato = data.statoDdt;

				var links = '<a class="detailsNotaAccredito pr-1" data-id="'+data.id+'" href="#" title="Dettagli"><i class="fas fa-info-circle"></i></a>';
				links += '<a class="updateNotaAccredito pr-1" data-id="'+data.id+'" href="nota-accredito-edit.html?idNotaAccredito=' + data.id + '" title="Modifica"><i class="far fa-edit"></i></a>';
				links += '<a class="emailNotaAccredito pr-1" data-id="'+data.id+'" href="#" title="Spedizione email"><i class="fa fa-envelope"></i></a>';
				links += '<a class="printNotaAccredito pr-1" data-id="'+data.id+'" href="#" title="Stampa"><i class="fa fa-print"></i></a>';
				links += '<a class="deleteNotaAccredito" data-id="' + data.id + '" href="#" title="Elimina"><i class="far fa-trash-alt"></i></a>';
				return links;
			}}
		],
		"createdRow": function(row, data, dataIndex,cells){
			$(row).css('font-size', '12px');
			$(cells[6]).css('padding-right','0px').css('padding-left','3px');
			$(cells[5]).css('font-weight','bold').css('text-align','right');
		}
	});

}

$(document).ready(function() {

	$.fn.loadNoteAccreditoTable(baseUrl + "note-accredito");

	$('#notaAccreditoArticoliTable').DataTable({
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
		"pageLength": 50,
		"lengthChange": false,
		"info": false,
		"autoWidth": false,
		"order": [
			[0, 'asc']
		]
	});

	$(document).on('click','#resetSearchNoteAccreditoButton', function(){
		$('#searchNoteAccreditoForm :input').val(null);
		$('#searchNoteAccreditoForm select option[value=""]').attr('selected', true);

		$('#noteAccreditoTable').DataTable().destroy();
		$.fn.loadNoteAccreditoTable(baseUrl + "note-accredito");
	});

	$(document).on('click','.detailsNotaAccredito', function(){
		var idNotaAccredito = $(this).attr('data-id');

		var alertContent = '<div id="alertNotaAccreditoContent" class="alert alert-danger alert-dismissible fade show" role="alert">';
		alertContent = alertContent + '<strong>Errore nel recupero della Nota Accredito.</strong></div>';

		$.ajax({
			url: baseUrl + "note-accredito/" + idNotaAccredito,
			type: 'GET',
			dataType: 'json',
			success: function(result) {
				if(result != null && result != undefined && result != '') {
					$('#numero').text(result.progressivo);
					$('#data').text(moment(result.data).format('DD/MM/YYYY'));
					var cliente = result.cliente;
					if(cliente != null && cliente != undefined && cliente != ''){
						if(cliente.dittaIndividuale){
							$('#cliente').text(cliente.nome + ' ' + cliente.cognome);
						} else {
							$('#cliente').text(cliente.ragioneSociale);
						}
						var agente = cliente.agente;
						if(agente != null){
							$('#agente').text(agente.nome + ' ' + agente.cognome);
						}
					}
					$('#totale').text(result.totale);
					$('#totaleAcconto').text(result.totaleAcconto);

					var speditoAde = result.speditoAde;
					if(speditoAde){
						$('#speditoAde').text("Si");
					} else {
						$('#speditoAde').text("No");
					}

					$('#note').text(result.note);
					$('#dataInserimento').text(moment(result.dataInserimento).format('DD/MM/YYYY HH:mm:ss'));
					var dataAggiornamento = result.dataAggiornamento;
					if(dataAggiornamento != null && dataAggiornamento != undefined && dataAggiornamento != ''){
						$('#dataAggiornamento').text(moment(dataAggiornamento).format('DD/MM/YYYY HH:mm:ss'));
					}

					if(result.notaAccreditoArticoli != null && result.notaAccreditoArticoli != undefined){
						$('#detailsNoteAccreditoArticoliModalTable').DataTable({
							"data": result.notaAccreditoArticoli,
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
								[1, 'asc'],
								[2, 'asc'],
								[3, 'desc']
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
								{"name": "scadenza", "data": null, render: function (data, type, row) {
									var a = moment(data.scadenza);
									return a.format('DD/MM/YYYY');
								}},
								{"name": "quantita", "data": "quantita"},
								{"name": "pezzi", "data": "numeroPezzi"},
								{"name": "prezzo", "data": "prezzo"},
								{"name": "sconto", "data": "sconto"},
								{"name": "imponibile", "data": "imponibile"},
								{"name": "costo", "data": "costo"}
							]
						});
					}

					if(result.notaAccreditoTotali != null && result.notaAccreditoTotali != undefined){
						$('#detailsNoteAccreditoTotaliModalTable').DataTable({
							"data": result.notaAccreditoTotali,
							"language": {
								"paginate": {
									"first": "Inizio",
									"last": "Fine",
									"next": "Succ.",
									"previous": "Prec."
								},
								"search": "Cerca",
								"emptyTable": "Nessun totale presente",
								"zeroRecords": "Nessun totale presente"
							},
							"paging": false,
							"searching": false,
							"lengthChange": false,
							"info": false,
							"order": [
								[0, 'asc']
							],
							"autoWidth": false,
							"columns": [
								{"name": "aliquotaIva", "data": null, render: function (data, type, row) {
									var result = '';
									if (data.aliquotaIva != null) {
										result = data.aliquotaIva.valore;
									}
									return result;
								}},
								{"name": "totaleIva", "data": "totaleIva"},
								{"name": "totaleImponibile", "data": "totaleImponibile"}
							]
						});
					}

					if(result.notaAccreditoInfo != null && result.notaAccreditoInfo != undefined){
						$('#detailsNoteAccreditoInfoModalTable').DataTable({
							"data": result.notaAccreditoInfo,
							"language": {
								"paginate": {
									"first": "Inizio",
									"last": "Fine",
									"next": "Succ.",
									"previous": "Prec."
								},
								"search": "Cerca",
								"emptyTable": "Nessuna info aggiuntiva presente",
								"zeroRecords": "Nessuna info aggiuntiva presente"
							},
							"paging": false,
							"searching": false,
							"lengthChange": false,
							"info": false,
							"order": [
								[0, 'asc']
							],
							"autoWidth": false,
							"columns": [
								{"name": "descrizione", "data": "descrizione"},
								{"name": "lotto", "data": "lotto"},
								{"name": "unitaMisura", "data": null, render: function (data, type, row) {
									var result = '';
									if(data.unitaMisura != null){
										result = data.unitaMisura.etichetta;
									}
									return result;
								}},
								{"name": "quantita", "data": "quantita"},
								{"name": "prezzo", "data": "prezzo"},
								{"name": "sconto", "data": "sconto"},
								{"name": "aliquotaIva", "data": null, render: function (data, type, row) {
									var result = '';
									if (data.aliquotaIva != null) {
										result = data.aliquotaIva.valore;
									}
									return result;
								}},
								{"name": "imponibile", "data": "imponibile"}
							]
						});
					}

				} else{
					$('#detailsNoteAccreditoMainDiv').empty().append(alertContent);
				}
			},
			error: function(jqXHR, textStatus, errorThrown) {
				$('#detailsNoteAccreditoMainDiv').empty().append(alertContent);
				console.log('Response text: ' + jqXHR.responseText);
			}
		})

		$('#detailsNoteAccreditoModal').modal('show');
	});

	$(document).on('click','.closeNoteAccredito', function(){
		$('#detailsNoteAccreditoArticoliModalTable').DataTable().destroy();
		$('#detailsNoteAccreditoTotaliModalTable').DataTable().destroy();
		$('#detailsNoteAccreditoInfoModalTable').DataTable().destroy();
		$('#detailsNoteAccreditoModal').modal('hide');
	});

	$(document).on('click','.deleteNotaAccredito', function(){
		var idNotaAccredito = $(this).attr('data-id');
		$('#confirmDeleteNoteAccredito').attr('data-id', idNotaAccredito);
		$('#deleteNoteAccreditoModal').modal('show');
	});

	$(document).on('click','#confirmDeleteNoteAccredito', function(){
		$('#deleteNoteAccreditoModal').modal('hide');
		var idNotaAccredito = $(this).attr('data-id');

		$.ajax({
			url: baseUrl + "note-accredito/" + idNotaAccredito,
			type: 'DELETE',
			success: function() {
				var alertContent = '<div id="alertNoteAccreditoContent" class="alert alert-success alert-dismissible fade show" role="alert">';
				alertContent = alertContent + '<strong>Nota Accredito</strong> cancellata con successo.\n' +
					'            <button type="button" class="close" data-dismiss="alert" aria-label="Close"><span aria-hidden="true">&times;</span></button></div>';
				$('#alertNoteAccredito').empty().append(alertContent);

				$('#noteAccreditoTable').DataTable().ajax.reload();
			},
			error: function(jqXHR, textStatus, errorThrown) {
				console.log('Response text: ' + jqXHR.responseText);
			}
		});
	});

	if($('#searchNoteAccreditoButton') != null && $('#searchNoteAccreditoButton') != undefined) {
		$(document).on('submit', '#searchNoteAccreditoForm', function (event) {
			event.preventDefault();

			var dataDa = $('#searchDataFrom').val();
			var dataA = $('#searchDataTo').val();
			var progressivo = $('#searchProgressivo').val();
			var importo = $('#searchImporto').val();
			var cliente = $('#searchCliente').val();
			var agente = $('#searchAgente option:selected').val();
			var articolo = $('#searchArticolo option:selected').val();

			var params = {};
			if(dataDa != null && dataDa != undefined && dataDa != ''){
				params.dataDa = dataDa;
			}
			if(dataA != null && dataA != undefined && dataA != ''){
				params.dataA = dataA;
			}
			if(progressivo != null && progressivo != undefined && progressivo != ''){
				params.progressivo = progressivo;
			}
			if(importo != null && importo != undefined && importo != ''){
				params.importo = importo;
			}
			if(cliente != null && cliente != undefined && cliente != ''){
				params.cliente = cliente;
			}
			if(agente != null && agente != undefined && agente != ''){
				params.agente = agente;
			}
			if(articolo != null && articolo != undefined && articolo != ''){
				params.articolo = articolo;
			}
			var url = baseUrl + "note-accredito?" + $.param( params );

			$('#noteAccreditoTable').DataTable().destroy();
			$.fn.loadNoteAccreditoTable(url);

		});
	}

	$.fn.validateLotto = function(){
		var validLotto = true;
		// check if all input fields 'lotto' are not empty
		$('.lotto').each(function(i, item){
			var lottoValue = $(this).val();
			if($.fn.checkVariableIsNull(lottoValue)){
				validLotto = false;
				return false;
			}
		});
		return validLotto;
	}

	if($('#newNotaAccreditoButton') != null && $('#newNotaAccreditoButton') != undefined && $('#newNotaAccreditoButton').length > 0){

		$('#articolo').selectpicker();
		$('#cliente').selectpicker();

		$(document).on('submit','#newNotaAccreditoForm', function(event){
			event.preventDefault();

			var alertContent = '<div id="alertDdtContent" class="alert alert-@@alertResult@@ alert-dismissible fade show" role="alert">';
			alertContent = alertContent + '<strong>@@alertText@@</strong>\n' +
				'<button type="button" class="close" data-dismiss="alert" aria-label="Close"><span aria-hidden="true">&times;</span></button></div>';

			var validLotto = $.fn.validateLotto();
			if(!validLotto){
				$('#alertNoteAccredito').empty().append(alertContent.replace('@@alertText@@', "Compilare tutti i dati 'Lotto'").replace('@@alertResult@@', 'danger'));
				return false;
			}

			var notaAccredito = new Object();
			notaAccredito.progressivo = $('#progressivo').val();
			notaAccredito.anno = $('#anno').val();
			notaAccredito.data = $('#data').val();

			var cliente = new Object();
			cliente.id = $('#cliente option:selected').val();
			notaAccredito.cliente = cliente;

			var notaAccreditoArticoliLength = $('.rowArticolo').length;
			if(notaAccreditoArticoliLength != null && notaAccreditoArticoliLength != undefined && notaAccreditoArticoliLength != 0){
				var notaAccreditoArticoli = [];
				$('.rowArticolo').each(function(i, item){
					var articoloId = $(this).attr('data-id');

					var notaAccreditoArticolo = {};
					var notaAccreditoArticoloId = new Object();
					notaAccreditoArticoloId.articoloId = articoloId;
					notaAccreditoArticolo.id = notaAccreditoArticoloId;

					notaAccreditoArticolo.lotto = $(this).children().eq(1).children().eq(0).val();
					notaAccreditoArticolo.scadenza = $(this).children().eq(2).children().eq(0).val();
					notaAccreditoArticolo.quantita = $(this).children().eq(4).children().eq(0).val();
					notaAccreditoArticolo.numeroPezzi = $(this).children().eq(5).children().eq(0).val();
					notaAccreditoArticolo.prezzo = $(this).children().eq(6).children().eq(0).val();
					notaAccreditoArticolo.sconto = $(this).children().eq(7).children().eq(0).val();

					notaAccreditoArticoli.push(notaAccreditoArticolo);
				});
				notaAccredito.notaAccreditoArticoli = notaAccreditoArticoli;
			}
			notaAccredito.note = $('#note').val();

			var notaAccreditoTotaliLength = $('.rowTotaliByIva').length;
			if(notaAccreditoTotaliLength != null && notaAccreditoTotaliLength != undefined && notaAccreditoTotaliLength != 0){
				var notaAccreditoTotali = [];
				$('.rowTotaliByIva').each(function(i, item){
					var aliquotaIvaId = $(this).attr('data-id');

					var notaAccreditoTotale = {};
					var notaAccreditoTotaleId = new Object();
					notaAccreditoTotaleId.aliquotaIvaId = aliquotaIvaId;
					notaAccreditoTotale.id = notaAccreditoTotaleId;

					notaAccreditoTotale.totaleIva = $(this).find('td').eq(1).text();
					notaAccreditoTotale.totaleImponibile = $(this).find('td').eq(2).text();

					notaAccreditoTotali.push(notaAccreditoTotale);
				});
				notaAccredito.notaAccreditoTotali = notaAccreditoTotali;
			}

			var notaAccreditoJson = JSON.stringify(notaAccredito);

			$.ajax({
				url: baseUrl + "note-accredito",
				type: 'POST',
				contentType: "application/json",
				dataType: 'json',
				data: notaAccreditoJson,
				success: function(result) {
					$('#alertNoteAccredito').empty().append(alertContent.replace('@@alertText@@','Nota Accredito creata con successo').replace('@@alertResult@@', 'success'));

					$('#newNotaAccreditoButton').attr("disabled", true);

					// Returns to the page with the list of DDTs
					setTimeout(function() {
						window.location.href = "note-accredito.html";
					}, 1000);
				},
				error: function(jqXHR, textStatus, errorThrown) {
					var errorMessage = 'Errore nella creazione della Nota Accredito';
					if(jqXHR != null && jqXHR != undefined){
						var jqXHRResponseJson = jqXHR.responseJSON;
						if(jqXHRResponseJson != null && jqXHRResponseJson != undefined && jqXHRResponseJson != ''){
							var jqXHRResponseJsonMessage = jqXHR.responseJSON.message;
							if(jqXHRResponseJsonMessage != null && jqXHRResponseJsonMessage != undefined && jqXHRResponseJsonMessage != '' && jqXHRResponseJsonMessage.indexOf('con progressivo') != -1){
								errorMessage = jqXHRResponseJsonMessage;
							}
						}
					}
					$('#alertNoteAccredito').empty().append(alertContent.replace('@@alertText@@', errorMessage).replace('@@alertResult@@', 'danger'));
				}
			});

		});
	}

	if($('#updateNotaAccreditoButton') != null && $('#updateNotaAccreditoButton') != undefined && $('#updateNotaAccreditoButton').length > 0){
		$('#articolo').selectpicker();
		$('#cliente').selectpicker();

		$(document).on('submit','#updateNotaAccreditoForm', function(event){
			event.preventDefault();

			var alertContent = '<div id="alertNotaAccreditoContent" class="alert alert-@@alertResult@@ alert-dismissible fade show" role="alert">';
			alertContent = alertContent + '<strong>@@alertText@@</strong>\n' +
				'<button type="button" class="close" data-dismiss="alert" aria-label="Close"><span aria-hidden="true">&times;</span></button></div>';

			var validLotto = $.fn.validateLotto();
			if(!validLotto){
				$('#alertNoteAccredito').empty().append(alertContent.replace('@@alertText@@', "Compilare tutti i dati 'Lotto'").replace('@@alertResult@@', 'danger'));
				return false;
			}

			var notaAccredito = new Object();
			notaAccredito.id = $('#hiddenIdNotaAccredito').val();
			notaAccredito.progressivo = $('#progressivo').val();
			notaAccredito.anno = $('#anno').val();
			notaAccredito.data = $('#data').val();

			var cliente = new Object();
			cliente.id = $('#cliente option:selected').val();
			notaAccredito.cliente = cliente;

			var notaAccreditoArticoliLength = $('.rowArticolo').length;
			if(notaAccreditoArticoliLength != null && notaAccreditoArticoliLength != undefined && notaAccreditoArticoliLength != 0){
				var notaAccreditoArticoli = [];
				$('.rowArticolo').each(function(i, item){
					var articoloId = $(this).attr('data-id');

					var notaAccreditoArticolo = {};
					var notaAccreditoArticoloId = new Object();
					notaAccreditoArticoloId.articoloId = articoloId;
					notaAccreditoArticolo.id = notaAccreditoArticoloId;

					notaAccreditoArticolo.lotto = $(this).children().eq(1).children().eq(0).val();
					notaAccreditoArticolo.scadenza = $(this).children().eq(2).children().eq(0).val();
					notaAccreditoArticolo.quantita = $(this).children().eq(4).children().eq(0).val();
					notaAccreditoArticolo.numeroPezzi = $(this).children().eq(5).children().eq(0).val();
					notaAccreditoArticolo.prezzo = $(this).children().eq(6).children().eq(0).val();
					notaAccreditoArticolo.sconto = $(this).children().eq(7).children().eq(0).val();

					notaAccreditoArticoli.push(notaAccreditoArticolo);
				});
				notaAccredito.notaAccreditoArticoli = notaAccreditoArticoli;
			}
			notaAccredito.note = $('#note').val();

			var notaAccreditoTotaliLength = $('.rowTotaliByIva').length;
			if(notaAccreditoTotaliLength != null && notaAccreditoTotaliLength != undefined && notaAccreditoTotaliLength != 0){
				var notaAccreditoTotali = [];
				$('.rowTotaliByIva').each(function(i, item){
					var aliquotaIvaId = $(this).attr('data-id');

					var notaAccreditoTotale = {};
					var notaAccreditoTotaleId = new Object();
					notaAccreditoTotaleId.aliquotaIvaId = aliquotaIvaId;
					notaAccreditoTotale.id = notaAccreditoTotaleId;

					notaAccreditoTotale.totaleIva = $(this).find('td').eq(1).text();
					notaAccreditoTotale.totaleImponibile = $(this).find('td').eq(2).text();

					notaAccreditoTotali.push(notaAccreditoTotale);
				});
				notaAccredito.notaAccreditoTotali = notaAccreditoTotali;
			}

			var notaAccreditoJson = JSON.stringify(notaAccredito);

			$.ajax({
				url: baseUrl + "note-accredito/"+notaAccredito.id,
				type: 'PUT',
				contentType: "application/json",
				dataType: 'json',
				data: notaAccreditoJson,
				success: function(result) {
					$('#alertNoteAccredito').empty().append(alertContent.replace('@@alertText@@','Nota Accredito aggiornata con successo').replace('@@alertResult@@', 'success'));

					$('#updateNotaAccreditoButton').attr("disabled", true);

					// Returns to the page with the list of DDTs
					setTimeout(function() {
						window.location.href = "note-accredito.html";
					}, 1000);
				},
				error: function(jqXHR, textStatus, errorThrown) {
					var errorMessage = 'Errore nella modifica della Nota Accredito';
					if(jqXHR != null && jqXHR != undefined){
						var jqXHRResponseJson = jqXHR.responseJSON;
						if(jqXHRResponseJson != null && jqXHRResponseJson != undefined && jqXHRResponseJson != ''){
							var jqXHRResponseJsonMessage = jqXHR.responseJSON.message;
							if(jqXHRResponseJsonMessage != null && jqXHRResponseJsonMessage != undefined && jqXHRResponseJsonMessage != '' && jqXHRResponseJsonMessage.indexOf('con progressivo') != -1){
								errorMessage = jqXHRResponseJsonMessage;
							}
						}
					}
					$('#alertNoteAccredito').empty().append(alertContent.replace('@@alertText@@', errorMessage).replace('@@alertResult@@', 'danger'));
				}
			});
		});
	}

	$(document).on('change','#cliente', function(){
		$('#articolo option[value=""]').prop('selected', true);
		$('#udm').val('');
		$('#iva').val('');
		$('#lotto').val('');
		$('#scadenza').val('');
		$('#quantita').val('');
		$('#pezzi').val('');
		$('#prezzo').val('');
		$('#sconto').val('');

		var alertContent = '<div id="alertNotaAccreditoContent" class="alert alert-@@alertResult@@ alert-dismissible fade show" role="alert">';
		alertContent = alertContent + '<strong>@@alertText@@</strong>\n' +
			'<button type="button" class="close" data-dismiss="alert" aria-label="Close"><span aria-hidden="true">&times;</span></button></div>';

		$('#alertNoteAccredito').empty();

		var cliente = $('#cliente option:selected').val();
		var idListino = $('#cliente option:selected').attr('data-id-listino');
		if(cliente != null && cliente != ''){

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
						$('#alertNoteAccredito').empty().append(alertContent.replace('@@alertText@@', 'Errore nel caricamento dei prezzi di listino').replace('@@alertResult@@', 'danger'));
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

			$('#articolo').removeAttr('disabled');
			$('#articolo').selectpicker('refresh');
		} else {
			$('#articolo').attr('disabled', true);
			$('#articolo').selectpicker('refresh');
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
		var alertContent = '<div id="alertNoteAccreditoContent" class="alert alert-@@alertResult@@ alert-dismissible fade show" role="alert">';
		alertContent = alertContent + '<strong>@@alertText@@</strong>\n' +
			'<button type="button" class="close" data-dismiss="alert" aria-label="Close"><span aria-hidden="true">&times;</span></button></div>';

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
				$('#alertNoteAccredito').empty().append(alertContent.replace('@@alertText@@', 'Errore nel caricamento degli sconti').replace('@@alertResult@@', 'danger'));
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
			$('#scadenza').val('');
			$('#quantita').val(quantita);
			$('#pezzi').val('');
			$('#prezzo').val(prezzo);
			$('#sconto').val(sconto);
		} else {
			$('#udm').val('');
			$('#iva').val('');
			$('#lotto').val('');
			$('#scadenza').val('');
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
			var alertContent = '<div class="alert alert-danger alert-dismissable">\n' +
				'                <button type="button" class="close" data-dismiss="alert" aria-hidden="true">&times;</button>\n' +
				'                Seleziona un articolo\n' +
				'              </div>';

			$('#addNotaAccreditoArticoloAlert').empty().append(alertContent);
			return;
		} else {
			$('#addNotaAccreditoArticoloAlert').empty();
		}

		var articolo = $('#articolo option:selected').text();
		var udm = $('#udm').val();
		var lotto = $('#lotto').val();
		var scadenza = $('#scadenza').val();
		var quantita = $('#quantita').val();
		var pezzi = $('#pezzi').val();
		var prezzo = $('#prezzo').val();
		var sconto = $('#sconto').val();
		var iva = $('#iva').val();
		var codiceFornitore = $('#articolo option:selected').attr("data-codice-fornitore");

		if(lotto != null && lotto != undefined && lotto != ''){
			var lottoHtml = '<input type="text" class="form-control form-control-sm text-center compute-totale lotto group" value="'+lotto+'" data-codice-fornitore="'+codiceFornitore+'">';
		} else {
			var lottoHtml = '<input type="text" class="form-control form-control-sm text-center compute-totale lotto group" value="" data-codice-fornitore="'+codiceFornitore+'">';
		}
		var scadenzaHtml = '<input type="date" class="form-control form-control-sm text-center compute-totale scadenza group" value="'+moment(scadenza).format('YYYY-MM-DD')+'">';

		var quantitaHtml = '<input type="number" step=".001" min="0" class="form-control form-control-sm text-center compute-totale" value="'+ $.fn.fixDecimalPlaces(quantita,3)+'">';
		var pezziHtml = '<input type="number" step="1" min="0" class="form-control form-control-sm text-center compute-totale" value="'+pezzi+'">';
		var prezzoHtml = '<input type="number" step=".001" min="0" class="form-control form-control-sm text-center compute-totale group" value="'+prezzo+'">';
		var scontoHtml = '<input type="number" step=".001" min="0" class="form-control form-control-sm text-center compute-totale group" value="'+sconto+'">';

		// check if a same articolo was already added
		var found = 0;
		var currentRowIndex;
		var currentIdArticolo;
		var currentLotto;
		var currentPrezzo;
		var currentSconto;
		var currentScadenza;
		var currentQuantita = 0;
		var currentPezzi = 0;

		var notaAccreditoArticoliLength = $('.rowArticolo').length;
		if(notaAccreditoArticoliLength != null && notaAccreditoArticoliLength != undefined && notaAccreditoArticoliLength != 0) {
			$('.rowArticolo').each(function(i, item){

				if(found != 1){
					currentRowIndex = $(this).attr('data-row-index');
					currentIdArticolo = $(this).attr('data-id');
					currentLotto = $(this).children().eq(1).children().eq(0).val();
					currentScadenza = $(this).children().eq(2).children().eq(0).val();
					currentPrezzo = $(this).children().eq(6).children().eq(0).val();
					currentSconto = $(this).children().eq(7).children().eq(0).val();

					if($.fn.normalizeIfEmptyOrNullVariable(currentIdArticolo) == $.fn.normalizeIfEmptyOrNullVariable(articoloId)
						&& $.fn.normalizeIfEmptyOrNullVariable(currentLotto) == $.fn.normalizeIfEmptyOrNullVariable(lotto)
						&& $.fn.normalizeIfEmptyOrNullVariable(currentPrezzo) == $.fn.normalizeIfEmptyOrNullVariable(prezzo)
						&& $.fn.normalizeIfEmptyOrNullVariable(currentSconto) == $.fn.normalizeIfEmptyOrNullVariable(sconto)
						&& $.fn.normalizeIfEmptyOrNullVariable(currentScadenza) == $.fn.normalizeIfEmptyOrNullVariable(scadenza)){
						found = 1;
						currentQuantita = $(this).children().eq(4).children().eq(0).val();
						currentPezzi = $(this).children().eq(5).children().eq(0).val();
					}
				}
			});
		}

		var totale = 0;
		quantita = $.fn.parseValue(quantita, 'float');
		prezzo = $.fn.parseValue(prezzo, 'float');
		sconto = $.fn.parseValue(sconto, 'float');
		pezzi = $.fn.parseValue(pezzi, 'int');

		var quantitaPerPrezzo = ((quantita + $.fn.parseValue(currentQuantita,'float')) * prezzo);
		var scontoValue = (sconto/100)*quantitaPerPrezzo;
		totale = Number(Math.round((quantitaPerPrezzo - scontoValue) + 'e2') + 'e-2');

		var table = $('#notaAccreditoArticoliTable').DataTable();
		if(found == 1){
			//$('tr[data-id="'+currentIdArticolo+'"]').children().eq(3).children().eq(0).val(quantita + $.fn.parseValue(currentQuantita,'float'));
			//$('tr[data-id="'+currentIdArticolo+'"]').children().eq(7).text(totale);

			var newQuantita = (quantita + $.fn.parseValue(currentQuantita,'float'));

			var newQuantitaHtml = '<input type="number" step=".001" min="0" class="form-control form-control-sm text-center compute-totale ignore-barcode-scanner" value="'+ $.fn.fixDecimalPlaces(newQuantita, 3) +'">';
			var newPezziHtml = '<input type="number" step="1" min="0" class="form-control form-control-sm text-center compute-totale ignore-barcode-scanner" value="'+(pezzi + $.fn.parseValue(currentPezzi,'int'))+'">';

			var rowData = table.row("[data-row-index='"+currentRowIndex+"']").data();
			rowData[4] = newQuantitaHtml;
			rowData[5] = newPezziHtml;
			rowData[8] = totale;
			table.row("[data-row-index='"+currentRowIndex+"']").data(rowData).draw();
			//$('#ddtArticoliTable').DataTable().row(currentRowIndex)

		} else {
			var deleteLink = '<a class="deleteNotaAccreditoArticolo" data-id="'+articoloId+'" href="#"><i class="far fa-trash-alt" title="Rimuovi"></i></a>';

			var rowsCount = table.rows().count();

			var rowNode = table.row.add( [
				articolo,
				lottoHtml,
				scadenzaHtml,
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
			$(rowNode).attr('data-row-index', parseInt(rowsCount) + 1);
		}
		$.fn.computeTotale();

		$('#articolo option[value=""]').prop('selected',true);
		$('#udm').val('');
		$('#iva').val('');
		$('#lotto').val('');
		$('#scadenza').val('');
		$('#quantita').val('');
		$('#pezzi').val('');
		$('#prezzo').val('');
		$('#sconto').val('');

		$('#articolo').focus();
		$('#articolo').selectpicker('refresh');
	});

	$(document).on('click','.deleteNotaAccreditoArticolo', function(){
		$('#notaAccreditoArticoliTable').DataTable().row( $(this).parent().parent() )
			.remove()
			.draw();
		$('#notaAccreditoArticoliTable').focus();

		$.fn.computeTotale();
	});

	$(document).on('change','.compute-totale', function(){
		$.row = $(this).parent().parent();
		var quantita = $.row.children().eq(4).children().eq(0).val();
		quantita = $.fn.parseValue(quantita, 'float');
		var prezzo = $.row.children().eq(6).children().eq(0).val();
		prezzo = $.fn.parseValue(prezzo, 'float');
		var sconto = $.row.children().eq(7).children().eq(0).val();
		sconto = $.fn.parseValue(sconto, 'float');

		var quantitaPerPrezzo = (quantita * prezzo);
		var scontoValue = (sconto/100)*quantitaPerPrezzo;
		var totale = Number(Math.round((quantitaPerPrezzo - scontoValue) + 'e2') + 'e-2');

		//var totale = Number(Math.round(((quantita * prezzo) - sconto) + 'e2') + 'e-2');
		$.row.children().eq(8).text(totale);

		$.fn.computeTotale();
	});

});

$.fn.preloadSearchFields = function(){

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

}

$.fn.preloadFields = function(){
	$.ajax({
		url: baseUrl + "note-accredito/progressivo",
		type: 'GET',
		dataType: 'json',
		success: function(result) {
			if(result != null && result != undefined && result != ''){
				$('#progressivo').attr('value', result.progressivo);
				$('#anno').attr('value', result.anno);
				$('#data').val(moment().format('YYYY-MM-DD'));

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
		url: baseUrl + "clienti?bloccaDdt=false",
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

					$('#cliente').selectpicker('refresh');
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
					$('#articolo').append('<option value="'+item.id+'" data-udm="'+dataUdm+'" data-iva="'+dataIva+'" data-qta="'+dataQta+'" data-prezzo-base="'+dataPrezzoBase+'" data-codice-fornitore="'+item.fornitore.codice+'">'+item.codice+' '+item.descrizione+'</option>');

					$('#articolo').selectpicker('refresh');
				});
			}
		},
		error: function(jqXHR, textStatus, errorThrown) {
			console.log('Response text: ' + jqXHR.responseText);
		}
	});
}

$.fn.extractIdNotaAccreditoFromUrl = function(){
    var pageUrl = window.location.search.substring(1);

	var urlVariables = pageUrl.split('&'),
        paramNames,
        i;

    for (i = 0; i < urlVariables.length; i++) {
        paramNames = urlVariables[i].split('=');

        if (paramNames[0] === 'idNotaAccredito') {
        	return paramNames[1] === undefined ? null : decodeURIComponent(paramNames[1]);
        }
    }
}

$.fn.getNotaAccredito = function(idNotaAccredito){

	var alertContent = '<div id="alertNotaAccreditoContent" class="alert alert-danger alert-dismissible fade show" role="alert">';
	alertContent = alertContent +  '<strong>Errore nel recupero della Nota Accredito</strong>\n' +
		'<button type="button" class="close" data-dismiss="alert" aria-label="Close"><span aria-hidden="true">&times;</span></button></div>';

	$.ajax({
		url: baseUrl + "note-accredito/" + idNotaAccredito,
		type: 'GET',
		dataType: 'json',
		success: function(result) {
			if(result != null && result != undefined && result != ''){

				$('#hiddenIdNotaAccredito').attr('value', result.id);
				$('#progressivo').attr('value', result.progressivo);
				$('#anno').attr('value', result.anno);
				$('#data').attr('value', result.data);
				if(result.cliente != null && result.cliente != undefined){
					$('#cliente option[value="' + result.cliente.id +'"]').attr('selected', true);

					$('#cliente').selectpicker('refresh');
				}
				$('#note').val(result.note);

				if(result.notaAccreditoArticoli != null && result.notaAccreditoArticoli != undefined && result.notaAccreditoArticoli.length != 0){
					result.notaAccreditoArticoli.forEach(function(item, i){
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
						var scadenza = item.scadenza;
						if(lotto != null && lotto != undefined && lotto != ''){
							var lottoHtml = '<input type="text" class="form-control form-control-sm text-center compute-totale lotto group" value="'+lotto+'" data-codice-fornitore="'+articolo.fornitore.codice+'">';
						} else {
							var lottoHtml = '<input type="text" class="form-control form-control-sm text-center compute-totale lotto group" value="" data-codice-fornitore="'+articolo.fornitore.codice+'">';
						}
						var scadenzaHtml = '<input type="date" class="form-control form-control-sm text-center compute-totale scadenza group" value="'+moment(scadenza).format('YYYY-MM-DD')+'">';
						var quantitaHtml = '<input type="number" step=".001" min="0" class="form-control form-control-sm text-center compute-totale" value="'+quantita+'">';
						var pezziHtml = '<input type="number" step="1" min="0" class="form-control form-control-sm text-center compute-totale" value="'+pezzi+'">';
						var prezzoHtml = '<input type="number" step=".001" min="0" class="form-control form-control-sm text-center compute-totale group" value="'+prezzo+'">';
						var scontoHtml = '<input type="number" step=".001" min="0" class="form-control form-control-sm text-center compute-totale group" value="'+sconto+'">';

						var totale = 0;
						quantita = $.fn.parseValue(quantita, 'float');
						prezzo = $.fn.parseValue(prezzo, 'float');
						sconto = $.fn.parseValue(sconto, 'float');
						var quantitaPerPrezzo = (quantita * prezzo);
						var scontoValue = (sconto/100)*quantitaPerPrezzo;
						totale = Number(Math.round((quantitaPerPrezzo - scontoValue) + 'e2') + 'e-2');

						var deleteLink = '<a class="deleteNotaAccreditoArticolo" data-id="'+articoloId+'" href="#"><i class="far fa-trash-alt" title="Rimuovi"></i></a>';

						var table = $('#noteAccreditoTable').DataTable();
						var rowNode = table.row.add( [
							articoloDesc,
							lottoHtml,
							scadenzaHtml,
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
				$('#alertNoteAccredito').empty().append(alertContent);
			}
		},
		error: function(jqXHR, textStatus, errorThrown) {
			$('#alertNoteAccredito').append(alertContent);
			$('#updateNotaAccreditoButton').attr('disabled', true);
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
		var totale = $(this).children().eq(8).text();
		totale = $.fn.parseValue(totale, 'float');
		var iva = $(this).children().eq(9).text();
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

$.fn.checkVariableIsNull = function(variable){
	if(variable == null || variable == undefined || variable == ''){
		return true;
	}
	return false;
}

$.fn.normalizeIfEmptyOrNullVariable = function(variable){
	if(variable != null && variable != undefined && variable != ''){
		return variable;
	}
	if(variable == null || variable == undefined){
		return '';
	}
	return '';
}

$.fn.fixDecimalPlaces = function(quantita, decimalPlaces){
	var quantitaFixed = quantita;

	if(typeof quantita != "string"){
		quantita = quantita.toString();
	}

	if(quantita.indexOf('.') != -1){
		var numDecimalPlaces = quantita.substring(quantita.indexOf('.')+1, quantita.length).length;
		if(numDecimalPlaces > decimalPlaces){
			quantitaFixed = quantita.substring(0, quantita.indexOf('.')+1);
			quantitaFixed += quantita.substring(quantita.indexOf('.')+1, quantita.indexOf('.')+4);
		}
	}

	return quantitaFixed;
}
