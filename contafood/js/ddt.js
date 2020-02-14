var baseUrl = "/contafood-be/";

$.fn.loadDdtTable = function(url) {
	$.ajax({
		url: baseUrl + "autisti",
		type: 'GET',
		dataType: 'json',
		success: function(autistiResult) {
			$('#ddtTable').DataTable({
				"ajax": {
					"url": url,
					"type": "GET",
					"content-type": "json",
					"cache": false,
					"dataSrc": "",
					"error": function(jqXHR, textStatus, errorThrown) {
						console.log('Response text: ' + jqXHR.responseText);
						var alertContent = '<div id="alertDdtContent" class="alert alert-danger alert-dismissible fade show" role="alert">';
						alertContent = alertContent + '<strong>Errore nel recupero dei DDT</strong>\n' +
							'            <button type="button" class="close" data-dismiss="alert" aria-label="Close"><span aria-hidden="true">&times;</span></button></div>';
						$('#alertDdt').empty().append(alertContent);
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
					"emptyTable": "Nessun DDT disponibile",
					"zeroRecords": "Nessun DDT disponibile"
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
					{"name": "fatturato", "data": null, "width":"5%", render: function ( data, type, row ) {
						if(data.fatturato){
							return 'Si';
						} else {
							return 'No';
						}
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
					{"name":"autista", "data": null, "width":"13%", render: function ( data, type, row ) {
						var ddtId = data.id;
						var selectId = "autista_" + ddtId;

						var autistaId = null;
						if(data.autista != null){
							autistaId = data.autista.id;
						}

						var autistaSelect = '<select id="'+selectId+'" class="form-control form-control-sm autistaDdt" data-id="'+ddtId+'">';
						autistaSelect += '<option value=""> - </option>';
						if(autistiResult != null && autistiResult != undefined && autistiResult != ''){
							$.each(autistiResult, function(i, item){
								var label = item.nome + ' ' + item.cognome;
								var optionHtml = '<option value="'+item.id+'"';
								if(autistaId != null && autistaId != undefined){
									if(autistaId == item.id){
										optionHtml += ' selected';
									}
								}
								optionHtml += '>'+label+'</option>';
								autistaSelect += optionHtml;
							});
						}
						autistaSelect += '</select';
						return autistaSelect;
					}},
					{"name": "acconto", "data": "totaleAcconto", "width":"8%"},
					{"name": "importo", "data": "totale", "width":"8%"},
					{"name": "imponibile", "data": "totaleImponibile", "width":"8%"},
					{"name": "costo", "data": "totaleCosto", "width":"6%"},
					{"name": "guadagno", "data": null, "width":"8%", render: function ( data, type, row ) {
						var guadagno = data.totaleImponibile - data.totaleCosto;
						return Number(Math.round(guadagno+'e2')+'e-2');
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

						var links = '<a class="detailsDdt pr-1" data-id="'+data.id+'" href="#" title="Dettagli"><i class="fas fa-info-circle"></i></a>';
						if(!data.fatturato){
							links += '<a class="updateDdt pr-1" data-id="'+data.id+'" href="ddt-edit.html?idDdt=' + data.id + '" title="Modifica"><i class="far fa-edit"></i></a>';
						}
						if((totale - acconto) != 0){
							links += '<a class="payDdt pr-1" data-id="'+data.id+'" href="pagamenti-new.html?idDdt=' + data.id + '" title="Pagamento"><i class="fa fa-shopping-cart"></i></a>';
						}
						links += '<a class="emailDdt pr-1" data-id="'+data.id+'" href="#" title="Spedizione email"><i class="fa fa-envelope"></i></a>';
						links += '<a class="printDdt pr-1" data-id="'+data.id+'" href="#" title="Stampa"><i class="fa fa-print"></i></a>';
						links += '<a class="deleteDdt" data-id="'+data.id+'" href="#" title="Elimina"><i class="far fa-trash-alt"></i></a>';
						return links;
					}}
				],
				"createdRow": function(row, data, dataIndex,cells){
					$(row).css('font-size', '12px');
					if(data.statoDdt != null){
						var backgroundColor = '';
						if(data.statoDdt.codice == 'DA_PAGARE'){
							backgroundColor = '#f7f25c';
						} else if(data.statoDdt.codice == 'PARZIALMENTE_PAGATO'){
							backgroundColor = '#f5f1a4';
						} else {
							backgroundColor = 'trasparent';
						}
						$(row).css('background-color', backgroundColor);
					}
					$(cells[11]).css('padding-right','0px').css('padding-left','3px');
				}
			});
		}
	});
}

$(document).ready(function() {

	$.fn.loadDdtTable(baseUrl + "ddts");

	$('#ddtArticoliTable').DataTable({
		"searching": false,
		"language": {
			"paginate": {
				"first": "Inizio",
				"last": "Fine",
				"next": "Succ.",
				//"previous": "<i class=\"fa fa-backward\" aria-hidden=\"true\"></i>"
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

	$(document).on('click','#resetSearchDdtButton', function(){
		$('#searchDdtForm :input').val(null);
		$('#searchDdtForm select option[value=""]').attr('selected', true);

		$('#ddtTable').DataTable().destroy();
		$.fn.loadDdtTable(baseUrl + "ddts");
	});

	$(document).on('click','.detailsDdt', function(){
		var idDdt = $(this).attr('data-id');

		var alertContent = '<div id="alertDdtContent" class="alert alert-danger alert-dismissible fade show" role="alert">';
		alertContent = alertContent + '<strong>Errore nel recupero del DDT.</strong></div>';

		$.ajax({
			url: baseUrl + "ddts/" + idDdt,
			type: 'GET',
			dataType: 'json',
			success: function(result) {
				if(result != null && result != undefined && result != '') {
					$('#numero').text(result.progressivo);
					$('#data').text(moment(result.data).format('DD/MM/YYYY'));
					var cliente = result.cliente;
					if(cliente != null && cliente != undefined && cliente != ''){
						if(cliente.dittaIndividuale){
							$('#cliente').text(cliente.nome + ' - ' + cliente.cognome);
						} else {
							$('#cliente').text(cliente.ragioneSociale);
						}
					}
					var puntoConsegna = result.puntoConsegna;
					if(puntoConsegna != null && puntoConsegna != undefined && puntoConsegna != ''){
						$('#puntoConsegna').text(puntoConsegna.nome);
					}
					var autista = result.autista;
					if(autista != null && autista != undefined && autista != ''){
						$('#autista').text(autista.nome+' - '+autista.cognome);
					}
					var stato = result.statoDdt;
					if(stato != null && stato != undefined && stato != ''){
						$('#stato').text(stato.descrizione);
					}
					$('#tipoTrasporto').text(result.tipoTrasporto);
					$('#dataTrasporto').text(moment(result.dataTrasporto).format('DD/MM/YYYY'));
					$('#oraTrasporto').text(result.oraTrasporto);
					$('#trasportatore').text(result.trasportatore);
					$('#colli').text(result.numeroColli);
					$('#totaleImponibile').text(result.totaleImponibile);
					$('#totaleIva').text(result.totaleIva);
					$('#totaleCosto').text(result.totaleCosto);
					$('#totaleAcconto').text(result.totaleAcconto);
					$('#totale').text(result.totale);
					if(result.fatturato){
						$('#fatturato').text("Si");
					} else {
						$('#fatturato').text("No");
					}
					$('#note').text(result.note);
					$('#dataInserimento').text(moment(result.dataInserimento).format('DD/MM/YYYY HH:mm:ss'));
					var dataAggiornamento = result.dataAggiornamento;
					if(dataAggiornamento != null && dataAggiornamento != undefined && dataAggiornamento != ''){
						$('#dataAggiornamento').text(moment(dataAggiornamento).format('DD/MM/YYYY HH:mm:ss'));
					}

					if(result.ddtArticoli != null && result.ddtArticoli != undefined){
						$('#detailsDdtArticoliModalTable').DataTable({
							"data": result.ddtArticoli,
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
								{"name": "quantita", "data": "quantita"},
								{"name": "pezzi", "data": "numeroPezzi"},
								{"name": "prezzo", "data": "prezzo"},
								{"name": "sconto", "data": "sconto"},
								{"name": "imponibile", "data": "imponibile"},
								{"name": "costo", "data": "costo"}
							]
						});
					}


				} else{
					$('#detailsDdtMainDiv').empty().append(alertContent);
				}
			},
			error: function(jqXHR, textStatus, errorThrown) {
				$('#detailsDdtMainDiv').empty().append(alertContent);
				console.log('Response text: ' + jqXHR.responseText);
			}
		})

		$('#detailsDdtModal').modal('show');
	});

	$(document).on('click','.closeDdt', function(){
		$('#detailsDdtModalTable').DataTable().destroy();
		$('#detailsDdtModal').modal('hide');
	});

	$(document).on('click','.deleteDdt', function(){
		var idDdt = $(this).attr('data-id');
		$('#confirmDeleteDdt').attr('data-id', idDdt);
		$('#deleteDdtModal').modal('show');
	});

	$(document).on('click','#confirmDeleteDdt', function(){
		$('#deleteDdtModal').modal('hide');
		var idDdt = $(this).attr('data-id');

		$.ajax({
			url: baseUrl + "ddts/" + idDdt,
			type: 'DELETE',
			success: function() {
				var alertContent = '<div id="alertDdtContent" class="alert alert-success alert-dismissible fade show" role="alert">';
				alertContent = alertContent + '<strong>DDT</strong> cancellato con successo.\n' +
					'            <button type="button" class="close" data-dismiss="alert" aria-label="Close"><span aria-hidden="true">&times;</span></button></div>';
				$('#alertDdt').empty().append(alertContent);

				$('#ddtTable').DataTable().ajax.reload();
			},
			error: function(jqXHR, textStatus, errorThrown) {
				console.log('Response text: ' + jqXHR.responseText);
			}
		});
	});

	if($('#searchDdtButton') != null && $('#searchDdtButton') != undefined) {
		$(document).on('submit', '#searchDdtForm', function (event) {
			event.preventDefault();

			var dataDa = $('#searchDataFrom').val();
			var dataA = $('#searchDataTo').val();
			var progressivo = $('#searchProgressivo').val();
			var importo = $('#searchImporto').val();
			var tipoPagamento = $('#searchTipoPagamento option:selected').val();
			var cliente = $('#searchCliente').val();
			var agente = $('#searchAgente option:selected').val();
			var autista = $('#searchAutista option:selected').val();
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
			if(tipoPagamento != null && tipoPagamento != undefined && tipoPagamento != ''){
				params.tipoPagamento = tipoPagamento;
			}
			if(cliente != null && cliente != undefined && cliente != ''){
				params.cliente = cliente;
			}
			if(agente != null && agente != undefined && agente != ''){
				params.agente = agente;
			}
			if(autista != null && autista != undefined && autista != ''){
				params.autista = autista;
			}
			if(articolo != null && articolo != undefined && articolo != ''){
				params.articolo = articolo;
			}
			if(stato != null && stato != undefined && stato != ''){
				params.stato = stato;
			}
			var url = baseUrl + "ddts?" + $.param( params );

			$('#ddtTable').DataTable().destroy();
			$.fn.loadDdtTable(url);

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

			var alertContent = '<div id="alertDdtContent" class="alert alert-@@alertResult@@ alert-dismissible fade show" role="alert">';
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
						window.location.href = "ddt-new.html";
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

			var alertContent = '<div id="alertDdtContent" class="alert alert-@@alertResult@@ alert-dismissible fade show" role="alert">';
			alertContent = alertContent + '<strong>@@alertText@@</strong>\n' +
				'<button type="button" class="close" data-dismiss="alert" aria-label="Close"><span aria-hidden="true">&times;</span></button></div>';

			$.ajax({
				url: baseUrl + "ddts",
				type: 'PUT',
				contentType: "application/json",
				dataType: 'json',
				data: ddtJson,
				success: function(result) {
					$('#alertDdt').empty().append(alertContent.replace('@@alertText@@','DDT aggiornato con successo').replace('@@alertResult@@', 'success'));

					$('#newDdtButton').attr("disabled", true);

					// Returns to the page with the list of DDTs
					setTimeout(function() {
						window.location.href = "ddt.html";
					}, 1000);
				},
				error: function(jqXHR, textStatus, errorThrown) {
					var errorMessage = 'Errore nell aggiornamento del DDT';
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

		var alertContent = '<div id="alertDdtContent" class="alert alert-@@alertResult@@ alert-dismissible fade show" role="alert">';
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
		var cliente = $('#cliente option:selected').val();
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
					}
					$('#puntoConsegna').removeAttr('disabled');

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

	$(document).on('change','#articolo', function(){
		var articolo = $('#articolo option:selected').val();
		if(articolo != null && articolo != ''){
			var udm = $('#articolo option:selected').attr('data-udm');
			var iva = $('#articolo option:selected').attr('data-iva');
			var quantita = $('#articolo option:selected').attr('data-qta');
			var prezzoBase = $('#articolo option:selected').attr('data-prezzo-base');

			$('#udm').val(udm);
			$('#iva').val(iva);
			$('#lotto').val('');
			$('#quantita').val(quantita);
			$('#pezzi').val('');
			$('#prezzo').val(prezzoBase);
			$('#sconto').val('');
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

		var quantitaHtml = '<input type="number" step=".01" min="0" class="form-control form-control-sm text-center compute-totale" value="'+quantita+'">';
		var pezziHtml = '<input type="number" step="1" min="0" class="form-control form-control-sm text-center compute-totale" value="'+pezzi+'">';
		var prezzoHtml = '<input type="number" step=".01" min="0" class="form-control form-control-sm text-center compute-totale" value="'+prezzo+'">';
		var scontoHtml = '<input type="number" step=".01" min="0" class="form-control form-control-sm text-center compute-totale" value="'+sconto+'">';

		var totale = 0;
		quantita = $.fn.parseValue(quantita, 'float');
		prezzo = $.fn.parseValue(prezzo, 'float');
		sconto = $.fn.parseValue(sconto, 'float');

		var quantitaPerPrezzo = (quantita * prezzo);
		var scontoValue = (sconto/100)*quantitaPerPrezzo;
		totale = Number(Math.round((quantitaPerPrezzo - scontoValue) + 'e2') + 'e-2');

		var deleteLink = '<a class="deleteDdtArticolo" data-id="'+articoloId+'" href="#"><i class="far fa-trash-alt" title="Rimuovi"></i></a>';

		var table = $('#ddtArticoliTable').DataTable();
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

		$.fn.computeTotale();

		$('#articolo option[value=""]').attr('selected',true);
		$('#udm').val('');
		$('#iva').val('');
		$('#lotto').val('');
		$('#quantita').val('');
		$('#pezzi').val('');
		$('#prezzo').val('');
		$('#sconto').val('');
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
		var totale = Number(Math.round(((quantita * prezzo) - sconto) + 'e2') + 'e-2');
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

$.fn.preloadFields = function(){
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
				$('#dataTrasporto').val(moment().format('YYYY-MM-DD'));
				$('#oraTrasporto').val(moment().format('HH:mm'));
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
					if(agente != null) {
						idAgente = agente.id;
					}
					$('#cliente').append('<option value="'+item.id+'" data-id-agente="'+idAgente+'">'+label+'</option>');
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


$.fn.getDdt = function(idDdt){

	var alertContent = '<div id="alertDdtContent" class="alert alert-danger alert-dismissible fade show" role="alert">';
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

