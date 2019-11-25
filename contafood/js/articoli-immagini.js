
var baseUrl = "/contafood-be/";

$(document).ready(function() {

	$(document).on('click','.deleteArticoloImmagine', function(){
		var idArticoloImmagine = $(this).attr('data-id');
		$('#confirmDeleteArticoloImmagine').attr('data-id', idArticoloImmagine);
		$('#deleteArticoloImmagineModal').modal('show');
	});

	$(document).on('click','#confirmDeleteArticoloImmagine', function(){
		$('#deleteArticoloImmagineModal').modal('hide');
		var idArticoloImmagine = $(this).attr('data-id');

		$.ajax({
			url: baseUrl + "articoli-immagini/" + idArticoloImmagine,
			type: 'DELETE',
			success: function() {
				var alertContent = '<div id="alertArticoloImmagineContent" class="alert alert-success alert-dismissible fade show" role="alert">';
				alertContent = alertContent + '<strong>Immagine articolo</strong> cancellata con successo.\n' +
					'            <button type="button" class="close" data-dismiss="alert" aria-label="Close"><span aria-hidden="true">&times;</span></button></div>';
				$('#alertArticoloImmagine').empty().append(alertContent);

				$('#articoliImmaginiTable').DataTable().ajax.reload();
			},
			error: function(jqXHR, textStatus, errorThrown) {
				console.log('Response text: ' + jqXHR.responseText);
			}
		});
	});

	if($('#newArticoloImmagineButton') != null && $('#newArticoloImmagineButton') != undefined){
		$(document).on('submit','#newArticoloImmagineForm', function(event){
			event.preventDefault();

			var puntoConsegna = new Object();
			puntoConsegna.nome = $('#nome').val();
			puntoConsegna.indirizzo = $('#indirizzo').val();
			puntoConsegna.localita = $('#localita').val();
			puntoConsegna.cap = $('#cap').val();
			puntoConsegna.provincia = $('#provincia option:selected').text();
			puntoConsegna.codiceConad = $('#codiceConad').val();
			var cliente = new Object();
			cliente.id = $('#hiddenIdCliente').val();
			puntoConsegna.cliente = cliente;

			var puntoConsegnaJson = JSON.stringify(puntoConsegna);

			var alertContent = '<div id="alertClientePuntoConsegnaContent" class="alert alert-@@alertResult@@ alert-dismissible fade show" role="alert">';
			alertContent = alertContent + '<strong>@@alertText@@</strong>\n' +
				'<button type="button" class="close" data-dismiss="alert" aria-label="Close"><span aria-hidden="true">&times;</span></button></div>';

			$.ajax({
				url: baseUrl + "punti-consegna",
				type: 'POST',
				contentType: "application/json",
				dataType: 'json',
				data: puntoConsegnaJson,
				success: function(result) {
					$('#alertClientePuntoConsegna').empty().append(alertContent.replace('@@alertText@@','Punto di consegna creato con successo').replace('@@alertResult@@', 'success'));
				},
				error: function(jqXHR, textStatus, errorThrown) {
					$('#alertClientePuntoConsegna').empty().append(alertContent.replace('@@alertText@@','Errore nella creazione del punto di consegna').replace('@@alertResult@@', 'danger'));
				}
			});
		});
	}
});

$.fn.getArticoloForImmagine = function(idArticolo){
	var alertContent = '<div id="alertArticoloContent" class="alert alert-danger alert-dismissible fade show" role="alert">';
	alertContent = alertContent + '<strong>Errore nel recupero dell articolo.</strong>\n' +
		'<button type="button" class="close" data-dismiss="alert" aria-label="Close"><span aria-hidden="true">&times;</span></button></div>';

	$.ajax({
		url: baseUrl + "articoli/" + idArticolo,
		type: 'GET',
		dataType: 'json',
		success: function(result) {
			if(result != null && result != undefined && result != '') {

				var articoloRow = '<td>'+result.codice+'</td>';
				articoloRow = articoloRow + '<td>'+result.descrizione+'</td>';
				articoloRow = articoloRow + '<td>'+result.categoria.nome+'</td>';
				articoloRow = articoloRow + '<td>'+result.fornitore.codice+'</td>';
				articoloRow = articoloRow + '<td>'+result.data+'</td>';

				$('#articoloRow').append(articoloRow);

				$('#hiddenIdArticolo').val(idArticolo);
				$('#annullaArticoloImmagine').attr('href','articolo-immagini.html?idArticolo='+idArticolo);
			}
		},
		error: function(jqXHR, textStatus, errorThrown) {
			$('#alertArticoloImmagine').empty().append(alertContent);
			console.log('Response text: ' + jqXHR.responseText);
		}
	});
}

$.fn.getImmagini = function(idArticolo){

	var nuovoLink = 'articolo-immagini-new.html?idArticolo='+idArticolo;
	$('#nuovoLink').attr('href', nuovoLink);

	$('#articoloImmaginiTable').DataTable({
		"ajax": {
			"url": baseUrl + "articoli-immagini",
			"type": "GET",
			"content-type": "json",
			"cache": false,
			"dataSrc": "",
			"error": function(jqXHR, textStatus, errorThrown) {
				//console.log('Response text: ' + jqXHR.responseText);
				var alertContent = '<div id="alertArticoloImmagineContent" class="alert alert-danger alert-dismissible fade show" role="alert">';
				alertContent = alertContent + '<strong>Errore nel recupero delle immagini articolo</strong>\n' +
					'            <button type="button" class="close" data-dismiss="alert" aria-label="Close"><span aria-hidden="true">&times;</span></button></div>';
				$('#alertArticoloImmagine').empty().append(alertContent);
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
			"emptyTable": "Nessuna immagine disponibile",
			"zeroRecords": "Nessuna immagine disponibile"
		},
		"pageLength": 20,
		"lengthChange": false,
		"info": false,
		"autoWidth": false,
		"order": [
			[0, 'asc']
		],
		"columns": [
			{"name": "fileName", "data": "fileName"},
			{"name": "filePath", "data": null, render: function ( data, type, row ) {
				var link = '<a class="articoloImmagineAnteprima" data-path="'+data.filePath+'" href="#">Anteprima</a>';
				return link;
			}},
			{"data": null, "orderable":false, "width":"10%", render: function ( data, type, row ) {
				var links = '<a class="deleteArticoloImmagine" data-id="'+data.id+'" href="#"><i class="far fa-trash-alt"></i></a>';
				return links;
			}}
		]
	});
}

