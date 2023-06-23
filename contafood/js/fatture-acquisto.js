var baseUrl = "/contafood-be/";

$.fn.loadEmptyFatturaAcquistoDdtAcquistoTable = function() {
	$('#fatturaAcquistoDdtAcquistoTable').DataTable({
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
			[1, 'desc'],
			[2, 'desc']
		]
	});
}

$(document).ready(function() {

	$.fn.loadEmptyFatturaAcquistoDdtAcquistoTable();

	if($('#newFatturaAcquistoButton') != null && $('#newFatturaAcquistoButton') != undefined){
		$(document).on('submit','#newFatturaAcquistoForm', function(event){
			event.preventDefault();

			var alertContent = '<div id="alertFattureAcquistoContent" class="alert alert-@@alertResult@@ alert-dismissible fade show" role="alert">';
			alertContent = alertContent + '<strong>@@alertText@@</strong>\n' +
				'<button type="button" class="close" data-dismiss="alert" aria-label="Close"><span aria-hidden="true">&times;</span></button></div>';

			var numChecked = $('.fatturaAcquistoDdtAcquistoCheckbox:checkbox:checked').length;
			if(numChecked == null || numChecked == undefined || numChecked == 0){
				$('#alertFattureAcquisto').empty().append(alertContent.replace('@@alertText@@','Selezionare almeno un DDT acquisto').replace('@@alertResult@@', 'danger'));
			} else{
				var fatturaAcquisto = new Object();
				fatturaAcquisto.numero = $('#numero').val();
				fatturaAcquisto.data = $('#data').val();

				var fornitore = new Object();
				fornitore.id = $('#fornitore option:selected').val();
				fatturaAcquisto.fornitore = fornitore;

				var causale = new Object();
				causale.id = $('#causale option:selected').val();
				fatturaAcquisto.causale = causale;

				var fatturaAcquistoDdtAcquisti = [];
				$('.fatturaAcquistoDdtAcquistoCheckbox:checkbox:checked').each(function(i, item) {
					var ddtAcquistoId = $(item).attr('data-id-documento');

					var fatturaAcquistoDdtAcquisto = {};
					var fatturaAcquistoDdtAcquistoId = new Object();
					fatturaAcquistoDdtAcquistoId.ddtAcquistoId = ddtAcquistoId;
					fatturaAcquistoDdtAcquisto.id = fatturaAcquistoDdtAcquistoId;

					fatturaAcquistoDdtAcquisti.push(fatturaAcquistoDdtAcquisto);
				});

				fatturaAcquisto.fatturaAcquistoDdtAcquisti = fatturaAcquistoDdtAcquisti;

				fatturaAcquisto.totale = $('#totale').val();
				fatturaAcquisto.totaleAcconto = 0;
				fatturaAcquisto.note = $('#note').val();

				var fatturaAcquistoJson = JSON.stringify(fatturaAcquisto);

				$.ajax({
					url: baseUrl + "fatture-acquisto",
					type: 'POST',
					contentType: "application/json",
					dataType: 'json',
					data: fatturaAcquistoJson,
					success: function(result) {
						$('#alertFattureAcquisto').empty().append(alertContent.replace('@@alertText@@','Fattura acquisto creata con successo').replace('@@alertResult@@', 'success'));

						$('#newFatturaAcquistoButton').attr("disabled", true);

						// Returns to the same page
						setTimeout(function() {
							window.location.href = "documenti-acquisto.html";
						}, 1000);
					},
					error: function(jqXHR, textStatus, errorThrown) {
						$('#alertFattureAcquisto').empty().append(alertContent.replace('@@alertText@@', 'Errore nella creazione della fattura acquisto').replace('@@alertResult@@', 'danger'));
					}
				});
			}

		});
	}

	if($('#updateFatturaAcquistoButton') != null && $('#updateFatturaAcquistoButton') != undefined && $('#updateFatturaAcquistoButton').length > 0){

		$(document).on('submit','#updateFatturaAcquistoForm', function(event){
			event.preventDefault();

			var alertContent = '<div id="alertFattureAcquistoContent" class="alert alert-@@alertResult@@ alert-dismissible fade show" role="alert">';
			alertContent = alertContent + '<strong>@@alertText@@</strong>\n' +
				'<button type="button" class="close" data-dismiss="alert" aria-label="Close"><span aria-hidden="true">&times;</span></button></div>';

			var fatturaAcquisto = new Object();
			fatturaAcquisto.id = parseInt($('#hiddenIdFatturaAcquisto').val());
			fatturaAcquisto.numero = $('#numero').val();
			fatturaAcquisto.data = $('#data').val();
			fatturaAcquisto.note = $('#note').val();

			var fatturaAcquistoJson = JSON.stringify(fatturaAcquisto);

			$.ajax({
				url: baseUrl + "fatture-acquisto/" + fatturaAcquisto.id,
				type: 'PATCH',
				contentType: "application/json",
				dataType: 'json',
				data: fatturaAcquistoJson,
				success: function(result) {
					$('#alertFattureAcquisto').empty().append(alertContent.replace('@@alertText@@','Fattura acquisto modificata con successo').replace('@@alertResult@@', 'success'));

					$('#updateFatturaAcquistoButton').attr("disabled", true);

					// Returns to the same page
					setTimeout(function() {
						window.location.href = "documenti-acquisto.html";
					}, 1000);
				},
				error: function(jqXHR, textStatus, errorThrown) {
					var errorMessage = 'Errore nella modifica della fattura acquisto';
					if(jqXHR != null && jqXHR != undefined){
						var jqXHRResponseJson = jqXHR.responseJSON;
						if(jqXHRResponseJson != null && jqXHRResponseJson != undefined && jqXHRResponseJson != ''){
							var jqXHRResponseJsonMessage = jqXHR.responseJSON.message;
							if(jqXHRResponseJsonMessage != null && jqXHRResponseJsonMessage != undefined && jqXHRResponseJsonMessage != '' && jqXHRResponseJsonMessage.indexOf('con progressivo') != -1){
								errorMessage = jqXHRResponseJsonMessage;
							}
						}
					}
					$('#alertFattureAcquisto').empty().append(alertContent.replace('@@alertText@@', errorMessage).replace('@@alertResult@@', 'danger'));
				}
			});
		});
	}
});

$.fn.getFornitori = function(){
	$.ajax({
		url: baseUrl + "fornitori?attivo=true",
		type: 'GET',
		dataType: 'json',
		success: function(result) {
			if(result != null && result != undefined && result != ''){
				$.each(result, function(i, item){
					var label = item.ragioneSociale;
					$('#fornitore').append('<option value="'+item.id+'">'+label+'</option>');
				});
			}
			$('#data').val(moment().format('YYYY-MM-DD'));

			$('#fornitore').focus();
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

$(document).on('change','#fornitore', function(){
	$.fn.loadDdtAcquistoDaFatturare();
});

$(document).on('change','#data', function(){
	$.fn.loadDdtAcquistoDaFatturare();
});

$.fn.getFatturaAcquisto = function(idFatturaAcquisto){
	$.ajax({
		url: baseUrl + "fatture-acquisto/" + idFatturaAcquisto,
		type: 'GET',
		dataType: 'json',
		success: function(result) {
			if(result != null && result != undefined && result != ''){
				$('#hiddenIdFatturaAcquisto').attr('value', result.id);
				$('#numero').attr('value', result.numero);
				$('#data').attr('value', result.data);
				$('#note').val(result.note);
			}
		},
		error: function(jqXHR, textStatus, errorThrown) {
			console.log('Response text: ' + jqXHR.responseText);
		}
	});
}

$.fn.loadDdtAcquistoDaFatturare = function(){
	var fornitore = $('#fornitore option:selected').val();
	var data = $('#data').val();
	if(fornitore != null && fornitore != ''){
		var dataString = moment().format('YYYY-MM-DD');
		if(data != null && data != ''){
			dataString = moment(data).format('YYYY-MM-DD');
		}

		$('#fatturaAcquistoDdtAcquistoTable').DataTable().destroy();

		var url = baseUrl + "documenti-acquisto/search?tipoDocumento=DDT acquisto&idFornitore="+fornitore+"&fatturato=false&dataA="+dataString;
		$('#fatturaAcquistoDdtAcquistoTable').DataTable({
			"ajax": {
				"url": url,
				"type": "GET",
				"content-type": "json",
				"cache": false,
				"dataSrc": "data",
				"error": function(jqXHR, textStatus, errorThrown) {
					console.log('Response text: ' + jqXHR.responseText);
					var alertContent = '<div id="alertFattureAcquistoContent" class="alert alert-danger alert-dismissible fade show" role="alert">';
					alertContent = alertContent + '<strong>Errore nel recupero dei DDT acquisto da fatturare</strong>\n' +
						'            <button type="button" class="close" data-dismiss="alert" aria-label="Close"><span aria-hidden="true">&times;</span></button></div>';
					$('#alertFattureAcquisto').empty().append(alertContent);
				}
			},
			"language": {
				"paginate": {
					"first": "Inizio",
					"last": "Fine",
					"next": "Succ.",
					"previous": "Prec."
				},
				"emptyTable": "Nessun DDT acquisto da fatturare",
				"zeroRecords": "Nessun DDT acquisto da fatturare"
			},
			"searching": false,
			"responsive":true,
			"pageLength": 20,
			"lengthChange": false,
			"info": false,
			"autoWidth": false,
			"order": [
				[0, 'desc'],
				[2, 'desc']
			],
			"columns": [
				{"name":"data", "data": "dataDocumento", "width":"5%", "visible": false},
				{"data": null, "orderable":false, "width": "2%", render: function ( data, type, row ) {
					var checkboxHtml = '<input type="checkbox" id="checkbox_'+data.id+'" data-id="'+data.id+'" data-tipo-documento="'+data.tipoDocumento+'" data-id-documento="'+data.idDocumento+'"  class="fatturaAcquistoDdtAcquistoCheckbox">';
					return checkboxHtml;
				}},
				{"name": "num_documento", "data": "numDocumento", "width":"5%"},
				{"name": "data_documento", "data": null, "width":"8%", render: function ( data, type, row ) {
					var a = moment(data.dataDocumento);
					return a.format('DD/MM/YYYY');
				}},
				{"name": "totale", "data": null, "width":"8%",render: function ( data, type, row ) {
					return $.fn.formatNumber(data.totale);
				}}
			],
			"createdRow": function(row, data, dataIndex,cells){
				$(cells[1]).css('text-align','center');
				$(cells[2]).css('text-align','center');
				$(cells[3]).css('text-align','center');
				$(cells[4]).css('text-align','center').addClass('ddtTotale');
			}
		});
	} else {
		$('#fatturaDdtTable').DataTable().clear();
		$('#fatturaDdtTable').DataTable().destroy();
		$.fn.loadEmptyFatturaDdtTable();
	}
}

$.fn.extractIdFatturaAcquistoFromUrl = function(){
    var pageUrl = window.location.search.substring(1);

	var urlVariables = pageUrl.split('&'),
        paramNames,
        i;

    for (i = 0; i < urlVariables.length; i++) {
        paramNames = urlVariables[i].split('=');

        if (paramNames[0] === 'idFatturaAcquisto') {
        	return paramNames[1] === undefined ? null : decodeURIComponent(paramNames[1]);
        }
    }
}

$(document).on('change','.fatturaAcquistoDdtAcquistoCheckbox', function(){
	var numChecked = $('.fatturaAcquistoDdtAcquistoCheckbox:checkbox:checked').length;
	if(numChecked == null || numChecked == undefined || numChecked == 0){
		$('#totale').val(null);
	} else{
		var totale = 0;
		$('.fatturaAcquistoDdtAcquistoCheckbox:checkbox:checked').each(function(i, item) {
			$(this).parent().parent().find('.ddtTotale').each(function( index ) {
				totale += parseFloat($(this).text());
			});
		});
		$('#totale').val(parseFloat(Number(Math.round(totale+'e2')+'e-2')).toFixed(2));
	};
});