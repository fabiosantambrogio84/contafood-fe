var baseUrl = "/contafood-be/";

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

			var statisticaFilter = new Object();
			statisticaFilter.dataDal = $('#dataDal').val();
			statisticaFilter.dataAl = $('#dataAl').val();
			statisticaFilter.idFornitore = $('#fornitore').val();
			statisticaFilter.idsClienti = $('#cliente').val().filter(Boolean);
			statisticaFilter.idsArticoli = $('#articolo').val().filter(Boolean);
			var opzione = $('#opzione').val();
			if(!$.fn.checkVariableIsNull(opzione)){
				statisticaFilter.opzione = opzione;
			}

			var statisticaFilterJson = JSON.stringify(statisticaFilter);

			$.ajax({
				url: baseUrl + "statistiche",
				type: 'POST',
				contentType: "application/json",
				dataType: 'json',
				data: statisticaFilterJson,
				success: function(result) {
					if(result != null && result != undefined && result != ''){

						$('#statisticheTotaleVenduto').text(result.totaleVenduto+' €');
						$('#statisticheQuantitaTotaleVenduta').text(result.totaleQuantitaVenduta);
						if(!$.fn.checkVariableIsNull(opzione) && opzione == 'MOSTRA_DETTAGLIO'){
							$('#statisticheRigheTitle').text('Sono state trovate '+result.numeroRighe+' righe di dettaglio');

							if(result.ddtArticoli != null && result.ddtArticoli != undefined){
								if($.fn.DataTable.isDataTable( '#statisticheDdtArticoliTable' )){
									$('#statisticheDdtArticoliTable').DataTable().destroy();
								}

								$('#statisticheDdtArticoliTable').DataTable({
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
										[1, 'asc']
									],
									"autoWidth": false,
									"columns": [
										{"title": "DDT", "name": "ddt", "data": null, render: function (data, type, row) {
											var result = '';
											if (data.ddt != null) {
												result = data.ddt.progressivo;
											}
											return result;
										}},
										{"title": "Articolo", "name": "articolo", "data": null, render: function (data, type, row) {
											var result = '';
											if (data.articolo != null) {
												result = data.articolo.codice+' - '+data.articolo.descrizione;
											}
											return result;
										}},
										{"title": "Quantit&agrave;", "name": "quantita", "data": null, render: function (data, type, row) {
											var result = '';
											if (data.quantita != null) {
												result = data.quantita;
											}
											return result;
										}},
										{"title": "Prezzo (€)", "name": "prezzo", "data": null, render: function (data, type, row) {
											var result = '';
											if (data.prezzo != null) {
												result = data.prezzo;
											}
											return result;
										}},
										{"title": "Totale (€)", "name": "totale", "data": null, render: function (data, type, row) {
											var result = '';
											if (data.totale != null) {
												result = data.totale;
											}
											return result;
										}},
										{"title": "Lotto", "name": "lotto", "data": null, render: function (data, type, row) {
											var result = '';
											if (data.lotto != null) {
												result = data.lotto;
											}
											return result;
										}}
									]
								});
							}

						} else if(!$.fn.checkVariableIsNull(opzione) && opzione == 'RAGGRUPPA_DETTAGLIO'){

							if(result.statisticaArticoli != null && result.statisticaArticoli != undefined){
								if($.fn.DataTable.isDataTable( '#statisticheDdtArticoliTable' )){
									$('#statisticheDdtArticoliTable').DataTable().destroy();
								}

								$('#statisticheDdtArticoliTable').DataTable({
									"data": result.statisticaArticoli,
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
										[2, 'desc']
									],
									"autoWidth": false,
									"columns": [
										{"title": "Articolo", "name": "articolo", "data": null, render: function (data, type, row) {
											return data.codice+' - '+data.descrizione;
										}},
										{"title": "Tot. Quantit&agrave;", "name": "quantita", "data": null, render: function (data, type, row) {
											var result = '';
											if (data.totaleQuantitaVenduta != null) {
												result = data.totaleQuantitaVenduta;
											}
											return result;
										}},
										{"title": "Tot. venduto (€)", "name": "totale", "data": null, render: function (data, type, row) {
											var result = '';
											if (data.totaleVenduto != null) {
												result = data.totaleVenduto;
											}
											return result;
										}},
										{"title": "Tot. venduto medio", "name": "totale_medio", "data": null, render: function (data, type, row) {
											var result = '';
											if (data.totaleVendutoMedio != null) {
												result = data.totaleVendutoMedio;
											}
											return result;
										}}
									]
								});
							}
						}

						$('#statisticheTotaleVendutoTitle').removeClass('d-none');
						$('#statisticheQuantitaTotaleVendutaTitle').removeClass('d-none');
						$('#statisticheRigheTitle').removeClass('d-none');

						$('#alertStatistiche').empty();
					}
				},
				error: function(jqXHR, textStatus, errorThrown) {
					console.log('Response text: ' + jqXHR.responseText);
				}
			});

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