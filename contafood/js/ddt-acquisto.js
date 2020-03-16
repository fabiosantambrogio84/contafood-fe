var baseUrl = "/contafood-be/";

$.fn.loadDdtAcquistoTable = function(url) {
	$('#ddtAcquistoTable').DataTable({
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
			[2, 'desc'],
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
			{"data": null, "orderable":false, "width":"8%", render: function ( data, type, row ) {
				var links = '<a class="detailsDdtAcquisto pr-1" data-id="'+data.id+'" href="#" title="Dettagli"><i class="fas fa-info-circle"></i></a>';
				links += '<a class="updateDdtAcquisto pr-1" data-id="'+data.id+'" href="ddt-acquisto-edit.html?idDdtAcquisto=' + data.id + '" title="Modifica"><i class="far fa-edit"></i></a>';
				links += '<a class="deleteDdtAcquisto" data-id="' + data.id + '" href="#" title="Elimina"><i class="far fa-trash-alt"></i></a>';
				return links;
			}}
		],
		"createdRow": function(row, data, dataIndex,cells){
			$(cells[0]).css('text-align','center');
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

			var params = {};
			if(numero != null && numero != undefined && numero != ''){
				params.numero = numero;
			}
			if(fornitore != null && fornitore != undefined && fornitore != ''){
				params.fornitore = fornitore;
			}
			var url = baseUrl + "ddts-acquisto?" + $.param( params );

			$('#ddtAcquistoTable').DataTable().destroy();
			$.fn.loadDdtAcquistoTable(url);

		});

		$(document).on('click','#resetSearchDdtAcquistoButton', function(){
			$('#searchDdtAcquistoForm :input').val(null);

			$('#ddtAcquistoTable').DataTable().destroy();
			$.fn.loadDdtAcquistoTable(baseUrl + "ddts-acquisto");
		});
	}

	if($('#newDdtAcquistoButton') != null && $('#newDdtAcquistoButton') != undefined){
		$(document).on('submit','#newDdtAcquistoForm', function(event){
			event.preventDefault();

			var ddtAcquisto = new Object();
			ddtAcquisto.numero = $('#numero').val();
			ddtAcquisto.data = $('#data').val();

			var fornitore = new Object();
			fornitore.id = $('#fornitore option:selected').val();
			ddtAcquisto.fornitore = fornitore;

			var ddtAcquistoArticoliLength = $('.rowArticolo').length;
			if(ddtAcquistoArticoliLength != null && ddtAcquistoArticoliLength != undefined && ddtAcquistoArticoliLength != 0){
				var ddtAcquistoArticoli = [];
				$('.rowArticolo').each(function(i, item){
					var articoloId = $(this).attr('data-id');

					var ddtAcquistoArticolo = {};
					var ddtAcquistoArticoloId = new Object();
					ddtAcquistoArticoloId.articoloId = articoloId;
					ddtAcquistoArticolo.id = ddtAcquistoArticoloId;

					ddtAcquistoArticolo.lotto = $(this).children().eq(1).children().eq(0).val();
					ddtAcquistoArticolo.dataScadenza = $(this).children().eq(2).children().eq(0).val();
					ddtAcquistoArticolo.quantita = $(this).children().eq(4).children().eq(0).val();
					ddtAcquistoArticolo.prezzo = $(this).children().eq(5).children().eq(0).val();
					ddtAcquistoArticolo.sconto = $(this).children().eq(6).children().eq(0).val();

					ddtAcquistoArticoli.push(ddtAcquistoArticolo);
				});
				ddtAcquisto.ddtAcquistoArticoli = ddtAcquistoArticoli;
			}
			ddtAcquisto.numeroColli = $('#colli').val();
			ddtAcquisto.note = $('#note').val();

			var ddtAcquistoJson = JSON.stringify(ddtAcquisto);

			var alertContent = '<div id="alertDdtAcquistoContent" class="alert alert-@@alertResult@@ alert-dismissible fade show" role="alert">';
			alertContent = alertContent + '<strong>@@alertText@@</strong>\n' +
				'<button type="button" class="close" data-dismiss="alert" aria-label="Close"><span aria-hidden="true">&times;</span></button></div>';

			$.ajax({
				url: baseUrl + "ddts-acquisto",
				type: 'POST',
				contentType: "application/json",
				dataType: 'json',
				data: ddtAcquistoJson,
				success: function(result) {
					$('#alertDdtAcquisto').empty().append(alertContent.replace('@@alertText@@','DDT acquisto creato con successo').replace('@@alertResult@@', 'success'));

					$('#newDdtAcquistoButton').attr("disabled", true);

					// Returns to the same page
					setTimeout(function() {
						window.location.href = "ddt-acquisto-new.html";
					}, 1000);
				},
				error: function(jqXHR, textStatus, errorThrown) {
					var errorMessage = 'Errore nella creazione del DDT acquisto';
					if(jqXHR != null && jqXHR != undefined){
						var jqXHRResponseJson = jqXHR.responseJSON;
						if(jqXHRResponseJson != null && jqXHRResponseJson != undefined && jqXHRResponseJson != ''){
							var jqXHRResponseJsonMessage = jqXHR.responseJSON.message;
							if(jqXHRResponseJsonMessage != null && jqXHRResponseJsonMessage != undefined && jqXHRResponseJsonMessage != '' && jqXHRResponseJsonMessage.indexOf('con progressivo') != -1){
								errorMessage = jqXHRResponseJsonMessage;
							}
						}
					}
					$('#alertDdtAcquisto').empty().append(alertContent.replace('@@alertText@@', errorMessage).replace('@@alertResult@@', 'danger'));
				}
			});

		});
	}

	if($('#updateDdtAcquistoButton') != null && $('#updateDdtAcquistoButton') != undefined){
		$(document).on('submit','#updateDdtAcquistoForm', function(event){
			event.preventDefault();

			var ddtAcquisto = new Object();
			ddtAcquisto.id = $('#hiddenIdDdtAcquisto').val();
			ddtAcquisto.numero = $('#numero').val();
			ddtAcquisto.data = $('#data').val();

			var fornitore = new Object();
			fornitore.id = $('#fornitore option:selected').val();
			ddtAcquisto.fornitore = fornitore;

			var ddtAcquistoArticoliLength = $('.rowArticolo').length;
			if(ddtAcquistoArticoliLength != null && ddtAcquistoArticoliLength != undefined && ddtAcquistoArticoliLength != 0){
				var ddtAcquistoArticoli = [];
				$('.rowArticolo').each(function(i, item){
					var articoloId = $(this).attr('data-id');

					var ddtAcquistoArticolo = {};
					var ddtAcquistoArticoloId = new Object();
					ddtAcquistoArticoloId.articoloId = articoloId;
					ddtAcquistoArticolo.id = ddtAcquistoArticoloId;

					ddtAcquistoArticolo.lotto = $(this).children().eq(1).children().eq(0).val();
					ddtAcquistoArticolo.dataScadenza = $(this).children().eq(3).children().eq(0).val();
					ddtAcquistoArticolo.quantita = $(this).children().eq(4).children().eq(0).val();
					ddtAcquistoArticolo.prezzo = $(this).children().eq(5).children().eq(0).val();
					ddtAcquistoArticolo.sconto = $(this).children().eq(6).children().eq(0).val();

					ddtAcquistoArticoli.push(ddtAcquistoArticolo);
				});
				ddtAcquisto.ddtAcquistoArticoli = ddtAcquistoArticoli;
			}
			ddtAcquisto.numeroColli = $('#colli').val();
			ddtAcquisto.note = $('#note').val();

			var ddtAcquistoJson = JSON.stringify(ddtAcquisto);

			var alertContent = '<div id="alertDdtAcquistoContent" class="alert alert-@@alertResult@@ alert-dismissible fade show" role="alert">';
			alertContent = alertContent + '<strong>@@alertText@@</strong>\n' +
				'<button type="button" class="close" data-dismiss="alert" aria-label="Close"><span aria-hidden="true">&times;</span></button></div>';

			$.ajax({
				url: baseUrl + "ddts-acquisto/"+ddtAcquisto.id,
				type: 'PUT',
				contentType: "application/json",
				dataType: 'json',
				data: ddtAcquistoJson,
				success: function(result) {
					$('#alertDdtAcquisto').empty().append(alertContent.replace('@@alertText@@','DDT Acquisto aggiornato con successo').replace('@@alertResult@@', 'success'));

					$('#updateDdtAcquistoButton').attr("disabled", true);

					// Returns to the page with the list of DDTs
					setTimeout(function() {
						window.location.href = "ddt-acquisto.html";
					}, 1000);
				},
				error: function(jqXHR, textStatus, errorThrown) {
					var errorMessage = 'Errore nella modifica del DDT Acquisto';
					if(jqXHR != null && jqXHR != undefined){
						var jqXHRResponseJson = jqXHR.responseJSON;
						if(jqXHRResponseJson != null && jqXHRResponseJson != undefined && jqXHRResponseJson != ''){
							var jqXHRResponseJsonMessage = jqXHR.responseJSON.message;
							if(jqXHRResponseJsonMessage != null && jqXHRResponseJsonMessage != undefined && jqXHRResponseJsonMessage != '' && jqXHRResponseJsonMessage.indexOf('con progressivo') != -1){
								errorMessage = jqXHRResponseJsonMessage;
							}
						}
					}
					$('#alertDdtAcquisto').empty().append(alertContent.replace('@@alertText@@', errorMessage).replace('@@alertResult@@', 'danger'));
				}
			});
		});
	}

	$(document).on('change','#fornitore', function(){
		$('#articolo option[value=""]').prop('selected', true);
		$('#udm').val('');
		$('#lotto').val('');
		$('#scadenza').val('');
		$('#quantita').val('');
		$('#prezzo').val('');
		$('#sconto').val('');

		var fornitore = $('#fornitore option:selected').val();
		if(fornitore != null && fornitore != ''){
			$.fn.getArticoli(fornitore);

			// load Sconti associated to the Fornitore
			/*
			var data = $('#data').val();
			if(data != null && data != undefined && data != ''){
				$.fn.loadScontiArticoli(data, fornitore);
			}
			*/
		} else {
			$('#articolo').empty();
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


	$.fn.loadScontiArticoli = function(data, fornitore){
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
	*/

	$(document).on('change','#articolo', function(){
		var articolo = $('#articolo option:selected').val();
		if(articolo != null && articolo != ''){
			var udm = $('#articolo option:selected').attr('data-udm');
			var quantita = $('#articolo option:selected').attr('data-qta');
			var prezzoBase = $('#articolo option:selected').attr('data-prezzo-base');
			var prezzo = prezzoBase;

			$('#udm').val(udm);
			$('#lotto').val('');
			$('#scadenza').val('');
			$('#quantita').val(quantita);
			$('#prezzo').val(prezzo);
			$('#sconto').val('');
		} else {
			$('#udm').val('');
			$('#lotto').val('');
			$('#scadenza').val('null');
			$('#quantita').val('');
			$('#prezzo').val('');
			$('#sconto').val('');
		}
	});

	$(document).on('click','#addArticolo', function(event){
		event.preventDefault();

		var articoloId = $('#articolo option:selected').val();

		if(articoloId == null || articoloId == undefined || articoloId == ''){
			$('#addDdtAcquistoArticoloAlert').removeClass("d-none");
			return;
		} else {
			if($('#lotto').val() == null || $('#lotto').val() == undefined || $('#lotto').val()==''){
				var alertContent = '<button type="button" class="close" data-dismiss="alert" aria-hidden="true">&times;</button>Inserisci un lotto'
				$('#addDdtAcquistoArticoloAlert').empty().append(alertContent).removeClass("d-none");
				return;
			} else{
				var alertContent = '<button type="button" class="close" data-dismiss="alert" aria-hidden="true">&times;</button>Seleziona un articolo'
				$('#addDdtAcquistoArticoloAlert').empty().append(alertContent).addClass("d-none");
			}
		}

		var articolo = $('#articolo option:selected').text();
		var udm = $('#udm').val();
		var lotto = $('#lotto').val();
		var scadenza = $('#dataScadenza').val();
		var quantita = $('#quantita').val();
		var prezzo = $('#prezzo').val();
		var sconto = $('#sconto').val();
		var iva = $('#articolo option:selected').attr('data-iva');

		if(lotto != null && lotto != undefined && lotto != ''){
			var lottoHtml = '<input type="text" class="form-control form-control-sm text-center compute-totale" value="'+lotto+'">';
		} else {
			var lottoHtml = '<input type="text" class="form-control form-control-sm text-center compute-totale" value="">';
		}

		var quantitaHtml = '<input type="number" step=".001" min="0" class="form-control form-control-sm text-center compute-totale" value="'+quantita+'">';
		var scadenzaHtml = '<input type="date" class="form-control form-control-sm text-center compute-totale" value="'+scadenza+'">';
		var prezzoHtml = '<input type="number" step=".001" min="0" class="form-control form-control-sm text-center compute-totale" value="'+prezzo+'">';
		var scontoHtml = '<input type="number" step=".001" min="0" class="form-control form-control-sm text-center compute-totale" value="'+sconto+'">';

		// check if a same articolo was already added
		var found = 0;
		var currentRowIndex;
		var currentIdArticolo;
		var currentLotto;
		var currentScadenza;
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
					currentScadenza = $(this).children().eq(2).children().eq(0).val();
					currentPrezzo = $(this).children().eq(6).children().eq(0).val();
					currentSconto = $(this).children().eq(7).children().eq(0).val();

					if(currentIdArticolo == articoloId && currentLotto == lotto && currentScadenza == scadenza && currentPrezzo == prezzo && currentSconto == sconto){
						found = 1;
						currentQuantita = $(this).children().eq(4).children().eq(0).val();
					}
				}
			});
		}

		var imponibile = 0;
		quantita = $.fn.parseValue(quantita, 'float');
		prezzo = $.fn.parseValue(prezzo, 'float');
		sconto = $.fn.parseValue(sconto, 'float');

		var quantitaPerPrezzo = ((quantita + $.fn.parseValue(currentQuantita,'float')) * prezzo);
		var scontoValue = (sconto/100)*quantitaPerPrezzo;
		imponibile = Number(Math.round((quantitaPerPrezzo - scontoValue) + 'e2') + 'e-2');

		var table = $('#ddtAcquistoArticoliTable').DataTable();
		if(found == 1){
			var newQuantitaHtml = '<input type="number" step=".01" min="0" class="form-control form-control-sm text-center compute-totale" value="'+(quantita + $.fn.parseValue(currentQuantita,'float'))+'">';
			var newDeleteLink = '<a class="deleteDdtArticolo" data-id="'+articoloId+'" data-iva="'+iva+'" data-imponibile="'+imponibile+'" href="#"><i class="far fa-trash-alt" title="Rimuovi"></i></a>';

			var rowData = table.row(currentRowIndex).data();
			rowData[4] = newQuantitaHtml;
			rowData[7] = newDeleteLink;
			table.row(currentRowIndex).data(rowData).draw();

		} else {
			var deleteLink = '<a class="deleteDdtArticolo" data-id="'+articoloId+'" data-iva="'+iva+'" data-imponibile="'+imponibile+'" href="#"><i class="far fa-trash-alt" title="Rimuovi"></i></a>';

			var rowNode = table.row.add( [
				articolo,
				lottoHtml,
				scadenzaHtml,
				udm,
				quantitaHtml,
				prezzoHtml,
				scontoHtml,
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
		$('#lotto').val('');
		$('#dataScadenza').val('null');
		$('#quantita').val('');
		$('#prezzo').val('');
		$('#sconto').val('');

		$('#articolo').focus();
	});

	$(document).on('click','.deleteDdtArticolo', function(){
		$('#ddtAcquistoArticoliTable').DataTable().row( $(this).parent().parent() )
			.remove()
			.draw();
		$('#ddtAcquistoArticoliTable').focus();

		$.fn.computeTotale();
	});

	$(document).on('change','.compute-totale', function(){
		$.row = $(this).parent().parent();
		var articoloId = $.row.attr('data-id');

		var quantita = $.row.children().eq(4).children().eq(0).val();
		quantita = $.fn.parseValue(quantita, 'float');
		var prezzo = $.row.children().eq(5).children().eq(0).val();
		prezzo = $.fn.parseValue(prezzo, 'float');
		var sconto = $.row.children().eq(6).children().eq(0).val();
		sconto = $.fn.parseValue(sconto, 'float');

		var quantitaPerPrezzo = (quantita * prezzo);
		var scontoValue = (sconto/100)*quantitaPerPrezzo;
		var imponibile = $.fn.formatNumber((quantitaPerPrezzo - scontoValue));

		var iva = $.row.children().eq(7).find('a').attr('data-iva');

		var newDeleteLink = '<a class="deleteDdtArticolo" data-id="'+articoloId+'" data-iva="'+iva+'" data-imponibile="'+imponibile+'" href="#"><i class="far fa-trash-alt" title="Rimuovi"></i></a>';
		$.row.children().eq(7).html(newDeleteLink);

		$.fn.computeTotale();
	});

	$(document).on('change','.ddtAcquistoCheckbox', function(){
		var numChecked = $('.ddtAcquistoCheckbox:checkbox:checked').length;
		if(numChecked == null || numChecked == undefined || numChecked == 0){
			$('#ddtAcquistoNumSelezionati').text('0 elementi selezionati');
		} else{
			var numSelezionati = 0;
			$('.ddtAcquistoCheckbox:checkbox:checked').each(function(i, item) {
				numSelezionati += 1;
			});
			$('#ddtAcquistoNumSelezionati').text(numSelezionati+' elementi selezionati');
		};
	});

});

$.fn.preloadFields = function(){
	$('#data').val(moment().format('YYYY-MM-DD'));
	$('#colli').attr('value', 1);
	$('#fornitore').focus();
}

$.fn.getFornitori = function(){
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
				});
			}
		},
		error: function(jqXHR, textStatus, errorThrown) {
			console.log('Response text: ' + jqXHR.responseText);
		}
	});
}

$.fn.getArticoli = function(idFornitore){
	$.ajax({
		url: baseUrl + "articoli?attivo=true&idFornitore="+idFornitore,
		type: 'GET',
		dataType: 'json',
		success: function(result) {
			$('#articolo').empty().append('<option value=""></option>');
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
			var alertContent = '<div id="alertDdtAcquistoContent" class="alert alert-@@alertResult@@ alert-dismissible fade show" role="alert">';
			alertContent = alertContent + '<strong>@@alertText@@</strong>\n' +
				'<button type="button" class="close" data-dismiss="alert" aria-label="Close"><span aria-hidden="true">&times;</span></button></div>';
			$('#alertDdtAcquisto').empty().append(alertContent.replace('@@alertText@@', 'Errore nel caricamento degli articoli').replace('@@alertResult@@', 'danger'));
		}
	});
}

$.fn.extractIdDdtAcquistoFromUrl = function(){
    var pageUrl = window.location.search.substring(1);

	var urlVariables = pageUrl.split('&'),
        paramNames,
        i;

    for (i = 0; i < urlVariables.length; i++) {
        paramNames = urlVariables[i].split('=');

        if (paramNames[0] === 'idDdtAcquisto') {
        	return paramNames[1] === undefined ? null : decodeURIComponent(paramNames[1]);
        }
    }
}

$.fn.getDdtAcquisto = function(idDdtAcquisto){

	var alertContent = '<div id="alertDdtAcquistoContent" class="alert alert-danger alert-dismissible fade show" role="alert">';
	alertContent = alertContent +  '<strong>Errore nel recupero del DDT Acquisto</strong>\n' +
		'<button type="button" class="close" data-dismiss="alert" aria-label="Close"><span aria-hidden="true">&times;</span></button></div>';

	$.ajax({
		url: baseUrl + "ddts-acquisto/" + idDdtAcquisto,
		type: 'GET',
		dataType: 'json',
		success: function(result) {
			if(result != null && result != undefined && result != ''){

				$('#hiddenIdDdtAcquisto').attr('value', result.id);
				$('#numero').attr('value', result.numero);
				$('#data').attr('value', result.data);
				if(result.fornitore != null && result.fornitore != undefined){
					$('#fornitore option[value="' + result.fornitore.id +'"]').attr('selected', true);

					$.fn.getArticoli(result.fornitore.id);
				}
				$('#colli').attr('value', result.numeroColli);
				$('#note').val(result.note);

				if(result.ddtAcquistoArticoli != null && result.ddtAcquistoArticoli != undefined && result.ddtAcquistoArticoli.length != 0){
					result.ddtAcquistoArticoli.forEach(function(item, i){
						var articolo = item.articolo;
						var articoloId = item.id.articoloId;
						var articoloDesc = articolo.codice+' '+articolo.descrizione;
						var udm = articolo.unitaMisura.etichetta;
						var iva = articolo.aliquotaIva.valore;
						var quantita = item.quantita;
						var prezzo = item.prezzo;
						var sconto = item.sconto;
						var dataScadenza = item.dataScadenza;
						var lotto = item.lotto;

						if(lotto != null && lotto != undefined && lotto != ''){
							var lottoHtml = '<input type="text" class="form-control form-control-sm text-center compute-totale" value="'+lotto+'">';
						} else {
							var lottoHtml = '<input type="text" class="form-control form-control-sm text-center compute-totale" value="">';
						}

						var quantitaHtml = '<input type="number" step=".001" min="0" class="form-control form-control-sm text-center compute-totale" value="'+quantita+'">';
						var scadenzaHtml = '<input type="date" class="form-control form-control-sm text-center compute-totale" value="'+scadenza+'">';
						var prezzoHtml = '<input type="number" step=".001" min="0" class="form-control form-control-sm text-center compute-totale" value="'+prezzo+'">';
						var scontoHtml = '<input type="number" step=".001" min="0" class="form-control form-control-sm text-center compute-totale" value="'+sconto+'">';

						var imponibile = 0;
						quantita = $.fn.parseValue(quantita, 'float');
						prezzo = $.fn.parseValue(prezzo, 'float');
						sconto = $.fn.parseValue(sconto, 'float');
						imponibile = $.fn.formatNumber(((quantita * prezzo) - sconto));

						var deleteLink = '<a class="deleteDdtArticolo" data-id="'+articoloId+'" data-iva="'+iva+'" data-imponibile="'+imponibile+'" href="#"><i class="far fa-trash-alt" title="Rimuovi"></i></a>';

						var table = $('#ddtAcquistoArticoliTable').DataTable();
						var rowNode = table.row.add( [
							articoloDesc,
							lottoHtml,
							scadenzaHtml,
							udm,
							quantitaHtml,
							prezzoHtml,
							scontoHtml,
							deleteLink
						] ).draw( false ).node();
						$(rowNode).css('text-align', 'center');
						$(rowNode).addClass('rowArticolo');
						$(rowNode).attr('data-id', articoloId);

						$.fn.computeTotale();

					});
				}
			} else{
				$('#alertDdtAcquisto').empty().append(alertContent);
			}
		},
		error: function(jqXHR, textStatus, errorThrown) {
			$('#alertDdtAcquisto').append(alertContent);
			$('#updateDdtAcquistoButton').attr('disabled', true);
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
	var imponibileDocumento = 0;

	$('.rowArticolo').each(function(i, item){
		var quantita = $(this).children().eq(4).find('input').val();
		quantita = $.fn.parseValue(quantita, 'float');
		var prezzo = $(this).children().eq(5).find('input').val();
		prezzo = $.fn.parseValue(prezzo, 'float');
		var sconto = $(this).children().eq(6).find('input').val();
		sconto = $.fn.parseValue(sconto, 'float');
		var iva = $(this).children().eq(7).find('a').attr('data-iva');
		iva = $.fn.parseValue(iva, 'float');
		var imponibile = $(this).children().eq(7).find('a').attr('data-imponibile');
		imponibile = $.fn.parseValue(imponibile, 'float');

		var totaliIva;
		if(ivaMap.has(iva)){
			totaliIva = ivaMap.get(iva);
		} else {
			totaliIva = [];
		}
		totaliIva.push(imponibile);
		ivaMap.set(iva, totaliIva);

	});
	ivaMap.forEach( (value, key, map) => {
		var totalePerIva = value.reduce((a, b) => a + b, 0);
		var totaleConIva = totalePerIva + (totalePerIva * key/100);

		imponibileDocumento += totalePerIva;
		totaleDocumento += totaleConIva;
	});

	totaleDocumento = parseFloat(totaleDocumento);
	imponibileDocumento = parseFloat(imponibileDocumento);
	$('#totale').val($.fn.formatNumber(totaleDocumento));
	$('#totaleImponibile').val($.fn.formatNumber(imponibileDocumento));
}

