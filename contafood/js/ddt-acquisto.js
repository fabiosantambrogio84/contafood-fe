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
			"zeroRecords": "Nessun DDT acquisto disponibile",
			"info": "_TOTAL_ elementi",
			"infoEmpty": "0 elementi"
		},
		"searching": false,
		"responsive":true,
		"pageLength": 20,
		"lengthChange": false,
		"info": true,
		"autoWidth": false,
		"order": [
			[2, 'desc'],
			[3, 'asc']
		],
		"columns": [
			//{"name": "dataHidden", "data": "data", "width":"1%", "visible":false},
			{"data": null, "orderable":false, "width": "2%", render: function ( data, type, row ) {
				var checkboxHtml = '<input type="checkbox" data-id="'+data.id+'" id="checkbox_'+data.id+'" class="ddtAcquistoCheckbox">';
				return checkboxHtml;
			}},
			{"name": "numero", "data": "numero", "width":"5%"},
			{"name": "data", "data": null, "width":"8%", render: function ( data, type, row ) {
				var a = moment(data.data);
				var contentHtml = '<span class="d-none">'+data.data+'</span>'+a.format('DD/MM/YYYY');
				return contentHtml;
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
		},
		"infoCallback": function( settings, start, end, max, total, pre ) {
			var api = this.api();
			var pageInfo = api.page.info();

			return '<div style="font-size:16px; font-weight:bold;" id="ddtAcquistoInfoElements" data-num-records="'+pageInfo.recordsTotal+'">'+'0 elementi selezionati di '+pageInfo.recordsTotal+'</div>';
		}
	});
}

$.fn.loadDdtAcquistoProdottiTable = function() {
	$('#ddtAcquistoProdottiTable').DataTable({
		"retrieve": true,
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
}

$(document).ready(function() {

	$.fn.loadDdtAcquistoTable(baseUrl + "ddts-acquisto");

	$.fn.loadDdtAcquistoProdottiTable();

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
						if(result.ddtAcquistoArticoli.length){

							$('#spaceArticoli').removeClass("d-none");
							$('#detailsDdtAcquistoArticoliModalDiv').removeClass("d-none");

							$('#detailsDdtAcquistoArticoliModalTable').DataTable({
								"retrieve": true,
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
					}

					if(result.ddtAcquistoIngredienti != null && result.ddtAcquistoIngredienti != undefined){
						if(result.ddtAcquistoIngredienti.length){

							$('#spaceIngredienti').removeClass("d-none");
							$('#detailsDdtAcquistoIngredientiModalDiv').removeClass("d-none");

							$('#detailsDdtAcquistoIngredientiModalTable').DataTable({
								"retrieve": true,
								"data": result.ddtAcquistoIngredienti,
								"language": {
									"paginate": {
										"first": "Inizio",
										"last": "Fine",
										"next": "Succ.",
										"previous": "Prec."
									},
									"search": "Cerca",
									"emptyTable": "Nessun ingrediente presente",
									"zeroRecords": "Nessun ingrediente presente"
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
									{"name": "ingrediente", "data": null, render: function (data, type, row) {
										var result = '';
										if (data.ingrediente != null) {
											result = data.ingrediente.codice+' - '+data.ingrediente.descrizione;
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
		var modificaGiacenze = $("input[name='modificaGiacenze']:checked").val();

		var url = baseUrl + "ddts-acquisto/" + idDdtAcquisto;
		if(modificaGiacenze != null && modificaGiacenze != ''){
			if(modificaGiacenze == 'si'){
				url += "?modificaGiacenze=true";
			} else {
				url += "?modificaGiacenze=false";
			}
		} else {
			url += "?modificaGiacenze=false";
		}

		$.ajax({
			url: url,
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

	if($('#newDdtAcquistoButton') != null && $('#newDdtAcquistoButton') != undefined && $('#newDdtAcquistoButton').length > 0){
		$('#prodotto').selectpicker();
		$('#fornitore').selectpicker();

		$(document).on('submit','#newDdtAcquistoForm', function(event){
			event.preventDefault();

			var ddtAcquisto = new Object();
			ddtAcquisto.numero = $('#numero').val();
			ddtAcquisto.data = $('#data').val();

			var fornitore = new Object();
			fornitore.id = $('#fornitore option:selected').val();
			ddtAcquisto.fornitore = fornitore;

			var ddtAcquistoProdottiLength = $('.rowProdotto').length;
			if(ddtAcquistoProdottiLength != null && ddtAcquistoProdottiLength != undefined && ddtAcquistoProdottiLength != 0){
				var ddtAcquistoArticoli = [];
				var ddtAcquistoIngredienti = [];
				$('.rowProdotto').each(function(i, item){
					var tipo = $(this).attr('data-tipo');
					var prodottoId = $(this).attr('data-id');

					if(tipo == 'articolo'){
						var ddtAcquistoArticolo = {};
						var ddtAcquistoArticoloId = new Object();
						ddtAcquistoArticoloId.articoloId = prodottoId;
						ddtAcquistoArticolo.id = ddtAcquistoArticoloId;

						ddtAcquistoArticolo.lotto = $(this).children().eq(1).children().eq(0).val();
						ddtAcquistoArticolo.dataScadenza = $(this).children().eq(2).children().eq(0).val();
						ddtAcquistoArticolo.quantita = $(this).children().eq(4).children().eq(0).val();
						ddtAcquistoArticolo.prezzo = $(this).children().eq(5).children().eq(0).val();
						ddtAcquistoArticolo.sconto = $(this).children().eq(6).children().eq(0).val();

						ddtAcquistoArticoli.push(ddtAcquistoArticolo);

					} else if(tipo == 'ingrediente'){
						var ddtAcquistoIngrediente = {};
						var ddtAcquistoIngredienteId = new Object();
						ddtAcquistoIngredienteId.ingredienteId = prodottoId;
						ddtAcquistoIngrediente.id = ddtAcquistoIngredienteId;

						ddtAcquistoIngrediente.lotto = $(this).children().eq(1).children().eq(0).val();
						ddtAcquistoIngrediente.dataScadenza = $(this).children().eq(2).children().eq(0).val();
						ddtAcquistoIngrediente.quantita = $(this).children().eq(4).children().eq(0).val();
						ddtAcquistoIngrediente.prezzo = $(this).children().eq(5).children().eq(0).val();
						ddtAcquistoIngrediente.sconto = $(this).children().eq(6).children().eq(0).val();

						ddtAcquistoIngredienti.push(ddtAcquistoIngrediente);
					}
				});
				if(Array.isArray(ddtAcquistoArticoli) && ddtAcquistoArticoli.length){
					ddtAcquisto.ddtAcquistoArticoli = ddtAcquistoArticoli;
				}
				if(Array.isArray(ddtAcquistoIngredienti) && ddtAcquistoIngredienti.length){
					ddtAcquisto.ddtAcquistoIngredienti = ddtAcquistoIngredienti;
				}

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

	if($('#updateDdtAcquistoButton') != null && $('#updateDdtAcquistoButton') != undefined && $('#updateDdtAcquistoButton').length > 0){
		$('#articolo').selectpicker();
		$('#fornitore').selectpicker();

		$(document).on('click','#updateDdtAcquistoButton', function(event){
			event.preventDefault();
			$('#updateDdtAcquistoModal').modal('show');
		});

		$(document).on('click','#confirmUpdateDdtAcquisto', function(){
			var modificaGiacenze = $("input[name='modificaGiacenze']:checked").val();
			$('#hiddenModificaGiacenze').attr('value', modificaGiacenze);
			$('#updateDdtAcquistoModal').modal('hide');
			$('#updateDdtAcquistoForm').submit();
		});

		$(document).on('submit','#updateDdtAcquistoForm', function(event){
			event.preventDefault();

			var ddtAcquisto = new Object();
			ddtAcquisto.id = $('#hiddenIdDdtAcquisto').val();
			ddtAcquisto.numero = $('#numero').val();
			ddtAcquisto.data = $('#data').val();

			var fornitore = new Object();
			fornitore.id = $('#fornitore option:selected').val();
			ddtAcquisto.fornitore = fornitore;

			var ddtAcquistoProdottiLength = $('.rowProdotto').length;
			if(ddtAcquistoProdottiLength != null && ddtAcquistoProdottiLength != undefined && ddtAcquistoProdottiLength != 0){
				var ddtAcquistoArticoli = [];
				var ddtAcquistoIngredienti = [];
				$('.rowProdotto').each(function(i, item){
					var tipo = $(this).attr('data-tipo');
					var prodottoId = $(this).attr('data-id');

					if(tipo == 'articolo'){
						var ddtAcquistoArticolo = {};
						var ddtAcquistoArticoloId = new Object();
						ddtAcquistoArticoloId.articoloId = prodottoId;
						ddtAcquistoArticolo.id = ddtAcquistoArticoloId;

						ddtAcquistoArticolo.lotto = $(this).children().eq(1).children().eq(0).val();
						ddtAcquistoArticolo.dataScadenza = $(this).children().eq(2).children().eq(0).val();
						ddtAcquistoArticolo.quantita = $(this).children().eq(4).children().eq(0).val();
						ddtAcquistoArticolo.prezzo = $(this).children().eq(5).children().eq(0).val();
						ddtAcquistoArticolo.sconto = $(this).children().eq(6).children().eq(0).val();

						ddtAcquistoArticoli.push(ddtAcquistoArticolo);

					} else if(tipo == 'ingrediente'){
						var ddtAcquistoIngrediente = {};
						var ddtAcquistoIngredienteId = new Object();
						ddtAcquistoIngredienteId.ingredienteId = prodottoId;
						ddtAcquistoIngrediente.id = ddtAcquistoIngredienteId;

						ddtAcquistoIngrediente.lotto = $(this).children().eq(1).children().eq(0).val();
						ddtAcquistoIngrediente.dataScadenza = $(this).children().eq(2).children().eq(0).val();
						ddtAcquistoIngrediente.quantita = $(this).children().eq(4).children().eq(0).val();
						ddtAcquistoIngrediente.prezzo = $(this).children().eq(5).children().eq(0).val();
						ddtAcquistoIngrediente.sconto = $(this).children().eq(6).children().eq(0).val();

						ddtAcquistoIngredienti.push(ddtAcquistoIngrediente);
					}
				});
				if(Array.isArray(ddtAcquistoArticoli) && ddtAcquistoArticoli.length){
					ddtAcquisto.ddtAcquistoArticoli = ddtAcquistoArticoli;
				}
				if(Array.isArray(ddtAcquistoIngredienti) && ddtAcquistoIngredienti.length){
					ddtAcquisto.ddtAcquistoIngredienti = ddtAcquistoIngredienti;
				}

			}
			ddtAcquisto.numeroColli = $('#colli').val();
			ddtAcquisto.note = $('#note').val();
			var modificaGiacenze = $('#hiddenModificaGiacenze').val();
			if(modificaGiacenze != null && modificaGiacenze != '' && modificaGiacenze == 'si'){
				ddtAcquisto.modificaGiacenze = true;
			} else {
				ddtAcquisto.modificaGiacenze = false;
			}

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
		$('#prodotto option[value=""]').prop('selected', true);
		$('#udm').val('');
		$('#lotto').val('');
		$('#scadenza').val('');
		$('#quantita').val('');
		$('#prezzo').val('');
		$('#sconto').val('');

		var fornitore = $('#fornitore option:selected').val();
		if(fornitore != null && fornitore != ''){
			var tipoFornitore = $('#fornitore option:selected').attr("data-tipo");
			if(tipoFornitore == 'FORNITORE_ARTICOLI'){
				$('#aggiungiTitle').text('Aggiungi articolo');
				$('#prodottoLabel').text('Articolo');
				$('#tableHeaderProdotto').text('Articolo');

				$.fn.getArticoli(fornitore);

			} else if(tipoFornitore == 'FORNITORE_INGREDIENTI'){
				$('#aggiungiTitle').text('Aggiungi ingrediente');
				$('#prodottoLabel').text('Ingrediente');
				$('#tableHeaderProdotto').text('Ingrediente');

				$.fn.getIngredienti(fornitore);
			}

		} else {
			$('#prodotto').empty();
		}
	});

	$(document).on('change','#prodotto', function(){
		var prodotto = $('#prodotto option:selected').val();
		if(prodotto != null && prodotto != ''){
			var udm = $('#prodotto option:selected').attr('data-udm');
			var quantita = $('#prodotto option:selected').attr('data-qta');
			var prezzoAcquisto = $('#prodotto option:selected').attr('data-prezzo-acquisto');
			var prezzo = prezzoAcquisto;

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

	$(document).on('click','#addProdotto', function(event){
		event.preventDefault();

		var prodottoId = $('#prodotto option:selected').val();

		if(prodottoId == null || prodottoId == undefined || prodottoId == ''){
			$('#addDdtAcquistoProdottoAlert').removeClass("d-none");
			return;
		} else {
			if($('#lotto').val() == null || $('#lotto').val() == undefined || $('#lotto').val()==''){
				var alertContent = '<button type="button" class="close" data-dismiss="alert" aria-hidden="true">&times;</button>Inserisci un lotto'
				$('#addDdtAcquistoProdottoAlert').empty().append(alertContent).removeClass("d-none");
				return;
			} else{
				var alertContent = '<button type="button" class="close" data-dismiss="alert" aria-hidden="true">&times;</button>Seleziona un prodotto'
				$('#addDdtAcquistoProdottoAlert').empty().append(alertContent).addClass("d-none");
			}
		}

		var prodotto = $('#prodotto option:selected').text();
		var tipo = $('#prodotto option:selected').attr('data-tipo');
		var udm = $('#udm').val();
		var lotto = $('#lotto').val();
		var scadenza = $('#dataScadenza').val();
		var quantita = $('#quantita').val();
		var prezzo = $('#prezzo').val();
		var sconto = $('#sconto').val();
		var iva = $('#prodotto option:selected').attr('data-iva');

		if(lotto != null && lotto != undefined && lotto != ''){
			var lottoHtml = '<input type="text" class="form-control form-control-sm text-center compute-totale" value="'+lotto+'">';
		} else {
			var lottoHtml = '<input type="text" class="form-control form-control-sm text-center compute-totale" value="">';
		}

		var quantitaHtml = '<input type="number" step=".001" min="0" class="form-control form-control-sm text-center compute-totale" value="'+quantita+'">';
		var scadenzaHtml = '<input type="date" class="form-control form-control-sm text-center compute-totale" value="'+scadenza+'">';
		var prezzoHtml = '<input type="number" step=".001" min="0" class="form-control form-control-sm text-center compute-totale" value="'+prezzo+'">';
		var scontoHtml = '<input type="number" step=".001" min="0" class="form-control form-control-sm text-center compute-totale" value="'+sconto+'">';

		// check if a same prodotto was already added
		var found = 0;
		var currentRowIndex;
		var currentIdProdotto;
		var currentLotto;
		var currentScadenza;
		var currentPrezzo;
		var currentSconto;
		var currentQuantita = 0;

		var ddtProdottiLength = $('.rowProdotto').length;
		if(ddtProdottiLength != null && ddtProdottiLength != undefined && ddtProdottiLength != 0) {
			$('.rowProdotto').each(function(i, item){

				if(found != 1){
					currentRowIndex = $(this).attr('data-row-index');
					currentIdProdotto = $(this).attr('data-id');
					currentLotto = $(this).children().eq(1).children().eq(0).val();
					currentScadenza = $(this).children().eq(2).children().eq(0).val();
					currentPrezzo = $(this).children().eq(6).children().eq(0).val();
					currentSconto = $(this).children().eq(7).children().eq(0).val();

					if(currentIdProdotto == prodottoId && currentLotto == lotto && currentScadenza == scadenza && currentPrezzo == prezzo && currentSconto == sconto){
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

		var table = $('#ddtAcquistoProdottiTable').DataTable();
		if(found == 1){
			var newQuantitaHtml = '<input type="number" step=".01" min="0" class="form-control form-control-sm text-center compute-totale" value="'+(quantita + $.fn.parseValue(currentQuantita,'float'))+'">';
			var newDeleteLink = '<a class="deleteDdtProdotto" data-id="'+prodottoId+'" data-iva="'+iva+'" data-imponibile="'+imponibile+'" href="#"><i class="far fa-trash-alt" title="Rimuovi"></i></a>';

			var rowData = table.row(currentRowIndex).data();
			rowData[4] = newQuantitaHtml;
			rowData[7] = newDeleteLink;
			table.row(currentRowIndex).data(rowData).draw();

		} else {
			var deleteLink = '<a class="deleteDdtProdotto" data-id="'+prodottoId+'" data-iva="'+iva+'" data-imponibile="'+imponibile+'" href="#"><i class="far fa-trash-alt" title="Rimuovi"></i></a>';

			var rowNode = table.row.add( [
				prodotto,
				lottoHtml,
				scadenzaHtml,
				udm,
				quantitaHtml,
				prezzoHtml,
				scontoHtml,
				deleteLink
			] ).draw( false ).node();
			$(rowNode).css('text-align', 'center');
			$(rowNode).addClass('rowProdotto');
			$(rowNode).attr('data-id', prodottoId);
			$(rowNode).attr('data-tipo', tipo);
			$(rowNode).attr('data-row-index', $(rowNode).index());
		}
		$.fn.computeTotale();

		$('#prodotto option[value=""]').prop('selected',true);
		$('#udm').val('');
		$('#lotto').val('');
		$('#dataScadenza').val('null');
		$('#quantita').val('');
		$('#prezzo').val('');
		$('#sconto').val('');

		$('#prodotto').focus();
		$('#prodotto').selectpicker('refresh');
	});

	$(document).on('click','.deleteDdtProdotto', function(){
		$('#ddtAcquistoProdottiTable').DataTable().row( $(this).parent().parent() )
			.remove()
			.draw();
		$('#ddtAcquistoProdottiTable').focus();

		$.fn.computeTotale();
	});

	$(document).on('change','.compute-totale', function(){
		$.row = $(this).parent().parent();
		var prodottoId = $.row.attr('data-id');

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

		var newDeleteLink = '<a class="deleteDdtProdotto" data-id="'+prodottoId+'" data-iva="'+iva+'" data-imponibile="'+imponibile+'" href="#"><i class="far fa-trash-alt" title="Rimuovi"></i></a>';
		$.row.children().eq(7).html(newDeleteLink);

		$.fn.computeTotale();
	});

	$(document).on('change','.ddtAcquistoCheckbox', function(){
		var numChecked = $('.ddtAcquistoCheckbox:checkbox:checked').length;
		var numRecordsTotal = $('#ddtAcquistoInfoElements').attr('data-num-records');
		if(numChecked == null || numChecked == undefined || numChecked == 0){
			$('#ddtAcquistoInfoElements').text('0 elementi selezionati di '+numRecordsTotal);
		} else{
			var numSelezionati = 0;
			$('.ddtAcquistoCheckbox:checkbox:checked').each(function(i, item) {
				numSelezionati += 1;
			});
			$('#ddtAcquistoInfoElements').text(numSelezionati+' elementi selezionati di '+numRecordsTotal);
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

					$('#fornitore').append('<option value="'+item.id+'" data-tipo="'+item.tipoFornitore.codice+'">'+label+'</option>');
					$('#fornitore').selectpicker('refresh');
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
			$('#prodotto').empty().append('<option value=""></option>');
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
					var dataPrezzoAcquisto = item.prezzoAcquisto;
					$('#prodotto').append('<option value="'+item.id+'" data-tipo="articolo" data-udm="'+dataUdm+'" data-iva="'+dataIva+'" data-qta="'+dataQta+'" data-prezzo-acquisto="'+dataPrezzoAcquisto+'">'+item.codice+' '+item.descrizione+'</option>');

					$('#prodotto').selectpicker('refresh');
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

$.fn.getIngredienti = function(idFornitore){
	$.ajax({
		url: baseUrl + "ingredienti?attivo=true&idFornitore="+idFornitore,
		type: 'GET',
		dataType: 'json',
		success: function(result) {
			$('#prodotto').empty().append('<option value=""></option>');
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
					$('#prodotto').append('<option value="'+item.id+'" data-tipo="ingrediente" data-udm="'+dataUdm+'" data-iva="'+dataIva+'" data-qta="" data-prezzo-acquisto="'+item.prezzo+'">'+item.codice+' '+item.descrizione+'</option>');

					$('#prodotto').selectpicker('refresh');
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

					$('#fornitore').selectpicker('refresh');
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
						var scadenzaHtml = '<input type="date" class="form-control form-control-sm text-center compute-totale" value="'+dataScadenza+'">';
						var prezzoHtml = '<input type="number" step=".001" min="0" class="form-control form-control-sm text-center compute-totale" value="'+prezzo+'">';
						var scontoHtml = '<input type="number" step=".001" min="0" class="form-control form-control-sm text-center compute-totale" value="'+sconto+'">';

						var imponibile = 0;
						quantita = $.fn.parseValue(quantita, 'float');
						prezzo = $.fn.parseValue(prezzo, 'float');
						sconto = $.fn.parseValue(sconto, 'float');
						var quantitaPerPrezzo = (quantita * prezzo);
						var scontoValue = (sconto/100)*quantitaPerPrezzo;
						imponibile = $.fn.formatNumber((quantitaPerPrezzo - scontoValue));

						var deleteLink = '<a class="deleteDdtProdotto" data-id="'+articoloId+'" data-iva="'+iva+'" data-imponibile="'+imponibile+'" href="#"><i class="far fa-trash-alt" title="Rimuovi"></i></a>';

						$.fn.loadDdtAcquistoProdottiTable();
						var table = $('#ddtAcquistoProdottiTable').DataTable();

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
						$(rowNode).addClass('rowProdotto');
						$(rowNode).attr('data-id', articoloId);
						$(rowNode).attr('data-tipo', 'articolo');

						$.fn.computeTotale();

					});
				}

				if(result.ddtAcquistoIngredienti != null && result.ddtAcquistoIngredienti != undefined && result.ddtAcquistoIngredienti.length != 0){
					result.ddtAcquistoIngredienti.forEach(function(item, i){
						var ingrediente = item.ingrediente;
						var ingredienteId = item.id.ingredienteId;
						var ingredienteDesc = ingrediente.codice+' '+ingrediente.descrizione;
						var udm = ingrediente.unitaMisura.etichetta;
						var iva = ingrediente.aliquotaIva.valore;
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
						var scadenzaHtml = '<input type="date" class="form-control form-control-sm text-center compute-totale" value="'+dataScadenza+'">';
						var prezzoHtml = '<input type="number" step=".001" min="0" class="form-control form-control-sm text-center compute-totale" value="'+prezzo+'">';
						var scontoHtml = '<input type="number" step=".001" min="0" class="form-control form-control-sm text-center compute-totale" value="'+sconto+'">';

						var imponibile = 0;
						quantita = $.fn.parseValue(quantita, 'float');
						prezzo = $.fn.parseValue(prezzo, 'float');
						sconto = $.fn.parseValue(sconto, 'float');
						var quantitaPerPrezzo = (quantita * prezzo);
						var scontoValue = (sconto/100)*quantitaPerPrezzo;
						imponibile = $.fn.formatNumber((quantitaPerPrezzo - scontoValue));

						var deleteLink = '<a class="deleteDdtProdotto" data-id="'+ingredienteId+'" data-iva="'+iva+'" data-imponibile="'+imponibile+'" href="#"><i class="far fa-trash-alt" title="Rimuovi"></i></a>';

						$.fn.loadDdtAcquistoProdottiTable();
						var table = $('#ddtAcquistoProdottiTable').DataTable();

						var rowNode = table.row.add( [
							ingredienteDesc,
							lottoHtml,
							scadenzaHtml,
							udm,
							quantitaHtml,
							prezzoHtml,
							scontoHtml,
							deleteLink
						] ).draw( false ).node();
						$(rowNode).css('text-align', 'center');
						$(rowNode).addClass('rowProdotto');
						$(rowNode).attr('data-id', ingredienteId);
						$(rowNode).attr('data-tipo', 'ingrediente');

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

	$('.rowProdotto').each(function(i, item){
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

