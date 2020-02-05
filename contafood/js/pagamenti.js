var baseUrl = "/contafood-be/";

$(document).ready(function() {

	$('#pagamentiTable').DataTable({
		"ajax": {
			"url": baseUrl + "pagamenti",
			"type": "GET",
			"content-type": "json",
			"cache": false,
			"dataSrc": "",
			"error": function(jqXHR, textStatus, errorThrown) {
				console.log('Response text: ' + jqXHR.responseText);
				var alertContent = '<div id="alertTipoPagamentoContent" class="alert alert-danger alert-dismissible fade show" role="alert">';
				alertContent = alertContent + '<strong>Errore nel recupero dei tipi di pagamento</strong>\n' +
					'            <button type="button" class="close" data-dismiss="alert" aria-label="Close"><span aria-hidden="true">&times;</span></button></div>';
				$('#alertTipoPagamento').empty().append(alertContent);
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
			"emptyTable": "Nessun tipo di pagamento disponibile",
			"zeroRecords": "Nessun tipo di pagamento disponibile"
		},
		"pageLength": 20,
		"lengthChange": false,
		"info": false,
		"autoWidth": false,
		"order": [
			[0, 'asc']
		],
		"columns": [
			{"name": "descrizione", "data": "descrizione"},
			{"name": "scadenzaGiorni", "data": "scadenzaGiorni"},
			{"data": null, "orderable":false, "width":"8%", render: function ( data, type, row ) {
				var links = '<a class="updateTipoPagamento pr-2" data-id="'+data.id+'" href="tipi-pagamento-edit.html?idTipoPagamento=' + data.id + '"><i class="far fa-edit"></i></a>';
				links = links + '<a class="deleteTipoPagamento" data-id="'+data.id+'" href="#"><i class="far fa-trash-alt"></i></a>';
				return links;
			}}
		]
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
			url: baseUrl + "pagamenti/" + idPagamento,
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

	if($('#newPagamentoButton') != null && $('#newPagamentoButton') != undefined){
		$(document).on('submit','#newTipoPagamentoForm', function(event){
			event.preventDefault();

			var tipoPagamento = new Object();
			tipoPagamento.descrizione = $('#descrizione').val();
			tipoPagamento.scadenzaGiorni = $('#scadenzaGiorni').val();

			var tipoPagamentoJson = JSON.stringify(tipoPagamento);

			var alertContent = '<div id="alertTipoPagamentoContent" class="alert alert-@@alertResult@@ alert-dismissible fade show" role="alert">';
			alertContent = alertContent + '<strong>@@alertText@@</strong>\n' +
				'<button type="button" class="close" data-dismiss="alert" aria-label="Close"><span aria-hidden="true">&times;</span></button></div>';

			$.ajax({
				url: baseUrl + "tipi-pagamento",
				type: 'POST',
				contentType: "application/json",
				dataType: 'json',
				data: tipoPagamentoJson,
				success: function(result) {
					$('#alertTipoPagamento').empty().append(alertContent.replace('@@alertText@@','Tipo pagamento creato con successo').replace('@@alertResult@@', 'success'));
				},
				error: function(jqXHR, textStatus, errorThrown) {
					$('#alertTipoPagamento').empty().append(alertContent.replace('@@alertText@@','Errore nella creazione del tipo pagamento').replace('@@alertResult@@', 'danger'));
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

				var cliente = ddt.cliente;
				if(cliente != null && cliente != undefined && cliente != ''){
					var clienteTipoPagamento = cliente.tipoPagamento;
					if(tipoPagamento != null && tipoPagamento != undefined && tipoPagamento != ''){
						$('#tipoPagamento option[value="' + tipoPagamento.id +'"]').attr('selected', true);
					}
				}
			}
		},
		error: function(jqXHR, textStatus, errorThrown) {
			console.log('Response text: ' + jqXHR.responseText);
		}
	});
}
