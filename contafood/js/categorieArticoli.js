var baseUrl = "http://localhost:8090/contafood-be/";

$(document).ready(function() {

	$('#categorieArticoliTable').DataTable({
		"ajax": {
			"url": baseUrl + "categorie-articoli",
			"type": "GET",
			"content-type": "json",
			"cache": false,
			"dataSrc": "",
			"error": function(jqXHR, textStatus, errorThrown) {
				console.log('Response text: ' + jqXHR.responseText);
				var alertContent = '<strong>Errore nel recupero delle categorie fornitori</strong>\n' +
					'            <button type="button" class="close" data-dismiss="alert" aria-label="Close"><span aria-hidden="true">&times;</span></button>';
				$('#alertCategorieArticoli').addClass('alert alert-danger alert-dismissible fade show').attr('role','alert');
				$('#alertCategorieArticoli').html(alertContent);
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
			"emptyTable": "Nessuna categoria articoli disponibile",
			"zeroRecords": "Nessun categoria articoli disponibile"
		},
		"pageLength": 20,
		"lengthChange": false,
		"info": false,
		"columns": [
			{"name": "nome", "data": "nome"},
			{"name": "ordine", "data": "ordine"},
			{"data": null, render: function ( data, type, row ) {
				var links = '<a class="updateCategoriaArticoli pr-2" data-id="'+data.id+'" href="categorie-articoli-edit.html?idCategoriaArticoli=' + data.id + '"><i class="far fa-edit"></i></a>';
				links = links + '<a class="deleteCategoriaArticoli" data-id="'+data.id+'" href="#"><i class="far fa-trash-alt"></i></a>';
				return links;
			}}
		]
	});

	$(document).on('click','.deleteCategoriaArticoli', function(){
		var idCategoriaArticoli = $(this).attr('data-id');
		$('#confirmDeleteCategoriaArticoli').attr('data-id', idCategoriaArticoli);
		$('#deleteCategoriaArticoliModal').modal('show');
	});

	$(document).on('click','#confirmDeleteCategoriaArticoli', function(){
		$('#deleteCategoriaArticoliModal').modal('hide');
		var idCategoriaArticoli = $(this).attr('data-id');

		$.ajax({
			url: baseUrl + "categorie-articoli/" + idCategoriaArticoli,
			type: 'DELETE',
			success: function() {
				var alertContent = '<strong>Categoria articoli</strong> cancellato con successo.\n' +
					'            <button type="button" class="close" data-dismiss="alert" aria-label="Close"><span aria-hidden="true">&times;</span></button>';
				$('#alertCategorieArticoli').addClass('alert alert-success alert-dismissible fade show').attr('role','alert');
				$('#alertCategorieArticoli').html(alertContent);

				$('#categorieArticoliTable').DataTable().ajax.reload();
			},
			error: function(jqXHR, textStatus, errorThrown) {
				console.log('Response text: ' + jqXHR.responseText);
			}
		});
	});

	if($('#updateCategoriaArticoliButton') != null && $('#updateCategoriaArticoliButton') != undefined){
		$(document).on('click','#updateCategoriaArticoliButton', function(event){
			event.preventDefault();

			var categoriaArticoli = new Object();
			categoriaArticoli.id = $('#hiddenIdCategoriaArticoli').val();
			categoriaArticoli.nome = $('#nome').val();
			categoriaArticoli.ordine = $('#ordine').val();

			var categoriaArticoliJson = JSON.stringify(categoriaArticoli);

			var alertContent = '<strong>@@alertText@@</strong>\n' +
				'<button type="button" class="close" data-dismiss="alert" aria-label="Close"><span aria-hidden="true">&times;</span></button>';

			$.ajax({
				url: baseUrl + "categorie-articoli/" + $('#hiddenIdCategoriaArticoli').val(),
				type: 'PUT',
				contentType: "application/json",
				dataType: 'json',
				data: categoriaArticoliJson,
				success: function(result) {
					$('#alertCategorieArticoli').addClass('alert alert-success alert-dismissible fade show').attr('role','alert');
					$('#alertCategorieArticoli').html(alertContent.replace('@@alertText@@','Categoria articoli modificata con successo'));
				},
				error: function(jqXHR, textStatus, errorThrown) {
					$('#alertCategorieArticoli').addClass('alert alert-danger alert-dismissible fade show').attr('role','alert');
					$('#alertCategorieArticoli').html(alertContent.replace('@@alertText@@','Errore nella modifica della categoria articoli'));
				}
			});
		});
	}

	if($('#newCategoriaArticoliButton') != null && $('#newCategoriaArticoliButton') != undefined){
		$(document).on('click','#newCategoriaArticoliButton', function(event){
			event.preventDefault();

			var categoriaArticoli = new Object();
			categoriaArticoli.codice = $('#nome').val();
			categoriaArticoli.ordine = $('#ordine').val();

			var categoriaArticoliJson = JSON.stringify(categoriaArticoli);

			var alertContent = '<strong>@@alertText@@</strong>\n' +
				'<button type="button" class="close" data-dismiss="alert" aria-label="Close"><span aria-hidden="true">&times;</span></button>';

			$.ajax({
				url: baseUrl + "categorie-articoli",
				type: 'POST',
				contentType: "application/json",
				dataType: 'json',
				data: categoriaArticoliJson,
				success: function(result) {
					$('#alertCategorieArticoli').addClass('alert alert-success alert-dismissible fade show').attr('role','alert');
					$('#alertCategorieArticoli').html(alertContent.replace('@@alertText@@','Categoria articoli creata con successo'));
				},
				error: function(jqXHR, textStatus, errorThrown) {
					$('#alertCategorieArticoli').addClass('alert alert-danger alert-dismissible fade show').attr('role','alert');
					$('#alertCategorieArticoli').html(alertContent.replace('@@alertText@@','Errore nella creazione della categoria articoli'));
				}
			});
		});
	}
});

$.fn.extractIdCategoriaArticoliFromUrl = function(){
    var pageUrl = window.location.search.substring(1);

	var urlVariables = pageUrl.split('&'),
        paramNames,
        i;

    for (i = 0; i < urlVariables.length; i++) {
        paramNames = urlVariables[i].split('=');

        if (paramNames[0] === 'idFornitore') {
        	return paramNames[1] === undefined ? null : decodeURIComponent(paramNames[1]);
        }
    }
}

$.fn.getCategoriaArticoli = function(idCategoriaArticoli){

    var alertContent = '<strong>Errore nel recupero della categoria articoli.</strong>\n' +
    					'<button type="button" class="close" data-dismiss="alert" aria-label="Close"><span aria-hidden="true">&times;</span></button>';

    $.ajax({
        url: baseUrl + "categorie-articoli/" + idCategoriaArticoli,
        type: 'GET',
        dataType: 'json',
        success: function(result) {
          if(result != null && result != undefined && result != ''){

			$('#hiddenIdCategoriaArticoli').attr('value', result.id);
			$('#nome').attr('value', result.nome);
            $('#ordine').attr('value', result.ordine);

          } else{
            $('#alertCategorieArticoli').addClass('alert alert-danger alert-dismissible fade show').attr('role','alert');
            $('#alertCategorieArticoli').html(alertContent);
          }
        },
        error: function(jqXHR, textStatus, errorThrown) {
            $('#alertCategorieArticoli').addClass('alert alert-danger alert-dismissible fade show').attr('role','alert');
            $('#alertCategorieArticoli').html(alertContent);
            $('#updateCategoriaArticoliButton').attr('disabled', true);
            console.log('Response text: ' + jqXHR.responseText);
        }
    });

}
