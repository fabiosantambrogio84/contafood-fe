var baseUrl = "/contafood-be/";

$.fn.loadFattureTable = function(url) {
	$('#fattureTable').DataTable({
		"ajax": {
			"url": url,
			"type": "GET",
			"content-type": "json",
			"cache": false,
			"dataSrc": "",
			"error": function(jqXHR, textStatus, errorThrown) {
				console.log('Response text: ' + jqXHR.responseText);
				var alertContent = '<div id="alertFattureContent" class="alert alert-danger alert-dismissible fade show" role="alert">';
				alertContent = alertContent + '<strong>Errore nel recupero delle fatture</strong>\n' +
					'            <button type="button" class="close" data-dismiss="alert" aria-label="Close"><span aria-hidden="true">&times;</span></button></div>';
				$('#alertFatture').empty().append(alertContent);
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
			"emptyTable": "Nessuna fattura disponibile",
			"zeroRecords": "Nessuna fattura disponibile"
		},
		"searching": false,
		"responsive":true,
		"pageLength": 20,
		"lengthChange": false,
		"info": false,
		"autoWidth": false,
		"order": [
			[2, 'desc']
		],
		"columns": [
			{"name":"speditoAde", "data": null, "width":"8%", render: function ( data, type, row ) {
				var speditoAde = data.speditoAde;
				var fatturaId = data.id;
				var selectId = "speditoAde_" + fatturaId;

				var speditoAdeSelect = '<select id="'+selectId+'" class="form-control form-control-sm speditoAdeFattura" data-id="'+fatturaId+'" data-value="'+speditoAde+'" data-tipo="'+data.tipoFattura.codice+'">';
				var optionHtml = '<option value="si"';
				if(speditoAde){
					optionHtml += ' selected'
				}
				optionHtml += '>Si</option>';
				speditoAdeSelect += optionHtml;
				optionHtml = '<option value="no"';
				if(!speditoAde){
					optionHtml += ' selected'
				}
				optionHtml += '>No</option>';
				speditoAdeSelect += optionHtml;

				speditoAdeSelect += '</select';
				return speditoAdeSelect;
			}},

			{"name": "tipo", "data": null, "width":"8%", render: function ( data, type, row ) {
				var tipo = data.tipoFattura;
				if(tipo != null){
					if(tipo.id != null && tipo.id != undefined && tipo.id == 1){
						return "Si";
					}
				}
				return "No";
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
				var acconto = data.totaleAcconto;
				if(acconto == null || acconto == undefined || acconto == ''){
					acconto = 0;
				}
				var totale = data.totale;
				if(totale == null || totale == undefined || totale == ''){
					totale = 0;
				}
				var tipo = data.tipoFattura;
				var pagamentoUrl = "pagamenti-new.html?";
				if(tipo != null){
					if(tipo.id != null && tipo.id != undefined && tipo.id == 1){
						pagamentoUrl += "idFatturaAccompagnatoria="+data.id;
					} else {
						pagamentoUrl += "idFattura="+data.id;
					}
				}

				var stato = data.statoFattura;

				var links = '<a class="detailsFatture pr-1" data-id="'+data.id+'" data-tipo="'+data.tipoFattura.codice+'" href="#" title="Dettagli"><i class="fas fa-info-circle"></i></a>';
				if((totale - acconto) != 0){
					links += '<a class="payFattura pr-1" data-id="'+data.id+'" href="' + pagamentoUrl + '" title="Pagamento"><i class="fa fa-shopping-cart"></i></a>';
				}
				links += '<a class="printFattura pr-1" data-id="'+data.id+'" data-tipo="'+data.tipoFattura.codice+'" href="#" title="Stampa"><i class="fa fa-print"></i></a>';
				links += '<a class="downloadAdeXml pr-1" data-id="'+data.id+'" data-tipo="'+data.tipoFattura.codice+'" href="#" title="Download XML AdE"><i class="fa fa-download"></i></a>';

				var tipo = data.tipoFattura;
                if(tipo != null){
                    if(tipo.id != null && tipo.id != undefined && tipo.id == 0){
                        var cliente = data.cliente;
                        if(cliente != null){
                            var email = cliente.email;
                            if(email != null && email != undefined && email != ""){
                                links += '<a class="emailFattura pr-1" data-id="'+data.id+'" data-email-to="'+email+'" href="#" title="Invio email"><i class="fa fa-envelope"></i></a>';
                            }
                        }
                    }
                }

				if(stato != null && stato != undefined && stato != '' && stato.codice == 'DA_PAGARE') {
					links += '<a class="deleteFatture" data-id="' + data.id + '" data-tipo="'+data.tipoFattura.codice+'" href="#" title="Elimina"><i class="far fa-trash-alt"></i></a>';
				}
				return links;
			}}
		],
		"createdRow": function(row, data, dataIndex,cells){
			$(row).css('font-size', '12px').addClass('rowFattura');
			$(row).attr('data-id-fattura', data.id);
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

$.fn.loadEmptyFatturaDdtTable = function() {
	$('#fatturaDdtTable').DataTable({
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

	$.fn.loadFattureTable(baseUrl + "fatture");

	$.fn.loadEmptyFatturaDdtTable();

	var pageTitle = $("title").text();
	if(pageTitle != null && pageTitle != "" && pageTitle == "ContaFood - Fatture"){
		$('#searchTipoPagamento').selectpicker();
	}

	$(document).on('change','.speditoAdeFattura', function(){
		var originalValue = $(this).attr("data-value");
		if(originalValue == "true"){
			originalValue = "si";
		} else {
			originalValue = "no";
		}
		var fatturaId = $(this).attr("data-id");
		var tipoFattura = $(this).attr("data-tipo");

		confirmResult = confirm("Sei sicuro di voler aggiornare il flag 'Spedito A.d.E.'?");

		if(confirmResult){
			var speditoAde = $(this).val();
			if(speditoAde == "si"){
				speditoAde = true;
			} else {
				speditoAde = false;
			}

			var fatturaPatched = new Object();
			fatturaPatched.id = parseInt(fatturaId);
			fatturaPatched.speditoAde = speditoAde;

			var fatturaPatchedJson = JSON.stringify(fatturaPatched);

			var alertContent = '<div id="alertFatturaContent" class="alert alert-@@alertResult@@ alert-dismissible fade show" role="alert">';
			alertContent = alertContent + '<strong>@@alertText@@</strong>\n' +
				'<button type="button" class="close" data-dismiss="alert" aria-label="Close"><span aria-hidden="true">&times;</span></button></div>';

			url = baseUrl + "fatture/" + fatturaId;
			if(tipoFattura == "ACCOMPAGNATORIA"){
				url = baseUrl + "fatture-accompagnatorie/" + fatturaId;
			}

			$.ajax({
				url: url,
				type: 'PATCH',
				contentType: "application/json",
				dataType: 'json',
				data: fatturaPatchedJson,
				success: function(result) {
					$('#alertFatture').empty().append(alertContent.replace('@@alertText@@',"Flag 'Spedito A.d.E.' modificato con successo").replace('@@alertResult@@', 'success'));
					$('#fattureTable').DataTable().ajax.reload();
				},
				error: function(jqXHR, textStatus, errorThrown) {
					$('#alertFatture').empty().append(alertContent.replace('@@alertText@@',"Errore nella modifica del flag 'Spedito A.d.E.'").replace('@@alertResult@@', 'danger'));
					$('#fattureTable').DataTable().ajax.reload();
				}
			});

		} else {
			$("#speditoAde_" + fatturaId).val(originalValue).prop('selected', true);
		}
	});

	$(document).on('click','#resetSearchFattureButton', function(){
		$('#searchFattureForm :input').val(null);
		$('#searchFattureForm select option[value=""]').attr('selected', true);

		$('#searchTipoPagamento').selectpicker('refresh');

		$('#fattureTable').DataTable().destroy();
		$.fn.loadFattureTable(baseUrl + "fatture");
	});

	$(document).on('click','.detailsFatture', function(){
		var idFattura = $(this).attr('data-id');
		var tipoFattura = $(this).attr('data-tipo');

		var alertContent = '<div id="alertFatturaContent" class="alert alert-danger alert-dismissible fade show" role="alert">';

		if(tipoFattura == 'VENDITA'){
			alertContent = alertContent + '<strong>Errore nel recupero della fattura.</strong></div>';

			$.ajax({
				url: baseUrl + "fatture/" + idFattura,
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
						var tipo = result.tipoFattura;
						if(tipo != null && tipo != undefined && tipo != ''){
							$('#tipo').text(tipo.descrizione);
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
						var causale = result.causale;
						if(causale != null && causale != undefined && causale != ''){
							$('#causale').text(causale.descrizione);
						}
						$('#totaleAcconto').text(result.totaleAcconto);
						$('#totale').text(result.totale);
						$('#note').text(result.note);


						if(result.fatturaDdts != null && result.fatturaDdts != undefined){
							$('#detailsFattureDdtModalTable').DataTable({
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
											return $.fn.formatNumber(result);
										}},
									{"name": "importo", "data": null, render: function (data, type, row) {
											var result = '';
											if (data.ddt != null) {
												result = data.ddt.totale;
											}
											return $.fn.formatNumber(result);
										}},
									{"name": "imponibile", "data": null, render: function (data, type, row) {
											var result = '';
											if (data.ddt != null) {
												result = data.ddt.totaleImponibile;
											}
											return $.fn.formatNumber(result);
										}},
									{"name": "costo", "data": null, render: function (data, type, row) {
											var result = '';
											if (data.ddt != null) {
												result = data.ddt.totaleCosto;
											}
											return $.fn.formatNumber(result);
										}},
									{"name": "guadagno", "data": null, render: function (data, type, row) {
											var result = '';
											if (data.ddt != null) {
												result = data.ddt.totaleImponibile - data.ddt.totaleCosto;
											}
											return $.fn.formatNumber(result);
										}}
								]
							});
						}

					} else{
						$('#detailsFattureMainDiv').empty().append(alertContent);
					}
				},
				error: function(jqXHR, textStatus, errorThrown) {
					$('#detailsFattureMainDiv').empty().append(alertContent);
					console.log('Response text: ' + jqXHR.responseText);
				}
			})

			$('#detailsFattureModal').modal('show');

		} else {
			alertContent = alertContent + '<strong>Errore nel recupero della fattura accompagnatoria.</strong></div>';

			$.ajax({
				url: baseUrl + "fatture-accompagnatorie/" + idFattura,
				type: 'GET',
				dataType: 'json',
				success: function(result) {
					if(result != null && result != undefined && result != '') {
						$('#fatturaAccompagnatoriaNumero').text(result.progressivo);
						$('#fatturaAccompagnatoriaData').text(moment(result.data).format('DD/MM/YYYY'));
						$('#fatturaAccompagnatoriaDataInserimento').text(moment(result.dataInserimento).format('DD/MM/YYYY HH:mm:ss'));
						var dataAggiornamento = result.dataAggiornamento;
						if(dataAggiornamento != null && dataAggiornamento != undefined && dataAggiornamento != ''){
							$('#fatturaAccompagnatoriaDataAggiornamento').text(moment(dataAggiornamento).format('DD/MM/YYYY HH:mm:ss'));
						}
						var speditoAde = result.speditoAde;
						if(speditoAde){
							$('#fatturaAccompagnatoriaSpeditoAde').text("Si");
						} else {
							$('#fatturaAccompagnatoriaSpeditoAde').text("No");
						}
						var stato = result.statoFattura;
						if(stato != null && stato != undefined && stato != ''){
							$('#fatturaAccompagnatoriaStato').text(stato.descrizione);
						}
						var tipo = result.tipoFattura;
						if(tipo != null && tipo != undefined && tipo != ''){
							$('#fatturaAccompagnatoriaTipo').text(tipo.descrizione);
						}
						var cliente = result.cliente;
						if(cliente != null && cliente != undefined && cliente != ''){
							if(cliente.dittaIndividuale){
								$('#fatturaAccompagnatoriaCliente').text(cliente.nome + ' ' + cliente.cognome);
							} else {
								$('#fatturaAccompagnatoriaCliente').text(cliente.ragioneSociale);
							}
						}
						var puntoConsegna = result.puntoConsegna;
						if(puntoConsegna != null && puntoConsegna != undefined && puntoConsegna != ''){
							$('#fatturaAccompagnatoriaPuntoConsegna').text(puntoConsegna.nome);
						}
						var causale = result.causale;
						if(causale != null && causale != undefined && causale != ''){
							$('#fatturaAccompagnatoriaCausale').text(causale.descrizione);
						}
						$('#fatturaAccompagnatoriaTotaleAcconto').text(result.totaleAcconto);
						$('#fatturaAccompagnatoriaTotale').text(result.totale);
						$('#fatturaAccompagnatoriaNote').text(result.note);

						if(result.fatturaAccompagnatoriaArticoli != null && result.fatturaAccompagnatoriaArticoli != undefined){
							$('#detailsFattureAccompagnatorieArticoliModalTable').DataTable({
								"data": result.fatturaAccompagnatoriaArticoli,
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

						if(result.fatturaAccompagnatoriaTotali != null && result.fatturaAccompagnatoriaTotali != undefined){
							$('#detailsFattureAccompagnatorieTotaliModalTable').DataTable({
								"data": result.fatturaAccompagnatoriaTotali,
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

					} else{
						$('#detailsFattureMainDiv').empty().append(alertContent);
					}
				},
				error: function(jqXHR, textStatus, errorThrown) {
					$('#detailsFattureMainDiv').empty().append(alertContent);
					console.log('Response text: ' + jqXHR.responseText);
				}
			})

			$('#detailsFattureAccompagnatorieModal').modal('show');
		}

	});

	$(document).on('click','.closeFatture', function(){
		$('#detailsFattureDdtModalTable').DataTable().destroy();
		$('#detailsFattureModal').modal('hide');
	});

	$(document).on('click','.closeFattureAccompagnatorie', function(){
		$('#detailsFattureAccompagnatorieArticoliModalTable').DataTable().destroy();
		$('#detailsFattureAccompagnatorieTotaliModalTable').DataTable().destroy();
		$('#detailsFattureAccompagnatorieModal').modal('hide');
	});

	$(document).on('click','.deleteFatture', function(){
		var idFattura = $(this).attr('data-id');
		var tipoFattura = $(this).attr('data-tipo');
		$('#confirmDeleteFatture').attr('data-id', idFattura);
		$('#confirmDeleteFatture').attr('data-tipo', tipoFattura);
		$('#deleteFattureModal').modal('show');
	});

	$(document).on('click','#confirmDeleteFatture', function(){
		$('#deleteFattureModal').modal('hide');
		var idFattura = $(this).attr('data-id');
		var tipoFattura = $(this).attr('data-tipo');

		var url;
		var successText;
		var errorText;

		if(tipoFattura == 'VENDITA'){
			url = baseUrl + "fatture/" + idFattura;
			successText = '<strong>Fattura </strong> cancellata con successo.\n';
			errorText = '<strong>Errore nella cancellazione della fattura.</strong>\n';
		} else {
			// Fattura accompagnatoria
			url = baseUrl + "fatture-accompagnatorie/" + idFattura;
			successText = '<strong>Fattura accompagnatoria </strong> cancellata con successo.\n';
			errorText = '<strong>Errore nella cancellazione della fattura accompagnatoria.</strong>\n';
		}

		$.ajax({
			url: url,
			type: 'DELETE',
			success: function() {
				var alertContent = '<div id="alertFattureContent" class="alert alert-success alert-dismissible fade show" role="alert">';
				alertContent = alertContent + successText +
					'            <button type="button" class="close" data-dismiss="alert" aria-label="Close"><span aria-hidden="true">&times;</span></button></div>';
				$('#alertFatture').empty().append(alertContent);

				$('#fattureTable').DataTable().ajax.reload();
			},
			error: function(jqXHR, textStatus, errorThrown) {
				console.log('Response text: ' + jqXHR.responseText);
				var alertContent = '<div id="alertFattureContent" class="alert alert-danger alert-dismissible fade show" role="alert">';
				alertContent = alertContent + errorText +
					'            <button type="button" class="close" data-dismiss="alert" aria-label="Close"><span aria-hidden="true">&times;</span></button></div>';
				$('#alertFatture').empty().append(alertContent);
			}
		});

	});

	$(document).on('click','.printFattura', function(){
		var idFattura = $(this).attr('data-id');
		var tipoFattura = $(this).attr('data-tipo');

		if(tipoFattura == 'VENDITA'){
			window.open(baseUrl + "stampe/fatture/"+idFattura, '_blank');
		} else {
			// fattura accompagnatoria
			window.open(baseUrl + "stampe/fatture-accompagnatorie/"+idFattura, '_blank');
		}
	});

	$(document).on('click','#printFatture', function(event){
		event.preventDefault();

		var ids = "";

		$(".rowFattura").each(function(i, item){
			var id = $(this).attr('data-id-fattura');
			ids += id+",";
		});

		window.open(baseUrl + "stampe/fatture?ids="+ids, '_blank');

	});

	$(document).on('click','.downloadAdeXml', function(){
		var idFattura = $(this).attr('data-id');
		var tipoFattura = $(this).attr('data-tipo');

		if(tipoFattura == 'VENDITA'){
			window.open(baseUrl + "export-ade/fatture/"+idFattura);
		} else {
			// fattura accompagnatoria
			window.open(baseUrl + "export-ade/fatture-accompagnatorie/"+idFattura);
		}
	});

	$(document).on('click','#exportRiba', function(event){

		event.preventDefault();

		var alertContent = '<div id="alertFattureContent" class="alert alert-@@alertResult@@ alert-dismissible fade show" role="alert">';
		alertContent = alertContent + '<strong>@@alertText@@</strong>\n' +
			'            <button type="button" class="close" data-dismiss="alert" aria-label="Close"><span aria-hidden="true">&times;</span></button></div>';

		$('#alertFatture').empty().append(alertContent.replace('@@alertText@@','Generazione file in corso...').replace('@@alertResult@@', 'warning'));

		var dataDa = $('#searchDataFrom').val();
		var dataA = $('#searchDataTo').val();
		var tipoPagamento = $('#searchTipoPagamento').val().filter(Number).toString();
		var stato = $('#searchStato option:selected').val();

		var params = {};
		if(dataDa != null && dataDa != undefined && dataDa != ''){
			params.dataDa = dataDa;
		}
		if(dataA != null && dataA != undefined && dataA != ''){
			params.dataA = dataA;
		}
		if(tipoPagamento != null && tipoPagamento != undefined && tipoPagamento != ''){
			params.tipoPagamento = tipoPagamento;
		}
		if(stato != null && stato != undefined && stato != ''){
			params.stato = stato;
		}
		var url = baseUrl + "export-riba?" + $.param( params );

		$.ajax({
			type : "GET",
			url : url,
			//xhrFields: {
			//	responseType: 'blob'
			//},
			xhr: function() {
				var xhr = new XMLHttpRequest();
				xhr.onreadystatechange = function() {
					if (xhr.readyState == 2) {
						if (xhr.status == 200) {
							xhr.responseType = "blob";
						} else {
							xhr.responseType = "text";
						}
					}
				};
				return xhr;
			},
			success: function(response, status, xhr){
				//console.log(response);

				var contentDisposition = xhr.getResponseHeader("Content-Disposition");
				var fileName = contentDisposition.substring(contentDisposition.indexOf("; ") + 1);
				fileName = fileName.replace("filename=","").trim();

				var blob = new Blob([response], { type: "application/text" });
				var downloadUrl = URL.createObjectURL(blob);
				var a = document.createElement("a");
				a.href = downloadUrl;
				a.download = fileName;
				document.body.appendChild(a);
				a.click();
				a.remove();
				window.URL.revokeObjectURL(url);

				$('#alertFatture').empty();
			},
			error: function(jqXHR, textStatus, errorThrown) {
				var errorMessage = 'Errore nella creazione del file TXT';
				if(jqXHR != null && jqXHR != undefined){
					var jqXHRResponseJson = jqXHR.responseJSON;
					if(jqXHRResponseJson != null && jqXHRResponseJson != undefined && jqXHRResponseJson != ''){
						var jqXHRResponseJsonMessage = jqXHR.responseJSON.message;
						if(jqXHRResponseJsonMessage != null
							&& jqXHRResponseJsonMessage != undefined
							&& jqXHRResponseJsonMessage != ''){
							errorMessage = jqXHRResponseJsonMessage;
						}
					}
				}
				$('#alertFatture').empty().append(alertContent.replace('@@alertText@@', errorMessage).replace('@@alertResult@@', 'danger'));
			}
		});
	});

	$(document).on('click','.emailFattura', function(){
        var idFattura = $(this).attr('data-id');
        var email = $(this).attr('data-email-to');
        $('#confirmSendEmailFattura').attr('data-id', idFattura);
        $('#sendEmailFatturaModalBody').html("La fattura verrà inviata a <b>"+email+"</b>. Confermi?");
        $('#sendEmailFatturaModal').modal('show');
    });

    $(document).on('click','#confirmSendEmailFattura', function(){
        $('#sendEmailFatturaModal').modal('hide');
        var idFattura = $(this).attr('data-id');

        var alertContent = '<div id="alertFattureContent" class="alert alert-@@alertResult@@ alert-dismissible fade show" role="alert">';
        alertContent = alertContent + '<strong>@@alertText@@\n' +
            '            <button type="button" class="close" data-dismiss="alert" aria-label="Close"><span aria-hidden="true">&times;</span></button></div>';

        var url = baseUrl + "emails/fatture/" + idFattura;

        $('#alertFatture').empty().append(alertContent.replace('@@alertText@@', 'Invio email in corso...').replace('@@alertResult@@', 'warning'));

        $.ajax({
            url: url,
            type: 'GET',
            success: function() {
                $('#alertFatture').empty().append(alertContent.replace('@@alertText@@', 'Email inviata con successo.').replace('@@alertResult@@', 'success'));
                $('#fattureTable').DataTable().ajax.reload();
            },
            error: function(jqXHR, textStatus, errorThrown) {
                console.log('Response text: ' + jqXHR.responseText);
                $('#alertFatture').empty().append(alertContent.replace('@@alertText@@', "Errore nell'invio dell'email").replace('@@alertResult@@', 'danger'));
            }
        });
    });

	if($('#searchFattureButton') != null && $('#searchFattureButton') != undefined) {
		$(document).on('submit', '#searchFattureForm', function (event) {
			event.preventDefault();

			var dataDa = $('#searchDataFrom').val();
			var dataA = $('#searchDataTo').val();
			var cliente = $('#searchCliente').val();
			var agente = $('#searchAgente option:selected').val();
			var progressivo = $('#searchProgressivo').val();
			var importo = $('#searchImporto').val();
			var tipoPagamento = $('#searchTipoPagamento').val().filter(Number).toString();
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
			var url = baseUrl + "fatture?" + $.param( params );

			$('#fattureTable').DataTable().destroy();
			$.fn.loadFattureTable(url);

		});
	}

	if($('#newFatturaButton') != null && $('#newFatturaVButton') != undefined){
		$(document).on('submit','#newFatturaForm', function(event){
			event.preventDefault();

			var alertContent = '<div id="alertFattureContent" class="alert alert-@@alertResult@@ alert-dismissible fade show" role="alert">';
			alertContent = alertContent + '<strong>@@alertText@@</strong>\n' +
				'<button type="button" class="close" data-dismiss="alert" aria-label="Close"><span aria-hidden="true">&times;</span></button></div>';

			var numChecked = $('.fatturaDdtCheckbox:checkbox:checked').length;
			if(numChecked == null || numChecked == undefined || numChecked == 0){
				$('#alertFatture').empty().append(alertContent.replace('@@alertText@@','Selezionare almeno un DDT').replace('@@alertResult@@', 'danger'));
			} else{
				var fattura = new Object();
				fattura.progressivo = $('#progressivo').val();
				fattura.anno = $('#anno').val();
				fattura.data = $('#data').val();

				var cliente = new Object();
				cliente.id = $('#cliente option:selected').val();
				fattura.cliente = cliente;

				var causale = new Object();
				causale.id = $('#causale option:selected').val();
				fattura.causale = causale;

				var fatturaDdts = [];
				$('.fatturaDdtCheckbox:checkbox:checked').each(function(i, item) {
					var ddtId = item.id.replace('checkbox_', '');

					var fatturaDdt = {};
					var fatturaDdtId = new Object();
					fatturaDdtId.ddtId = ddtId;
					fatturaDdt.id = fatturaDdtId;

					fatturaDdts.push(fatturaDdt);
				});

				fattura.fatturaDdts = fatturaDdts;

				fattura.totale = $('#totale').val();
				fattura.totaleAcconto = 0;
				fattura.note = $('#note').val();

				var fatturaJson = JSON.stringify(fattura);

				$.ajax({
					url: baseUrl + "fatture",
					type: 'POST',
					contentType: "application/json",
					dataType: 'json',
					data: fatturaJson,
					success: function(result) {
						$('#alertFatture').empty().append(alertContent.replace('@@alertText@@','Fattura creata con successo').replace('@@alertResult@@', 'success'));

						$('#newFatturaButton').attr("disabled", true);

						// Returns to the same page
						setTimeout(function() {
							window.location.href = "fatture.html";
						}, 1000);
					},
					error: function(jqXHR, textStatus, errorThrown) {
						var errorMessage = 'Errore nella creazione della fattura';
						if(jqXHR != null && jqXHR != undefined){
							var jqXHRResponseJson = jqXHR.responseJSON;
							if(jqXHRResponseJson != null && jqXHRResponseJson != undefined && jqXHRResponseJson != ''){
								var jqXHRResponseJsonMessage = jqXHR.responseJSON.message;
								if(jqXHRResponseJsonMessage != null && jqXHRResponseJsonMessage != undefined && jqXHRResponseJsonMessage != '' && jqXHRResponseJsonMessage.indexOf('con progressivo') != -1){
									errorMessage = jqXHRResponseJsonMessage;
								}
							}
						}
						$('#alertFatture').empty().append(alertContent.replace('@@alertText@@', errorMessage).replace('@@alertResult@@', 'danger'));
					}
				});
			}

		});
	}

	if($('#creazioneAutomaticaFattureButton') != null && $('#creazioneAutomaticaFattureButton') != undefined){
		$(document).on('submit','#creazioneAutomaticaFattureForm', function(event){
			event.preventDefault();

			var alertContent = '<div id="alertFattureContent" class="alert alert-@@alertResult@@ alert-dismissible fade show" role="alert">';
			alertContent = alertContent + '<strong>@@alertText@@</strong>\n' +
				'<button type="button" class="close" data-dismiss="alert" aria-label="Close"><span aria-hidden="true">&times;</span></button></div>';

			$('#alertFatture').empty().append(alertContent.replace('@@alertText@@','Creazione fatture in corso...').replace('@@alertResult@@', 'warning'));

			var data = $('#data').val();

			var creazioneAutomaticaObject = new Object();
			creazioneAutomaticaObject.data = data;

			var creazioneAutomaticaObjectJson = JSON.stringify(creazioneAutomaticaObject);

			$.ajax({
				url: baseUrl + "fatture/creazione-automatica",
				type: 'POST',
				contentType: "application/json",
				dataType: 'json',
				data: creazioneAutomaticaObjectJson,
				success: function(result) {
					$('#alertFatture').empty().append(alertContent.replace('@@alertText@@','Fatture create con successo').replace('@@alertResult@@', 'success'));

					// Returns to the fatture vendite list page
					setTimeout(function() {
						window.location.href = "fatture.html";
					}, 1000);
				},
				error: function(jqXHR, textStatus, errorThrown) {
					var errorMessage = 'Errore nella creazione delle fatture';
					if(jqXHR != null && jqXHR != undefined){
						var jqXHRResponseJson = jqXHR.responseJSON;
						if(jqXHRResponseJson != null && jqXHRResponseJson != undefined && jqXHRResponseJson != ''){
							var jqXHRResponseJsonMessage = jqXHR.responseJSON.message;
							if(jqXHRResponseJsonMessage != null && jqXHRResponseJsonMessage != undefined && jqXHRResponseJsonMessage != '' && jqXHRResponseJsonMessage.indexOf('con progressivo') != -1){
								errorMessage = jqXHRResponseJsonMessage;
							}
						}
					}
					$('#alertFatture').empty().append(alertContent.replace('@@alertText@@', errorMessage).replace('@@alertResult@@', 'danger'));
				}
			});

		});
	}

	$(document).on('keypress','#searchStato', function(event){
		if (event.keyCode === 13) {
			event.preventDefault();
			$('#searchFattureButton').click();
		}
	});

	$(document).on('keypress','#searchTipoPagamento', function(event){
		if (event.keyCode === 13) {
			event.preventDefault();
			$('#searchFattureButton').click();
		}
	});

	$(document).on('keypress','#searchAgente', function(event){
		if (event.keyCode === 13) {
			event.preventDefault();
			$('#searchFattureButton').click();
		}
	});

	$(document).on('keypress','#searchArticolo', function(event){
		if (event.keyCode === 13) {
			event.preventDefault();
			$('#searchFattureButton').click();
		}
	});

	$(document).on('keypress','#searchTipo', function(event){
		if (event.keyCode === 13) {
			event.preventDefault();
			$('#searchFattureButton').click();
		}
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

	$.ajax({
		url: baseUrl + "tipi-fattura",
		type: 'GET',
		dataType: 'json',
		success: function(result) {
			if(result != null && result != undefined && result != ''){
				$.each(result, function(i, item){
					$('#searchTipo').append('<option value="'+item.id+'" >'+item.descrizione+'</option>');
				});
			}
		},
		error: function(jqXHR, textStatus, errorThrown) {
			console.log('Response text: ' + jqXHR.responseText);
		}
	});

}

$.fn.preloadFieldData = function(){
	$('#data').val(moment().format('YYYY-MM-DD'));
}

$.fn.preloadFields = function(){
	$.ajax({
		url: baseUrl + "fatture/progressivo",
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

$(document).on('change','#cliente', function(){
	$.fn.loadDdtDaFatturare();
});

$(document).on('change','#data', function(){
	$.fn.loadDdtDaFatturare();
});

$.fn.loadDdtDaFatturare = function(){
	var cliente = $('#cliente option:selected').val();
	var data = $('#data').val();
	if(cliente != null && cliente != ''){
		var dataString = moment().format('YYYY-MM-DD');
		if(data != null && data != ''){
			dataString = moment(data).format('YYYY-MM-DD');
		}

		$('#fatturaDdtTable').DataTable().destroy();

		var url = baseUrl + "ddts?idCliente="+cliente+"&fatturato=false&dataA="+dataString;
		$('#fatturaDdtTable').DataTable({
			"ajax": {
				"url": url,
				"type": "GET",
				"content-type": "json",
				"cache": false,
				"dataSrc": "",
				"error": function(jqXHR, textStatus, errorThrown) {
					console.log('Response text: ' + jqXHR.responseText);
					var alertContent = '<div id="alertFattureContent" class="alert alert-danger alert-dismissible fade show" role="alert">';
					alertContent = alertContent + '<strong>Errore nel recupero dei ddt da fatturare</strong>\n' +
						'            <button type="button" class="close" data-dismiss="alert" aria-label="Close"><span aria-hidden="true">&times;</span></button></div>';
					$('#alertFatture').empty().append(alertContent);
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
					var checkboxHtml = '<input type="checkbox" data-id="'+data.id+'" id="checkbox_'+data.id+'" class="fatturaDdtCheckbox">';
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
				$(cells[0]).css('text-align','center');
				$(cells[1]).css('text-align','center');
				$(cells[2]).css('text-align','center');
				$(cells[3]).css('text-align','center').addClass('ddtTotale');
			}
		});
	} else {
		$('#fatturaDdtTable').DataTable().clear();
		$('#fatturaDdtTable').DataTable().destroy();
		$.fn.loadEmptyFatturaDdtTable();
	}
}

$.fn.extractIdFatturaFromUrl = function(){
    var pageUrl = window.location.search.substring(1);

	var urlVariables = pageUrl.split('&'),
        paramNames,
        i;

    for (i = 0; i < urlVariables.length; i++) {
        paramNames = urlVariables[i].split('=');

        if (paramNames[0] === 'idFattura') {
        	return paramNames[1] === undefined ? null : decodeURIComponent(paramNames[1]);
        }
    }
}

$.fn.formatNumber = function(value){
	return parseFloat(Number(Math.round(value+'e2')+'e-2')).toFixed(2);
}

$(document).on('change','.fatturaDdtCheckbox', function(){
	var numChecked = $('.fatturaDdtCheckbox:checkbox:checked').length;
	if(numChecked == null || numChecked == undefined || numChecked == 0){
		$('#totale').val(null);
	} else{
		var totale = 0;
		$('.fatturaDdtCheckbox:checkbox:checked').each(function(i, item) {
			$(this).parent().parent().find('.ddtTotale').each(function( index ) {
				totale += parseFloat($(this).text());
			});
		});
		$('#totale').val(parseFloat(Number(Math.round(totale+'e2')+'e-2')).toFixed(2));
	};
});
