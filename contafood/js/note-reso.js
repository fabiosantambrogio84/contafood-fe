var baseUrl = "/contafood-be/";

$.fn.loadNoteResoTable = function(url) {

	$('#noteResoTable').DataTable({
		"ajax": {
			"url": url,
			"type": "GET",
			"content-type": "json",
			"cache": false,
			"dataSrc": "",
			"error": function(jqXHR, textStatus, errorThrown) {
				console.log('Response text: ' + jqXHR.responseText);
				var alertContent = '<div id="alertNoteResoContent" class="alert alert-danger alert-dismissible fade show" role="alert">';
				alertContent = alertContent + '<strong>Errore nel recupero delle Note Reso</strong>\n' +
					'            <button type="button" class="close" data-dismiss="alert" aria-label="Close"><span aria-hidden="true">&times;</span></button></div>';
				$('#alertNoteReso').empty().append(alertContent);
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
			"emptyTable": "Nessuna Nota Reso disponibile",
			"zeroRecords": "Nessun Nota Reso disponibile"
		},
		"searching": false,
		"responsive":true,
		"pageLength": 20,
		"lengthChange": false,
		"info": false,
		"autoWidth": false,
		"order": [
			[0, 'desc'],
			[1, 'desc']
		],
		"columns": [
			{"name": "speditoAde", "data": null, "width":"8%", render: function ( data, type, row ) {
				var speditoAde = data.speditoAde;
				if(speditoAde){
					return "Si";
				} else {
					return "No";
				}
			}},
			{"name": "numero", "data": "progressivo", "width":"5%"},
			{"name": "data", "data": null, "width":"8%", render: function ( data, type, row ) {
				var a = moment(data.data);
				return a.format('DD/MM/YYYY');
			}},
			{"name": "fornitore", "data": null, "width":"15%", render: function ( data, type, row ) {
				var fornitore = data.fornitore;
				if(fornitore != null){
					return fornitore.ragioneSociale;
				}
				return '';
			}},
			{"name": "acconto", "data": null, "width":"8%",render: function ( data, type, row ) {
				return $.fn.formatNumber(data.totaleAcconto);
			}},
			{"name": "importo", "data": null, "width":"8%",render: function ( data, type, row ) {
				return $.fn.formatNumber(data.totale);
			}},
			{"data": null, "orderable":false, "width":"10%", render: function ( data, type, row ) {
				var acconto = data.totaleAcconto;
				if(acconto == null || acconto == undefined || acconto == ''){
					acconto = 0;
				}
				var totale = data.totale;
				if(totale == null || totale == undefined || totale == ''){
					totale = 0;
				}
				var stato = data.statoNotaReso;

				var links = '<a class="detailsNotaReso pr-1" data-id="'+data.id+'" href="#" title="Dettagli"><i class="fas fa-info-circle"></i></a>';
				if(stato != null && stato != undefined && stato != '' && stato.codice == 'DA_PAGARE'){
					links += '<a class="updateNotaReso pr-1" data-id="'+data.id+'" href="note-reso-edit.html?idNotaReso=' + data.id + '" title="Modifica"><i class="far fa-edit"></i></a>';
				}
				if((totale - acconto) != 0){
					links += '<a class="payNotaReso pr-1" data-id="'+data.id+'" href="pagamenti-new.html?idNotaReso=' + data.id + '" title="Pagamento"><i class="fa fa-shopping-cart"></i></a>';
				}
				links += '<a class="emailNotaReso pr-1" data-id="'+data.id+'" href="#" title="Spedizione email"><i class="fa fa-envelope"></i></a>';
				links += '<a class="printNotaReso pr-1" data-id="'+data.id+'" href="#" title="Stampa"><i class="fa fa-print"></i></a>';
				links += '<a class="deleteNotaReso" data-id="' + data.id + '" href="#" title="Elimina"><i class="far fa-trash-alt"></i></a>';
				return links;
			}}
		],
		"createdRow": function(row, data, dataIndex,cells){
			$(row).css('font-size', '12px').addClass('rowNotaReso');
			$(row).attr('data-id-nota-reso', data.id);
			if(data.statoNotaReso != null){
				var backgroundColor = '';
				if(data.statoNotaReso.codice == 'DA_PAGARE'){
					backgroundColor = '#fcf456';
				} else if(data.statoNotaReso.codice == 'PARZIALMENTE_PAGATA'){
					backgroundColor = '#fcc08b';
				} else {
					backgroundColor = 'trasparent';
				}
				$(row).css('background-color', backgroundColor);
			}
			$(cells[4]).css('text-align','right');
			$(cells[5]).css('font-weight','bold').css('text-align','right');
			$(cells[6]).css('padding-right','0px').css('padding-left','3px');
		}
	});
}

$.fn.loadNoteResoTotaliTable = function(){

	$('#notaResoTotaliTable').DataTable({
		"ajax": {
			"url": baseUrl + "aliquote-iva",
			"type": "GET",
			"content-type": "json",
			"cache": false,
			"dataSrc": "",
			"error": function(jqXHR, textStatus, errorThrown) {
				console.log('Response text: ' + jqXHR.responseText);
				var alertContent = '<div id="alertNoteResoContent" class="alert alert-danger alert-dismissible fade show" role="alert">';
				alertContent = alertContent + '<strong>Errore nel recupero delle aliquote iva</strong>\n' +
					'            <button type="button" class="close" data-dismiss="alert" aria-label="Close"><span aria-hidden="true">&times;</span></button></div>';
				$('#alertNoteReso').empty().append(alertContent);
			}
		},
		"language": {
			"paginate": {
				"first": "Inizio",
				"last": "Fine",
				"next": "Succ.",
				"previous": "Prec."
			},
			"emptyTable": "Nessuna aliquota iva disponibile",
			"zeroRecords": "Nessuna aliquota iva disponibile"
		},
		"searching": false,
		"responsive":true,
		"paging": false,
		"lengthChange": false,
		"info": false,
		"autoWidth": false,
		"order": [
			[0, 'asc']
		],
		"columns": [
			{"name": "valore", "data": null, "width":"8%", render: function ( data, type, row ) {
				return data.valore;
			}},
			{"name": "totaleIva", "data": null, "width":"8%", render: function ( data, type, row ) {
				return ''
			}},
			{"name": "totaleImponibile", "data": null, "width":"8%", render: function ( data, type, row ) {
				return ''
			}}
		],
		"createdRow": function(row, data, dataIndex,cells){
			$(row).attr('data-id', data.id);
			$(row).attr('data-valore', data.valore);
			$(row).addClass('rowTotaliByIva');
			$(cells[0]).css('text-align','center');
			$(cells[1]).css('text-align','center');
			$(cells[2]).css('text-align','center');

		}
	});
}

$.fn.loadNoteResoArticoliTable = function(){

	var table =  $('#notaResoArticoliTable').DataTable({
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
		"columns": [
			{ "width": "25%" },
			{ "width": "12%" },
			{ "width": "10%" },
			{ "width": "5%" },
			{ "width": "8%" },
			{ "width": "8%" },
			{ "width": "8%" },
			{ "width": "8%" },
			{ "width": "8%" },
			{ "width": "5%" }
		],
		"order": [
			[0, 'asc']
		]
	});

	return table;
}

$(document).ready(function() {

	$.fn.loadNoteResoTable(baseUrl + "note-reso");

	if(window.location.search.substring(1).indexOf('idNotaReso') == -1){
		$.fn.loadNoteResoTotaliTable();
		$.fn.loadNoteResoArticoliTable();
	}

	$(document).on('click','#resetSearchNoteResoButton', function(){
		$('#searchNoteResoForm :input').val(null);
		$('#searchNoteResoForm select option[value=""]').attr('selected', true);

		$('#noteResoTable').DataTable().destroy();
		$.fn.loadNoteResoTable(baseUrl + "note-reso");
	});

	$(document).on('click','.detailsNotaReso', function(){
		var idNotaReso = $(this).attr('data-id');

		var alertContent = '<div id="alertNotaResoContent" class="alert alert-danger alert-dismissible fade show" role="alert">';
		alertContent = alertContent + '<strong>Errore nel recupero della Nota Reso.</strong></div>';

		$.ajax({
			url: baseUrl + "note-reso/" + idNotaReso,
			type: 'GET',
			dataType: 'json',
			success: function(result) {
				if(result != null && result != undefined && result != '') {
					$('#numero').text(result.progressivo);
					$('#data').text(moment(result.data).format('DD/MM/YYYY'));
					var fornitore = result.fornitore;
					if(fornitore != null && fornitore != undefined && fornitore != ''){
						$('#fornitore').text(fornitore.ragioneSociale);
					}
					$('#totale').text(result.totale);
					$('#totaleAcconto').text(result.totaleAcconto);

					var speditoAde = result.speditoAde;
					if(speditoAde){
						$('#speditoAde').text("Si");
					} else {
						$('#speditoAde').text("No");
					}
					var stato = result.statoNotaReso;
					if(stato != null && stato != undefined && stato != ''){
						$('#stato').text(stato.descrizione);
					}
					$('#note').text(result.note);
					$('#dataInserimento').text(moment(result.dataInserimento).format('DD/MM/YYYY HH:mm:ss'));
					var dataAggiornamento = result.dataAggiornamento;
					if(dataAggiornamento != null && dataAggiornamento != undefined && dataAggiornamento != ''){
						$('#dataAggiornamento').text(moment(dataAggiornamento).format('DD/MM/YYYY HH:mm:ss'));
					}

					if(result.notaResoRighe != null && result.notaResoRighe != undefined){
						$('#detailsNoteResoRigheModalTable').DataTable({
							"data": result.notaResoRighe,
							"language": {
								"paginate": {
									"first": "Inizio",
									"last": "Fine",
									"next": "Succ.",
									"previous": "Prec."
								},
								"search": "Cerca",
								"emptyTable": "Nessuna riga presente",
								"zeroRecords": "Nessuna riga presente"
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
								{"name": "imponibile", "data": "imponibile"},
								{"name": "aliquotaIva", "data": null, render: function (data, type, row) {
									var result = '';
									if (data.aliquotaIva != null) {
										result = data.aliquotaIva.valore;
									}
									return result;
								}}
							]
						});
					}

					if(result.notaResoTotali != null && result.notaResoTotali != undefined){
						$('#detailsNoteResoTotaliModalTable').DataTable({
							"data": result.notaResoTotali,
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

					if(result.notaResoPagamenti != null && result.notaResoPagamenti != undefined){
						$('#detailsNoteResoPagamentiModalTable').DataTable({
							"data": result.notaResoPagamenti,
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

				} else{
					$('#detailsNoteResoMainDiv').empty().append(alertContent);
				}
			},
			error: function(jqXHR, textStatus, errorThrown) {
				$('#detailsNoteResoMainDiv').empty().append(alertContent);
				console.log('Response text: ' + jqXHR.responseText);
			}
		})

		$('#detailsNoteResoModal').modal('show');
	});

	$(document).on('click','.closeNoteReso', function(){
		$('#detailsNoteResoRigheModalTable').DataTable().destroy();
		$('#detailsNoteResoTotaliModalTable').DataTable().destroy();
		$('#detailsNoteResoPagamentiModalTable').DataTable().destroy();
		$('#detailsNoteResoModal').modal('hide');
	});

	$(document).on('click','.deleteNotaReso', function(){
		var idNotaReso = $(this).attr('data-id');
		$('#confirmDeleteNoteReso').attr('data-id', idNotaReso);
		$('#deleteNoteResoModal').modal('show');
	});

	$(document).on('click','#confirmDeleteNoteReso', function(){
		$('#deleteNoteResoModal').modal('hide');
		var idNotaReso = $(this).attr('data-id');

		$.ajax({
			url: baseUrl + "note-reso/" + idNotaReso,
			type: 'DELETE',
			success: function() {
				var alertContent = '<div id="alertNoteResoContent" class="alert alert-success alert-dismissible fade show" role="alert">';
				alertContent = alertContent + '<strong>Nota Reso</strong> cancellata con successo.\n' +
					'            <button type="button" class="close" data-dismiss="alert" aria-label="Close"><span aria-hidden="true">&times;</span></button></div>';
				$('#alertNoteReso').empty().append(alertContent);

				$('#noteResoTable').DataTable().ajax.reload();
			},
			error: function(jqXHR, textStatus, errorThrown) {
				console.log('Response text: ' + jqXHR.responseText);
			}
		});
	});

	$(document).on('click','.printNotaReso', function(){
		var idNotaReso = $(this).attr('data-id');

		window.open(baseUrl + "stampe/note-reso/"+idNotaReso, '_blank');
	});

	if($('#searchNoteResoButton') != null && $('#searchNoteResoButton') != undefined) {
		$(document).on('submit', '#searchNoteResoForm', function (event) {
			event.preventDefault();

			var dataDa = $('#searchDataFrom').val();
			var dataA = $('#searchDataTo').val();
			var progressivo = $('#searchProgressivo').val();
			var importo = $('#searchImporto').val();
			var fornitore = $('#searchFornitore').val();
			var articolo = $('#searchArticolo option:selected').val();
			var stato = $('#searchStato option:selected').val();

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
			if(fornitore != null && fornitore != undefined && fornitore != ''){
				params.fornitore = fornitore;
			}
			if(articolo != null && articolo != undefined && articolo != ''){
				params.articolo = articolo;
			}
			if(stato != null && stato != undefined && stato != ''){
				params.stato = stato;
			}
			var url = baseUrl + "note-reso?" + $.param( params );

			$('#noteResoTable').DataTable().destroy();
			$.fn.loadNoteResoTable(url);

		});
	}

	if($('#newNotaResoButton') != null && $('#newNotaResoButton') != undefined && $('#newNotaResoButton').length > 0){

		$('#articolo').selectpicker();
		$('#fornitore').selectpicker();

		$(document).on('submit','#newNotaResoForm', function(event){
			event.preventDefault();

			$.fn.createNotaReso(false);

		});
	}

	if($('#newAndPrintNotaResoButton') != null && $('#newAndPrintNotaResoButton') != undefined && $('#newAndPrintNotaResoButton').length > 0){
		$('#articolo').selectpicker();
		$('#fornitore').selectpicker();

		$(document).on('click','#newAndPrintNotaResoButton', function(event){
			event.preventDefault();

			$.fn.createNotaReso(true);
		});
	}

	if($('#updateNotaResoButton') != null && $('#updateNotaResoButton') != undefined && $('#updateNotaResoButton').length > 0){
		$('#articolo').selectpicker();
		$('#fornitore').selectpicker();

		$(document).on('submit','#updateNotaResoForm', function(event){
			event.preventDefault();

			var alertContent = '<div id="alertNotaResoContent" class="alert alert-@@alertResult@@ alert-dismissible fade show" role="alert">';
			alertContent = alertContent + '<strong>@@alertText@@</strong>\n' +
				'<button type="button" class="close" data-dismiss="alert" aria-label="Close"><span aria-hidden="true">&times;</span></button></div>';


			var notaReso = new Object();
			notaReso.id = $('#hiddenIdNotaReso').val();
			notaReso.progressivo = $('#progressivo').val();
			notaReso.anno = $('#anno').val();
			notaReso.data = $('#data').val();

			var fornitore = new Object();
			fornitore.id = $('#fornitore option:selected').val();
			notaReso.fornitore = fornitore;

			notaReso.note = $('#note').val();

			var notaResoRigheLength = $('.rowArticolo').length;
			if(notaResoRigheLength != null && notaResoRigheLength != undefined && notaResoRigheLength != 0){
				var notaResoRighe = [];
				$('.rowArticolo').each(function(i, item){
					var articoloId = $(this).attr('data-id');

					var notaResoRiga = {};

					var notaResoRigaId = new Object();
					notaResoRiga.id = notaResoRigaId;

					notaResoRiga.descrizione = $(this).children().eq(0).children().eq(0).val();
					notaResoRiga.lotto = $(this).children().eq(1).children().eq(0).val();
					notaResoRiga.scadenza = $(this).children().eq(2).children().eq(0).val();

					var udm = $(this).children().eq(3).children().eq(0).val();
					if(udm != null && udm != ""){
						var unitaMisura = new Object();
						unitaMisura.id = udm;
						notaResoRiga.unitaMisura = unitaMisura;
					}
					notaResoRiga.quantita = $(this).children().eq(4).children().eq(0).val();
					notaResoRiga.prezzo = $(this).children().eq(5).children().eq(0).val();
					notaResoRiga.sconto = $(this).children().eq(6).children().eq(0).val();

					var iva = $(this).children().eq(8).children().eq(0).val();
					if(iva != null && iva != ""){
						var aliquotaIva = new Object();
						aliquotaIva.id = iva;
						notaResoRiga.aliquotaIva = aliquotaIva;
					}

					if(articoloId != null && articoloId != ""){
						var articolo = new Object();
						articolo.id = articoloId;
						notaResoRiga.articolo = articolo;
					}

					notaResoRighe.push(notaResoRiga);
				});
				notaReso.notaResoRighe = notaResoRighe;
			}

			var notaResoTotaliLength = $('.rowTotaliByIva').length;
			if(notaResoTotaliLength != null && notaResoTotaliLength != undefined && notaResoTotaliLength != 0){
				var notaResoTotali = [];
				$('.rowTotaliByIva').each(function(i, item){
					var aliquotaIvaId = $(this).attr('data-id');

					var notaResoTotale = {};
					var notaResoTotaleId = new Object();
					notaResoTotaleId.aliquotaIvaId = aliquotaIvaId;
					notaResoTotale.id = notaResoTotaleId;

					notaResoTotale.totaleIva = $(this).find('td').eq(1).text();
					notaResoTotale.totaleImponibile = $(this).find('td').eq(2).text();

					notaResoTotali.push(notaResoTotale);
				});
				notaReso.notaResoTotali = notaResoTotali;
			}

			var notaResoJson = JSON.stringify(notaReso);

			$.ajax({
				url: baseUrl + "note-reso/"+notaReso.id,
				type: 'PUT',
				contentType: "application/json",
				dataType: 'json',
				data: notaResoJson,
				success: function(result) {
					$('#alertNoteReso').empty().append(alertContent.replace('@@alertText@@','Nota Reso aggiornata con successo').replace('@@alertResult@@', 'success'));

					$('#updateNotaAccreditoButton').attr("disabled", true);

					// Returns to the page with the list of Nota Reso
					setTimeout(function() {
						window.location.href = "note-reso.html";
					}, 1000);
				},
				error: function(jqXHR, textStatus, errorThrown) {
					var errorMessage = 'Errore nella modifica della Nota Reso';
					if(jqXHR != null && jqXHR != undefined){
						var jqXHRResponseJson = jqXHR.responseJSON;
						if(jqXHRResponseJson != null && jqXHRResponseJson != undefined && jqXHRResponseJson != ''){
							var jqXHRResponseJsonMessage = jqXHR.responseJSON.message;
							if(jqXHRResponseJsonMessage != null && jqXHRResponseJsonMessage != undefined && jqXHRResponseJsonMessage != '' && jqXHRResponseJsonMessage.indexOf('con progressivo') != -1){
								errorMessage = jqXHRResponseJsonMessage;
							}
						}
					}
					$('#alertNoteReso').empty().append(alertContent.replace('@@alertText@@', errorMessage).replace('@@alertResult@@', 'danger'));
				}
			});
		});
	}

	$(document).on('change','#fornitore', function(){
		$('#articolo option[value=""]').prop('selected', true);
		$('#udm').val('');
		$('#iva').val('');
		$('#lotto').val('');
		$('#scadenza').val('');
		$('#quantita').val('');
		$('#prezzo').val('');
		$('#sconto').val('');

		var alertContent = '<div id="alertNotaAccreditoContent" class="alert alert-@@alertResult@@ alert-dismissible fade show" role="alert">';
		alertContent = alertContent + '<strong>@@alertText@@</strong>\n' +
			'<button type="button" class="close" data-dismiss="alert" aria-label="Close"><span aria-hidden="true">&times;</span></button></div>';

		$('#alertNoteReso').empty();

		var fornitore = $('#fornitore option:selected').val();
		//var idListino = $('#fornitore option:selected').attr('data-id-listino');

		$.fn.getArticoli(fornitore);

		if(fornitore != null && fornitore != ''){
			/*
			// load the prices of the Listino associated to the Fornitore
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
						$('#alertNoteReso').empty().append(alertContent.replace('@@alertText@@', 'Errore nel caricamento dei prezzi di listino').replace('@@alertResult@@', 'danger'));
					}
				});
			} else {
				$("#articolo option").each(function(i){
					var prezzoAcquisto = $(this).attr('data-prezzo-acquisto');
					$(this).attr('data-prezzo-listino', prezzoAcquisto);
				});
			}

			// load Sconti associated to the Cliente
			var data = $('#data').val();
			if(data != null && data != undefined && data != ''){
				$.fn.loadScontiArticoli(data, cliente);
			}
			*/

			$('#articolo').removeAttr('disabled');
			$('#articolo').selectpicker('refresh');
		} else {
			$('#articolo').attr('disabled', true);
			$('#articolo').selectpicker('refresh');
		}
	});

	/*
	$(document).on('change','#data', function(){
		var data = $(this).val();
		var cliente = $('#cliente option:selected').val();
		if(data != null && data != undefined && data != '' && cliente != null && cliente != undefined && cliente != ''){
			$.fn.loadScontiArticoli(data, cliente);
		}
	});
	*/

	/*
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
				$('#alertNoteReso').empty().append(alertContent.replace('@@alertText@@', 'Errore nel caricamento degli sconti').replace('@@alertResult@@', 'danger'));
			}
		});
	}
	 */

	$(document).on('change','#articolo', function(){
		var articolo = $('#articolo option:selected').val();
		if(articolo != null && articolo != ''){
			var udm = $('#articolo option:selected').attr('data-udm');
			var iva = $('#articolo option:selected').attr('data-iva');
			var quantita = $('#articolo option:selected').attr('data-qta');
			var prezzoAcquisto = $('#articolo option:selected').attr('data-prezzo-acquisto');
			var prezzoListino = $('#articolo option:selected').attr('data-prezzo-listino');
			var prezzo;
			if(prezzoListino != null && prezzoListino != undefined && prezzoListino != ''){
				prezzo = prezzoListino;
			} else {
				prezzo = prezzoAcquisto;
			}
			var sconto = $('#articolo option:selected').attr('data-sconto');

			$('#udm option[value="' + udm +'"]').prop('selected', true);
			$('#iva option[value="' + iva +'"]').prop('selected', true);

			$('#lotto').val('');
			$('#scadenza').val('');
			$('#quantita').val(quantita);
			$('#prezzo').val(prezzo);
			$('#sconto').val(sconto);
		} else {
			('#udm option[value=""]').prop('selected', true);
			('#iva option[value=""]').prop('selected', true);
			$('#lotto').val('');
			$('#scadenza').val('');
			$('#quantita').val('');
			$('#prezzo').val('');
			$('#sconto').val('');
		}
	});

	$(document).on('click','#addArticolo', function(event){
		event.preventDefault();

		var articoloId = $('#articolo option:selected').val();

		$('#addNotaResoArticoloAlert').empty();

		var articolo = $('#articolo option:selected').text();
		var udm = $('#udm').val();
		var lotto = $('#lotto').val();
		var scadenza = $('#scadenza').val();
		var quantita = $('#quantita').val();
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
		var prezzoHtml = '<input type="number" step=".001" min="0" class="form-control form-control-sm text-center compute-totale group" value="'+prezzo+'">';
		var scontoHtml = '<input type="number" step=".001" min="0" class="form-control form-control-sm text-center compute-totale group" value="'+sconto+'">';

		var udmHtml = '<select class="form-control form-control-sm ">\n' +
			'                    <option value=""></option>';
		var udmValues = $('#_udm').data("udmValues");
		if(udmValues != null){
			udmValues.forEach(function(item, i){
				udmHtml += '<option value="'+item.id+'"';
				if(udm != null && udm != ""){
					if(udm == item.id){
						udmHtml += ' selected';
					}
				}
				udmHtml += '>'+item.etichetta+'</option>';
			});
		}
		udmHtml += '</select>';

		var ivaHtml = '<select class="form-control form-control-sm compute-totale">';
		var ivaValues = $('#_iva').data("ivaValues");
		if(ivaValues != null){
			ivaValues.forEach(function(item, i){
				ivaHtml += '<option value="'+item.id+'"';
				if(iva != null && iva != ""){
					if(iva == item.id){
						ivaHtml += ' selected';
					}
				}
				ivaHtml += '>'+item.valore+'</option>';
			});
		}
		ivaHtml += '</select>';

		var descrizioneHtml = '<textarea rows="1" style="width: 100%">'+articolo+'</textarea>';

		var totale = 0;
		quantita = $.fn.parseValue(quantita, 'float');
		prezzo = $.fn.parseValue(prezzo, 'float');
		sconto = $.fn.parseValue(sconto, 'float');

		var quantitaPerPrezzo = (quantita * prezzo);
		var scontoValue = (sconto/100)*quantitaPerPrezzo;
		totale = Number(Math.round((quantitaPerPrezzo - scontoValue) + 'e2') + 'e-2');

		var table = $('#notaResoArticoliTable').DataTable();

		var rowsCount = $.fn.getMaxRowsCountArticoliTable();

		var deleteLink = '<a class="deleteNotaResoArticolo" data-row-index="'+(parseInt(rowsCount) + 1)+'" href="#"><i class="far fa-trash-alt" title="Rimuovi"></i></a>';

		var rowNode = table.row.add( [
			descrizioneHtml,
			lottoHtml,
			scadenzaHtml,
			udmHtml,
			quantitaHtml,
			prezzoHtml,
			scontoHtml,
			totale,
			ivaHtml,
			deleteLink
		] ).draw( false ).node();
		$(rowNode).css('text-align', 'center');
		$(rowNode).addClass('rowArticolo');
		$(rowNode).attr('data-id', articoloId);
		$(rowNode).attr('data-row-index', parseInt(rowsCount) + 1);

		$.fn.computeTotale();

		$('#articolo option[value=""]').prop('selected',true);
		$('#udm').val('');
		$('#iva').val('');
		$('#lotto').val('');
		$('#scadenza').val('');
		$('#quantita').val('');
		$('#prezzo').val('');
		$('#sconto').val('');

		$('#articolo').focus();
		$('#articolo').selectpicker('refresh');
	});

	$(document).on('click','.deleteNotaResoArticolo', function(){
		$('#notaResoArticoliTable').DataTable().row( $(this).parent().parent() )
			.remove()
			.draw();
		$('#notaResoArticoliTable').focus();

		$.fn.computeTotale();
	});

	$(document).on('change','.compute-totale', function(){
		$.row = $(this).parent().parent();
		var quantita = $.row.children().eq(4).children().eq(0).val();
		quantita = $.fn.parseValue(quantita, 'float');
		var prezzo = $.row.children().eq(5).children().eq(0).val();
		prezzo = $.fn.parseValue(prezzo, 'float');
		var sconto = $.row.children().eq(6).children().eq(0).val();
		sconto = $.fn.parseValue(sconto, 'float');

		var quantitaPerPrezzo = (quantita * prezzo);
		var scontoValue = (sconto/100)*quantitaPerPrezzo;
		var totale = Number(Math.round((quantitaPerPrezzo - scontoValue) + 'e2') + 'e-2');

		$.row.children().eq(7).text(totale);

		$.fn.computeTotale();
	});

});

$.fn.preloadSearchFields = function(){

	$.ajax({
		url: baseUrl + "stati-note-reso",
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

$.fn.preloadFields = function(){
	$.ajax({
		url: baseUrl + "note-reso/progressivo",
		type: 'GET',
		dataType: 'json',
		success: function(result) {
			if(result != null && result != undefined && result != ''){
				$('#progressivo').attr('value', result.progressivo);
				$('#anno').attr('value', result.anno);
				$('#data').val(moment().format('YYYY-MM-DD'));

				$('#fornitore').focus();

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

$.fn.getFornitori = function(){

	return $.Deferred(function() {

		$.ajax({
			url: baseUrl + "fornitori",
			type: 'GET',
			dataType: 'json',
			success: function(result) {
				if(result != null && result != undefined && result != ''){
					$.each(result, function(i, item){
						var label = item.ragioneSociale;
						label += ' - ' + item.indirizzo + ' ' + item.citta + ', ' + item.cap + ' (' + item.provincia + ')';

						$('#fornitore').append('<option value="'+item.id+'">'+label+'</option>');

						$('#fornitore').selectpicker('refresh');
					});
				}
			},
			error: function(jqXHR, textStatus, errorThrown) {
				console.log('Response text: ' + jqXHR.responseText);
			}
		});

	});
}

$.fn.getArticoli = function(idFornitore){

	return $.Deferred(function() {

		var url = baseUrl + "articoli?attivo=true";
		if(idFornitore != null && idFornitore != ''){
			url += '&idFornitore='+idFornitore;
		}

		$('#articolo').empty();
		$('#articolo').append('<<option value=""></option>');
		$('#articolo').selectpicker('refresh');

		$.ajax({
			url: url,
			type: 'GET',
			dataType: 'json',
			success: function(result) {
				if(result != null && result != undefined && result != ''){
					$.each(result, function(i, item){
						var dataUdm = '';
						var udm = item.unitaMisura;
						if(udm != null && udm != undefined){
							dataUdm = udm.id;
						}
						var dataIva = '';
						var iva = item.aliquotaIva;
						if(iva != null && iva != undefined){
							dataIva = iva.id;
						}
						var dataQta = item.quantitaPredefinita;
						var dataAcquisto = item.prezzoAcquisto;
						$('#articolo').append('<option value="'+item.id+'" data-udm="'+dataUdm+'" data-iva="'+dataIva+'" data-qta="'+dataQta+'" data-prezzo-acquisto="'+dataAcquisto+'" data-codice-fornitore="'+item.fornitore.codice+'">'+item.codice+' '+item.descrizione+'</option>');

						$('#articolo').selectpicker('refresh');
					});
				}
			},
			error: function(jqXHR, textStatus, errorThrown) {
				console.log('Response text: ' + jqXHR.responseText);
			}
		});

	});
}


$.fn.getUnitaMisura = function(){

	return $.Deferred(function() {

		$.ajax({
			url: baseUrl + "unita-misura",
			type: 'GET',
			dataType: 'json',
			success: function(result) {
				if(result != null && result != undefined && result != ''){
					var udm = [];
					$.each(result, function(i, item){
						$('#udm').append('<option value="'+item.id+'">'+item.etichetta+'</option>');

						udm.push(item);
					});
					$('#_udm').data("udmValues", udm);

				}
			},
			error: function(jqXHR, textStatus, errorThrown) {
				console.log('Response text: ' + jqXHR.responseText);
			}
		});

	});
}

$.fn.getAliquoteIva = function(){

	return $.Deferred(function() {

		$.ajax({
			url: baseUrl + "aliquote-iva",
			type: 'GET',
			dataType: 'json',
			success: function(result) {
				var iva = [];
				if(result != null && result != undefined && result != ''){
					$.each(result, function(i, item){
						$('#iva').append('<option value="'+item.id+'">'+item.valore+'</option>');

						iva.push(item);
					});
					$('#_iva').data("ivaValues", iva);
				}
			},
			error: function(jqXHR, textStatus, errorThrown) {
				console.log('Response text: ' + jqXHR.responseText);
			}
		});

	});
}

$.fn.extractIdNotaResoFromUrl = function(){
    var pageUrl = window.location.search.substring(1);

	var urlVariables = pageUrl.split('&'),
        paramNames,
        i;

    for (i = 0; i < urlVariables.length; i++) {
        paramNames = urlVariables[i].split('=');

        if (paramNames[0] === 'idNotaReso') {
        	return paramNames[1] === undefined ? null : decodeURIComponent(paramNames[1]);
        }
    }
}

$.fn.getNotaReso = function(idNotaReso){

	var alertContent = '<div id="alertNotaResoContent" class="alert alert-danger alert-dismissible fade show" role="alert">';
	alertContent = alertContent +  '<strong>Errore nel recupero della Nota Reso</strong>\n' +
		'<button type="button" class="close" data-dismiss="alert" aria-label="Close"><span aria-hidden="true">&times;</span></button></div>';

	$.ajax({
		url: baseUrl + "note-reso/" + idNotaReso,
		type: 'GET',
		dataType: 'json',
		success: function(result) {
			if(result != null && result != undefined && result != ''){

				$('#hiddenIdNotaReso').attr('value', result.id);
				$('#progressivo').attr('value', result.progressivo);
				$('#anno').attr('value', result.anno);
				$('#data').attr('value', result.data);
				if(result.fornitore != null && result.fornitore != undefined){
					$('#fornitore option[value="' + result.fornitore.id +'"]').attr('selected', true);

					$('#fornitore').selectpicker('refresh');

					$.fn.getArticoli(result.fornitore.id);
				}
				$('#note').val(result.note);

				if(result.notaResoRighe != null && result.notaResoRighe != undefined && result.notaResoRighe.length != 0){

					var table = $('#notaResoArticoliTable').DataTable();
					if(table != null){
						table.destroy();
						table = $.fn.loadNoteResoArticoliTable();
					}

					result.notaResoRighe.forEach(function(item, i){
						var articolo = item.articolo;
						var articoloId;
						var codiceFornitore;
						if(articolo != null && articolo != ''){
							articoloId = item.id.articoloId;
							codiceFornitore = articolo.fornitore.codice;
						}
						var descrizione = item.descrizione;

						var udm;
						var unitaMisura = item.unitaMisura;
						if(unitaMisura != null && unitaMisura != ''){
							udm = unitaMisura.id;
						}
						var iva;
						var aliquotaIva = item.aliquotaIva;
						if(aliquotaIva != null && aliquotaIva != ''){
							iva = aliquotaIva.id;
						}

						var quantita = item.quantita;
						var prezzo = item.prezzo;
						var sconto = item.sconto;
						var lotto = item.lotto;
						var scadenza = item.scadenza;

						if(lotto != null && lotto != undefined && lotto != ''){
							var lottoHtml = '<input type="text" class="form-control form-control-sm text-center compute-totale lotto group" value="'+lotto+'" data-codice-fornitore="'+codiceFornitore+'">';
						} else {
							var lottoHtml = '<input type="text" class="form-control form-control-sm text-center compute-totale lotto group" value="" data-codice-fornitore="'+codiceFornitore+'">';
						}
						var scadenzaHtml = '<input type="date" class="form-control form-control-sm text-center compute-totale scadenza group" value="'+moment(scadenza).format('YYYY-MM-DD')+'">';
						var quantitaHtml = '<input type="number" step=".001" min="0" class="form-control form-control-sm text-center compute-totale" value="'+ $.fn.fixDecimalPlaces(quantita,3)+'">';
						var prezzoHtml = '<input type="number" step=".001" min="0" class="form-control form-control-sm text-center compute-totale group" value="'+prezzo+'">';
						var scontoHtml = '<input type="number" step=".001" min="0" class="form-control form-control-sm text-center compute-totale group" value="'+sconto+'">';

						var udmHtml = '<select class="form-control form-control-sm ">\n' +
							'                    <option value=""></option>';
						var udmValues = $('#_udm').data("udmValues");
						if(udmValues != null){
							udmValues.forEach(function(item, i){
								udmHtml += '<option value="'+item.id+'"';
								if(udm != null && udm != ""){
									if(udm == item.id){
										udmHtml += ' selected';
									}
								}
								udmHtml += '>'+item.etichetta+'</option>';
							});
						}
						udmHtml += '</select>';

						var ivaHtml = '<select class="form-control form-control-sm compute-totale">';
						var ivaValues = $('#_iva').data("ivaValues");
						if(ivaValues != null){
							ivaValues.forEach(function(item, i){
								ivaHtml += '<option value="'+item.id+'"';
								if(iva != null && iva != ""){
									if(iva == item.id){
										ivaHtml += ' selected';
									}
								}
								ivaHtml += '>'+item.valore+'</option>';
							});
						}
						ivaHtml += '</select>';

						var descrizioneHtml = '<textarea rows="1" style="width: 100%">'+descrizione+'</textarea>';

						var totale = 0;
						quantita = $.fn.parseValue(quantita, 'float');
						prezzo = $.fn.parseValue(prezzo, 'float');
						sconto = $.fn.parseValue(sconto, 'float');

						var quantitaPerPrezzo = (quantita * prezzo);
						var scontoValue = (sconto/100)*quantitaPerPrezzo;
						totale = Number(Math.round((quantitaPerPrezzo - scontoValue) + 'e2') + 'e-2');

						var rowsCount = $.fn.getMaxRowsCountArticoliTable();

						var deleteLink = '<a class="deleteNotaResoArticolo" data-row-index="'+(parseInt(rowsCount) + 1)+'" href="#"><i class="far fa-trash-alt" title="Rimuovi"></i></a>';

						var rowNode = table.row.add( [
							descrizioneHtml,
							lottoHtml,
							scadenzaHtml,
							udmHtml,
							quantitaHtml,
							prezzoHtml,
							scontoHtml,
							totale,
							ivaHtml,
							deleteLink
						] ).draw( false ).node();
						$(rowNode).css('text-align', 'center');
						$(rowNode).addClass('rowArticolo');
						$(rowNode).attr('data-id', articoloId);
						$(rowNode).attr('data-row-index', parseInt(rowsCount) + 1);

						$.fn.computeTotale();
					});

					if(result.notaResoTotali != null && result.notaResoTotali != undefined && result.notaResoTotali.length != 0){

						var notaResoTotaliTable = $('#notaResoTotaliTable').DataTable();
						if(notaResoTotaliTable != null){
							notaResoTotaliTable.destroy();
						}

						$('#notaResoTotaliTable').DataTable({
							"data": result.notaResoTotali,
							"language": {
								"paginate": {
									"first": "Inizio",
									"last": "Fine",
									"next": "Succ.",
									"previous": "Prec."
								},
								"emptyTable": "Nessuna aliquota iva disponibile",
								"zeroRecords": "Nessuna aliquota iva disponibile"
							},
							"searching": false,
							"responsive":true,
							"paging": false,
							"lengthChange": false,
							"info": false,
							"autoWidth": false,
							"order": [
								[0, 'asc']
							],
							"columns": [
								{"name": "valore", "data": null, "width":"8%", render: function ( data, type, row ) {
									var iva = '';
									var aliquotaIva = data.aliquotaIva;
									if(aliquotaIva != null && aliquotaIva != ''){
										iva = aliquotaIva.valore;
									}
									return iva;
								}},
								{"name": "totaleIva", "data": null, "width":"8%", render: function ( data, type, row ) {
									return data.totaleIva;
								}},
								{"name": "totaleImponibile", "data": null, "width":"8%", render: function ( data, type, row ) {
									return data.totaleImponibile;
								}}
							],
							"createdRow": function(row, data, dataIndex,cells){
								var aliquotaIva = data.aliquotaIva;
								var ivaId;
								var ivaValore;
								if(aliquotaIva != null && aliquotaIva != ''){
									ivaId = aliquotaIva.id;
									ivaValore = aliquotaIva.valore;
								}
								$(row).attr('data-id', ivaId);
								$(row).attr('data-valore', ivaValore);
								$(row).addClass('rowTotaliByIva');
								$(cells[0]).css('text-align','center');
								$(cells[1]).css('text-align','center');
								$(cells[2]).css('text-align','center');
							}
						});
					}

				}
			} else{
				$('#alertNoteReso').empty().append(alertContent);
			}
		},
		error: function(jqXHR, textStatus, errorThrown) {
			$('#alertNoteReso').append(alertContent);
			$('#updateNotaResoButton').attr('disabled', true);
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

$.fn.getMaxRowsCountArticoliTable = function(){
	var maxRowsCount = 0;
	var rowIndexes = [];
	$('#notaResoArticoliTable tbody tr').each(function(i, item){
		rowIndexes.push($.fn.parseValue($(this).attr('data-row-index'), 'int'));
	});

	if (Array.isArray(rowIndexes) && rowIndexes.length > 0){
		maxRowsCount= Math.max.apply(null, rowIndexes);
	}

	return maxRowsCount;
}

$.fn.emptyTotaliTable = function(){
	$('#notaResoTotaliTable tbody tr').each(function(i, item){
		$(this).find('td').eq(1).text('');
		$(this).find('td').eq(2).text('');
	});
}

$.fn.computeTotale = function() {
	var ivaMap = new Map();
	var totaleDocumento = 0;

	$.fn.emptyTotaliTable();

	$('.rowArticolo').each(function(i, item){
		var totale = $(this).children().eq(7).text();
		totale = $.fn.parseValue(totale, 'float');
		var iva = $(this).children().eq(8).children().eq(0).find('option:selected').text();
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

		// populating the table with iva and imponibile
		$('tr[data-valore='+key+']').find('td').eq(1).text($.fn.formatNumber((totalePerIva * key/100)));
		$('tr[data-valore='+key+']').find('td').eq(2).text($.fn.formatNumber(totalePerIva));
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

	if(quantita != null && quantita != ''){
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
	}

	return quantitaFixed;
}

$.fn.createNotaReso = function(print){

	var alertContent = '<div id="alertNotaResoContent" class="alert alert-@@alertResult@@ alert-dismissible fade show" role="alert">';
	alertContent = alertContent + '<strong>@@alertText@@</strong>\n' +
		'<button type="button" class="close" data-dismiss="alert" aria-label="Close"><span aria-hidden="true">&times;</span></button></div>';

	var notaReso = new Object();
	notaReso.progressivo = $('#progressivo').val();
	notaReso.anno = $('#anno').val();
	notaReso.data = $('#data').val();

	var fornitore = new Object();
	fornitore.id = $('#fornitore option:selected').val();
	notaReso.fornitore = fornitore;

	notaReso.note = $('#note').val();

	var notaResoRigheLength = $('.rowArticolo').length;
	if(notaResoRigheLength != null && notaResoRigheLength != undefined && notaResoRigheLength != 0){
		var notaResoRighe = [];
		$('.rowArticolo').each(function(i, item){
			var articoloId = $(this).attr('data-id');

			var notaResoRiga = {};

			var notaResoRigaId = new Object();
			notaResoRiga.id = notaResoRigaId;

			notaResoRiga.descrizione = $(this).children().eq(0).children().eq(0).val();
			notaResoRiga.lotto = $(this).children().eq(1).children().eq(0).val();
			notaResoRiga.scadenza = $(this).children().eq(2).children().eq(0).val();

			var udm = $(this).children().eq(3).children().eq(0).val();
			if(udm != null && udm != ""){
				var unitaMisura = new Object();
				unitaMisura.id = udm;
				notaResoRiga.unitaMisura = unitaMisura;
			}
			notaResoRiga.quantita = $(this).children().eq(4).children().eq(0).val();
			notaResoRiga.prezzo = $(this).children().eq(5).children().eq(0).val();
			notaResoRiga.sconto = $(this).children().eq(6).children().eq(0).val();

			var iva = $(this).children().eq(8).children().eq(0).val();
			if(iva != null && iva != ""){
				var aliquotaIva = new Object();
				aliquotaIva.id = iva;
				notaResoRiga.aliquotaIva = aliquotaIva;
			}

			if(articoloId != null && articoloId != ""){
				var articolo = new Object();
				articolo.id = articoloId;
				notaResoRiga.articolo = articolo;
			}

			notaResoRighe.push(notaResoRiga);
		});
		notaReso.notaResoRighe = notaResoRighe;
	}

	var notaResoTotaliLength = $('.rowTotaliByIva').length;
	if(notaResoTotaliLength != null && notaResoTotaliLength != undefined && notaResoTotaliLength != 0){
		var notaResoTotali = [];
		$('.rowTotaliByIva').each(function(i, item){
			var aliquotaIvaId = $(this).attr('data-id');

			var notaResoTotale = {};
			var notaResoTotaleId = new Object();
			notaResoTotaleId.aliquotaIvaId = aliquotaIvaId;
			notaResoTotale.id = notaResoTotaleId;

			notaResoTotale.totaleIva = $(this).find('td').eq(1).text();
			notaResoTotale.totaleImponibile = $(this).find('td').eq(2).text();

			notaResoTotali.push(notaResoTotale);
		});
		notaReso.notaResoTotali = notaResoTotali;
	}

	var notaResoJson = JSON.stringify(notaReso);

	$.ajax({
		url: baseUrl + "note-reso",
		type: 'POST',
		contentType: "application/json",
		dataType: 'json',
		data: notaResoJson,
		success: function(result) {
			var idNotaReso = result.id;

			$('#alertNoteReso').empty().append(alertContent.replace('@@alertText@@','Nota Reso creata con successo').replace('@@alertResult@@', 'success'));

			$('#newNotaAccreditoButton').attr("disabled", true);

			// Returns to the page with the list of Nota Reso
			setTimeout(function() {
				window.location.href = "note-reso.html";
			}, 1000);

			if(print){
				window.open(baseUrl + "stampe/note-reso/"+idNotaReso, '_blank');
			}
		},
		error: function(jqXHR, textStatus, errorThrown) {
			var errorMessage = 'Errore nella creazione della Nota Reso';
			if(jqXHR != null && jqXHR != undefined){
				var jqXHRResponseJson = jqXHR.responseJSON;
				if(jqXHRResponseJson != null && jqXHRResponseJson != undefined && jqXHRResponseJson != ''){
					var jqXHRResponseJsonMessage = jqXHR.responseJSON.message;
					if(jqXHRResponseJsonMessage != null && jqXHRResponseJsonMessage != undefined && jqXHRResponseJsonMessage != '' && jqXHRResponseJsonMessage.indexOf('con progressivo') != -1){
						errorMessage = jqXHRResponseJsonMessage;
					}
				}
			}
			$('#alertNoteReso').empty().append(alertContent.replace('@@alertText@@', errorMessage).replace('@@alertResult@@', 'danger'));
		}
	});
}
