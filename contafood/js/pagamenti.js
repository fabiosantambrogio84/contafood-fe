var baseUrl = "/contafood-be/";

$.fn.loadPagamentiTable = function(url) {
	$('#pagamentiTable').DataTable({
		"ajax": {
			"url": url,
			"type": "GET",
			"content-type": "json",
			"cache": false,
			"dataSrc": "",
			"error": function(jqXHR, textStatus, errorThrown) {
				console.log('Response text: ' + jqXHR.responseText);
				var alertContent = '<div id="alertPagamentoContent" class="alert alert-danger alert-dismissible fade show" role="alert">';
				alertContent = alertContent + '<strong>Errore nel recupero dei pagamenti</strong>\n' +
					'            <button type="button" class="close" data-dismiss="alert" aria-label="Close"><span aria-hidden="true">&times;</span></button></div>';
				$('#alertPagamento').empty().append(alertContent);
			}
		},
		"language": {
			//"search": "Cerca",
			"paginate": {
				"first": "Inizio",
				"last": "Fine",
				"next": "Succ.",
				"previous": "Prec."
			},
			"emptyTable": "Nessun pagamento disponibile",
			"zeroRecords": "Nessun pagamento disponibile"
		},
		"searching":false,
		"pageLength": 20,
		"lengthChange": false,
		"info": false,
		"autoWidth": false,
		"order": [
			[0, 'asc']
		],
		"columns": [
			{"name": "data", "data": null, "width":"5%", render: function ( data, type, row ) {
					var a = moment(data.data);
					return a.format('DD/MM/YYYY');
				}},
			{"name": "cliente", "data": null, "width":"8%", render: function ( data, type, row ) {
					var clienteHtml = '';
					var ddt = data.ddt;
					if(ddt != null && ddt != undefined && ddt != ''){
						var cliente = ddt.cliente;
						if(cliente != null && cliente != undefined && cliente != ''){
							if(cliente.dittaIndividuale){
								clienteHtml += cliente.nome + ' - ' + cliente.cognome;
							} else {
								clienteHtml += cliente.ragioneSociale;
							}
						}
					}
					return clienteHtml;
				}},
			{"name": "descrizione", "data": "descrizione", "width":"12%"},
			{"name": "importo", "data": "importo", "width":"5%"},
			{"name": "tipoPagamento", "data": null, "width":"5%", render: function ( data, type, row ) {
					var tipoPagamento = data.tipoPagamento;
					if(tipoPagamento != null && tipoPagamento != undefined && tipoPagamento != ''){
						return tipoPagamento.descrizione;
					}
					return '';
				}},
			{"name": "note", "data": null, "width": "12%", render: function ( data, type, row ) {
					var note = data.note;
					var noteTrunc = note;
					var noteHtml = '<div>'+noteTrunc+'</div>';
					if(note.length > 100){
						noteTrunc = note.substring(0, 100)+'...';
						noteHtml = '<div data-toggle="tooltip" data-placement="bottom" title="'+note+'">'+noteTrunc+'</div>';
					}

					return noteHtml;
				}},
			{"data": null, "orderable":false, "width":"2%", render: function ( data, type, row ) {
					var links = '<a class="deletePagamento" data-id="'+data.id+'" href="#"><i class="far fa-trash-alt"></i></a>';
					return links;
				}}
		],
		"initComplete": function( settings, json ) {
			$('[data-toggle="tooltip"]').tooltip();
		},
		"createdRow": function(row, data, dataIndex,cells){
			$(row).css('font-size', '12px');
		}
	});
}


$(document).ready(function() {
	$('[data-toggle="tooltip"]').tooltip();

	$.fn.loadPagamentiTable(baseUrl + "ddts/pagamenti");

	$(document).on('click','#resetSearchPagamentoButton', function(){
		$('#searchPagamentoForm :input').val(null);
		$('#searchPagamentoForm select option[value=""]').attr('selected', true);

		$('#pagamentiTable').DataTable().destroy();
		$.fn.loadPagamentiTable(baseUrl + "ddts/pagamenti");
	});

	$(document).on('click','.deletePagamento', function(){
		var idPagamento = $(this).attr('data-id');
		$('#confirmDeletePagamento').attr('data-id', idPagamento);
		$('#deletePagamentoModal').modal('show');
	});

	$(document).on('click','#confirmDeletePagamento', function(){
		$('#deletePagamentoModal').modal('hide');
		var idPagamento = $(this).attr('data-id');

		$.ajax({
			url: baseUrl + "ddts/pagamenti/" + idPagamento,
			type: 'DELETE',
			success: function() {
				var alertContent = '<div id="alertPagamentoContent" class="alert alert-success alert-dismissible fade show" role="alert">';
				alertContent = alertContent + '<strong>Pagamento</strong> cancellato con successo.\n' +
					'            <button type="button" class="close" data-dismiss="alert" aria-label="Close"><span aria-hidden="true">&times;</span></button></div>';
				$('#alertPagamento').empty().append(alertContent);

				$('#pagamentiTable').DataTable().ajax.reload();
			},
			error: function(jqXHR, textStatus, errorThrown) {
				console.log('Response text: ' + jqXHR.responseText);

				var alertContent = '<div id="alertPagamentoContent" class="alert alert-danger alert-dismissible fade show" role="alert">';
                alertContent = alertContent + '<strong>Errore</strong> nella cancellazione del pagamento' +
                    '            <button type="button" class="close" data-dismiss="alert" aria-label="Close"><span aria-hidden="true">&times;</span></button></div>';
                $('#alertPagamento').empty().append(alertContent);

                $('#pagamentiTable').DataTable().ajax.reload();
			}
		});
	});

	if($('#searchPagamentoButton') != null && $('#searchPagamentoButton') != undefined) {
		$(document).on('submit', '#searchPagamentoForm', function (event) {
			event.preventDefault();

			var dataDa = $('#searchDataFrom').val();
			var dataA = $('#searchDataTo').val();
			var cliente = $('#searchCliente').val();
			var importo = $('#searchImporto').val();

			var params = {};
			if(dataDa != null && dataDa != undefined && dataDa != ''){
				params.dataDa = dataDa;
			}
			if(dataA != null && dataA != undefined && dataA != ''){
				params.dataA = dataA;
			}
			if(cliente != null && cliente != undefined && cliente != ''){
				params.cliente = cliente;
			}
			if(importo != null && importo != undefined && importo != ''){
				params.importo = importo;
			}
			var url = baseUrl + "ddts/pagamenti?" + $.param( params );

			$('#pagamentiTable').DataTable().destroy();
			$.fn.loadPagamentiTable(url);
		});
	}

	if($('#newPagamentoButton') != null && $('#newPagamentoButton') != undefined){
		$(document).on('submit','#newPagamentoForm', function(event){
			event.preventDefault();

			var idDdt = $('#hiddenIdDdt').val();

			var pagamento = new Object();
			pagamento.data = $('#data').val();
			pagamento.descrizione = $('#descrizione').val();

			var tipoPagamento = new Object();
			tipoPagamento.id = $('#tipoPagamento option:selected').val();
			pagamento.tipoPagamento = tipoPagamento;

			var ddt = new Object();
			ddt.id = idDdt;
			pagamento.ddt = ddt;

			pagamento.importo = $('#importo').val();
			pagamento.note = $('#note').val();

			var pagamentoJson = JSON.stringify(pagamento);

			var alertContent = '<div id="alertPagamentoContent" class="alert alert-@@alertResult@@ alert-dismissible fade show" role="alert">';
			alertContent = alertContent + '<strong>@@alertText@@</strong>\n' +
				'<button type="button" class="close" data-dismiss="alert" aria-label="Close"><span aria-hidden="true">&times;</span></button></div>';

			$.ajax({
				url: baseUrl + "ddts/"+idDdt+"/pagamenti",
				type: 'POST',
				contentType: "application/json",
				dataType: 'json',
				data: pagamentoJson,
				success: function(result) {
					$('#alertPagamento').empty().append(alertContent.replace('@@alertText@@','Pagamento creato con successo').replace('@@alertResult@@', 'success'));

					$('#newPagamentoButton').attr("disabled", true);

					// Returns to the page with the list of DDTs
					setTimeout(function() {
						window.location.href = "ddt.html";
					}, 1000);
				},
				error: function(jqXHR, textStatus, errorThrown) {
					var errorMessage = 'Errore nella creazione del pagamento';
					if(jqXHR != null && jqXHR != undefined){
						var jqXHRResponseJson = jqXHR.responseJSON;
						if(jqXHRResponseJson != null && jqXHRResponseJson != undefined && jqXHRResponseJson != ''){
							var jqXHRResponseJsonMessage = jqXHR.responseJSON.message;
							if(jqXHRResponseJsonMessage != null && jqXHRResponseJsonMessage != undefined && jqXHRResponseJsonMessage != '' && jqXHRResponseJsonMessage.indexOf('importo del pagamento') != -1){
								errorMessage = jqXHRResponseJsonMessage;
							}
						}
					}
					$('#alertPagamento').empty().append(alertContent.replace('@@alertText@@',errorMessage).replace('@@alertResult@@', 'danger'));
				}
			});
		});
	}
});

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

$.fn.getTipiPagamento = function(){
	$.ajax({
		url: baseUrl + "tipi-pagamento",
		type: 'GET',
		dataType: 'json',
		success: function(result) {
			if(result != null && result != undefined && result != ''){
				$.each(result, function(i, item){
					var label = item.descrizione;
					$('#tipoPagamento').append('<option value="'+item.id+'" >'+label+'</option>');
				});

				$('#data').val(moment().format('YYYY-MM-DD'));
			}
		},
		error: function(jqXHR, textStatus, errorThrown) {
			console.log('Response text: ' + jqXHR.responseText);
		}
	});
}

$.fn.getDdt = function(idDdt){
	$.ajax({
		url: baseUrl + "ddts/" + idDdt,
		type: 'GET',
		dataType: 'json',
		success: function(result) {
			if(result != null && result != undefined && result != ''){
				var totaleAcconto = result.totaleAcconto;
				var totale = result.totale;

				if(totaleAcconto == null || totaleAcconto == undefined || totaleAcconto == ''){
					totaleAcconto = 0;
				}

				if(totale == null || totale == undefined || totale == ''){
					totale = 0;
				}

				var importo = (totale - totaleAcconto);
				$('#importo').val(Number(Math.round(importo+'e2')+'e-2'));

				var cliente = result.cliente;
				if(cliente != null && cliente != undefined && cliente != ''){
					var clienteTipoPagamento = cliente.tipoPagamento;
					if(clienteTipoPagamento != null && clienteTipoPagamento != undefined && clienteTipoPagamento != ''){
						$('#tipoPagamento option[value="' + clienteTipoPagamento.id +'"]').attr('selected', true);
					}
				}

				var descrizione = "Pagamento DDT n. "+result.progressivo+" del "+moment(result.data).format('DD/MM/YYYY');
				$('#descrizione').val(descrizione);

				$('#hiddenIdDdt').val(result.id);
			}
		},
		error: function(jqXHR, textStatus, errorThrown) {
			console.log('Response text: ' + jqXHR.responseText);
		}
	});
}
