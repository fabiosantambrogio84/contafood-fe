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
		"pageLength": 50,
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

	if($('#newFatturaAccompagnatoriaButton') != null && $('#newFatturaAccompagnatoriaButton') != undefined && $('#newFatturaAccompagnatoriaButton').length > 0){

		$('#articolo').selectpicker();
		$('#cliente').selectpicker();

		$(document).on('submit','#newFatturaAccompagnatoriaForm', function(event){
			event.preventDefault();

			var alertContent = '<div id="alertFattureAccompagnatorieContent" class="alert alert-@@alertResult@@ alert-dismissible fade show" role="alert">';
			alertContent = alertContent + '<strong>@@alertText@@</strong>\n' +
				'<button type="button" class="close" data-dismiss="alert" aria-label="Close"><span aria-hidden="true">&times;</span></button></div>';

			var validLotto = $.fn.validateLotto();
			if(!validLotto){
				$('#alertFattureAccompagnatorie').empty().append(alertContent.replace('@@alertText@@', "Compilare tutti i dati 'Lotto'").replace('@@alertResult@@', 'danger'));
				return false;
			}

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
					fatturaAccompagnatoriaArticolo.scadenza = $(this).children().eq(2).children().eq(0).val();
					fatturaAccompagnatoriaArticolo.quantita = $(this).children().eq(4).children().eq(0).val();
					fatturaAccompagnatoriaArticolo.numeroPezzi = $(this).children().eq(5).children().eq(0).val();
					fatturaAccompagnatoriaArticolo.prezzo = $(this).children().eq(6).children().eq(0).val();
					fatturaAccompagnatoriaArticolo.sconto = $(this).children().eq(7).children().eq(0).val();

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
		$('#scadenza').val('');
		$('#quantita').val('');
		$('#pezzi').val('');
		$('#prezzo').val('');
		$('#sconto').val('');

		var alertContent = '<div id="alertFatturaAccompagnatoriaContent" class="alert alert-@@alertResult@@ alert-dismissible fade show" role="alert">';
		alertContent = alertContent + '<strong>@@alertText@@</strong>\n' +
			'<button type="button" class="close" data-dismiss="alert" aria-label="Close"><span aria-hidden="true">&times;</span></button></div>';

		$('#alertFattureAccompagnatorie').empty();

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

			$('#addFatturaAccompagnatoriaArticoloAlert').empty().append(alertContent);
			return;
		} else {
			$('#addFatturaAccompagnatoriaArticoloAlert').empty();
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
		var scadenzaHtml = '<input type="date" class="form-control form-control-sm text-center compute-totale ignore-barcode-scanner scadenza group" value="'+moment(scadenza).format('YYYY-MM-DD')+'">';

		var quantitaHtml = '<input type="number" step=".001" min="0" class="form-control form-control-sm text-center compute-totale ignore-barcode-scanner" value="'+ $.fn.fixDecimalPlaces(quantita, 3) +'">';
		var pezziHtml = '<input type="number" step="1" min="0" class="form-control form-control-sm text-center compute-totale ignore-barcode-scanner" value="'+pezzi+'">';
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

		var table = $('#fatturaAccompagnatoriaArticoliTable').DataTable();
		if(found == 1){
			//$('tr[data-id="'+currentIdArticolo+'"]').children().eq(3).children().eq(0).val(quantita + $.fn.parseValue(currentQuantita,'float'));
			//$('tr[data-id="'+currentIdArticolo+'"]').children().eq(7).text(totale);

			var newQuantita = (quantita + $.fn.parseValue(currentQuantita,'float'));

			var newQuantitaHtml = '<input type="number" step=".001" min="0" class="form-control form-control-sm text-center compute-totale gnore-barcode-scanner" value="'+$.fn.fixDecimalPlaces(newQuantita, 3)+'">';
			var newPezziHtml = '<input type="number" step="1" min="0" class="form-control form-control-sm text-center compute-totale ignore-barcode-scanner" value="'+(pezzi + $.fn.parseValue(currentPezzi,'int'))+'">';

			var rowData = table.row("[data-row-index='"+currentRowIndex+"']").data();
			rowData[4] = newQuantitaHtml;
			rowData[5] = newPezziHtml;
			rowData[8] = totale;
			table.row("[data-row-index='"+currentRowIndex+"']").data(rowData).draw();

		} else {
			var deleteLink = '<a class="deleteFatturaAccompagnatoriaArticolo" data-id="'+articoloId+'" href="#"><i class="far fa-trash-alt" title="Rimuovi"></i></a>';

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

	$(document).on('click','.deleteFatturaAccompagnatoriaArticolo', function(){
		$('#fatturaAccompagnatoriaArticoliTable').DataTable().row( $(this).parent().parent() )
			.remove()
			.draw();
		$('#fatturaAccompagnatoriaArticoliTable').focus();

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

$.fn.groupArticoloRow = function(insertedRow){
	var insertedRowIndex = insertedRow.attr("data-row-index");
	var insertedArticoloId = insertedRow.attr("data-id");
	var	insertedLotto = insertedRow.children().eq(1).children().eq(0).val();
	var	insertedScadenza = insertedRow.children().eq(2).children().eq(0).val();
	var	insertedPrezzo = insertedRow.children().eq(6).children().eq(0).val();
	var	insertedSconto = insertedRow.children().eq(7).children().eq(0).val();
	var insertedPezzi = insertedRow.children().eq(5).children().eq(0).val();
	var insertedQuantita = insertedRow.children().eq(4).children().eq(0).val();

	var found = 0;
	var currentRowIndex = 0;
	var currentIdArticolo;
	var currentLotto;
	var currentScadenza;
	var currentPrezzo;
	var currentSconto;
	var currentPezzi = 0;
	var currentQuantita = 0;

	var fatturaAccompagnatoriaArticoliLength = $('.rowArticolo').length;
	if(fatturaAccompagnatoriaArticoliLength != null && fatturaAccompagnatoriaArticoliLength != undefined && fatturaAccompagnatoriaArticoliLength != 0) {
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
	var table = $('#fatturaAccompagnatoriaArticoliTable').DataTable();
	if(found == 1){
		var totale = 0;
		sconto = $.fn.parseValue(sconto, 'float');

		var quantitaPerPrezzo = (($.fn.parseValue(insertedQuantita,'float') + $.fn.parseValue(currentQuantita,'float')) * $.fn.parseValue(insertedPrezzo, 'float'));
		var scontoValue = ($.fn.parseValue(insertedSconto, 'float')/100)*quantitaPerPrezzo;
		totale = Number(Math.round((quantitaPerPrezzo - scontoValue) + 'e2') + 'e-2');

		var newQuantita = ($.fn.parseValue(insertedQuantita,'float') + $.fn.parseValue(currentQuantita,'float'));

		var newPezziHtml = '<input type="number" step="1" min="0" class="form-control form-control-sm text-center compute-totale ignore-barcode-scanner" value="'+($.fn.parseValue(insertedPezzi,'int') + $.fn.parseValue(currentPezzi,'int'))+'">';
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

	if(lotto != null && lotto != undefined && lotto != ''){
		var lottoHtml = '<input type="text" class="form-control form-control-sm text-center compute-totale lotto group" value="'+lotto+'" data-codice-fornitore="'+codiceFornitore+'">';
	} else {
		var lottoHtml = '<input type="text" class="form-control form-control-sm text-center compute-totale lotto group" value="" data-codice-fornitore="'+codiceFornitore+'">';
	}
	var scadenzaHtml = '<input type="date" class="form-control form-control-sm text-center compute-totale ignore-barcode-scanner scadenza group" value="'+scadenza+'">';
	var quantitaHtml = '<input type="number" step=".001" min="0" class="form-control form-control-sm text-center compute-totale ignore-barcode-scanner" value="'+quantita+'">';
	var pezziHtml = '<input type="number" step="1" min="0" class="form-control form-control-sm text-center compute-totale ignore-barcode-scanner" value="'+pezzi+'">';
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
					currentPezzi = $(this).children().eq(5).children().eq(0).val();
					currentQuantita = $(this).children().eq(4).children().eq(0).val();
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

	var table = $('#fatturaAccompagnatoriaArticoliTable').DataTable();
	var rowIndex;
	if(found == 1){
		var newQuantita = (quantita + $.fn.parseValue(currentQuantita,'float'));

		var newQuantitaHtml = '<input type="number" step=".001" min="0" class="form-control form-control-sm text-center compute-totale ignore-barcode-scanner" value="'+ $.fn.fixDecimalPlaces(newQuantita, 3) +'">';
		var newPezziHtml = '<input type="number" step="1" min="0" class="form-control form-control-sm text-center compute-totale ignore-barcode-scanner" value="'+(pezzi + $.fn.parseValue(currentPezzi,'int'))+'">';

		var rowData = table.row("[data-row-index='"+currentRowIndex+"']").data();
		rowData[4] = newQuantitaHtml;
		rowData[5] = newPezziHtml;
		rowData[8] = totale;
		table.row("[data-row-index='"+currentRowIndex+"']").data(rowData).draw();
		rowIndex = currentRowIndex;

	} else {
		var deleteLink = '<a class="deleteFatturaAccompagnatoriaArticolo" data-id="'+articoloId+'" href="#"><i class="far fa-trash-alt" title="Rimuovi"></i></a>';

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
		$(rowNode).css('text-align', 'center');
		$(rowNode).addClass('rowArticolo');
		$(rowNode).attr('data-id', articoloId);
		$(rowNode).attr('data-row-index', newRowindex);
		rowIndex = newRowindex;
	}
	$.fn.computeTotale();

	$('tr[data-row-index='+rowIndex+']').children().eq(1).children().eq(0).focus();
}

$(document).ready(function() {
	// https://github.com/axenox/onscan.js

	onScan.attachTo(document, {
		suffixKeyCodes: [13], // enter-key expected at the end of a scan
		reactToPaste: false, // Compatibility to built-in scanners in paste-mode (as opposed to keyboard-mode)
		ignoreIfFocusOn: '.ignore-barcode-scanner',
		onScan: function(barcode, numeroPezzi) { // Alternative to document.addEventListener('scan')
			console.log('Scanned: ' + numeroPezzi + ' - ' + barcode);
			//var $focused = $(':focus');

			var scannerLog = '--------------------------------------------------\n';
			scannerLog += 'Barcode: '+barcode+', numero pezzi: '+numeroPezzi+'\n';

			var alertContent = '<div id="alertFatturaAccompagnatoriaContent" class="alert alert-@@alertResult@@ alert-dismissible fade show" role="alert">';
			alertContent = alertContent + '<strong>@@alertText@@</strong>\n' +
				'<button type="button" class="close" data-dismiss="alert" aria-label="Close"><span aria-hidden="true">&times;</span></button></div>';

			var cliente = $('#cliente option:selected').val();
			if($.fn.checkVariableIsNull(cliente)){
				var alertText = "Selezionare un cliente prima di effettuare la lettura del barcode";
				$('#alertDdt').empty().append(alertContent.replace('@@alertText@@', alertText).replace('@@alertResult@@', 'danger'));
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
				var codiceFornitore = lottoFocused.attr("data-codice-fornitore");

				if(barcodeType == 'ean13') {

					scannerLog += 'Lotto: '+barcodeToSearch+'\n';

					lottoFocused.val(barcodeToSearch);
				} else {
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
										$('#alertFattureAccompagnatorie').empty().append(alertContent.replace('@@alertText@@', alertText).replace('@@alertResult@@', 'warning'));
										return;
									}
									var codiceFornitore = fornitore.codice;
									if($.fn.checkVariableIsNull(codiceFornitore)){
										var alertText = "Codice fornitore non presente. Impossibile gestire il barcode ean128.";
										$('#alertFattureAccompagnatorie').empty().append(alertContent.replace('@@alertText@@', alertText).replace('@@alertResult@@', 'warning'));
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
										$('#alertFattureAccompagnatorie').empty().append(alertContent.replace('@@alertText@@', alertText).replace('@@alertResult@@', 'warning'));
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
							$('#alertFattureAccompagnatorie').empty().append(alertContent.replace('@@alertText@@', alertText).replace('@@alertResult@@', 'warning'));

							scannerLog += '--------------------------------------------------\n';
							$('#scannerLog').append(scannerLog);
						}

					},
					error: function(jqXHR, textStatus, errorThrown) {
						var barcodeTruncate = barcode.substring(0, 6);
						var alertText = "Nessun articolo trovato con barcode completo '"+barcode+"' o barcode '"+barcodeTruncate+"'";
						$('#alertFattureAccompagnatorie').empty().append(alertContent.replace('@@alertText@@', alertText).replace('@@alertResult@@', 'warning'));

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