var baseUrl = "http://localhost:8090/contafood-be/";

$(document).ready(function() {

	$('#ingredientiTable').DataTable({
		"ajax": {
			"url": baseUrl + "ingredienti",
			"type": "GET",
			"content-type": "json",
			"cache": false,
			"dataSrc": "",
			"error": function(jqXHR, textStatus, errorThrown) {
				console.log('Response text: ' + jqXHR.responseText);
				var alertContent = '<strong>Errore nel recupero degli ingredienti</strong>\n' +
					'            <button type="button" class="close" data-dismiss="alert" aria-label="Close"><span aria-hidden="true">&times;</span></button>';
				$('#alertIngrediente').addClass('alert alert-danger alert-dismissible fade show').attr('role','alert');
				$('#alertIngrediente').html(alertContent);
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
			"emptyTable": "Nessun ingrediente disponibile",
			"zeroRecords": "Nessun ingrediente disponibile"
		},
		"pageLength": 20,
		"lengthChange": false,
		"info": false,
		"columns": [
			{"name": "codice", "data": "codice"},
			{"name": "descrizione", "data": "descrizione"},
			{"name": "prezzo", "data": "prezzo"},
			{"data": null, render: function ( data, type, row ) {
				var links = '<a class="updateIngrediente pr-2" data-id="'+data.id+'" href="ingredienti-edit.html?idIngrediente=' + data.id + '"><i class="far fa-edit"></i></a>';
				links = links + '<a class="deleteIngrediente" data-id="'+data.id+'" href="#"><i class="far fa-trash-alt"></i></a>';
				return links;
			}}
		]
	});

	$(document).on('click','.deleteIngrediente', function(){
		var idIngrediente = $(this).attr('data-id');
		$('#confirmDeleteIngrediente').attr('data-id', idIngrediente);
		$('#deleteIngredienteModal').modal('show');
	});

	$(document).on('click','#confirmDeleteIngrediente', function(){
		$('#deleteIngredienteModal').modal('hide');
		var idIngrediente = $(this).attr('data-id');

		$.ajax({
			url: baseUrl + "ingredienti/" + idIngrediente,
			type: 'DELETE',
			success: function() {
				var alertContent = '<strong>Ingrediente</strong> cancellato con successo.\n' +
					'            <button type="button" class="close" data-dismiss="alert" aria-label="Close"><span aria-hidden="true">&times;</span></button>';
				$('#alertIngrediente').addClass('alert alert-success alert-dismissible fade show').attr('role','alert');
				$('#alertIngrediente').html(alertContent);

				$('#ingredientiTable').DataTable().ajax.reload();
			},
			error: function(jqXHR, textStatus, errorThrown) {
				console.log('Response text: ' + jqXHR.responseText);
			}
		});
	});

	if($('#updateIngredienteButton') != null && $('#updateIngredienteButton') != undefined){
		$(document).on('click','#updateIngredienteButton', function(event){
			event.preventDefault();

			var ingrediente = new Object();
			ingrediente.id = $('#hiddenIdIngrediente').val();
			ingrediente.codice = $('#codice').val();
			ingrediente.descrizione = $('#descrizione').val();
			ingrediente.prezzo = $('#prezzo').val();

			var ingredienteJson = JSON.stringify(ingrediente);

			var alertContent = '<strong>@@alertText@@</strong>\n' +
				'<button type="button" class="close" data-dismiss="alert" aria-label="Close"><span aria-hidden="true">&times;</span></button>';

			$.ajax({
				url: baseUrl + "ingredienti/" + $('#hiddenIdIngrediente').val(),
				type: 'PUT',
				contentType: "application/json",
				dataType: 'json',
				data: ingredienteJson,
				success: function(result) {
					$('#alertIngrediente').addClass('alert alert-success alert-dismissible fade show').attr('role','alert');
					$('#alertIngrediente').html(alertContent.replace('@@alertText@@','Ingrediente modificato con successo'));
				},
				error: function(jqXHR, textStatus, errorThrown) {
					$('#alertIngrediente').addClass('alert alert-danger alert-dismissible fade show').attr('role','alert');
					$('#alertIngrediente').html(alertContent.replace('@@alertText@@','Errore nella modifica dell ingrediente'));
				}
			});
		});
	}

	if($('#newIngredienteButton') != null && $('#newIngredienteButton') != undefined){
		$(document).on('click','#newIngredienteButton', function(event){
			event.preventDefault();

			var ingrediente = new Object();
			ingrediente.codice = $('#codice').val();
			ingrediente.descrizione = $('#descrizione').val();
			ingrediente.prezzo = $('#prezzo').val();

			var ingredienteJson = JSON.stringify(ingrediente);

			var alertContent = '<strong>@@alertText@@</strong>\n' +
				'<button type="button" class="close" data-dismiss="alert" aria-label="Close"><span aria-hidden="true">&times;</span></button>';

			$.ajax({
				url: baseUrl + "ingredienti",
				type: 'POST',
				contentType: "application/json",
				dataType: 'json',
				data: ingredienteJson,
				success: function(result) {
					$('#alertIngrediente').addClass('alert alert-success alert-dismissible fade show').attr('role','alert');
					$('#alertIngrediente').html(alertContent.replace('@@alertText@@','Ingrediente creato con successo'));
				},
				error: function(jqXHR, textStatus, errorThrown) {
					$('#alertIngrediente').addClass('alert alert-danger alert-dismissible fade show').attr('role','alert');
					$('#alertIngrediente').html(alertContent.replace('@@alertText@@','Errore nella creazione dell ingrediente'));
				}
			});
		});
	}
});

$.fn.extractIdIngredienteFromUrl = function(){
    var pageUrl = window.location.search.substring(1);

	var urlVariables = pageUrl.split('&'),
        paramNames,
        i;

    for (i = 0; i < urlVariables.length; i++) {
        paramNames = urlVariables[i].split('=');

        if (paramNames[0] === 'idIngrediente') {
        	return paramNames[1] === undefined ? null : decodeURIComponent(paramNames[1]);
        }
    }
}

$.fn.getIngrediente = function(idIngrediente){

    var alertContent = '<strong>Errore nel recupero degli ingredienti.</strong>\n' +
    					'<button type="button" class="close" data-dismiss="alert" aria-label="Close"><span aria-hidden="true">&times;</span></button>';

    $.ajax({
        url: baseUrl + "ingredienti/" + idIngrediente,
        type: 'GET',
        dataType: 'json',
        success: function(result) {
          if(result != null && result != undefined && result != ''){

			$('#hiddenIdIngrediente').attr('value', result.id);
			$('#codice').attr('value', result.codice);
            $('#descrizione').attr('value', result.descrizione);
            $('#prezzo').attr('value', result.prezzo);

          } else{
            $('#alertIngrediente').addClass('alert alert-danger alert-dismissible fade show').attr('role','alert');
            $('#alertIngrediente').html(alertContent);
          }
        },
        error: function(jqXHR, textStatus, errorThrown) {
            $('#alertIngrediente').addClass('alert alert-danger alert-dismissible fade show').attr('role','alert');
            $('#alertIngrediente').html(alertContent);
            $('#updateIngredienteButton').attr('disabled', true);
            console.log('Response text: ' + jqXHR.responseText);
        }
    });
}
