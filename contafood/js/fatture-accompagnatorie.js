var baseUrl = "/contafood-be/";

$(document).ready(function() {

	$('#fatturaAccompagnatoriaArticoliTable').DataTable({
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

	$('#fatturaAccompagnatoriaTotaliTable').DataTable({
		"ajax": {
			"url": baseUrl + "aliquote-iva",
			"type": "GET",
			"content-type": "json",
			"cache": false,
			"dataSrc": "",
			"error": function(jqXHR, textStatus, errorThrown) {
				console.log('Response text: ' + jqXHR.responseText);
				var alertContent = '<div id="alertFattureContent" class="alert alert-danger alert-dismissible fade show" role="alert">';
				alertContent = alertContent + '<strong>Errore nel recupero delle aliquote iva</strong>\n' +
					'            <button type="button" class="close" data-dismiss="alert" aria-label="Close"><span aria-hidden="true">&times;</span></button></div>';
				$('#alertFattureAccompagnatorie').empty().append(alertContent);
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

	if($('#newFatturaAccompagnatoriaButton') != null && $('#newFatturaAccompagnatoriaButton') != undefined && $('#newFatturaAccompagnatoriaButton').length > 0){

		$(document).on('keypress','#lotto', function(event){
			if (event.keyCode === 13) {
				event.preventDefault();
			}
		});

		$('#articolo').selectpicker();
		$('#cliente').selectpicker();

		$(document).on('submit','#newFatturaAccompagnatoriaForm', function(event){
			event.preventDefault();

			var fatturaAccompagnatoria = new Object();
			fatturaAccompagnatoria.progressivo = $('#progressivo').val();
			fatturaAccompagnatoria.anno = $('#anno').val();
			fatturaAccompagnatoria.data = $('#data').val();

			var cliente = new Object();
			cliente.id = $('#cliente option:selected').val();
			fatturaAccompagnatoria.cliente = cliente;

			var puntoConsegna = new Object();
			puntoConsegna.id = $('#puntoConsegna option:selected').val();
			fatturaAccompagnatoria.puntoConsegna = puntoConsegna;

			var fatturaAccompagnatoriaArticoliLength = $('.rowArticolo').length;
			if(fatturaAccompagnatoriaArticoliLength != null && fatturaAccompagnatoriaArticoliLength != undefined && fatturaAccompagnatoriaArticoliLength != 0){
				var fatturaAccompagnatoriaArticoli = [];
				$('.rowArticolo').each(function(i, item){
					var articoloId = $(this).attr('data-id');

					var fatturaAccompagnatoriaArticolo = {};
					var fatturaAccompagnatoriaArticoloId = new Object();
					fatturaAccompagnatoriaArticoloId.articoloId = articoloId;
					fatturaAccompagnatoriaArticolo.id = fatturaAccompagnatoriaArticoloId;

					fatturaAccompagnatoriaArticolo.lotto = $(this).children().eq(1).children().eq(0).val();
					fatturaAccompagnatoriaArticolo.quantita = $(this).children().eq(3).children().eq(0).val();
					fatturaAccompagnatoriaArticolo.numeroPezzi = $(this).children().eq(4).children().eq(0).val();
					fatturaAccompagnatoriaArticolo.prezzo = $(this).children().eq(5).children().eq(0).val();
					fatturaAccompagnatoriaArticolo.sconto = $(this).children().eq(6).children().eq(0).val();

					fatturaAccompagnatoriaArticoli.push(fatturaAccompagnatoriaArticolo);
				});
				fatturaAccompagnatoria.fatturaAccompagnatoriaArticoli = fatturaAccompagnatoriaArticoli;
			}
			var fatturaAccompagnatoriaTotaliLength = $('.rowTotaliByIva').length;
			if(fatturaAccompagnatoriaTotaliLength != null && fatturaAccompagnatoriaTotaliLength != undefined && fatturaAccompagnatoriaTotaliLength != 0){
				var fatturaAccompagnatoriaTotali = [];
				$('.rowTotaliByIva').each(function(i, item){
					var aliquotaIvaId = $(this).attr('data-id');

					var fatturaAccompagnatoriaTotale = {};
					var fatturaAccompagnatoriaTotaleId = new Object();
					fatturaAccompagnatoriaTotaleId.aliquotaIvaId = aliquotaIvaId;
					fatturaAccompagnatoriaTotale.id = fatturaAccompagnatoriaTotaleId;

					fatturaAccompagnatoriaTotale.totaleIva = $(this).find('td').eq(1).text();
					fatturaAccompagnatoriaTotale.totaleImponibile = $(this).find('td').eq(2).text();

					fatturaAccompagnatoriaTotali.push(fatturaAccompagnatoriaTotale);
				});
				fatturaAccompagnatoria.fatturaAccompagnatoriaTotali = fatturaAccompagnatoriaTotali;
			}

			fatturaAccompagnatoria.numeroColli = $('#colli').val();
			fatturaAccompagnatoria.tipoTrasporto = $('#tipoTrasporto option:selected').val();
			fatturaAccompagnatoria.dataTrasporto = $('#dataTrasporto').val();

			var regex = /:/g;
			var oraTrasporto = $('#oraTrasporto').val();
			if(oraTrasporto != null && oraTrasporto != ''){
				var count = oraTrasporto.match(regex);
				count = (count) ? count.length : 0;
				if(count == 1){
					fatturaAccompagnatoria.oraTrasporto = $('#oraTrasporto').val() + ':00';
				} else {
					fatturaAccompagnatoria.oraTrasporto = $('#oraTrasporto').val();
				}
			}
			fatturaAccompagnatoria.trasportatore = $('#trasportatore').val();
			fatturaAccompagnatoria.note = $('#note').val();

			var fatturaAccompagnatoriaJson = JSON.stringify(fatturaAccompagnatoria);

			var alertContent = '<div id="alertDdtContent" class="alert alert-@@alertResult@@ alert-dismissible fade show" role="alert">';
			alertContent = alertContent + '<strong>@@alertText@@</strong>\n' +
				'<button type="button" class="close" data-dismiss="alert" aria-label="Close"><span aria-hidden="true">&times;</span></button></div>';

			$.ajax({
				url: baseUrl + "fatture-accompagnatorie",
				type: 'POST',
				contentType: "application/json",
				dataType: 'json',
				data: fatturaAccompagnatoriaJson,
				success: function(result) {
					$('#alertFattureAccompagnatorie').empty().append(alertContent.replace('@@alertText@@','Fattura accompagnatoria creata con successo').replace('@@alertResult@@', 'success'));

					$('#newFatturaAccompagnatoriaButton').attr("disabled", true);

					// Returns to the same page
					setTimeout(function() {
						window.location.href = "fatture-accompagnatorie-new.html?dt="+fatturaAccompagnatoria.dataTrasporto+"&ot="+oraTrasporto;
					}, 1000);
				},
				error: function(jqXHR, textStatus, errorThrown) {
					var errorMessage = 'Errore nella creazione della fattura accompagnatoria';
					if(jqXHR != null && jqXHR != undefined){
						var jqXHRResponseJson = jqXHR.responseJSON;
						if(jqXHRResponseJson != null && jqXHRResponseJson != undefined && jqXHRResponseJson != ''){
							var jqXHRResponseJsonMessage = jqXHR.responseJSON.message;
							if(jqXHRResponseJsonMessage != null && jqXHRResponseJsonMessage != undefined && jqXHRResponseJsonMessage != '' && jqXHRResponseJsonMessage.indexOf('con progressivo') != -1){
								errorMessage = jqXHRResponseJsonMessage;
							}
						}
					}
					$('#alertFattureAccompagnatorie').empty().append(alertContent.replace('@@alertText@@', errorMessage).replace('@@alertResult@@', 'danger'));
				}
			});

		});
	}

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
								$('#alertFattureAccompagnatorie').empty().append(alertContent.replace('@@alertText@@', 'Errore nel caricamento dei prezzi di listino').replace('@@alertResult@@', 'danger'));
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
					$('#alertFattureAccompagnatorie').empty().append(alertContent.replace('@@alertText@@','Errore nel caricamento dei punti di consegna').replace('@@alertResult@@', 'danger'));
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
				$('#alertFattureAccompagnatorie').empty().append(alertContent.replace('@@alertText@@', 'Errore nel caricamento degli sconti').replace('@@alertResult@@', 'danger'));
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
			var alertContent = '<div class="alert alert-danger alert-dismissable">\n' +
				'                <button type="button" class="close" data-dismiss="alert" aria-hidden="true">&times;</button>\n' +
				'                Seleziona un articolo\n' +
				'              </div>';

			$('#addFatturaAccompagnatoriaArticoloAlert').empty().append(alertContent);
			return;
		} else {
			$('#addFatturaAccompagnatoriaArticoloAlert').empty();
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

		var fatturaAccompagnatoriaArticoliLength = $('.rowArticolo').length;
		if(fatturaAccompagnatoriaArticoliLength != null && fatturaAccompagnatoriaArticoliLength != undefined && fatturaAccompagnatoriaArticoliLength != 0) {
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

		var table = $('#fatturaAccompagnatoriaArticoliTable').DataTable();
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
			var deleteLink = '<a class="deleteFatturaAccompagnatoriaArticolo" data-id="'+articoloId+'" href="#"><i class="far fa-trash-alt" title="Rimuovi"></i></a>';

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
		$('#articolo').selectpicker('refresh');
	});

	$(document).on('click','.deleteFatturaAccompagnatoriaArticolo', function(){
		$('#fatturaAccompagnatoriaArticoliTable').DataTable().row( $(this).parent().parent() )
			.remove()
			.draw();
		$('#fatturaAccompagnatoriaArticoliTable').focus();

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

		$.row.children().eq(7).text(totale);

		$.fn.computeTotale();
	});

});

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
		url: baseUrl + "fatture-accompagnatorie/progressivo",
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

		// populating the table with iva and imponibile
		$('tr[data-valore='+key+']').find('td').eq(1).text($.fn.formatNumber((totalePerIva * key/100)));
		$('tr[data-valore='+key+']').find('td').eq(2).text($.fn.formatNumber(totalePerIva));
	});

	if(totaleDocumento != null && totaleDocumento != undefined && totaleDocumento != ""){
		totaleDocumento = parseFloat(totaleDocumento);
	}
	$('#totale').val(Number(Math.round(totaleDocumento+'e2')+'e-2'));
}

