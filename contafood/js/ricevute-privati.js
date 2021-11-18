var baseUrl = "/contafood-be/";
var rowBackgroundVerde = '#96ffb2';
var rowBackgroundRosa = '#fcd1ff';
var rowBackgroundGiallo = '#fffca3';

$.fn.loadRicevutaPrivatoTable = function(url) {
	$.ajax({
		url: baseUrl + "autisti",
		type: 'GET',
		dataType: 'json',
		success: function(autistiResult) {
			$('#ricevutePrivatiTable').DataTable({
				"ajax": {
					"url": url,
					"type": "GET",
					"content-type": "json",
					"cache": false,
					"dataSrc": "",
					"error": function(jqXHR, textStatus, errorThrown) {
						console.log('Response text: ' + jqXHR.responseText);
						var alertContent = '<div id="alertRicevutaPrivatoContent" class="alert alert-danger alert-dismissible fade show" role="alert">';
						alertContent = alertContent + '<strong>Errore nel recupero delle Ricevute Privati</strong>\n' +
							'            <button type="button" class="close" data-dismiss="alert" aria-label="Close"><span aria-hidden="true">&times;</span></button></div>';
						$('#alertRicevutaPrivato').empty().append(alertContent);
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
					"emptyTable": "Nessuna ricevuta a privato disponibile",
					"zeroRecords": "Nessuna ricevuta a privato disponibile"
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
							return cliente.nome+" "+cliente.cognome;
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
						var ricevutaPrivatoId = data.id;
						var selectId = "autista_" + ricevutaPrivatoId;

						var autistaId = null;
						if(data.autista != null){
							autistaId = data.autista.id;
						}

						var autistaSelect = '<select id="'+selectId+'" class="form-control form-control-sm autistaDdt" data-id="'+ricevutaPrivatoId+'">';
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
					{"name": "acconto", "data": null, "width":"8%", render: function ( data, type, row ) {
						return $.fn.formatNumber(data.totaleAcconto);
					}},
					{"name": "importo", "data": null, "width":"8%",render: function ( data, type, row ) {
						return $.fn.formatNumber(data.totale);
					}},
					{"name": "imponibile", "data": null, "width":"8%", render: function ( data, type, row ) {
						return $.fn.formatNumber(data.totaleImponibile);
					}},
					{"name": "costo", "data": null, "width":"6%", render: function ( data, type, row ) {
						return $.fn.formatNumber(data.totaleCosto);
					}},
					{"name": "guadagno", "data": null, "width":"8%", render: function ( data, type, row ) {
						var guadagno = data.totaleImponibile - data.totaleCosto;
						return $.fn.formatNumber(guadagno);
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
						var stato = data.statoRicevutaPrivato;

						var links = '<a class="detailsRicevutaPrivato pr-1" data-id="'+data.id+'" href="#" title="Dettagli"><i class="fas fa-info-circle"></i></a>';
						//if(!data.fatturato && (stato != null && stato != undefined && stato != '' && stato.codice == 'DA_PAGARE')){
						//	links += '<a class="updateRicevutaPrivato pr-1" data-id="'+data.id+'" href="ricevuta-privato-edit.html?idRicevutaPrivato=' + data.id + '" title="Modifica"><i class="far fa-edit"></i></a>';
						//}
						if((totale - acconto) != 0){
							links += '<a class="payRicevutaPrivato pr-1" data-id="'+data.id+'" href="pagamenti-new.html?idRicevutaPrivato=' + data.id + '" title="Pagamento"><i class="fa fa-shopping-cart"></i></a>';
						}
						links += '<a class="emailRicevutaPrivato pr-1" data-id="'+data.id+'" href="#" title="Spedizione email"><i class="fa fa-envelope"></i></a>';
						links += '<a class="printRicevutaPrivato pr-1" data-id="'+data.id+'" href="#" title="Stampa"><i class="fa fa-print"></i></a>';
						if(!data.fatturato && (stato != null && stato != undefined && stato != '' && stato.codice == 'DA_PAGARE')) {
							links += '<a class="deleteRicevutaPrivato" data-id="' + data.id + '" href="#" title="Elimina"><i class="far fa-trash-alt"></i></a>';
						}
						return links;
					}}
				],
				"createdRow": function(row, data, dataIndex,cells){
					$(row).css('font-size', '12px').addClass('rowRicevutaPrivato');
					$(row).attr('data-id-ricevuta-privato', data.id);
					if(data.statoRicevutaPrivato != null){
						var backgroundColor = '';
						if(data.statoRicevutaPrivato.codice == 'DA_PAGARE'){
							backgroundColor = '#fcf456';
						} else if(data.statoRicevutaPrivato.codice == 'PARZIALMENTE_PAGATA'){
							backgroundColor = '#fcc08b';
						} else {
							backgroundColor = 'trasparent';
						}
						$(row).css('background-color', backgroundColor);
					}
					$(cells[11]).css('padding-right','0px').css('padding-left','3px');
					$(cells[6]).css('text-align','right');
					$(cells[7]).css('font-weight','bold').css('text-align','right');
					$(cells[8]).css('text-align','right');
					$(cells[9]).css('text-align','right');
					$(cells[10]).css('text-align','right');
				}
			});
		}
	});
}

$(document).ready(function() {

	$.fn.loadRicevutaPrivatoTable(baseUrl + "ricevute-privati");

	$('#ricevutaPrivatoArticoliTable').DataTable({
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
			{ "width": "12%" },
			{ "width": "12%" },
			{ "width": "5%" },
			{ "width": "3%" },
			{ "width": "8%" },
			{ "width": "5%" },
			{ "width": "5%" },
			{ "width": "5%" },
			{ "width": "5%" },
			{ "width": "4%" },
			{ "width": "2%" }
		],
		"order": [
			[0, 'asc']
		]
	});

	$('#ricevutaPrivatoTotaliTable').DataTable({
		"ajax": {
			"url": baseUrl + "aliquote-iva",
			"type": "GET",
			"content-type": "json",
			"cache": false,
			"dataSrc": "",
			"error": function(jqXHR, textStatus, errorThrown) {
				console.log('Response text: ' + jqXHR.responseText);
				var alertContent = '<div id="alertRicevutaPrivatoContent" class="alert alert-danger alert-dismissible fade show" role="alert">';
				alertContent = alertContent + '<strong>Errore nel recupero delle aliquote iva</strong>\n' +
					'            <button type="button" class="close" data-dismiss="alert" aria-label="Close"><span aria-hidden="true">&times;</span></button></div>';
				$('#alertRicevutaPrivato').empty().append(alertContent);
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

	$(document).on('click','#resetSearchRicevutePrivatiButton', function(){
		$('#searchRicevutePrivatiForm :input').val(null);
		$('#searchRicevutePrivatiForm select option[value=""]').attr('selected', true);

		$('#ricevutePrivatiTable').DataTable().destroy();
		$.fn.loadRicevutaPrivatoTable(baseUrl + "ricevute-privati");
	});

	$(document).on('click','.detailsRicevutaPrivato', function(){
		var idRicevutaPrivato = $(this).attr('data-id');

		var alertContent = '<div id="alertRicevutaPrivatoContent" class="alert alert-danger alert-dismissible fade show" role="alert">';
		alertContent = alertContent + '<strong>Errore nel recupero della ricevuta a privato.</strong></div>';

		$.ajax({
			url: baseUrl + "ricevute-privati/" + idRicevutaPrivato,
			type: 'GET',
			dataType: 'json',
			success: function(result) {
				if(result != null && result != undefined && result != '') {
					$('#numero').text(result.progressivo);
					$('#data').text(moment(result.data).format('DD/MM/YYYY'));
					var cliente = result.cliente;
					if(cliente != null && cliente != undefined && cliente != ''){
						$('#cliente').text(cliente.nome+" "+cliente.cognome);
						var agente = cliente.agente;
						if(agente != null){
							$('#agente').text(agente.nome + ' ' + agente.cognome);
						}
					}
					var puntoConsegna = result.puntoConsegna;
					if(puntoConsegna != null && puntoConsegna != undefined && puntoConsegna != ''){
						$('#puntoConsegna').text(puntoConsegna.nome);
					}
					var autista = result.autista;
					if(autista != null && autista != undefined && autista != ''){
						$('#autista').text(autista.nome+' '+autista.cognome);
					}
					var stato = result.statoRicevutaPrivato;
					if(stato != null && stato != undefined && stato != ''){
						$('#stato').text(stato.descrizione);
					}
					var causale = result.causale;
					if(causale != null && causale != undefined && causale != ''){
						$('#causale').text(causale.descrizione);
					}
					$('#tipoTrasporto').text(result.tipoTrasporto);
					$('#dataTrasporto').text(moment(result.dataTrasporto).format('DD/MM/YYYY'));
					$('#oraTrasporto').text(result.oraTrasporto);
					$('#trasportatore').text(result.trasportatore);
					$('#colli').text(result.numeroColli);
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

					if(result.ricevutaPrivatoArticoli != null && result.ricevutaPrivatoArticoli != undefined){
						$('#detailsRicevutaPrivatoArticoliModalTable').DataTable({
							"data": result.ricevutaPrivatoArticoli,
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
								[0, 'desc'],
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

					if(result.ricevutaPrivatoTotali != null && result.ricevutaPrivatoTotali != undefined){
						$('#detailsRicevutaPrivatoTotaliModalTable').DataTable({
							"data": result.ricevutaPrivatoTotali,
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

					if(result.ricevutaPrivatoPagamenti != null && result.ricevutaPrivatoPagamenti != undefined){
						$('#detailsRicevutaPrivatoPagamentiModalTable').DataTable({
							"retrieve": true,
							"data": result.ricevutaPrivatoPagamenti,
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

				} else{
					$('#detailsRicevutaPrivatoMainDiv').empty().append(alertContent);
				}
			},
			error: function(jqXHR, textStatus, errorThrown) {
				$('#detailsRicevutaPrivatoMainDiv').empty().append(alertContent);
				console.log('Response text: ' + jqXHR.responseText);
			}
		})

		$('#detailsRicevutaPrivatoModal').modal('show');


	});

	$(document).on('click','.closeRicevutaPrivato', function(){
		$('#detailsRicevutaPrivatoArticoliModalTable').DataTable().destroy();
		$('#detailsRicevutaPrivatoTotaliModalTable').DataTable().destroy();
		$('#detailsRicevutaPrivatoPagamentiModalTable').DataTable().destroy();
		$('#detailsRicevutaPrivatoModal').modal('hide');
	});

	$(document).on('click','.deleteRicevutaPrivato', function(){
		var idRicevutaPrivato = $(this).attr('data-id');
		$('#confirmDeleteRicevutaPrivato').attr('data-id', idRicevutaPrivato);
		$('#deleteRicevutaPrivatoModal').modal('show');
	});

	$(document).on('click','#confirmDeleteRicevutaPrivato', function(){
		$('#deleteRicevutaPrivatoModal').modal('hide');
		var idRicevutaPrivato = $(this).attr('data-id');

		var url = baseUrl + "ricevute-privati/" + idRicevutaPrivato;
		var successText = '<strong>Ricevuta a privato </strong> cancellata con successo.\n';
		var errorText = '<strong>Errore nella cancellazione della ricevuta a privato.</strong>\n';

		$.ajax({
			url: url,
			type: 'DELETE',
			success: function() {
				var alertContent = '<div id="alertRicevutaPrivatoContent" class="alert alert-success alert-dismissible fade show" role="alert">';
				alertContent = alertContent + successText +
					'            <button type="button" class="close" data-dismiss="alert" aria-label="Close"><span aria-hidden="true">&times;</span></button></div>';
				$('#alertRicevutaPrivato').empty().append(alertContent);

				$('#ricevutePrivatiTable').DataTable().ajax.reload();
			},
			error: function(jqXHR, textStatus, errorThrown) {
				console.log('Response text: ' + jqXHR.responseText);
				var alertContent = '<div id="alertRicevutaPrivatoContent" class="alert alert-danger alert-dismissible fade show" role="alert">';
				alertContent = alertContent + errorText +
					'            <button type="button" class="close" data-dismiss="alert" aria-label="Close"><span aria-hidden="true">&times;</span></button></div>';
				$('#alertRicevutaPrivato').empty().append(alertContent);
			}
		});

	});

	$(document).on('click','.printRicevutaPrivato', function(){
		var idRicevutaPrivato = $(this).attr('data-id');

		window.open(baseUrl + "stampe/ricevute-privati/"+idRicevutaPrivato, '_blank');
	});

	$(document).on('click','#printRicevutePrivati', function(event){
		event.preventDefault();

		var ids = "";

		$(".rowRicevutaPrivato").each(function(i, item){
			var id = $(this).attr('data-id-ricevuta-privato');
			ids += id+",";
		});

		window.open(baseUrl + "stampe/ricevute-privati?ids="+ids, '_blank');

	});

	if($('#searchRicevutePrivatiButton') != null && $('#searchRicevutePrivatiButton') != undefined) {
		$(document).on('submit', '#searchRicevutePrivatiForm', function (event) {
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
			var tipo = $('#searchTipo option:selected').val();

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
			if(tipo != null && tipo != undefined && tipo != ''){
				params.tipo = tipo;
			}
			var url = baseUrl + "ricevute-privati?" + $.param( params );

			$('#ricevutePrivatiTable').DataTable().destroy();
			$.fn.loadRicevutaPrivatoTable(url);

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

	$.fn.validateDataTrasporto = function(){
		var valid = true;

		var dataFatturaAccompagnatoria = $('#data').val();
		var dataTrasporto = $('#dataTrasporto').val();
		if(dataFatturaAccompagnatoria != null && dataTrasporto != null){
			var dataFatturaAccompagnatoria_d = new Date(dataFatturaAccompagnatoria);
			var dataTrasporto_d = new Date(dataTrasporto);
			if(dataTrasporto_d < dataFatturaAccompagnatoria_d){
				valid = false;
			}
		}

		return valid;
	}

	$.fn.createRicevutaPrivato = function(print){

		var alertContent = '<div id="alertRicevutaPrivatoContent" class="alert alert-@@alertResult@@ alert-dismissible fade show" role="alert">';
		alertContent = alertContent + '<strong>@@alertText@@</strong>\n' +
			'<button type="button" class="close" data-dismiss="alert" aria-label="Close"><span aria-hidden="true">&times;</span></button></div>';

		var validLotto = $.fn.validateLotto();
		/*
        if(!validLotto){
            $('#alertFattureAccompagnatorie').empty().append(alertContent.replace('@@alertText@@', "Compilare tutti i dati 'Lotto'").replace('@@alertResult@@', 'danger'));
            return false;
        }
         */
		var validDataTrasporto = $.fn.validateDataTrasporto();
		if(!validDataTrasporto){
			$('#alertRicevutaPrivato').empty().append(alertContent.replace('@@alertText@@', "'Data trasporto' non può essere precedente alla data della Ricevuta Privato").replace('@@alertResult@@', 'danger'));
			return false;
		}

		var ricevutaPrivato = new Object();
		ricevutaPrivato.progressivo = $('#progressivo').val();
		ricevutaPrivato.anno = $('#anno').val();
		ricevutaPrivato.data = $('#data').val();

		var cliente = new Object();
		cliente.id = $('#cliente option:selected').val();
		ricevutaPrivato.cliente = cliente;

		var puntoConsegna = new Object();
		puntoConsegna.id = $('#puntoConsegna option:selected').val();
		ricevutaPrivato.puntoConsegna = puntoConsegna;

		var causale = new Object();
		causale.id = $('#causale option:selected').val();
		ricevutaPrivato.causale = causale;

		var ricevutaPrivatoArticoliLength = $('.rowArticolo').length;
		if(ricevutaPrivatoArticoliLength != null && ricevutaPrivatoArticoliLength != undefined && ricevutaPrivatoArticoliLength != 0){
			var ricevutaPrivatoArticoli = [];
			$('.rowArticolo').each(function(i, item){
				var articoloId = $(this).attr('data-id');

				var ricevutaPrivatoArticolo = {};
				var ricevutaPrivatoArticoloId = new Object();
				ricevutaPrivatoArticoloId.articoloId = articoloId;
				ricevutaPrivatoArticolo.id = ricevutaPrivatoArticoloId;

				ricevutaPrivatoArticolo.lotto = $(this).children().eq(1).children().eq(0).val();
				ricevutaPrivatoArticolo.scadenza = $(this).children().eq(2).children().eq(0).val();
				ricevutaPrivatoArticolo.quantita = $(this).children().eq(4).children().eq(0).val();
				ricevutaPrivatoArticolo.numeroPezzi = $(this).children().eq(5).children().eq(0).val();
				ricevutaPrivatoArticolo.prezzo = $(this).children().eq(6).children().eq(0).val();
				ricevutaPrivatoArticolo.sconto = $(this).children().eq(7).children().eq(0).val();

				ricevutaPrivatoArticoli.push(ricevutaPrivatoArticolo);
			});
			ricevutaPrivato.ricevutaPrivatoArticoli = ricevutaPrivatoArticoli;
		}
		var ricevutaPrivatoTotaliLength = $('.rowTotaliByIva').length;
		if(ricevutaPrivatoTotaliLength != null && ricevutaPrivatoTotaliLength != undefined && ricevutaPrivatoTotaliLength != 0){
			var ricevutaPrivatoTotali = [];
			$('.rowTotaliByIva').each(function(i, item){
				var aliquotaIvaId = $(this).attr('data-id');

				var ricevutaPrivatoTotale = {};
				var ricevutaPrivatoTotaleId = new Object();
				ricevutaPrivatoTotaleId.aliquotaIvaId = aliquotaIvaId;
				ricevutaPrivatoTotale.id = ricevutaPrivatoTotaleId;

				ricevutaPrivatoTotale.totaleIva = $(this).find('td').eq(1).text();
				ricevutaPrivatoTotale.totaleImponibile = $(this).find('td').eq(2).text();

				ricevutaPrivatoTotali.push(ricevutaPrivatoTotale);
			});
			ricevutaPrivato.ricevutaPrivatoTotali = ricevutaPrivatoTotali;
		}

		ricevutaPrivato.numeroColli = $('#colli').val();
		ricevutaPrivato.tipoTrasporto = $('#tipoTrasporto option:selected').val();
		ricevutaPrivato.dataTrasporto = $('#dataTrasporto').val();

		var regex = /:/g;
		var oraTrasporto = $('#oraTrasporto').val();
		if(oraTrasporto != null && oraTrasporto != ''){
			var count = oraTrasporto.match(regex);
			count = (count) ? count.length : 0;
			if(count == 1){
				ricevutaPrivato.oraTrasporto = $('#oraTrasporto').val() + ':00';
			} else {
				ricevutaPrivato.oraTrasporto = $('#oraTrasporto').val();
			}
		}
		ricevutaPrivato.trasportatore = $('#trasportatore').val();
		ricevutaPrivato.note = $('#note').val();

		var ricevutaPrivatoJson = JSON.stringify(ricevutaPrivato);

		$.ajax({
			url: baseUrl + "ricevute-privati",
			type: 'POST',
			contentType: "application/json",
			dataType: 'json',
			data: ricevutaPrivatoJson,
			success: function(result) {
				var idRicevutaPrivato = result.id;

				$('#alertRicevutaPrivato').empty().append(alertContent.replace('@@alertText@@','Ricevuta privato creata con successo').replace('@@alertResult@@', 'success'));

				$('#newRicevutaPrivatoButton').attr("disabled", true);

				// Update ordini clienti
				var articoliOrdiniClienti = [];
				$('.ordineClienteArticolo').each(function(i, item){
					var idArticolo = $(this).attr('data-id-articolo');
					var idsOrdiniClienti = $(this).attr('data-ids-ordini');
					var numeroPezziDaEvadere = $(this).parent().parent().attr('data-num-pezzi-evasi');

					var articoloOrdiniClienti = new Object();
					articoloOrdiniClienti.idArticolo = idArticolo;
					articoloOrdiniClienti.numeroPezziDaEvadere = numeroPezziDaEvadere;
					articoloOrdiniClienti.idsOrdiniClienti = idsOrdiniClienti;

					articoliOrdiniClienti.push(articoloOrdiniClienti);
				});

				if(articoliOrdiniClienti.length != 0){

					var articoliOrdiniClientiJson = JSON.stringify(articoliOrdiniClienti);

					$.ajax({
						url: baseUrl + "ordini-clienti/aggregate",
						type: 'POST',
						contentType: "application/json",
						dataType: 'json',
						data: articoliOrdiniClientiJson,
						success: function(result) {
							$('#alertRicevutaPrivato').empty().append(alertContent.replace('@@alertText@@','Ricevuta privato creata con successo. Ordini clienti aggiornati con successo.').replace('@@alertResult@@', 'success'));

							// Returns to the same page
							setTimeout(function() {
								window.location.href = "ricevute-privati-new.html?dt="+ricevutaPrivato.dataTrasporto+"&ot="+oraTrasporto;
							}, 1000);

							if(print){
								window.open(baseUrl + "stampe/ricevute-privati/"+idRicevutaPrivato, '_blank');
							}
						},
						error: function(jqXHR, textStatus, errorThrown) {
							$('#alertRicevutaPrivato').empty().append(alertContent.replace('@@alertText@@', "Ricevuta privato creata con successo. Errore nell aggiornamento degli ordini clienti.").replace('@@alertResult@@', 'warning'));
						}
					});

				} else {
					$('#alertRicevutaPrivato').empty().append(alertContent.replace('@@alertText@@','Ricevuta privato creata con successo').replace('@@alertResult@@', 'success'));

					// Returns to the same page
					setTimeout(function() {
						window.location.href = "ricevute-privati-new.html?dt="+ricevutaPrivato.dataTrasporto+"&ot="+oraTrasporto;
					}, 1000);

					if(print){
						window.open(baseUrl + "stampe/ricevute-privati/"+idRicevutaPrivato, '_blank');
					}
				}

			},
			error: function(jqXHR, textStatus, errorThrown) {
				var errorMessage = 'Errore nella creazione della ricevuta privato';
				if(jqXHR != null && jqXHR != undefined){
					var jqXHRResponseJson = jqXHR.responseJSON;
					if(jqXHRResponseJson != null && jqXHRResponseJson != undefined && jqXHRResponseJson != ''){
						var jqXHRResponseJsonMessage = jqXHR.responseJSON.message;
						if(jqXHRResponseJsonMessage != null && jqXHRResponseJsonMessage != undefined && jqXHRResponseJsonMessage != '' && jqXHRResponseJsonMessage.indexOf('con progressivo') != -1){
							errorMessage = jqXHRResponseJsonMessage;
						}
					}
				}
				$('#alertRicevutaPrivato').empty().append(alertContent.replace('@@alertText@@', errorMessage).replace('@@alertResult@@', 'danger'));
			}
		});
	}

	if($('#newRicevutaPrivatoButton') != null && $('#newRicevutaPrivatoButton') != undefined && $('#newRicevutaPrivatoButton').length > 0){

		$('#articolo').selectpicker();
		$('#cliente').selectpicker();

		$(document).on('submit','#newRicevutaPrivatoForm', function(event){
			event.preventDefault();

			$.fn.createRicevutaPrivato(false);

		});
	}

	if($('#newAndPrintRicevutaPrivatoButton') != null && $('#newAndPrintRicevutaPrivatoButton') != undefined && $('#newAndPrintRicevutaPrivatoButton').length > 0){
		$('#articolo').selectpicker();
		$('#cliente').selectpicker();

		$(document).on('click','#newAndPrintRicevutaPrivatoButton', function(event){
			event.preventDefault();

			$.fn.createRicevutaPrivato(true);
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

		var alertContent = '<div id="alertRicevutaPrivatoContent" class="alert alert-@@alertResult@@ alert-dismissible fade show" role="alert">';
		alertContent = alertContent + '<strong>@@alertText@@</strong>\n' +
			'<button type="button" class="close" data-dismiss="alert" aria-label="Close"><span aria-hidden="true">&times;</span></button></div>';

		$('#alertRicevutaPrivato').empty();

		$.fn.emptyArticoli();

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
								$('#alertRicevutaPrivato').empty().append(alertContent.replace('@@alertText@@', 'Errore nel caricamento dei prezzi di listino').replace('@@alertResult@@', 'danger'));
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

					$.fn.loadArticoliFromOrdiniClienti();
				},
				error: function(jqXHR, textStatus, errorThrown) {
					$('#alertRicevutaPrivato').empty().append(alertContent.replace('@@alertText@@','Errore nel caricamento dei punti di consegna').replace('@@alertResult@@', 'danger'));
				}
			});
			$('#articolo').removeAttr('disabled');
			$('#articolo').selectpicker('refresh');

		} else {
			$('#puntoConsegna').empty();
			$('#puntoConsegna').attr('disabled', true);
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

	$(document).on('change','#dataTrasporto', function(){
		$.fn.emptyArticoli();

		$.fn.loadArticoliFromOrdiniClienti();
	});

	$(document).on('change','#puntoConsegna', function(){
		$.fn.emptyArticoli();
	});

	$(document).on('change','.pezzi', function(){
		$.fn.checkPezziOrdinati();
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
				$('#alertRicevutaPrivato').empty().append(alertContent.replace('@@alertText@@', 'Errore nel caricamento degli sconti').replace('@@alertResult@@', 'danger'));
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

			$('#addRicevutaPrivatoArticoloAlert').empty().append(alertContent);
			return;
		} else {
			$('#addRicevutaPrivatoArticoloAlert').empty();
		}

		var pezzi = $('#pezzi').val();
		if(pezzi == null || pezzi == undefined || pezzi == ''){
			var alertContent = '<div class="alert alert-danger alert-dismissable">\n' +
				'                <button type="button" class="close" data-dismiss="alert" aria-hidden="true">&times;</button>\n' +
				'                Inserisci il numero di pezzi\n' +
				'              </div>';

			$('#addRicevutaPrivatoArticoloAlert').empty().append(alertContent);
			return;
		} else {
			$('#addRicevutaPrivatoArticoloAlert').empty();
		}

		var articolo = $('#articolo option:selected').text();
		var udm = $('#udm').val();
		var lotto = $('#lotto').val();
		var scadenza = $('#scadenza').val();
		var quantita = $('#quantita').val();
		var prezzo = $('#prezzo').val();
		var sconto = $('#sconto').val();
		var iva = $('#iva').val();
		var codiceFornitore = $('#articolo option:selected').attr("data-codice-fornitore");
		var lottoRegExp = $('#articolo option:selected').attr("data-lotto-regexp");
		var dataScadenzaRegExp = $('#articolo option:selected').attr("data-scadenza-regexp");

		if(lotto != null && lotto != undefined && lotto != ''){
			var lottoHtml = '<input type="text" class="form-control form-control-sm text-center compute-totale lotto group" value="'+lotto+'" data-codice-fornitore="'+codiceFornitore+'" data-lotto-regexp="'+lottoRegExp+'" data-scadenza-regexp="'+dataScadenzaRegExp+'">';
		} else {
			var lottoHtml = '<input type="text" class="form-control form-control-sm text-center compute-totale lotto group" value="" data-codice-fornitore="'+codiceFornitore+'" data-lotto-regexp="'+lottoRegExp+'" data-scadenza-regexp="'+dataScadenzaRegExp+'">';
		}
		var scadenzaHtml = '<input type="date" class="form-control form-control-sm text-center compute-totale ignore-barcode-scanner scadenza group" value="'+moment(scadenza).format('YYYY-MM-DD')+'">';

		var quantitaHtml = '<input type="number" step=".001" min="0" class="form-control form-control-sm text-center compute-totale ignore-barcode-scanner" value="'+ $.fn.fixDecimalPlaces(quantita, 3) +'">';
		var pezziHtml = '<input type="number" step="1" min="0" class="form-control form-control-sm text-center compute-totale ignore-barcode-scanner pezzi" value="'+pezzi+'">';
		var prezzoHtml = '<input type="number" step=".001" min="0" class="form-control form-control-sm text-center compute-totale ignore-barcode-scanner" value="'+prezzo+'">';
		var scontoHtml = '<input type="number" step=".001" min="0" class="form-control form-control-sm text-center compute-totale ignore-barcode-scanner" value="'+sconto+'">';

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
		var fatturaAccompagnatoriaArticoliLength = $('.rowArticolo').length;
		if(fatturaAccompagnatoriaArticoliLength != null && fatturaAccompagnatoriaArticoliLength != undefined && fatturaAccompagnatoriaArticoliLength != 0) {
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

		var table = $('#ricevutaPrivatoArticoliTable').DataTable();
		if(found >= 1){

			var newQuantita = (quantita + $.fn.parseValue(currentQuantita,'float'));
			var newPezzi = pezzi + $.fn.parseValue(currentPezzi,'int');

			var newQuantitaHtml = '<input type="number" step=".001" min="0" class="form-control form-control-sm text-center compute-totale gnore-barcode-scanner" value="'+$.fn.fixDecimalPlaces(newQuantita, 3)+'">';
			var newPezziHtml = '<input type="number" step="1" min="0" class="form-control form-control-sm text-center compute-totale ignore-barcode-scanner pezzi" value="'+newPezzi+'">';

			var lottoHtml = '<input type="text" class="form-control form-control-sm text-center compute-totale lotto group" value="'+currentLotto+'" data-codice-fornitore="'+codiceFornitore+'">';
			var scadenzaHtml = '<input type="date" class="form-control form-control-sm text-center compute-totale ignore-barcode-scanner scadenza group" value="'+moment(currentScadenza).format('YYYY-MM-DD')+'">';

			var prezzoHtml = '<input type="number" step=".001" min="0" class="form-control form-control-sm text-center compute-totale ignore-barcode-scanner group" value="'+currentPrezzo+'">';
			var scontoHtml = '<input type="number" step=".001" min="0" class="form-control form-control-sm text-center compute-totale ignore-barcode-scanner group" value="'+currentSconto+'">';

			var rowData = table.row("[data-row-index='"+currentRowIndex+"']").data();
			rowData[1] = lottoHtml;
			rowData[2] = scadenzaHtml;
			rowData[4] = newQuantitaHtml;
			rowData[5] = newPezziHtml;
			rowData[6] = prezzoHtml;
			rowData[7] = scontoHtml;
			rowData[8] = totale;
			table.row("[data-row-index='"+currentRowIndex+"']").data(rowData).draw();

		} else {
			var deleteLink = '<a class="deleteRicevutaPrivatoArticolo" data-id="'+articoloId+'" href="#"><i class="far fa-trash-alt" title="Rimuovi"></i></a>';

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
			$(rowNode).css('text-align', 'center').css('color','#080707');
			$(rowNode).addClass('rowArticolo');
			$(rowNode).attr('data-id', articoloId);
			$(rowNode).attr('data-row-index', parseInt(rowsCount) + 1);

		}
		$.fn.computeTotale();

		$.fn.checkPezziOrdinati();

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

	$(document).on('click','.deleteRicevutaPrivatoArticolo', function(){
		$('#ricevutaPrivatoArticoliTable').DataTable().row( $(this).parent().parent() )
			.remove()
			.draw();
		$('#ricevutaPrivatoArticoliTable').focus();

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

		$.row.children().eq(8).text(totale);

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
		url: baseUrl + "stati-ricevuta-privato",
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

$.fn.preloadFields = function(dataTrasporto, oraTrasporto){
	$.ajax({
		url: baseUrl + "ricevute-privati/progressivo",
		type: 'GET',
		dataType: 'json',
		success: function(result) {
			if(result != null && result != undefined && result != ''){
				$('#progressivo').attr('value', result.progressivo);
				$('#anno').attr('value', result.anno);
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
		url: baseUrl + "clienti?bloccaDdt=false&privato=true",
		type: 'GET',
		dataType: 'json',
		success: function(result) {
			if(result != null && result != undefined && result != ''){
				$.each(result, function(i, item){
					var label = '';
					label += item.cognome + ' - ' + item.nome;
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

$.fn.getCausali = function(){
	$.ajax({
		url: baseUrl + "causali",
		type: 'GET',
		dataType: 'json',
		success: function(result) {
			if(result != null && result != undefined && result != ''){
				$.each(result, function(i, item){
					if(item != null && item != ''){
						if(item.descrizione == 'Vendita'){
							$('#causale').append('<option value="'+item.id+'" selected>'+item.descrizione+'</option>');
						} else{
							$('#causale').append('<option value="'+item.id+'">'+item.descrizione+'</option>');
						}
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
					var lottoRegexp = $.fn.getLottoRegExp(item);
					var dataScadenzaRegexp = $.fn.getDataScadenzaRegExp(item);

					$('#articolo').append('<option value="'+item.id+'" ' +
						'data-udm="'+dataUdm+'" ' +
						'data-iva="'+dataIva+'" ' +
						'data-qta="'+dataQta+'" ' +
						'data-prezzo-base="'+dataPrezzoBase+'" ' +
						'data-codice-fornitore="'+item.fornitore.codice+'" ' +
						'data-lotto-regexp="'+lottoRegexp+'" ' +
						'data-scadenza-regexp="'+dataScadenzaRegexp+'" ' +
						'>'+item.codice+' '+item.descrizione+'</option>');

					$('#articolo').selectpicker('refresh');
				});
			}
		},
		error: function(jqXHR, textStatus, errorThrown) {
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

$.fn.getLottoRegExp = function(articolo){
	var lottoRegexp = articolo.barcodeRegexpLotto;
	var fornitore = articolo.fornitore;
	if($.fn.checkVariableIsNull(lottoRegexp)) {
		if(!$.fn.checkVariableIsNull(fornitore)){
			lottoRegexp = fornitore.barcodeRegexpLotto;
		}
	}
	return lottoRegexp;
}

$.fn.getDataScadenzaRegExp = function(articolo){
	var dataScadenzaRegexp = articolo.barcodeRegexpDataScadenza;
	var fornitore = articolo.fornitore;
	if($.fn.checkVariableIsNull(dataScadenzaRegexp)) {
		if(!$.fn.checkVariableIsNull(fornitore)){
			dataScadenzaRegexp = fornitore.barcodeRegexpDataScadenza;
		}
	}
	return dataScadenzaRegexp;
}

$.fn.groupArticoloRow = function(insertedRow){
	var insertedRowIndex = insertedRow.attr("data-row-index");
	var insertedArticoloId = insertedRow.attr("data-id");
	var	insertedLotto = insertedRow.children().eq(1).children().eq(0).val();
	var	insertedScadenza = insertedRow.children().eq(2).children().eq(0).val();
	var insertedQuantita = insertedRow.children().eq(4).children().eq(0).val();
	var insertedPezzi = insertedRow.children().eq(5).children().eq(0).val();
	var	insertedPrezzo = insertedRow.children().eq(6).children().eq(0).val();
	var	insertedSconto = insertedRow.children().eq(7).children().eq(0).val();

	var found = 0;
	var currentRowIndex = 0;
	var currentIdArticolo;
	var currentLotto;
	var currentScadenza;
	var currentPrezzo;
	var currentSconto;
	var currentPezzi = 0;
	var currentQuantita = 0;

	var ricevutaPrivatoArticoliLength = $('.rowArticolo').length;
	if(ricevutaPrivatoArticoliLength != null && ricevutaPrivatoArticoliLength != undefined && ricevutaPrivatoArticoliLength != 0) {
		$('.rowArticolo').each(function(i, item){

			if(found != 1){
				currentRowIndex = $(this).attr('data-row-index');
				if(currentRowIndex != insertedRowIndex){
					currentIdArticolo = $(this).attr('data-id');
					currentLotto = $(this).children().eq(1).children().eq(0).val();
					currentScadenza = $(this).children().eq(2).children().eq(0).val();
					currentPrezzo = $(this).children().eq(6).children().eq(0).val();
					currentSconto = $(this).children().eq(7).children().eq(0).val();

					if($.fn.normalizeIfEmptyOrNullVariable(currentIdArticolo) == $.fn.normalizeIfEmptyOrNullVariable(insertedArticoloId)
						&& $.fn.normalizeIfEmptyOrNullVariable(currentLotto) == $.fn.normalizeIfEmptyOrNullVariable(insertedLotto)
						&& $.fn.normalizeIfEmptyOrNullVariable(currentPrezzo) == $.fn.normalizeIfEmptyOrNullVariable(insertedPrezzo)
						&& $.fn.normalizeIfEmptyOrNullVariable(currentSconto) == $.fn.normalizeIfEmptyOrNullVariable(insertedSconto)
						&& $.fn.normalizeIfEmptyOrNullVariable(currentScadenza) == $.fn.normalizeIfEmptyOrNullVariable(insertedScadenza)){
						found = 1;
						currentQuantita = $(this).children().eq(4).children().eq(0).val();
						currentPezzi = $(this).children().eq(5).children().eq(0).val();

					}
				}
			}
		});
	}
	var table = $('#ricevutaPrivatoArticoliTable').DataTable();
	if(found >= 1){
		var totale = 0;

		var quantitaPerPrezzo = (($.fn.parseValue(insertedQuantita,'float') + $.fn.parseValue(currentQuantita,'float')) * $.fn.parseValue(insertedPrezzo, 'float'));
		var scontoValue = ($.fn.parseValue(insertedSconto, 'float')/100)*quantitaPerPrezzo;
		totale = Number(Math.round((quantitaPerPrezzo - scontoValue) + 'e2') + 'e-2');

		var newQuantita = ($.fn.parseValue(insertedQuantita,'float') + $.fn.parseValue(currentQuantita,'float'));
		var newPezzi = ($.fn.parseValue(insertedPezzi,'int') + $.fn.parseValue(currentPezzi,'int'));

		var newPezziHtml = '<input type="number" step="1" min="0" class="form-control form-control-sm text-center compute-totale ignore-barcode-scanner pezzi" value="'+newPezzi+'">';
		var newLottoHtml = '<input type="text" class="form-control form-control-sm text-center compute-totale ignore-barcode-scanner lotto group" value="'+insertedLotto+'">';
		var newScadenzaHtml = '<input type="date" class="form-control form-control-sm text-center compute-totale ignore-barcode-scanner scadenza group" value="'+moment(insertedScadenza).format('YYYY-MM-DD')+'">';
		var newQuantitaHtml = '<input type="number" step=".001" min="0" class="form-control form-control-sm text-center compute-totale ignore-barcode-scanner" value="'+ $.fn.fixDecimalPlaces(newQuantita, 3) +'">';
		var newPrezzoHtml = '<input type="number" step=".001" min="0" class="form-control form-control-sm text-center compute-totale ignore-barcode-scanner group" value="'+insertedPrezzo+'">';
		var newScontoHtml = '<input type="number" step=".001" min="0" class="form-control form-control-sm text-center compute-totale ignore-barcode-scanner group" value="'+insertedSconto+'">';

		var rowData = table.row("[data-row-index='"+currentRowIndex+"']").data();
		rowData[1] = newLottoHtml;
		rowData[2] = newScadenzaHtml;
		rowData[4] = newQuantitaHtml;
		rowData[5] = newPezziHtml;
		rowData[6] = newPrezzoHtml;
		rowData[7] = newScontoHtml;
		rowData[8] = totale;

		table.row("[data-row-index='"+currentRowIndex+"']").data(rowData).draw();
		table.row("[data-row-index='"+insertedRowIndex+"']").remove().draw();

	}

	$.fn.computeTotale();

	$.fn.checkPezziOrdinati();
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

$.fn.emptyArticoli = function(){
	$('#ricevutaPrivatoArticoliTable').DataTable().rows()
		.remove()
		.draw();
}

$.fn.getStatoOrdineClienteEvaso = function(){

	var idStatoOrdineEvaso = 2;

	$.ajax({
		url: baseUrl + "stati-ordine/evaso",
		type: 'GET',
		ajax: false,
		dataType: 'json',
		success: function(result) {
			if(result != null && result != undefined && result != ''){
				idStatoOrdineEvaso = result.id;
			}

		},
		error: function(jqXHR, textStatus, errorThrown) {
			console.log('Errore nel recupero dello stato ordine evaso');
		}
	});

	return idStatoOrdineEvaso;
}

$.fn.loadArticoliFromOrdiniClienti = function(){

	var idStatoOrdineEvaso = $.fn.getStatoOrdineClienteEvaso();

	var dataConsegna = $('#dataTrasporto').val();
	var idCliente = $('#cliente option:selected').val();
	var idPuntoConsegna = $('#puntoConsegna option:selected').val();

	if($.fn.normalizeIfEmptyOrNullVariable(idCliente) != ''
		&& $.fn.normalizeIfEmptyOrNullVariable(idPuntoConsegna) != ''
		&& $.fn.normalizeIfEmptyOrNullVariable(dataConsegna) != ''){

		var url = baseUrl + "ordini-clienti/aggregate?idCliente="+idCliente;
		url += "&idPuntoConsegna="+idPuntoConsegna;
		url += "&dataConsegnaLessOrEqual="+moment(dataConsegna).format('YYYY-MM-DD');
		url += "&idStatoNot="+idStatoOrdineEvaso;

		$('#ordiniClientiArticoliTable').DataTable().destroy();

		$('#ordiniClientiArticoliTable').DataTable({
			"ajax": {
				"url": url,
				"type": "GET",
				"content-type": "json",
				"cache": false,
				"dataSrc": "",
				"error": function(jqXHR, textStatus, errorThrown) {
					console.log('Response text: ' + jqXHR.responseText);
					var alertContent = '<div id="alertRicevutaPrivatoContent" class="alert alert-danger alert-dismissible fade show" role="alert">';
					alertContent = alertContent + '<strong>Errore nel recupero degli ordini clienti</strong>\n' +
						'            <button type="button" class="close" data-dismiss="alert" aria-label="Close"><span aria-hidden="true">&times;</span></button></div>';
					$('#alertRicevutaPrivato').empty().append(alertContent);
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
				"emptyTable": "Nessun ordine cliente trovato",
				"zeroRecords": "Nessun ordine cliente trovato"
			},
			//"retrieve": true,
			"searching": false,
			"responsive":true,
			"pageLength": 5,
			"lengthChange": false,
			"info": false,
			"autoWidth": false,
			"order": [
				[1, 'asc']
			],
			"columns": [
				{"name": "codiciOrdiniClienti", "data": "codiciOrdiniClienti", "width":"10%"},
				{"name": "articolo", "data": null, "width":"15%", render: function ( data, type, row ) {
						var articolo = data.articolo;
						var span = '<span class="ordineClienteArticolo "';
						span += 'data-id-articolo="'+data.idArticolo+'" data-ids-ordini="'+data.idsOrdiniClienti+'"';
						span += '>'+articolo+'</span>';
						return span;
					}},
				{"name": "prezzoListinoBase", "data": "prezzoListinoBase", "width":"8%"},
				{"name": "numeroPezziDaEvadere", "data": "numeroPezziOrdinati", "width":"5%"},
				{"name": "numeroPezziEvasi", "data": "numeroPezziEvasi", "width":"5%"}
			],
			"createdRow": function(row, data, dataIndex,cells){
				$(row).css('background-color',rowBackgroundVerde).css('font-size', 'smaller');
				$(row).attr('data-id-articolo', data.idArticolo);
				$(row).attr('data-start-num-pezzi-evasi', data.numeroPezziEvasi);
				$(cells[0]).css('text-align','center');
				$(cells[1]).css('text-align','center');
				$(cells[2]).css('text-align','center');
				$(cells[3]).css('text-align','center');
				$(cells[4]).css('text-align','center');
			}
		});

	}
}

$.fn.checkPezziOrdinati = function(){

	var articoliMap = new Map();
	var articoliArray = [];
	var ordiniClientiArticoliArray = [];

	$('.rowArticolo').each(function(i, item){
		var idArticolo = $(this).attr('data-id');
		var numeroPezzi = $(this).children().eq(5).children().eq(0).val();
		numeroPezzi = $.fn.parseValue(numeroPezzi, 'int');

		var totaliPezzi;
		if(articoliMap.has(idArticolo)){
			totaliPezzi = articoliMap.get(idArticolo);
		} else {
			totaliPezzi = 0;
		}
		totaliPezzi = totaliPezzi + numeroPezzi;
		articoliMap.set(idArticolo, totaliPezzi);

		articoliArray.push(idArticolo);

	});

	$('.ordineClienteArticolo').each(function(i, item){
		var idArticolo = $(this).attr('data-id-articolo');
		ordiniClientiArticoliArray.push(idArticolo);
	});

	articoliMap.forEach( (value, key, map) => {
		var ordiniClientiArticoloLength = $('#ordiniClientiArticoliTable span[data-id-articolo='+key+']').length;

		if(ordiniClientiArticoloLength != 0){
			var numeroPezziOrdinati = $('#ordiniClientiArticoliTable span[data-id-articolo='+key+']').parent().parent().children().eq(3).text();
			var numeroPezziEvasi = $('#ordiniClientiArticoliTable span[data-id-articolo='+key+']').parent().parent().attr('data-start-num-pezzi-evasi');
			numeroPezziOrdinati = $.fn.parseValue(numeroPezziOrdinati, 'int');
			numeroPezziEvasi = $.fn.parseValue(numeroPezziEvasi, 'int');
			value = $.fn.parseValue(value, 'int');

			var newNumeroPezziEvasi = numeroPezziEvasi + value;

			var backgroundColor;
			if(newNumeroPezziEvasi == numeroPezziOrdinati){
				backgroundColor = 'transparent';
			} else if(newNumeroPezziEvasi < numeroPezziOrdinati){
				backgroundColor = rowBackgroundRosa;
			} else {
				backgroundColor = rowBackgroundGiallo;
			}
			$('#ordiniClientiArticoliTable span[data-id-articolo='+key+']').parent().parent().css('background-color', backgroundColor).attr('data-num-pezzi-evasi', newNumeroPezziEvasi);

			var table = $('#ordiniClientiArticoliTable').DataTable();
			var rowData = table.row("[data-id-articolo='"+key+"']").data();
			rowData["numeroPezziEvasi"] = newNumeroPezziEvasi;
			table.row("[data-id-articolo='"+key+"']").data(rowData).draw();
		}

	});

	$(ordiniClientiArticoliArray).not(articoliArray).each(function(i, item){
		$('#ordiniClientiArticoliTable span[data-id-articolo='+item+']').parent().parent().css('background-color', rowBackgroundVerde);
	})

}

// #####################################################################################################################
// BARCODE SCANNER FUNCTIONS

$.fn.getScontoArticolo = function(idArticolo, data, cliente){
	var sconto = null;
	$.ajax({
		url: baseUrl + "sconti?idCliente="+cliente+"&data="+moment(data.data).format('YYYY-MM-DD'),
		type: 'GET',
		dataType: 'json',
		async: false,
		success: function(result) {
			$.each(result, function(i, item){
				var articoloId = item.articolo.id;
				if(articoloId == idArticolo){
					sconto = item.valore;
				}
			});
		},
		error: function(jqXHR, textStatus, errorThrown) {
			console.log('Errore nel recupero dello sconto articolo');
		}
	});
	return sconto;
}

$.fn.getPrezzoListinoClienteArticolo = function(idArticolo, idListino){
	var prezzoListino = null;
	if(idListino != null && idListino != undefined && idListino != '-1'){
		$.ajax({
			url: baseUrl + "listini/"+idListino+"/listini-prezzi",
			type: 'GET',
			dataType: 'json',
			async: false,
			success: function(result) {
				$.each(result, function(i, item){
					var articoloId = item.articolo.id;
					if(articoloId == idArticolo){
						prezzoListino = item.prezzo;
						return false;
					}
				});
			},
			error: function(jqXHR, textStatus, errorThrown) {
				console.log('Errore nel recupero dei prezzi del listino cliente');
			}
		});
	}
	return prezzoListino;
}

$.fn.addArticoloFromScanner = function(articolo, numeroPezzi, quantita, lotto, scadenza, prezzoListino, sconto){
	var articoloId = articolo.id;

	var articoloLabel = articolo.codice + ' - ' + articolo.descrizione;
	var udm;
	if(!$.fn.checkVariableIsNull(articolo.unitaMisura)){
		udm = articolo.unitaMisura.etichetta;
	}
	var lotto = lotto;
	var scadenza = scadenza;
	if(!$.fn.checkVariableIsNull(scadenza)){
		scadenza = moment(scadenza).format('YYYY-MM-DD');
	}
	var quantita = quantita;
	var pezzi = numeroPezzi;
	var prezzo;
	if(!$.fn.checkVariableIsNull(prezzoListino)){
		prezzo = prezzoListino;
	} else {
		prezzo = articolo.prezzoListinoBase;
	}
	var sconto = sconto;
	var iva;
	if(!$.fn.checkVariableIsNull(articolo.aliquotaIva)){
		iva = articolo.aliquotaIva.valore;
	}
	var codiceFornitore = articolo.fornitore.codice;
	var lottoRegexp = $.fn.getLottoRegExp(articolo);
	var dataScadenzaRegexp = $.fn.getDataScadenzaRegExp(articolo);

	if(lotto != null && lotto != undefined && lotto != ''){
		var lottoHtml = '<input type="text" class="form-control form-control-sm text-center compute-totale lotto group" value="'+lotto+'" data-codice-fornitore="'+codiceFornitore+'" data-lotto-regexp="'+lottoRegexp+'" data-scadenza-regexp="'+dataScadenzaRegexp+'">';
	} else {
		var lottoHtml = '<input type="text" class="form-control form-control-sm text-center compute-totale lotto group" value="" data-codice-fornitore="'+codiceFornitore+'" data-lotto-regexp="'+lottoRegexp+'" data-scadenza-regexp="'+dataScadenzaRegexp+'">';
	}
	var scadenzaHtml = '<input type="date" class="form-control form-control-sm text-center compute-totale ignore-barcode-scanner scadenza group" value="'+scadenza+'">';
	var quantitaHtml = '<input type="number" step=".001" min="0" class="form-control form-control-sm text-center compute-totale ignore-barcode-scanner" value="'+quantita+'">';
	var pezziHtml = '<input type="number" step="1" min="0" class="form-control form-control-sm text-center compute-totale ignore-barcode-scanner pezzi" value="'+pezzi+'">';
	var prezzoHtml = '<input type="number" step=".001" min="0" class="form-control form-control-sm text-center compute-totale ignore-barcode-scanner group" value="'+prezzo+'">';
	var scontoHtml = '<input type="number" step=".001" min="0" class="form-control form-control-sm text-center compute-totale ignore-barcode-scanner group" value="'+sconto+'">';

	// check if a same articolo was already added
	var found = 0;
	var currentRowIndex;
	var currentIdArticolo;
	var currentLotto;
	var currentPrezzo;
	var currentSconto;
	var currentScadenza;
	var currentPezzi = 0;
	var currentQuantita= 0;

	var ricevutaPrivatoArticoliLength = $('.rowArticolo').length;
	if(ricevutaPrivatoArticoliLength != null && ricevutaPrivatoArticoliLength != undefined && ricevutaPrivatoArticoliLength != 0) {
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

	var table = $('#ricevutaPrivatoArticoliTable').DataTable();
	var rowIndex;
	if(found >= 1){
		var newQuantita = (quantita + $.fn.parseValue(currentQuantita,'float'));
		var newPezzi = (pezzi + $.fn.parseValue(currentPezzi,'int'));

		var newQuantitaHtml = '<input type="number" step=".001" min="0" class="form-control form-control-sm text-center compute-totale ignore-barcode-scanner" value="'+ $.fn.fixDecimalPlaces(newQuantita, 3) +'">';
		var newPezziHtml = '<input type="number" step="1" min="0" class="form-control form-control-sm text-center compute-totale ignore-barcode-scanner pezzi" value="'+newPezzi+'">';

		var lottoHtml = '<input type="text" class="form-control form-control-sm text-center compute-totale lotto group" value="'+currentLotto+'" data-codice-fornitore="'+codiceFornitore+'">';
		var scadenzaHtml = '<input type="date" class="form-control form-control-sm text-center compute-totale ignore-barcode-scanner scadenza group" value="'+moment(currentScadenza).format('YYYY-MM-DD')+'">';

		var prezzoHtml = '<input type="number" step=".001" min="0" class="form-control form-control-sm text-center compute-totale ignore-barcode-scanner group" value="'+currentPrezzo+'">';
		var scontoHtml = '<input type="number" step=".001" min="0" class="form-control form-control-sm text-center compute-totale ignore-barcode-scanner group" value="'+currentSconto+'">';

		var rowData = table.row("[data-row-index='"+currentRowIndex+"']").data();
		rowData[1] = lottoHtml;
		rowData[2] = scadenzaHtml;
		rowData[4] = newQuantitaHtml;
		rowData[5] = newPezziHtml;
		rowData[6] = prezzoHtml;
		rowData[7] = scontoHtml;
		rowData[8] = totale;
		table.row("[data-row-index='"+currentRowIndex+"']").data(rowData).draw();

	} else {
		var deleteLink = '<a class="deleteRicevutaPrivatoArticolo" data-id="'+articoloId+'" href="#"><i class="far fa-trash-alt" title="Rimuovi"></i></a>';

		var rowsCount = table.rows().count();
		var newRowindex = parseInt(rowsCount) + 1;

		var rowNode = table.row.add( [
			articoloLabel,
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
		$(rowNode).css('text-align', 'center').css('color','#080707');
		$(rowNode).addClass('rowArticolo');
		$(rowNode).attr('data-id', articoloId);
		$(rowNode).attr('data-row-index', newRowindex);

	}
	$.fn.computeTotale();

	$.fn.checkPezziOrdinati();

	$('tr[data-row-index='+rowIndex+']').children().eq(1).children().eq(0).focus();
}

$(document).ready(function() {
	// https://github.com/axenox/onscan.js

	$(document).on('click','.closeOverlay', function(){
		$('#alertOverlay').empty().hide();
	});

	onScan.attachTo(document, {
		suffixKeyCodes: [13], // enter-key expected at the end of a scan
		reactToPaste: false, // Compatibility to built-in scanners in paste-mode (as opposed to keyboard-mode)
		ignoreIfFocusOn: '.ignore-barcode-scanner',
		onScan: function(barcode, numeroPezzi) { // Alternative to document.addEventListener('scan')
			console.log('Scanned: ' + numeroPezzi + ' - ' + barcode);
			//var $focused = $(':focus');

			var scannerLog = '--------------------------------------------------\n';
			scannerLog += 'Barcode: '+barcode+', numero pezzi: '+numeroPezzi+'\n';

			var alertOverlayContent = '<div id="alertOverlayContent" class="alert alert-@@alertResult@@ alert-dismissible fade show" role="alert">';
			alertOverlayContent = alertOverlayContent + '<strong>@@alertText@@</strong>\n' +
				'<button type="button" class="close closeOverlay"><span aria-hidden="true">&times;</span></button></div>';

			var cliente = $('#cliente option:selected').val();
			if($.fn.checkVariableIsNull(cliente)){
				var alertText = "Selezionare un cliente prima di effettuare la lettura del barcode";
				$('#alertOverlay').empty().append(alertOverlayContent.replace('@@alertText@@', alertText).replace('@@alertResult@@', 'danger')).show();
				return;
			}

			/*
				Check length of barcode
			   	if length > 13 -> ean 128
			   	else -> ean 13

			*/

			var barcodeType = 'ean13';
			var barcodeToSearch = barcode;
			if(!$.fn.checkVariableIsNull(barcode) && barcode.length > 13){
				barcodeType = 'ean128';
				barcodeToSearch = barcode.substring(2, 16).trim();
			}

			scannerLog += 'Barcode type: '+barcodeType+'\n';
			scannerLog += 'Codice articolo: '+barcodeToSearch+'\n';

			// check if the scan is on a Lotto field or is for adding Articolo
			var isLottoFocused = $('.lotto').is(":focus");

			scannerLog += 'Focus lotto? '+isLottoFocused+'\n';

			if(isLottoFocused){
				var lottoFocused = $(':focus');
				//var codiceFornitore = lottoFocused.attr("data-codice-fornitore");
				var lottoRegexp = lottoFocused.attr("data-lotto-regexp");
				var dataScadenzaRegexp = lottoFocused.attr("data-scadenza-regexp");

				if(barcodeType == 'ean13') {

					scannerLog += 'Lotto: '+barcodeToSearch+'\n';

					lottoFocused.val(barcodeToSearch);
				} else {
					var lotto = lottoRegexp.exec(barcode)[1];
					var dataScadenza = dataScadenzaRegexp.exec(barcode)[1];
					dataScadenza = moment(dataScadenza, 'YYMMDD').format('YYYY-MM-DD');

					scannerLog += 'Lotto: '+lotto+'\n';
					scannerLog += 'Data scadenza: '+dataScadenza+'\n';

					/*
					var lotto;
					if(codiceFornitore == '29') {
						// fornitore 'La Gastronomica'
						lotto = barcode.substring(28, 34).trim();
						lotto = lotto.substring(0,6);
						lotto = lotto.slice(3,6) + lotto.slice(0,3);

						scannerLog += 'Lotto: '+lotto+' (fornitore "La Gastronomica")\n';

					} else if(codiceFornitore == '30'){
						// fornitore 'EuroChef'
						lotto = barcode.substring(26, 31).trim();

						scannerLog += 'Lotto: '+lotto+' (fornitore "EuroChef")\n';
					}
					*/
					lottoFocused.parent().next().find("input").val(dataScadenza);
					lottoFocused.val(lotto);
				}
				lottoFocused.blur();

				$.fn.groupArticoloRow(lottoFocused.parent().parent());

				scannerLog += '--------------------------------------------------\n';
				$('#scannerLog').append(scannerLog);

			} else {
				$.ajax({
					url: baseUrl + "articoli?attivo=true&barcode="+barcodeToSearch,
					type: 'GET',
					dataType: 'json',
					success: function(result) {
						if(result != null && result != undefined && result.length!=0){
							$.each(result, function(i, item){
								var idArticolo = item.id;

								$('.bs-searchbox > input').val(null);
								$('#articolo').selectpicker('refresh');
								var mainArticoloDiv = $('#articolo').parent();
								mainArticoloDiv.find('.dropdown-item > span:empty').parent().click();

								// get sconto articolo
								var sconto;
								var data = $('#data').val();
								var cliente = $('#cliente option:selected').val();
								if(!$.fn.checkVariableIsNull(data) && !$.fn.checkVariableIsNull(cliente)){
									sconto = $.fn.getScontoArticolo(idArticolo, data, cliente);
									console.log('SCONTO: '+sconto);
								}

								// get articolo prezzo listino cliente
								var prezzoListino;
								var idListino = $('#cliente option:selected').attr('data-id-listino');
								if(!$.fn.checkVariableIsNull(idListino)){
									prezzoListino = $.fn.getPrezzoListinoClienteArticolo(idArticolo, idListino);
									console.log('PREZZO LISTINO: '+prezzoListino);
								}

								scannerLog += 'Articolo id: '+idArticolo+', sconto: '+sconto+', prezzo listino: '+prezzoListino+'\n';

								var quantita;
								var numPezzi = numeroPezzi;
								var lotto = item.lotto;
								var scadenza;

								if(barcodeType == 'ean13'){
									// check if articolo has barcode complete or not
									var barcodeComplete = item.completeBarcode;
									if(barcodeComplete){
										quantita = item.quantitaPredefinita;

										scannerLog += 'Barcode complete. Quantita: '+quantita+'\n';

									} else {
										var subBarcode = barcode.substring(7, barcode.length);
										console.log(subBarcode);
										quantita = parseFloat(subBarcode)/10000;

										scannerLog += 'Barcode non complete. (SubBarcode: '+subBarcode+'). Quantita: '+quantita+'\n';
									}

								} else {
									quantita = item.quantitaPredefinita;

									// get fornitore
									var fornitore = item.fornitore;
									if($.fn.checkVariableIsNull(fornitore)){
										var alertText = "Errore nel recupero del fornitore.";
										$('#alertOverlay').empty().append(alertOverlayContent.replace('@@alertText@@', alertText).replace('@@alertResult@@', 'warning')).show();
										return;
									}
									var codiceFornitore = fornitore.codice;
									if($.fn.checkVariableIsNull(codiceFornitore)){
										var alertText = "Codice fornitore non presente. Impossibile gestire il barcode ean128.";
										$('#alertOverlay').empty().append(alertOverlayContent.replace('@@alertText@@', alertText).replace('@@alertResult@@', 'warning')).show();
										return;
									}

									scannerLog += 'Codice fornitore: '+codiceFornitore+'\n';

									var startIndex = 0;
									var endIndex = 0;

									// check codice fornitore
									if(codiceFornitore == '29'){
										// fornitore 'La Gastronomica'

										// example: "01980259970213213193000278100980940015200427"
										/*
                                            Numero pezzi = 01
                                            Codice articolo = 98025997021321
                                            Peso = 000278 -> 0.278 kg
                                            Lotto = 098094 -> 094098
                                            Scadenza = 200427 -> 27/04/20
                                        */

										//numPezzi = barcode.substring(1, barcode.indexOf(")")).trim();
										numPezzi = barcode.substring(0, 2);
										if(numPezzi.indexOf('0') == 0){
											numPezzi = numPezzi.substring(1, numPezzi.length);
										}

										//startIndex = barcode.split(")", 2).join(")").length + 1;
										//endIndex = barcode.split("(", 3).join("(").length;
										startIndex = 20;
										endIndex = 26;

										quantita = parseInt(barcode.substring(startIndex, endIndex).trim()) / 1000;

										//startIndex = barcode.split(")", 3).join(")").length + 1;
										//endIndex = barcode.split("(", 4).join("(").length;
										startIndex = 28;
										endIndex = 34;

										lotto = barcode.substring(startIndex, endIndex).trim();
										lotto = lotto.substring(0,6);
										lotto = lotto.slice(3,6) + lotto.slice(0,3);

										//startIndex = barcode.split(")", 4).join(")").length + 1;
										scadenza = barcode.substring(barcode.length-6).trim();
										scadenza = moment(scadenza, 'YYMMDD');

										scannerLog += 'Fornitore "La Gastronomica". Numero pezzi: '+numPezzi+', quantita: '+quantita+', lotto: '+lotto+', scadenza: '+scadenza+'\n';

									} else if(codiceFornitore == '30'){
										// fornitore 'EuroChef'

										// example "0218013554100422152005251020700370002"
										/*
                                            Numero pezzi = 02 -> vengono ignorati
                                            Codice articolo = 18013554100422
                                            Scadenza = 200525 -> 25/05/20
                                            Lotto = 20700
                                        */
										//startIndex = barcode.split(")", 2).join(")").length + 1;
										//endIndex = barcode.split("(", 3).join("(").length;
										startIndex = 18;
										endIndex = 24;

										scadenza = barcode.substring(startIndex, endIndex).trim();
										scadenza = moment(scadenza, 'YYMMDD');

										//startIndex = barcode.split(")", 3).join(")").length + 1;
										//endIndex = barcode.split("(", 4).join("(").length;

										startIndex = 26;
										endIndex = 31;

										lotto = barcode.substring(startIndex, endIndex).trim();

										scannerLog += 'Fornitore "EuroChef". Lotto: '+lotto+', scadenza: '+scadenza+'\n';

									} else {
										var alertText = "Codice fornitore '"+codiceFornitore+"' non gestito.";
										$('#alertOverlay').empty().append(alertOverlayContent.replace('@@alertText@@', alertText).replace('@@alertResult@@', 'warning')).show();
										return;
									}
								}

								quantita = $.fn.fixDecimalPlaces(quantita, 3);

								// add articolo to table
								$.fn.addArticoloFromScanner(item, numPezzi, quantita, lotto, scadenza, prezzoListino, sconto);

								scannerLog += '--------------------------------------------------\n';
								$('#scannerLog').append(scannerLog);

							});
						} else {
							var barcodeTruncate = barcode.substring(0, 6);
							var alertText = "Nessun articolo trovato con barcode completo '"+barcode+"' o barcode '"+barcodeTruncate+"'";
							$('#alertOverlay').empty().append(alertOverlayContent.replace('@@alertText@@', alertText).replace('@@alertResult@@', 'warning')).show();

							scannerLog += '--------------------------------------------------\n';
							$('#scannerLog').append(scannerLog);
						}

					},
					error: function(jqXHR, textStatus, errorThrown) {
						var barcodeTruncate = barcode.substring(0, 6);
						var alertText = "Nessun articolo trovato con barcode completo '"+barcode+"' o barcode '"+barcodeTruncate+"'";
						$('#alertOverlay').empty().append(alertOverlayContent.replace('@@alertText@@', alertText).replace('@@alertResult@@', 'warning')).show();

						scannerLog += '--------------------------------------------------\n';
						$('#scannerLog').append(scannerLog);
					}
				});

			}

		},
		onKeyDetect: function(iKeyCode){ // output all potentially relevant key events - great for debugging!
			//console.log('Pressed: ' + iKeyCode);
		}
	});

	$(document).on('keypress', function(event){
		if (event.keyCode === 13) {
			//console.log(event);

			if(event.target.nodeName == 'INPUT'){
				event.preventDefault();
				$(event.target).blur();

				if(event.target.classList.contains("lotto") || event.target.classList.contains("group")){
					// check if some rows could be grouped together
					var insertedRow = $(event.target).parent().parent();

					$.fn.groupArticoloRow(insertedRow);

				}
			}
		}
	});

});