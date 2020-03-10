var baseUrl = "/contafood-be/";

$.fn.loadFattureVenditaTable = function(url) {
	$('#fattureVenditaTable').DataTable({
		"ajax": {
			"url": url,
			"type": "GET",
			"content-type": "json",
			"cache": false,
			"dataSrc": "",
			"error": function(jqXHR, textStatus, errorThrown) {
				console.log('Response text: ' + jqXHR.responseText);
				var alertContent = '<div id="alertFattureVenditaContent" class="alert alert-danger alert-dismissible fade show" role="alert">';
				alertContent = alertContent + '<strong>Errore nel recupero delle fatture vendita</strong>\n' +
					'            <button type="button" class="close" data-dismiss="alert" aria-label="Close"><span aria-hidden="true">&times;</span></button></div>';
				$('#alertFattureVendita').empty().append(alertContent);
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
			"emptyTable": "Nessuna fattura vendita disponibile",
			"zeroRecords": "Nessuna fattura vendita disponibile"
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
			{"name": "acconto", "data": null, "width":"8%", render: function ( data, type, row ) {
				return $.fn.formatNumber(data.totaleAcconto);
			}},
			{"name": "importo", "data": null, "width":"8%",render: function ( data, type, row ) {
				return $.fn.formatNumber(data.totale);
			}},
			{"data": null, "orderable":false, "width":"8%", render: function ( data, type, row ) {
				var links = '<a class="detailsFattureVendita pr-1" data-id="'+data.id+'" href="#" title="Dettagli"><i class="fas fa-info-circle"></i></a>';
				links += '<a class="deleteFattureVendita" data-id="' + data.id + '" href="#" title="Elimina"><i class="far fa-trash-alt"></i></a>';
				return links;
			}}
		],
		"createdRow": function(row, data, dataIndex,cells){
			if(data.statoFattura != null){
				var backgroundColor = '';
				if(data.statoFattura.codice == 'DA_PAGARE'){
					backgroundColor = '#fcf456';
				} else if(data.statoFattura.codice == 'PARZIALMENTE_PAGATA'){
					backgroundColor = '#fcc08b';
				} else {
					backgroundColor = 'trasparent';
				}
				$(row).css('background-color', backgroundColor);
			}
			$(cells[3]).css('text-align','left');
			$(cells[4]).css('text-align','left');
			$(cells[5]).css('text-align','right');
			$(cells[6]).css('text-align','right');
		}
	});
}

$.fn.loadEmptyFatturaVenditaDdtTable = function() {
	$('#fatturaVenditaDdtTable').DataTable({
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
			[1, 'desc'],
			[2, 'desc']
		]
	});
}

$(document).ready(function() {

	$.fn.loadFattureVenditaTable(baseUrl + "fatture-vendita");

	$.fn.loadEmptyFatturaVenditaDdtTable();

	$(document).on('click','#resetSearchFattureVenditaButton', function(){
		$('#searchFattureVenditaForm :input').val(null);
		$('#searchFattureVenditaForm select option[value=""]').attr('selected', true);

		$('#fattureVenditaTable').DataTable().destroy();
		$.fn.loadFattureVenditaTable(baseUrl + "fatture-vendita");
	});

	$(document).on('click','.detailsFattureVendita', function(){
		var idFatturaVendita = $(this).attr('data-id');

		var alertContent = '<div id="alertDdtContent" class="alert alert-danger alert-dismissible fade show" role="alert">';
		alertContent = alertContent + '<strong>Errore nel recupero della fattura vendita.</strong></div>';

		$.ajax({
			url: baseUrl + "fatture-vendita/" + idFatturaVendita,
			type: 'GET',
			dataType: 'json',
			success: function(result) {
				if(result != null && result != undefined && result != '') {
					$('#numero').text(result.progressivo);
					$('#data').text(moment(result.data).format('DD/MM/YYYY'));
					$('#dataInserimento').text(moment(result.dataInserimento).format('DD/MM/YYYY HH:mm:ss'));
					var dataAggiornamento = result.dataAggiornamento;
					if(dataAggiornamento != null && dataAggiornamento != undefined && dataAggiornamento != ''){
						$('#dataAggiornamento').text(moment(dataAggiornamento).format('DD/MM/YYYY HH:mm:ss'));
					}
					var speditoAde = result.speditoAde;
					if(speditoAde){
						$('#speditoAde').text("Si");
					} else {
						$('#speditoAde').text("No");
					}
					var stato = result.statoFattura;
					if(stato != null && stato != undefined && stato != ''){
						$('#stato').text(stato.descrizione);
					}
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
					$('#totaleAcconto').text(result.totaleAcconto);
					$('#totale').text(result.totale);
					$('#note').text(result.note);


					if(result.fatturaDdts != null && result.fatturaDdts != undefined){
						$('#detailsFattureVenditaDdtModalTable').DataTable({
							"data": result.fatturaDdts,
							"language": {
								"paginate": {
									"first": "Inizio",
									"last": "Fine",
									"next": "Succ.",
									"previous": "Prec."
								},
								"search": "Cerca",
								"emptyTable": "Nessun DDT presente",
								"zeroRecords": "Nessun DDT presente"
							},
							"pageLength": 20,
							"lengthChange": false,
							"info": false,
							"order": [
								[0, 'desc'],
								[1, 'desc']
							],
							"autoWidth": false,
							"columns": [
								{"name": "numero", "data": null, render: function (data, type, row) {
									var result = '';
									if (data.ddt != null) {
										result = data.ddt.progressivo;
									}
									return result;
								}},
								{"name": "data", "data": null, render: function (data, type, row) {
									var result = '';
									if (data.ddt != null) {
										result = moment(data.ddt.data).format('DD/MM/YYYY');
									}
									return result;
								}},
								{"name": "acconto", "data": null, render: function (data, type, row) {
									var result = '';
									if (data.ddt != null) {
										result = data.ddt.totaleAcconto;
									}
									return result;
								}},
								{"name": "importo", "data": null, render: function (data, type, row) {
									var result = '';
									if (data.ddt != null) {
										result = data.ddt.totale;
									}
									return result;
								}},
								{"name": "imponibile", "data": null, render: function (data, type, row) {
									var result = '';
									if (data.ddt != null) {
										result = data.ddt.totaleImponibile;
									}
									return result;
								}},
								{"name": "costo", "data": null, render: function (data, type, row) {
									var result = '';
									if (data.ddt != null) {
										result = data.ddt.totaleCosto;
									}
									return result;
								}},
								{"name": "guadagno", "data": null, render: function (data, type, row) {
									var result = '';
									if (data.ddt != null) {
										result = data.ddt.totaleGuadagno;
									}
									return result;
								}}
							]
						});
					}

				} else{
					$('#detailsFattureVenditaMainDiv').empty().append(alertContent);
				}
			},
			error: function(jqXHR, textStatus, errorThrown) {
				$('#detailsFattureVenditaMainDiv').empty().append(alertContent);
				console.log('Response text: ' + jqXHR.responseText);
			}
		})

		$('#detailsFattureVenditaModal').modal('show');
	});

	$(document).on('click','.closeFattureVendita', function(){
		$('#detailsFattureVenditaDdtModalTable').DataTable().destroy();
		$('#detailsFattureVenditaModal').modal('hide');
	});

	$(document).on('click','.deleteFattureVendita', function(){
		var idFatturaVendita = $(this).attr('data-id');
		$('#confirmDeleteFattureVendita').attr('data-id', idFatturaVendita);
		$('#deleteFattureVenditaModal').modal('show');
	});

	$(document).on('click','#confirmDeleteFattureVendita', function(){
		$('#deleteFattureVenditaModal').modal('hide');
		var idFatturaVendita = $(this).attr('data-id');

		$.ajax({
			url: baseUrl + "fatture-vendita/" + idFatturaVendita,
			type: 'DELETE',
			success: function() {
				var alertContent = '<div id="alertFattureVenditaContent" class="alert alert-success alert-dismissible fade show" role="alert">';
				alertContent = alertContent + '<strong>Fattura vendita</strong> cancellata con successo.\n' +
					'            <button type="button" class="close" data-dismiss="alert" aria-label="Close"><span aria-hidden="true">&times;</span></button></div>';
				$('#alertFattureVendita').empty().append(alertContent);

				$('#fattureVenditaTable').DataTable().ajax.reload();
			},
			error: function(jqXHR, textStatus, errorThrown) {
				console.log('Response text: ' + jqXHR.responseText);
			}
		});
	});

	if($('#searchFattureVenditaButton') != null && $('#searchFattureVenditaButton') != undefined) {
		$(document).on('submit', '#searchFattureVenditaForm', function (event) {
			event.preventDefault();

			var dataDa = $('#searchDataFrom').val();
			var dataA = $('#searchDataTo').val();
			var cliente = $('#searchCliente').val();
			var agente = $('#searchAgente option:selected').val();
			var progressivo = $('#searchProgressivo').val();
			var importo = $('#searchImporto').val();
			var tipoPagamento = $('#searchTipoPagamento option:selected').val();
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
			if(articolo != null && articolo != undefined && articolo != ''){
				params.articolo = articolo;
			}
			if(stato != null && stato != undefined && stato != ''){
				params.stato = stato;
			}
			var url = baseUrl + "fatture-vendita?" + $.param( params );

			$('#fattureVenditaTable').DataTable().destroy();
			$.fn.loadFattureVenditaTable(url);

		});
	}

	if($('#newFatturaVenditaButton') != null && $('#newFatturaVenditaButton') != undefined){
		$(document).on('submit','#newFatturaVenditaForm', function(event){
			event.preventDefault();

			var alertContent = '<div id="alertFattureVenditaContent" class="alert alert-@@alertResult@@ alert-dismissible fade show" role="alert">';
			alertContent = alertContent + '<strong>@@alertText@@</strong>\n' +
				'<button type="button" class="close" data-dismiss="alert" aria-label="Close"><span aria-hidden="true">&times;</span></button></div>';

			var numChecked = $('.fatturaVenditaDdtCheckbox:checkbox:checked').length;
			if(numChecked == null || numChecked == undefined || numChecked == 0){
				$('#alertFattureVendita').empty().append(alertContent.replace('@@alertText@@','Selezionare almeno un DDT').replace('@@alertResult@@', 'danger'));
			} else{
				var fatturaVendita = new Object();
				fatturaVendita.progressivo = $('#progressivo').val();
				fatturaVendita.anno = $('#anno').val();
				fatturaVendita.data = $('#data').val();

				var cliente = new Object();
				cliente.id = $('#cliente option:selected').val();
				fatturaVendita.cliente = cliente;

				var fatturaDdts = [];
				$('.fatturaVenditaDdtCheckbox:checkbox:checked').each(function(i, item) {
					var ddtId = item.id.replace('checkbox_', '');

					var fatturaDdt = {};
					var fatturaDdtId = new Object();
					fatturaDdtId.ddtId = ddtId;
					fatturaDdt.id = fatturaDdtId;

					fatturaDdts.push(fatturaDdt);
				});

				fatturaVendita.fatturaDdts = fatturaDdts;

				fatturaVendita.totale = $('#totale').val();
				fatturaVendita.totaleAcconto = 0;
				fatturaVendita.note = $('#note').val();

				var fatturaVenditaJson = JSON.stringify(fatturaVendita);

				$.ajax({
					url: baseUrl + "fatture-vendita",
					type: 'POST',
					contentType: "application/json",
					dataType: 'json',
					data: fatturaVenditaJson,
					success: function(result) {
						$('#alertFattureVendita').empty().append(alertContent.replace('@@alertText@@','Fattura vendita creata con successo').replace('@@alertResult@@', 'success'));

						$('#newFatturaVenditaButton').attr("disabled", true);

						// Returns to the same page
						setTimeout(function() {
							window.location.href = "fatture-vendita.html";
						}, 1000);
					},
					error: function(jqXHR, textStatus, errorThrown) {
						var errorMessage = 'Errore nella creazione della fattura vendita';
						if(jqXHR != null && jqXHR != undefined){
							var jqXHRResponseJson = jqXHR.responseJSON;
							if(jqXHRResponseJson != null && jqXHRResponseJson != undefined && jqXHRResponseJson != ''){
								var jqXHRResponseJsonMessage = jqXHR.responseJSON.message;
								if(jqXHRResponseJsonMessage != null && jqXHRResponseJsonMessage != undefined && jqXHRResponseJsonMessage != '' && jqXHRResponseJsonMessage.indexOf('con progressivo') != -1){
									errorMessage = jqXHRResponseJsonMessage;
								}
							}
						}
						$('#alertFattureVendita').empty().append(alertContent.replace('@@alertText@@', errorMessage).replace('@@alertResult@@', 'danger'));
					}
				});
			}

		});
	}

	$(document).on('click','#resetSearchFattureVenditaButton', function(){
		event.preventDefault();

		var alertContent = '<div id="alertFattureVenditaContent" class="alert alert-@@alertResult@@ alert-dismissible fade show" role="alert">';
		alertContent = alertContent + '<strong>@@alertText@@</strong>\n' +
			'<button type="button" class="close" data-dismiss="alert" aria-label="Close"><span aria-hidden="true">&times;</span></button></div>';

		$.ajax({
			url: baseUrl + "fatture-vendita/creazione-automatica",
			type: 'POST',
			contentType: "application/json",
			dataType: 'json',
			success: function(result) {
				$('#alertFattureVendita').empty().append(alertContent.replace('@@alertText@@','Fatture vendite create con successo').replace('@@alertResult@@', 'success'));

			},
			error: function(jqXHR, textStatus, errorThrown) {
				var errorMessage = 'Errore nella creazione delle fatture vendite';
				if(jqXHR != null && jqXHR != undefined){
					var jqXHRResponseJson = jqXHR.responseJSON;
					if(jqXHRResponseJson != null && jqXHRResponseJson != undefined && jqXHRResponseJson != ''){
						var jqXHRResponseJsonMessage = jqXHR.responseJSON.message;
						if(jqXHRResponseJsonMessage != null && jqXHRResponseJsonMessage != undefined && jqXHRResponseJsonMessage != '' && jqXHRResponseJsonMessage.indexOf('con progressivo') != -1){
							errorMessage = jqXHRResponseJsonMessage;
						}
					}
				}
				$('#alertFattureVendita').empty().append(alertContent.replace('@@alertText@@', errorMessage).replace('@@alertResult@@', 'danger'));
			}
		});
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
		url: baseUrl + "stati-fattura",
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
		url: baseUrl + "fatture-vendita/progressivo",
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

$(document).on('change','#cliente', function(){
	var cliente = $('#cliente option:selected').val();
	if(cliente != null && cliente != ''){
		$('#fatturaVenditaDdtTable').DataTable().destroy();

		var url = baseUrl + "ddts?idCliente="+cliente+"&fatturato=false";
		$('#fatturaVenditaDdtTable').DataTable({
			"ajax": {
				"url": url,
				"type": "GET",
				"content-type": "json",
				"cache": false,
				"dataSrc": "",
				"error": function(jqXHR, textStatus, errorThrown) {
					console.log('Response text: ' + jqXHR.responseText);
					var alertContent = '<div id="alertFattureVenditaContent" class="alert alert-danger alert-dismissible fade show" role="alert">';
					alertContent = alertContent + '<strong>Errore nel recupero dei ddt da fatturare</strong>\n' +
						'            <button type="button" class="close" data-dismiss="alert" aria-label="Close"><span aria-hidden="true">&times;</span></button></div>';
					$('#alertFattureVendita').empty().append(alertContent);
				}
			},
			"language": {
				"paginate": {
					"first": "Inizio",
					"last": "Fine",
					"next": "Succ.",
					"previous": "Prec."
				},
				"emptyTable": "Nessun DDT da fatturare",
				"zeroRecords": "Nessun DDT da fatturare"
			},
			"searching": false,
			"responsive":true,
			"pageLength": 20,
			"lengthChange": false,
			"info": false,
			"autoWidth": false,
			"order": [
				[1, 'desc'],
				[2, 'desc']
			],
			"columns": [
				{"data": null, "orderable":false, "width": "2%", render: function ( data, type, row ) {
					var checkboxHtml = '<input type="checkbox" data-id="'+data.id+'" id="checkbox_'+data.id+'" class="fatturaVenditaDdtCheckbox">';
					return checkboxHtml;
				}},
				{"name": "numero", "data": "progressivo", "width":"5%"},
				{"name": "data", "data": null, "width":"8%", render: function ( data, type, row ) {
					var a = moment(data.data);
					return a.format('DD/MM/YYYY');
				}},
				{"name": "importo", "data": null, "width":"8%",render: function ( data, type, row ) {
					return $.fn.formatNumber(data.totale);
				}}
			],
			"createdRow": function(row, data, dataIndex,cells){
				/*
                $(row).css('font-size', '12px');
                if(data.statoDdt != null){
                    var backgroundColor = '';
                    if(data.statoDdt.codice == 'DA_PAGARE'){
                        backgroundColor = '#fcf456';
                    } else if(data.statoDdt.codice == 'PARZIALMENTE_PAGATO'){
                        backgroundColor = '#fcc08b';
                    } else {
                        backgroundColor = 'trasparent';
                    }
                    $(row).css('background-color', backgroundColor);
                }
                */
				//$(cells[11]).css('padding-right','0px').css('padding-left','3px');
				$(cells[0]).css('text-align','center');
				$(cells[1]).css('text-align','center');
				$(cells[2]).css('text-align','center');
				$(cells[3]).css('text-align','center').addClass('ddtTotale');
			}
		});
	} else {
		$('#fatturaVenditaDdtTable').DataTable().clear();
		$('#fatturaVenditaDdtTable').DataTable().destroy();
		$.fn.loadEmptyFatturaVenditaDdtTable();
	}
});

$.fn.extractIdFatturaVenditaFromUrl = function(){
    var pageUrl = window.location.search.substring(1);

	var urlVariables = pageUrl.split('&'),
        paramNames,
        i;

    for (i = 0; i < urlVariables.length; i++) {
        paramNames = urlVariables[i].split('=');

        if (paramNames[0] === 'idFatturaVendita') {
        	return paramNames[1] === undefined ? null : decodeURIComponent(paramNames[1]);
        }
    }
}

$.fn.formatNumber = function(value){
	return parseFloat(Number(Math.round(value+'e2')+'e-2')).toFixed(2);
}

$(document).on('change','.fatturaVenditaDdtCheckbox', function(){
	var numChecked = $('.fatturaVenditaDdtCheckbox:checkbox:checked').length;
	if(numChecked == null || numChecked == undefined || numChecked == 0){
		$('#totale').val(null);
	} else{
		var totale = 0;
		$('.fatturaVenditaDdtCheckbox:checkbox:checked').each(function(i, item) {
			$(this).parent().parent().find('.ddtTotale').each(function( index ) {
				totale += parseFloat($(this).text());
			});
		});
		$('#totale').val(parseFloat(Number(Math.round(totale+'e2')+'e-2')).toFixed(2));
	};
});
