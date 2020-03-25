var baseUrl = "/contafood-be/";

$.fn.loadRicercaLottiDdtTable = function(url) {
	if($.fn.DataTable.isDataTable( '#ricercaLottiDdtTable' )){
		$('#ricercaLottiDdtTable').DataTable().destroy();
	}

	$('#ricercaLottiDdtTable').DataTable({
		"ajax": {
			"url": url,
			"type": "GET",
			"content-type": "json",
			"cache": false,
			"dataSrc": "",
			"error": function(jqXHR, textStatus, errorThrown) {
				console.log('Response text: ' + jqXHR.responseText);
				var alertContent = '<div id="alertRicercaLottiContent" class="alert alert-danger alert-dismissible fade show" role="alert">';
				alertContent = alertContent + '<strong>Errore nel recupero dei DDT</strong>\n' +
					'            <button type="button" class="close" data-dismiss="alert" aria-label="Close"><span aria-hidden="true">&times;</span></button></div>';
				$('#alertRicercaLotti').empty().append(alertContent);
			}
		},
		"language": {
			"search": "Cerca",
			"paginate": {
				"first": "Inizio",
				"last": "Fine",
				"next": "Succ.",
				"previous": "Prec."
			},
			"emptyTable": "Nessun DDT disponibile",
			"zeroRecords": "Nessun DDT disponibile"
		},
		"searching": true,
		"responsive":true,
		"pageLength": 20,
		"lengthChange": false,
		"info": false,
		"autoWidth": false,
		"order": [
			[1, 'desc'],
			[0, 'desc']
		],
		"columns": [
			{"title":"Numero", "name": "numero", "data": "progressivo", "width":"5%"},
			{"title":"Data", "name": "data", "data": null, "width":"8%", render: function ( data, type, row ) {
				var a = moment(data.data);
				return a.format('DD/MM/YYYY');
			}},
			{"title":"Cliente", "name": "cliente", "data": null, "width":"10%", render: function ( data, type, row ) {
				var cliente = data.cliente;
				if(cliente != null){
					return cliente.ragioneSociale;
				}
				return '';
			}}
		],
		"initComplete": function( settings, json ) {
			$('#ricercaLottiDdtTitle').removeClass('d-none');
		}
	});
}

$.fn.loadRicercaLottiDdtAcquistoTable = function(url) {
	if($.fn.DataTable.isDataTable( '#ricercaLottiDdtAcquistoTable' )){
		$('#ricercaLottiDdtAcquistoTable').DataTable().destroy();
	}

	$('#ricercaLottiDdtAcquistoTable').DataTable({
		"ajax": {
			"url": url,
			"type": "GET",
			"content-type": "json",
			"cache": false,
			"dataSrc": "",
			"error": function(jqXHR, textStatus, errorThrown) {
				console.log('Response text: ' + jqXHR.responseText);
				var alertContent = '<div id="alertRicercaLottiContent" class="alert alert-danger alert-dismissible fade show" role="alert">';
				alertContent = alertContent + '<strong>Errore nel recupero dei DDT Acquisto</strong>\n' +
					'            <button type="button" class="close" data-dismiss="alert" aria-label="Close"><span aria-hidden="true">&times;</span></button></div>';
				$('#alertRicercaLotti').empty().append(alertContent);
			}
		},
		"language": {
			"search": "Cerca",
			"paginate": {
				"first": "Inizio",
				"last": "Fine",
				"next": "Succ.",
				"previous": "Prec."
			},
			"emptyTable": "Nessun DDT Acquisto disponibile",
			"zeroRecords": "Nessun DDT Acquisto disponibile"
		},
		"searching": true,
		"responsive":true,
		"pageLength": 20,
		"lengthChange": false,
		"info": false,
		"autoWidth": false,
		"order": [
			[1, 'desc'],
			[0, 'desc']
		],
		"columns": [
			{"title":"Numero", "name": "numero", "data": "numero", "width":"5%"},
			{"title":"Data", "name": "data", "data": null, "width":"8%", render: function ( data, type, row ) {
				var a = moment(data.data);
				return a.format('DD/MM/YYYY');
			}},
			{"title":"Fornitore", "name": "fornitore", "data": null, "width": "10%", render: function (data, type, row) {
				var fornitore = data.fornitore;
				if (fornitore != null) {
					return fornitore.ragioneSociale;
				}
				return '';
			}}
		],
		"initComplete": function( settings, json ) {
			$('#ricercaLottiDdtAcquistoTitle').removeClass('d-none');
		}
	});
}

$.fn.loadRicercaLottiProduzioneTable = function(url) {
	if($.fn.DataTable.isDataTable( '#ricercaLottiProduzioneTable' )){
		$('#ricercaLottiProduzioneTable').DataTable().destroy();
	}

	$('#ricercaLottiProduzioneTable').DataTable({
		"ajax": {
			"url": url,
			"type": "GET",
			"content-type": "json",
			"cache": false,
			"dataSrc": "",
			"error": function(jqXHR, textStatus, errorThrown) {
				console.log('Response text: ' + jqXHR.responseText);
				var alertContent = '<div id="alertRicercaLottiContent" class="alert alert-danger alert-dismissible fade show" role="alert">';
				alertContent = alertContent + '<strong>Errore nel recupero delle produzioni</strong>\n' +
					'            <button type="button" class="close" data-dismiss="alert" aria-label="Close"><span aria-hidden="true">&times;</span></button></div>';
				$('#alertRicercaLotti').empty().append(alertContent);
			}
		},
		"language": {
			"search": "Cerca",
			"paginate": {
				"first": "Inizio",
				"last": "Fine",
				"next": "Succ.",
				"previous": "Prec."
			},
			"emptyTable": "Nessuna produzione disponibile",
			"zeroRecords": "Nessuna produzione disponibile"
		},
		"searching": true,
		"responsive":true,
		"pageLength": 20,
		"lengthChange": false,
		"info": false,
		"autoWidth": false,
		"order": [
			[1, 'desc'],
			[0, 'desc']
		],
		"columns": [
			{"title":"Codice", "name": "codice", "data": "codice", "width":"10%"},
			{"title":"Lotto", "name": "lotto", "data": "lotto", "width":"10%"},
			{"title":"Data", "name": "dataProduzione", "data": null, "width":"15%", render: function ( data, type, row ) {
				var a = moment(data.dataProduzione);
				return a.format('DD/MM/YYYY');
			}},
			{"title":"Scadenza", "name": "scadenza", "data": null, "width":"10%", render: function ( data, type, row ) {
				var a = moment(data.scadenza);
				return a.format('DD/MM/YYYY');
			}},
			{"title":"Ricetta", "name": "ricetta", "data": null, "orderable":false, render: function ( data, type, row ) {
				var ricettaResult = data.ricetta.codice+' - '+data.ricetta.nome;
				return ricettaResult;
			}}
		],
		"initComplete": function( settings, json ) {
			$('#ricercaLottiProduzioneTitle').removeClass('d-none');
		}
	});
}

$(document).ready(function() {

	$('#cliente').selectpicker();
	$('#articolo').selectpicker();

	$(document).on('submit','#statisticheForm', function(event){
		event.preventDefault();

		var alertContent = '<div id="alertStatisticheContent" class="alert alert-@@alertResult@@ alert-dismissible fade show" role="alert">';
		alertContent = alertContent + '<strong>@@alertText@@</strong>\n' +
			'            <button type="button" class="close" data-dismiss="alert" aria-label="Close"><span aria-hidden="true">&times;</span></button></div>';

		var dataDal = $('#dataDal').val();
		var dataAl = $('#dataAl').val();

		if(!$.fn.checkVariableIsNull(dataDal) && !$.fn.checkVariableIsNull(dataAl)){
			$('#alertStatistiche').empty().append(alertContent.replace('@@alertText@@','Calcolo statistiche in corso...').replace('@@alertResult@@', 'warning'));

			/*
			var ricercaLottiDdtUrl = baseUrl + "ddts?lotto="+lotto;
			var ricercaLottiDdtAcquistoUrl = baseUrl + "ddts-acquisto?lotto="+lotto;
			var ricercaLottiProduzioneUrl = baseUrl + "produzioni?lotto="+lotto;

			$.when($.fn.loadRicercaLottiDdtTable(ricercaLottiDdtUrl),$.fn.loadRicercaLottiDdtAcquistoTable(ricercaLottiDdtAcquistoUrl), $.fn.loadRicercaLottiProduzioneTable(ricercaLottiProduzioneUrl)).then(function(f1,f2,f3){
				$('#alertRicercaLotti').empty();
				$('.custom-divider').removeClass('d-none');
			});

			 */

		} else {
			$('#alertStatistiche').empty().append(alertContent.replace('@@alertText@@','Inserire Data Dal e Data Al').replace('@@alertResult@@', 'danger'));
		}

	});

	$(document).on('click','#resetStatisticheButton', function(){
		$('#statisticheForm :input').val(null);

		$('#cliente').selectpicker('refresh');
		$('#articolo').selectpicker('refresh');

		$('#statisticheTotaleVendutoTitle').addClass('d-none');
		$('#statisticheQuantitaTotaleVendutaTitle').addClass('d-none');
		$('#statisticheRigheTitle').addClass('d-none');

		$('.custom-divider').addClass('d-none');

		var tableContent = '<table class="table table-bordered" id="@@tableId@@" width="100%" cellspacing="0" style="color: #080707 !important;">\n' +
			'                <thead>\n' +
			'                  <tr style="font-size:12px;">\n' +
			'                  </tr>\n' +
			'                </thead>\n' +
			'              </table>';

		var statisticheDdtArticoliTable = $('#statisticheDdtArticoliTable');
		if($.fn.DataTable.isDataTable( '#statisticheDdtArticoliTable' )){
			statisticheDdtArticoliTable.DataTable().destroy(true);
			$(tableContent.replace('@@tableId@@', 'statisticheDdtArticoliTable')).insertAfter("#statisticheDdtArticoliTableDiv");
		}
		var statisticheArticoliTable = $('#statisticheArticoliTable');
		if($.fn.DataTable.isDataTable( '#statisticheArticoliTable' )){
			statisticheArticoliTable.DataTable().destroy(true);
			$(tableContent.replace('@@tableId@@', 'statisticheArticoliTable')).insertAfter("#statisticheArticoliTableDiv");
		}

	});

	$(document).on('change','#periodo', function(){
		var periodo = $(this).val();
		if(periodo != null && periodo != undefined && periodo != ''){
			var startDate = moment();
			var endDate = moment();
			if(periodo == 'ANNO'){
				$('#dataDal').val(startDate.startOf('year').format('YYYY-MM-DD'));
				$('#dataAl').val(endDate.endOf('year').format('YYYY-MM-DD'));
			} else if(periodo == 'MESE'){
				$('#dataDal').val(startDate.startOf('month').format('YYYY-MM-DD'));
				$('#dataAl').val(endDate.endOf('month').format('YYYY-MM-DD'));
			} else {
				$('#dataDal').val(startDate.startOf('isoWeek').format('YYYY-MM-DD'));
				$('#dataAl').val(endDate.endOf('isoWeek').format('YYYY-MM-DD'));
			}

			$('#dataDal').prop("disabled", true);
			$('#dataAl').prop("disabled", true);
		} else {
			$('#dataDal').val(null);
			$('#dataAl').val(null);

			$('#dataDal').prop("disabled", false);
			$('#dataAl').prop("disabled", false);
		}

	});
});

$.fn.checkVariableIsNull = function(variable){
	if(variable == null || variable == undefined || variable == ''){
		return true;
	}
	return false;
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

					$('#cliente').append('<option value="'+item.id+'">'+label+'</option>');

					$('#cliente').selectpicker('refresh');
				});
			}
		},
		error: function(jqXHR, textStatus, errorThrown) {
			console.log('Response text: ' + jqXHR.responseText);
		}
	});
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

$.fn.getArticoli = function(){
	$.ajax({
		url: baseUrl + "articoli?attivo=true",
		type: 'GET',
		dataType: 'json',
		success: function(result) {
			if(result != null && result != undefined && result != ''){
				$.each(result, function(i, item){
					$('#articolo').append('<option value="'+item.id+'" >'+item.codice+' '+item.descrizione+'</option>');

					$('#articolo').selectpicker('refresh');
				});
			}
		},
		error: function(jqXHR, textStatus, errorThrown) {
			console.log('Response text: ' + jqXHR.responseText);
		}
	});
}

$.fn.getStatistichePeriodi = function(){
	$.ajax({
		url: baseUrl + "utils/statistiche-periodi",
		type: 'GET',
		dataType: 'json',
		success: function(result) {
			if(result != null && result != undefined && result != ''){
				$.each(result, function(i, item){
					$('#periodo').append('<option value="'+item.codice+'" >'+item.label+'</option>');
				});
			}
		},
		error: function(jqXHR, textStatus, errorThrown) {
			console.log('Response text: ' + jqXHR.responseText);
		}
	});
}

$.fn.getStatisticheOpzioni = function(){
	$.ajax({
		url: baseUrl + "utils/statistiche-opzioni",
		type: 'GET',
		dataType: 'json',
		success: function(result) {
			if(result != null && result != undefined && result != ''){
				$.each(result, function(i, item){
					$('#opzione').append('<option value="'+item.codice+'" >'+item.label+'</option>');
				});
			}
		},
		error: function(jqXHR, textStatus, errorThrown) {
			console.log('Response text: ' + jqXHR.responseText);
		}
	});
}