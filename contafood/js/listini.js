var baseUrl = "/contafood-be/";

$(document).ready(function() {

	$('#listiniTable').DataTable({
		"ajax": {
			"url": baseUrl + "listini",
			"type": "GET",
			"content-type": "json",
			"cache": false,
			"dataSrc": "",
			"error": function(jqXHR, textStatus, errorThrown) {
				console.log('Response text: ' + jqXHR.responseText);
				var alertContent = '<div id="alertListinoContent" class="alert alert-danger alert-dismissible fade show" role="alert">';
				alertContent = alertContent + '<strong>Errore nel recupero dei listini</strong>\n' +
					'            <button type="button" class="close" data-dismiss="alert" aria-label="Close"><span aria-hidden="true">&times;</span></button></div>';
				$('#alertListino').empty().append(alertContent);
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
			"emptyTable": "Nessun listino disponibile",
			"zeroRecords": "Nessun listino disponibile"
		},
		"pageLength": 20,
		"lengthChange": false,
		"info": false,
		"autoWidth": false,
		"order": [
			[0, 'asc']
		],
		"columns": [
			{"name": "nome", "data": "nome"},
			{"name": "listinoRiferimento", "data": null, "orderable":true, render: function ( data, type, row ) {
                if(data.listinoRiferimento != null){
                    return data.listinoRiferimento.nome;
                } else{
                    return '';
                }
            }},
			{"data": null, "orderable":false, "width":"8%", render: function ( data, type, row ) {
				var links = '<a class="updateListino pr-2" data-id="'+data.id+'" href="listini-edit.html?idListino=' + data.id + '"><i class="far fa-edit"></i></a>';
				links = links + '<a class="deleteListino" data-id="'+data.id+'" href="#"><i class="far fa-trash-alt"></i></a>';
				return links;
			}}
		]
	});

	$(document).on('click','.deleteListino', function(){
		var idListino = $(this).attr('data-id');
		$('#confirmDeleteListino').attr('data-id', idListino);
		$('#deleteListinoModal').modal('show');
	});

	$(document).on('click','#confirmDeleteListino', function(){
		$('#deleteListinoModal').modal('hide');
		var idListino = $(this).attr('data-id');

		$.ajax({
			url: baseUrl + "listini/" + idListino,
			type: 'DELETE',
			success: function() {
				var alertContent = '<div id="alertListinoContent" class="alert alert-success alert-dismissible fade show" role="alert">';
				alertContent = alertContent + '<strong>Listino</strong> cancellato con successo.\n' +
					'            <button type="button" class="close" data-dismiss="alert" aria-label="Close"><span aria-hidden="true">&times;</span></button></div>';
				$('#alertListino').empty().append(alertContent);

				$('#listiniTable').DataTable().ajax.reload();
			},
			error: function(jqXHR, textStatus, errorThrown) {
				console.log('Response text: ' + jqXHR.responseText);

				var alertContent = '<div id="alertListinoContent" class="alert alert-danger alert-dismissible fade show" role="alert">';
                alertContent = alertContent + '<strong>Errore</strong> nella cancellazione del listino' +
                    '            <button type="button" class="close" data-dismiss="alert" aria-label="Close"><span aria-hidden="true">&times;</span></button></div>';
                $('#alertListino').empty().append(alertContent);

                $('#listiniTable').DataTable().ajax.reload();
			}
		});
	});

	if($('#updateListinoButton') != null && $('#updateListinoButton') != undefined){
		$(document).on('submit','#updateListinoForm', function(event){
			event.preventDefault();

			var listino = new Object();
			listino.id = $('#hiddenIdListino').val();
			listino.nome = $('#nome').val();
			var listinoRiferimentoId = $('#listinoRiferimento option:selected').val();
			if(listinoRiferimentoId != null && listinoRiferimentoId != '' && listinoRiferimentoId != '-1'){
			    var listinoRiferimento = new Object();
                listinoRiferimento.id = listinoRiferimentoId;
                listino.listinoRiferimento = listinoRiferimento;
			}

			var listinoJson = JSON.stringify(listino);

			var alertContent = '<div id="alertListinoContent" class="alert alert-@@alertResult@@ alert-dismissible fade show" role="alert">';
			alertContent = alertContent + '<strong>@@alertText@@</strong>\n' +
				'<button type="button" class="close" data-dismiss="alert" aria-label="Close"><span aria-hidden="true">&times;</span></button></div>';

			$.ajax({
				url: baseUrl + "listini/" + $('#hiddenIdListino').val(),
				type: 'PUT',
				contentType: "application/json",
				dataType: 'json',
				data: listinoJson,
				success: function(result) {
					$('#alertListino').empty().append(alertContent.replace('@@alertText@@','Listino modificato con successo').replace('@@alertResult@@', 'success'));
				},
				error: function(jqXHR, textStatus, errorThrown) {
					$('#alertListino').empty().append(alertContent.replace('@@alertText@@','Errore nella modifica del listino').replace('@@alertResult@@', 'danger'));
				}
			});
		});
	}

	if($('#newListinoButton') != null && $('#newListinoButton') != undefined){
		$(document).on('submit','#newListinoForm', function(event){
			event.preventDefault();

			var listino = new Object();
            listino.nome = $('#nome').val();
            var listinoRiferimentoId = $('#listinoRiferimento option:selected').val();
            if(listinoRiferimentoId != null && listinoRiferimentoId != '' && listinoRiferimentoId != '-1'){
                var listinoRiferimento = new Object();
                listinoRiferimento.id = listinoRiferimentoId;
                listino.listinoRiferimento = listinoRiferimento;
            }

			var listinoJson = JSON.stringify(listino);

			var alertContent = '<div id="alertListinoContent" class="alert alert-@@alertResult@@ alert-dismissible fade show" role="alert">';
			alertContent = alertContent + '<strong>@@alertText@@</strong>\n' +
				'<button type="button" class="close" data-dismiss="alert" aria-label="Close"><span aria-hidden="true">&times;</span></button></div>';

			$.ajax({
				url: baseUrl + "listini",
				type: 'POST',
				contentType: "application/json",
				dataType: 'json',
				data: listinoJson,
				success: function(result) {
					$('#alertListino').empty().append(alertContent.replace('@@alertText@@','Listino creato con successo').replace('@@alertResult@@', 'success'));
				},
				error: function(jqXHR, textStatus, errorThrown) {
					$('#alertListino').empty().append(alertContent.replace('@@alertText@@','Errore nella creazione del listino').replace('@@alertResult@@', 'danger'));
				}
			});
		});
	}
});

$.fn.extractIdListinoFromUrl = function(){
    var pageUrl = window.location.search.substring(1);

	var urlVariables = pageUrl.split('&'),
        paramNames,
        i;

    for (i = 0; i < urlVariables.length; i++) {
        paramNames = urlVariables[i].split('=');

        if (paramNames[0] === 'idListino') {
        	return paramNames[1] === undefined ? null : decodeURIComponent(paramNames[1]);
        }
    }
}

$.fn.getListiniRiferimento = function(idListino){
	$.ajax({
		url: baseUrl + "listini",
		type: 'GET',
		dataType: 'json',
		success: function(result) {
			if(result != null && result != undefined && result != ''){
				$.each(result, function(i, item){
					if(idListino != null && idListino != undefined && idListino != ''){
					    if(idListino != item.id){
					        $('#listinoRiferimento').append('<option value="'+item.id+'">'+item.nome+'</option>');
					    }
					} else {
					    $('#listinoRiferimento').append('<option value="'+item.id+'">'+item.nome+'</option>');
					}
				});
			}
		},
		error: function(jqXHR, textStatus, errorThrown) {
			console.log('Response text: ' + jqXHR.responseText);
		}
	});
}

$.fn.getListino = function(idListino){

	var alertContent = '<div id="alertListinoContent" class="alert alert-danger alert-dismissible fade show" role="alert">';
	alertContent = alertContent + '<strong>Errore nel recupero del listino.</strong>\n' +
    					'<button type="button" class="close" data-dismiss="alert" aria-label="Close"><span aria-hidden="true">&times;</span></button></div>';

    // load listini riferimento
    $.fn.getListiniRiferimento(idListino);

    $.ajax({
        url: baseUrl + "listini/" + idListino,
        type: 'GET',
        dataType: 'json',
        success: function(result) {
          if(result != null && result != undefined && result != ''){

			$('#hiddenIdListino').attr('value', result.id);
			$('#nome').attr('value', result.nome);
            if(result.listinoRiferimento != null && result.listinoRiferimento != undefined){
                $('#listinoRiferimento option[value=' + result.listinoRiferimento.id +']').attr('selected', true);
            }

          } else{
            $('#alertListino').empty().append(alertContent);
          }
        },
        error: function(jqXHR, textStatus, errorThrown) {
            $('#alertListino').empty().append(alertContent);
            $('#updateListinoButton').attr('disabled', true);
            console.log('Response text: ' + jqXHR.responseText);
        }
    });
}
