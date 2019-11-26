
var baseUrl = "/contafood-be/";

$(document).ready(function() {

	$('#scontiTable').DataTable({
		"ajax": {
			"url": baseUrl + "sconti",
			"type": "GET",
			"content-type": "json",
			"cache": false,
			"dataSrc": "",
			"error": function(jqXHR, textStatus, errorThrown) {
				console.log('Response text: ' + jqXHR.responseText);
				var alertContent = '<div id="alertScontoContent" class="alert alert-danger alert-dismissible fade show" role="alert">';
				alertContent = alertContent + '<strong>Errore nel recupero dei clienti</strong>\n' +
					'            <button type="button" class="close" data-dismiss="alert" aria-label="Close"><span aria-hidden="true">&times;</span></button></div>';
				$('#alertSconto').empty().append(alertContent);
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
			"emptyTable": "Nessuno sconto disponibile",
			"zeroRecords": "Nessuno sconto disponibile"
		},
		"pageLength": 20,
		"lengthChange": false,
		"info": false,
		"autoWidth": false,
		"order": [
			[0, 'asc']
		],
		"columns": [
			{"name": "cliente", "data": null, render: function ( data, type, row ) {
                return data.cliente.ragioneSociale;
            }},
            {"name": "fornitore", "data": null, render: function ( data, type, row ) {
                return data.fornitore.ragioneSociale;
            }},
            {"name": "articolo", "data": null, render: function ( data, type, row ) {
                return data.articolo.descrizione;
            }},
			{"name": "dataDal", "data": "dataDal"},
			{"name": "dataAl", "data": "dataAl"},
			{"name": "valore", "data": "valore"},
			{"data": null, "orderable":false, "width":"15%", render: function ( data, type, row ) {
				var links = '<a class="updateSconto pr-2" data-id="'+data.id+'" href="sconti-edit.html?idSconto=' + data.id + '"><i class="far fa-edit" title="Modifica"></i></a>';
				links = links + '<a class="deleteSconto" data-id="'+data.id+'" href="#"><i class="far fa-trash-alt" title="Elimina"></i></a>';
				return links;
			}}
		]
	});

	$(document).on('click','.deleteSconto', function(){
		var idSconto = $(this).attr('data-id');
		$('#confirmDeleteSconto').attr('data-id', idSconto);
		$('#deleteScontoModal').modal('show');
	});

	$(document).on('click','#confirmDeleteSconto', function(){
		$('#deleteScontoModal').modal('hide');
		var idSconto = $(this).attr('data-id');

		$.ajax({
			url: baseUrl + "sconti/" + idSconto,
			type: 'DELETE',
			success: function() {
				var alertContent = '<div id="alertScontoContent" class="alert alert-success alert-dismissible fade show" role="alert">';
				alertContent = alertContent + '<strong>Sconto</strong> cancellato con successo.\n' +
					'            <button type="button" class="close" data-dismiss="alert" aria-label="Close"><span aria-hidden="true">&times;</span></button></div>';
				$('#alertSconto').empty().append(alertContent);

				$('#scontiTable').DataTable().ajax.reload();
			},
			error: function(jqXHR, textStatus, errorThrown) {
				console.log('Response text: ' + jqXHR.responseText);
			}
		});
	});

	if($('#updateScontoButton') != null && $('#updateScontoButton') != undefined){
		$(document).on('submit','#updateScontoForm', function(event){
			event.preventDefault();

			var sconto = new Object();
			sconto.id = $('#hiddenIdSconto').val();
			if($('#cliente option:selected').val() != -1){
                var cliente = new Object();
                cliente.id = $('#cliente option:selected').val();
                sconto.cliente = cliente;
            };
			if($('#fornitore option:selected').val() != -1){
                var fornitore = new Object();
                fornitore.id = $('#fornitore option:selected').val();
                sconto.fornitore = fornitore;
            };
            if($('#articolo option:selected').val() != -1){
                var articolo = new Object();
                articolo.id = $('#articolo option:selected').val();
                articolo.fornitore = articolo;
            };
			sconto.dataDal = $('#dataDal').val();
			sconto.dataAl = $('#dataAl').val();
			sconto.valore = $('#valore').val();

			var scontoJson = JSON.stringify(sconto);

			var alertContent = '<div id="alertScontoContent" class="alert alert-@@alertResult@@ alert-dismissible fade show" role="alert">';
			alertContent = alertContent + '<strong>@@alertText@@</strong>\n' +
				'<button type="button" class="close" data-dismiss="alert" aria-label="Close"><span aria-hidden="true">&times;</span></button></div>';

			$.ajax({
				url: baseUrl + "sconti/" + $('#hiddenIdSconto').val(),
				type: 'PUT',
				contentType: "application/json",
				dataType: 'json',
				data: scontoJson,
				success: function(result) {
					$('#alertSconto').empty().append(alertContent.replace('@@alertText@@','Sconto modificato con successo').replace('@@alertResult@@', 'success'));
				},
				error: function(jqXHR, textStatus, errorThrown) {
					$('#alertSconto').empty().append(alertContent.replace('@@alertText@@','Errore nella modifica dello sconto').replace('@@alertResult@@', 'danger'));
				}
			});
		});
	}

	if($('#newScontoButton') != null && $('#newScontoButton') != undefined){
		$(document).on('submit','#newScontoForm', function(event){
			event.preventDefault();

			var sconto = new Object();
            if($('#cliente option:selected').val() != -1){
                var cliente = new Object();
                cliente.id = $('#cliente option:selected').val();
                sconto.cliente = cliente;
            };
            if($('#fornitore option:selected').val() != -1){
                var fornitore = new Object();
                fornitore.id = $('#fornitore option:selected').val();
                sconto.fornitore = fornitore;
            };
            if($('#articolo option:selected').val() != -1){
                var articolo = new Object();
                articolo.id = $('#articolo option:selected').val();
                articolo.fornitore = articolo;
            };
            sconto.dataDal = $('#dataDal').val();
            sconto.dataAl = $('#dataAl').val();
            sconto.valore = $('#valore').val();

            var scontoJson = JSON.stringify(sconto);

			var alertContent = '<div id="alertScontoContent" class="alert alert-@@alertResult@@ alert-dismissible fade show" role="alert">';
			alertContent = alertContent + '<strong>@@alertText@@</strong>\n' +
				'<button type="button" class="close" data-dismiss="alert" aria-label="Close"><span aria-hidden="true">&times;</span></button></div>';

			$.ajax({
				url: baseUrl + "sconti",
				type: 'POST',
				contentType: "application/json",
				dataType: 'json',
				data: scontoJson,
				success: function(result) {
					$('#alertSconto').empty().append(alertContent.replace('@@alertText@@','Sconto creato con successo').replace('@@alertResult@@', 'success'));
				},
				error: function(jqXHR, textStatus, errorThrown) {
					$('#alertSconto').empty().append(alertContent.replace('@@alertText@@','Errore nella creazione dello sconto').replace('@@alertResult@@', 'danger'));
				}
			});
		});
	}
});

$.fn.getClienti = function(){
	$.ajax({
		url: baseUrl + "clienti",
		type: 'GET',
		dataType: 'json',
		success: function(result) {
			if(result != null && result != undefined && result != ''){
				$.each(result, function(i, item){
					$('#cliente').append('<option value="'+item.id+'">'+item.ragioneSociale+'</option>');
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
					$('#fornitore').append('<option value="'+item.id+'">'+item.ragioneSociale+'</option>');
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
		url: baseUrl + "articoli",
		type: 'GET',
		dataType: 'json',
		success: function(result) {
			if(result != null && result != undefined && result != ''){
				$.each(result, function(i, item){
					$('#articolo').append('<option value="'+item.id+'">'+item.descrizione+'</option>');
				});
			}
		},
		error: function(jqXHR, textStatus, errorThrown) {
			console.log('Response text: ' + jqXHR.responseText);
		}
	});
}

$.fn.extractIdScontoFromUrl = function(){
    var pageUrl = window.location.search.substring(1);

	var urlVariables = pageUrl.split('&'),
        paramNames,
        i;

    for (i = 0; i < urlVariables.length; i++) {
        paramNames = urlVariables[i].split('=');

        if (paramNames[0] === 'idSconto') {
        	return paramNames[1] === undefined ? null : decodeURIComponent(paramNames[1]);
        }
    }
}

$.fn.getSconto = function(idSconto){

	var alertContent = '<div id="alertScontoContent" class="alert alert-danger alert-dismissible fade show" role="alert">';
	alertContent = alertContent + '<strong>Errore nel recupero dello sconto.</strong>\n' +
    					'<button type="button" class="close" data-dismiss="alert" aria-label="Close"><span aria-hidden="true">&times;</span></button></div>';

    $.ajax({
        url: baseUrl + "sconti/" + idSconto,
        type: 'GET',
        dataType: 'json',
        success: function(result) {
          if(result != null && result != undefined && result != ''){

			$('#hiddenIdSconto').attr('value', result.id);
			if(result.cliente != null && result.cliente != undefined){
                  $('#cliente option[value="' + result.cliente.id +'"]').attr('selected', true);
            };
			if(result.fornitore != null && result.fornitore != undefined){
                  $('#fornitore option[value="' + result.fornitore.id +'"]').attr('selected', true);
            };
            if(result.articolo != null && result.articolo != undefined){
                  $('#articolo option[value="' + result.articolo.id +'"]').attr('selected', true);
            };

			$('#dataDal').attr('value', result.dataDal);
            $('#dataAl').attr('value', result.dataAl);
            $('#valore').attr('value', result.valore);

          } else{
            $('#alertSconto').empty().append(alertContent);
          }
        },
        error: function(jqXHR, textStatus, errorThrown) {
            $('#alertSconto').empty().append(alertContent);
            $('#updateScontoButton').attr('disabled', true);
            console.log('Response text: ' + jqXHR.responseText);
        }
    });
}

