var baseUrl = "/contafood-be/";

$(document).ready(function() {

	$('#confezioniTable').DataTable({
		"ajax": {
			"url": baseUrl + "confezioni",
			"type": "GET",
			"content-type": "json",
			"cache": false,
			"dataSrc": "",
			"error": function(jqXHR, textStatus, errorThrown) {
				console.log('Response text: ' + jqXHR.responseText);
				var alertContent = '<div id="alertConfezioneContent" class="alert alert-danger alert-dismissible fade show" role="alert">';
				alertContent = alertContent + '<strong>Errore nel recupero delle confezioni</strong>\n' +
					'            <button type="button" class="close" data-dismiss="alert" aria-label="Close"><span aria-hidden="true">&times;</span></button></div>';
				$('#alertConfezione').empty().append(alertContent);
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
			"emptyTable": "Nessuna confezione disponibile",
			"zeroRecords": "Nessuna confezione disponibile"
		},
		"pageLength": 20,
		"lengthChange": false,
		"info": false,
		"autoWidth": false,
		"order": [
			[0, 'asc']
		],
		"columns": [
			{"name": "tipo", "data": "tipo"},
			{"name": "peso", "data": "peso"},
			{"data": null, "orderable":false, "width":"8%", render: function ( data, type, row ) {
				var links = '<a class="updateConfezione pr-2" data-id="'+data.id+'" href="confezioni-edit.html?idConfezione=' + data.id + '"><i class="far fa-edit"></i></a>';
				links = links + '<a class="deleteConfezione" data-id="'+data.id+'" href="#"><i class="far fa-trash-alt"></i></a>';
				return links;
			}}
		]
	});

	$(document).on('click','.deleteConfezione', function(){
		var idConfezione = $(this).attr('data-id');
		$('#confirmDeleteConfezione').attr('data-id', idConfezione);
		$('#deleteConfezioneModal').modal('show');
	});

	$(document).on('click','#confirmDeleteConfezione', function(){
		$('#deleteConfezioneModal').modal('hide');
		var idConfezione = $(this).attr('data-id');

		$.ajax({
			url: baseUrl + "confezioni/" + idConfezione,
			type: 'DELETE',
			success: function() {
				var alertContent = '<div id="alertConfezioneContent" class="alert alert-success alert-dismissible fade show" role="alert">';
				alertContent = alertContent + '<strong>Confezione</strong> cancellata con successo.\n' +
					'            <button type="button" class="close" data-dismiss="alert" aria-label="Close"><span aria-hidden="true">&times;</span></button></div>';
				$('#alertConfezione').empty().append(alertContent);

				$('#confezioniTable').DataTable().ajax.reload();
			},
			error: function(jqXHR, textStatus, errorThrown) {
				console.log('Response text: ' + jqXHR.responseText);

				var alertContent = '<div id="alertConfezioneContent" class="alert alert-danger alert-dismissible fade show" role="alert">';
                alertContent = alertContent + '<strong>Errore</strong> nella cancellazione della confezione' +
                    '            <button type="button" class="close" data-dismiss="alert" aria-label="Close"><span aria-hidden="true">&times;</span></button></div>';
                $('#alertConfezione').empty().append(alertContent);

                $('#confezioniTable').DataTable().ajax.reload();
			}
		});
	});

	if($('#updateConfezioneButton') != null && $('#updateConfezioneButton') != undefined){
		$(document).on('submit','#updateConfezioneForm', function(event){
			event.preventDefault();

			var confezione = new Object();
			confezione.id = $('#hiddenIdConfezione').val();
			confezione.tipo = $('#tipo').val();
			confezione.peso = $('#peso').val();

			var confezioneJson = JSON.stringify(confezione);

			var alertContent = '<div id="alertConfezioneContent" class="alert alert-@@alertResult@@ alert-dismissible fade show" role="alert">';
			alertContent = alertContent + '<strong>@@alertText@@</strong>\n' +
				'<button type="button" class="close" data-dismiss="alert" aria-label="Close"><span aria-hidden="true">&times;</span></button></div>';

			$.ajax({
				url: baseUrl + "confezioni/" + $('#hiddenIdConfezione').val(),
				type: 'PUT',
				contentType: "application/json",
				dataType: 'json',
				data: confezioneJson,
				success: function(result) {
					$('#alertConfezione').empty().append(alertContent.replace('@@alertText@@','Confezione modificata con successo').replace('@@alertResult@@', 'success'));
				},
				error: function(jqXHR, textStatus, errorThrown) {
					$('#alertConfezione').empty().append(alertContent.replace('@@alertText@@','Errore nella modifica della confezione').replace('@@alertResult@@', 'danger'));
				}
			});
		});
	}

	if($('#newConfezioneButton') != null && $('#newConfezioneButton') != undefined){
		$(document).on('submit','#newConfezioneForm', function(event){
			event.preventDefault();

			var confezione = new Object();
			confezione.tipo = $('#tipo').val();
			confezione.peso = $('#peso').val();

			var confezioneJson = JSON.stringify(confezione);

			var alertContent = '<div id="alertConfezioneContent" class="alert alert-@@alertResult@@ alert-dismissible fade show" role="alert">';
			alertContent = alertContent + '<strong>@@alertText@@</strong>\n' +
				'<button type="button" class="close" data-dismiss="alert" aria-label="Close"><span aria-hidden="true">&times;</span></button></div>';

			$.ajax({
				url: baseUrl + "confezioni",
				type: 'POST',
				contentType: "application/json",
				dataType: 'json',
				data: confezioneJson,
				success: function(result) {
					$('#alertConfezione').empty().append(alertContent.replace('@@alertText@@','Confezione creata con successo').replace('@@alertResult@@', 'success'));
				},
				error: function(jqXHR, textStatus, errorThrown) {
					$('#alertConfezione').empty().append(alertContent.replace('@@alertText@@','Errore nella creazione della confezione').replace('@@alertResult@@', 'danger'));
				}
			});
		});
	}
});

$.fn.extractIdConfezioneFromUrl = function(){
    var pageUrl = window.location.search.substring(1);

	var urlVariables = pageUrl.split('&'),
        paramNames,
        i;

    for (i = 0; i < urlVariables.length; i++) {
        paramNames = urlVariables[i].split('=');

        if (paramNames[0] === 'idConfezione') {
        	return paramNames[1] === undefined ? null : decodeURIComponent(paramNames[1]);
        }
    }
}

$.fn.getConfezione = function(idConfezione){

	var alertContent = '<div id="alertConfezioneContent" class="alert alert-danger alert-dismissible fade show" role="alert">';
	alertContent = alertContent + '<strong>Errore nel recupero della confezione.</strong>\n' +
    					'<button type="button" class="close" data-dismiss="alert" aria-label="Close"><span aria-hidden="true">&times;</span></button></div>';

    $.ajax({
        url: baseUrl + "confezioni/" + idConfezione,
        type: 'GET',
        dataType: 'json',
        success: function(result) {
          if(result != null && result != undefined && result != ''){

			$('#hiddenIdConfezione').attr('value', result.id);
			$('#tipo').attr('value', result.tipo);
            $('#peso').attr('value', result.peso);

          } else{
            $('#alertConfezione').empty().append(alertContent);
          }
        },
        error: function(jqXHR, textStatus, errorThrown) {
            $('#alertConfezione').empty().append(alertContent);
            $('#updateConfezioneButton').attr('disabled', true);
            console.log('Response text: ' + jqXHR.responseText);
        }
    });
}
