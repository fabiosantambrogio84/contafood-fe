var baseUrl = "/contafood-be/";
var rowBackgroundVerde = '#96ffb2';
var rowBackgroundRosa = '#fcd1ff';
var rowBackgroundGiallo = '#fffca3';

$(document).ready(function() {

	$('#fatturaAccompagnatoriaAcquistoArticoliTable').DataTable({
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

	$('#fatturaAccompagnatoriaAcquistoTotaliTable').DataTable({
		"ajax": {
			"url": baseUrl + "aliquote-iva",
			"type": "GET",
			"content-type": "json",
			"cache": false,
			"dataSrc": "",
			"error": function(jqXHR, textStatus, errorThrown) {
				console.log('Response text: ' + jqXHR.responseText);
				var alertContent = '<div id="alertFattureAccompagnatorieAcquistoContent" class="alert alert-danger alert-dismissible fade show" role="alert">';
				alertContent = alertContent + '<strong>Errore nel recupero delle aliquote iva</strong>\n' +
					'            <button type="button" class="close" data-dismiss="alert" aria-label="Close"><span aria-hidden="true">&times;</span></button></div>';
				$('#alertFattureAccompagnatorieAcquisto').empty().append(alertContent);
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

	$.fn.createFatturaAccompagnatoriaAcquisto = function(print){

		var alertContent = '<div id="alertFattureAccompagnatorieAcquistoContent" class="alert alert-@@alertResult@@ alert-dismissible fade show" role="alert">';
		alertContent = alertContent + '<strong>@@alertText@@</strong>\n' +
			'<button type="button" class="close" data-dismiss="alert" aria-label="Close"><span aria-hidden="true">&times;</span></button></div>';

		var validDataTrasporto = $.fn.validateDataTrasporto();
		if(!validDataTrasporto){
			$('#alertFattureAccompagnatorieAcquisto').empty().append(alertContent.replace('@@alertText@@', "'Data trasporto' non può essere precedente alla data della Fattura Accompagnatoria Acquisto").replace('@@alertResult@@', 'danger'));
			return false;
		}

		var fatturaAccompagnatoriaAcquisto = new Object();
		fatturaAccompagnatoriaAcquisto.numero = $('#numero').val();
		//fatturaAccompagnatoriaAcquisto.anno = $('#anno').val();
		fatturaAccompagnatoriaAcquisto.data = $('#data').val();

		var fornitore = new Object();
		fornitore.id = $('#fornitore option:selected').val();
		fatturaAccompagnatoriaAcquisto.fornitore = fornitore;

		var causale = new Object();
		causale.id = $('#causale option:selected').val();
		fatturaAccompagnatoriaAcquisto.causale = causale;

		var fatturaAccompagnatoriaAcquistoArticoliLength = $('.rowArticolo').length;
		if(fatturaAccompagnatoriaAcquistoArticoliLength != null && fatturaAccompagnatoriaAcquistoArticoliLength != undefined && fatturaAccompagnatoriaAcquistoArticoliLength != 0){
			var fatturaAccompagnatoriaAcquistoArticoli = [];
			$('.rowArticolo').each(function(i, item){
				var articoloId = $(this).attr('data-id');

				var fatturaAccompagnatoriaAcquistoArticolo = {};
				var fatturaAccompagnatoriaAcquistoArticoloId = new Object();
				fatturaAccompagnatoriaAcquistoArticoloId.articoloId = articoloId;
				fatturaAccompagnatoriaAcquistoArticolo.id = fatturaAccompagnatoriaAcquistoArticoloId;

				fatturaAccompagnatoriaAcquistoArticolo.lotto = $(this).children().eq(1).children().eq(0).val();
				fatturaAccompagnatoriaAcquistoArticolo.scadenza = $(this).children().eq(2).children().eq(0).val();
				fatturaAccompagnatoriaAcquistoArticolo.quantita = $(this).children().eq(4).children().eq(0).val();
				fatturaAccompagnatoriaAcquistoArticolo.numeroPezzi = $(this).children().eq(5).children().eq(0).val();
				fatturaAccompagnatoriaAcquistoArticolo.prezzo = $(this).children().eq(6).children().eq(0).val();
				fatturaAccompagnatoriaAcquistoArticolo.sconto = $(this).children().eq(7).children().eq(0).val();

				fatturaAccompagnatoriaAcquistoArticoli.push(fatturaAccompagnatoriaAcquistoArticolo);
			});
			fatturaAccompagnatoriaAcquisto.fatturaAccompagnatoriaAcquistoArticoli = fatturaAccompagnatoriaAcquistoArticoli;
		}
		var fatturaAccompagnatoriaAcquistoTotaliLength = $('.rowTotaliByIva').length;
		if(fatturaAccompagnatoriaAcquistoTotaliLength != null && fatturaAccompagnatoriaAcquistoTotaliLength != undefined && fatturaAccompagnatoriaAcquistoTotaliLength != 0){
			var fatturaAccompagnatoriaAcquistoTotali = [];
			$('.rowTotaliByIva').each(function(i, item){
				var aliquotaIvaId = $(this).attr('data-id');

				var fatturaAccompagnatoriaAcquistoTotale = {};
				var fatturaAccompagnatoriaAcquistoTotaleId = new Object();
				fatturaAccompagnatoriaAcquistoTotaleId.aliquotaIvaId = aliquotaIvaId;
				fatturaAccompagnatoriaAcquistoTotale.id = fatturaAccompagnatoriaAcquistoTotaleId;

				fatturaAccompagnatoriaAcquistoTotale.totaleIva = $(this).find('td').eq(1).text();
				fatturaAccompagnatoriaAcquistoTotale.totaleImponibile = $(this).find('td').eq(2).text();

				fatturaAccompagnatoriaAcquistoTotali.push(fatturaAccompagnatoriaAcquistoTotale);
			});
			fatturaAccompagnatoriaAcquisto.fatturaAccompagnatoriaAcquistoTotali = fatturaAccompagnatoriaAcquistoTotali;
		}

		fatturaAccompagnatoriaAcquisto.numeroColli = $('#colli').val();
		fatturaAccompagnatoriaAcquisto.tipoTrasporto = $('#tipoTrasporto option:selected').val();
		fatturaAccompagnatoriaAcquisto.dataTrasporto = $('#dataTrasporto').val();

		var regex = /:/g;
		var oraTrasporto = $('#oraTrasporto').val();
		if(oraTrasporto != null && oraTrasporto != ''){
			var count = oraTrasporto.match(regex);
			count = (count) ? count.length : 0;
			if(count == 1){
				fatturaAccompagnatoriaAcquisto.oraTrasporto = $('#oraTrasporto').val() + ':00';
			} else {
				fatturaAccompagnatoriaAcquisto.oraTrasporto = $('#oraTrasporto').val();
			}
		}
		fatturaAccompagnatoriaAcquisto.trasportatore = $('#trasportatore').val();
		fatturaAccompagnatoriaAcquisto.note = $('#note').val();

		var fatturaAccompagnatoriaAcquistoJson = JSON.stringify(fatturaAccompagnatoriaAcquisto);

		$.ajax({
			url: baseUrl + "fatture-accompagnatorie-acquisto",
			type: 'POST',
			contentType: "application/json",
			dataType: 'json',
			data: fatturaAccompagnatoriaAcquistoJson,
			success: function(result) {
				var idFatturaAccompagnatoriaAcquisto = result.id;

				$('#alertFattureAccompagnatorieAcquisto').empty().append(alertContent.replace('@@alertText@@','Fattura accompagnatoria acquisto creata con successo').replace('@@alertResult@@', 'success'));

				$('#newFatturaAccompagnatoriaAcquistoButton').attr("disabled", true);

				// Returns to the same page
				setTimeout(function() {
					window.location.href = "fatture-accompagnatorie-acquisto-new.html?dt="+fatturaAccompagnatoriaAcquisto.dataTrasporto+"&ot="+oraTrasporto;
				}, 1000);

				if(print){
					window.open(baseUrl + "stampe/fatture-accompagnatorie-acquisto/"+idFatturaAccompagnatoriaAcquisto, '_blank');
				}

			},
			error: function(jqXHR, textStatus, errorThrown) {
				var errorMessage = 'Errore nella creazione della fattura accompagnatoria acquisto';
				if(jqXHR != null && jqXHR != undefined){
					var jqXHRResponseJson = jqXHR.responseJSON;
					if(jqXHRResponseJson != null && jqXHRResponseJson != undefined && jqXHRResponseJson != ''){
						var jqXHRResponseJsonMessage = jqXHR.responseJSON.message;
						if(jqXHRResponseJsonMessage != null && jqXHRResponseJsonMessage != undefined && jqXHRResponseJsonMessage != '' && jqXHRResponseJsonMessage.indexOf('con progressivo') != -1){
							errorMessage = jqXHRResponseJsonMessage;
						}
					}
				}
				$('#alertFattureAccompagnatorieAcquisto').empty().append(alertContent.replace('@@alertText@@', errorMessage).replace('@@alertResult@@', 'danger'));
			}
		});
	}

	if($('#newFatturaAccompagnatoriaAcquistoButton') != null && $('#newFatturaAccompagnatoriaAcquistoButton') != undefined && $('#newFatturaAccompagnatoriaAcquistoButton').length > 0){

		$('#articolo').selectpicker();
		$('#fornitore').selectpicker();

		$(document).on('submit','#newFatturaAccompagnatoriaAcquistoForm', function(event){
			event.preventDefault();

			$.fn.createFatturaAccompagnatoriaAcquisto(false);

		});
	}

	if($('#newAndPrintFatturaAccompagnatoriaAcquistoButton') != null && $('#newAndPrintFatturaAccompagnatoriaAcquistoButton') != undefined && $('#newAndPrintFatturaAccompagnatoriaAcquistoButton').length > 0){
		$('#articolo').selectpicker();
		$('#fornitore').selectpicker();

		$(document).on('click','#newAndPrintFatturaAccompagnatoriaAcquistoButton', function(event){
			event.preventDefault();

			$.fn.createFatturaAccompagnatoriaAcquisto(true);
		});
	}

	$(document).on('change','#fornitore', function(){
		$('#articolo option[value=""]').prop('selected', true);
		$('#udm').val('');
		$('#iva').val('');
		$('#lotto').val('');
		$('#scadenza').val('');
		$('#quantita').val('');
		$('#pezzi').val('');
		$('#prezzo').val('');
		$('#sconto').val('');

		var alertContent = '<div id="alertFatturaAccompagnatoriaAcquistoContent" class="alert alert-@@alertResult@@ alert-dismissible fade show" role="alert">';
		alertContent = alertContent + '<strong>@@alertText@@</strong>\n' +
			'<button type="button" class="close" data-dismiss="alert" aria-label="Close"><span aria-hidden="true">&times;</span></button></div>';

		$('#alertFattureAccompagnatorieAcquisto').empty();

		$.fn.emptyArticoli();

		var fornitore = $('#fornitore option:selected').val();
		if(fornitore != null && fornitore != ''){

			$.fn.getArticoli(fornitore);

			$('#articolo').removeAttr('disabled');
			$('#articolo').selectpicker('refresh');
		} else {
			$('#articolo').attr('disabled', true);
			$('#articolo').selectpicker('refresh');
		}
	});

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

			$('#addFatturaAccompagnatoriaAcquistoArticoloAlert').empty().append(alertContent);
			return;
		} else {
			$('#addFatturaAccompagnatoriaAcquistoArticoloAlert').empty();
		}

		var pezzi = $('#pezzi').val();
		if(pezzi == null || pezzi == undefined || pezzi == ''){
			var alertContent = '<div class="alert alert-danger alert-dismissable">\n' +
				'                <button type="button" class="close" data-dismiss="alert" aria-hidden="true">&times;</button>\n' +
				'                Inserisci il numero di pezzi\n' +
				'              </div>';

			$('#addFatturaAccompagnatoriaAcquistoArticoloAlert').empty().append(alertContent);
			return;
		} else {
			$('#addFatturaAccompagnatoriaAcquistoArticoloAlert').empty();
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
		var prezzoHtml = '<input type="number" step=".01" min="0" class="form-control form-control-sm text-center compute-totale ignore-barcode-scanner" value="'+prezzo+'">';
		var scontoHtml = '<input type="number" step=".01" min="0" class="form-control form-control-sm text-center compute-totale ignore-barcode-scanner" value="'+sconto+'">';

		// check if a same articolo was already added
		var found = 0;
		var currentRowIndex;
		var currentIdOrdineCliente;
		var currentIdArticolo;
		var currentLotto;
		var currentPrezzo;
		var currentSconto;
		var currentScadenza;
		var currentQuantita = 0;
		var currentPezzi = 0;
		var currentPezziDaEvadere = 0;

		var fatturaAccompagnatoriaAcquistoArticoliLength = $('.rowArticolo').length;
		if(fatturaAccompagnatoriaAcquistoArticoliLength != null && fatturaAccompagnatoriaAcquistoArticoliLength != undefined && fatturaAccompagnatoriaAcquistoArticoliLength != 0) {
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

		var table = $('#fatturaAccompagnatoriaAcquistoArticoliTable').DataTable();
		if(found >= 1){

			var newQuantita = (quantita + $.fn.parseValue(currentQuantita,'float'));
			var newPezzi = pezzi + $.fn.parseValue(currentPezzi,'int');

			var newQuantitaHtml = '<input type="number" step=".001" min="0" class="form-control form-control-sm text-center compute-totale gnore-barcode-scanner" value="'+$.fn.fixDecimalPlaces(newQuantita, 3)+'">';
			var newPezziHtml = '<input type="number" step="1" min="0" class="form-control form-control-sm text-center compute-totale ignore-barcode-scanner pezzi" value="'+newPezzi+'">';

			var lottoHtml = '<input type="text" class="form-control form-control-sm text-center compute-totale lotto group" value="'+currentLotto+'" data-codice-fornitore="'+codiceFornitore+'">';
			var scadenzaHtml = '<input type="date" class="form-control form-control-sm text-center compute-totale ignore-barcode-scanner scadenza group" value="'+moment(currentScadenza).format('YYYY-MM-DD')+'">';

			var prezzoHtml = '<input type="number" step=".01" min="0" class="form-control form-control-sm text-center compute-totale ignore-barcode-scanner group" value="'+currentPrezzo+'">';
			var scontoHtml = '<input type="number" step=".01" min="0" class="form-control form-control-sm text-center compute-totale ignore-barcode-scanner group" value="'+currentSconto+'">';

			if($.fn.isVersionClient()){
				prezzoHtml = prezzoHtml.replace('>', ' disabled>');
			}

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
			var deleteLink = '<a class="deleteFatturaAccompagnatoriaAcquistoArticolo" data-id="'+articoloId+'" href="#"><i class="far fa-trash-alt" title="Rimuovi"></i></a>';

			var rowsCount = table.rows().count();

			if($.fn.isVersionClient()){
				prezzoHtml = prezzoHtml.replace('>', ' disabled>');
			}

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

		//$.fn.checkPezziOrdinati();

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

	$(document).on('click','.deleteFatturaAccompagnatoriaAcquistoArticolo', function(){
		$('#fatturaAccompagnatoriaAcquistoArticoliTable').DataTable().row( $(this).parent().parent() )
			.remove()
			.draw();
		$('#fatturaAccompagnatoriaAcquistoArticoliTable').focus();

		$.fn.computeTotale();

		$.fn.checkPezziOrdinati();
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

$.fn.preloadFields = function(dataTrasporto, oraTrasporto){
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

	$('#fornitore').focus();

	var uri = window.location.toString();
	if (uri.indexOf("?") > 0) {
		var clean_uri = uri.substring(0, uri.indexOf("?"));
		window.history.replaceState({}, document.title, clean_uri);
	}
}

$.fn.getFornitori = function(){
	$.ajax({
		url: baseUrl + "fornitori?attivo=true",
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

$.fn.getCausali = function(dataTrasporto, oraTrasporto){
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
				$.fn.preloadFields(dataTrasporto, oraTrasporto);
			}
		},
		error: function(jqXHR, textStatus, errorThrown) {
			console.log('Response text: ' + jqXHR.responseText);
		}
	});
}

$.fn.getArticoli = function(idFornitore){

	$('#articolo').empty().append('<option value=""></option>');

	$.ajax({
		url: baseUrl + "articoli?attivo=true&idFornitore="+idFornitore,
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