
var baseUrl = "/contafood-be/";

$(document).ready(function() {

	$('#articoliTable').DataTable({
		"ajax": {
			"url": baseUrl + "articoli",
			"type": "GET",
			"content-type": "json",
			"cache": false,
			"dataSrc": "",
			"error": function(jqXHR, textStatus, errorThrown) {
				console.log('Response text: ' + jqXHR.responseText);
				var alertContent = '<div id="alertArticoloContent" class="alert alert-danger alert-dismissible fade show" role="alert">';
				alertContent = alertContent + '<strong>Errore nel recupero degli articoli</strong>\n' +
					'            <button type="button" class="close" data-dismiss="alert" aria-label="Close"><span aria-hidden="true">&times;</span></button></div>';
				$('#alertArticolo').empty().append(alertContent);
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
			"emptyTable": "Nessun articolo disponibile",
			"zeroRecords": "Nessun articolo disponibile"
		},
		"pageLength": 20,
		"lengthChange": false,
		"info": false,
		"autoWidth": false,
		"order": [
			[0, 'asc']
		],
		"columns": [
			{"name": "codice", "data": "codice"},
			{"name": "descrizione", "data": "descrizione"},
			{"name": "categoria", "data": null, render: function ( data, type, row ) {
				return data.categoria.nome;
			}},
			{"name": "fornitore", "data": null, render: function ( data, type, row ) {
				return data.fornitore.ragioneSociale;
			}},
			{"name": "data", "data": "data"},
			{"data": null, "orderable":false, "width":"15%", render: function ( data, type, row ) {
				var links = '<a class="updateArticolo pr-2" data-id="'+data.id+'" href="articoli-edit.html?idArticolo=' + data.id + '"><i class="far fa-edit" title="Modifica"></i></a>';
				links = links + '<a class="manageArticoloImmagini pr-2" data-id="'+data.id+'" href="articolo-immagini.html?idArticolo=' + data.id + '"><i class="fas fa-truck-moving" title="Immagini"></i></a>';
				links = links + '<a class="deleteArticolo" data-id="'+data.id+'" href="#"><i class="far fa-trash-alt" title="Elimina"></i></a>';
				return links;
			}}
		]
	});

	$(document).on('click','.deleteArticolo', function(){
		var idArticolo = $(this).attr('data-id');
		$('#confirmDeleteArticolo').attr('data-id', idArticolo);
		$('#deleteArticoloModal').modal('show');
	});

	$(document).on('click','#confirmDeleteArticolo', function(){
		$('#deleteArticoloModal').modal('hide');
		var idArticolo = $(this).attr('data-id');

		$.ajax({
			url: baseUrl + "articoli/" + idArticolo,
			type: 'DELETE',
			success: function() {
				var alertContent = '<div id="alertArticoloContent" class="alert alert-success alert-dismissible fade show" role="alert">';
				alertContent = alertContent + '<strong>Articolo</strong> cancellato con successo.\n' +
					'            <button type="button" class="close" data-dismiss="alert" aria-label="Close"><span aria-hidden="true">&times;</span></button></div>';
				$('#alertArticolo').empty().append(alertContent);

				$('#articoliTable').DataTable().ajax.reload();
			},
			error: function(jqXHR, textStatus, errorThrown) {
				console.log('Response text: ' + jqXHR.responseText);
			}
		});
	});

	if($('#updateArticoloButton') != null && $('#updateArticoloButton') != undefined){
		$(document).on('submit','#updateArticoloForm', function(event){
			event.preventDefault();

			var articolo = new Object();
			articolo.id = $('#hiddenIdArticolo').val();
			articolo.codice = $('#codice').val();
			articolo.descrizione= $('#descrizione').val();
			if($('#categoriaArticolo option:selected').val() != -1){
				var categoriaArticolo = new Object();
				categoriaArticolo.id = $('#categoriaArticolo option:selected').val();
				articolo.categoria = categoriaArticolo;
			}
			if($('#fornitore option:selected').val() != -1){
				var fornitore = new Object();
				fornitore.id = $('#fornitore option:selected').val();
				articolo.fornitore = fornitore;
			}
			if($('#aliquotaIva option:selected').val() != -1){
				var aliquotaIva = new Object();
				aliquotaIva.id = $('#aliquotaIva option:selected').val();
				articolo.aliquotaIva = aliquotaIva;
			}
			if($('#unitaMisura option:selected').val() != -1){
				var unitaMisura = new Object();
				unitaMisura.id = $('#unitaMisura option:selected').val();
				articolo.unitaMisura = unitaMisura;
			}
			articolo.data= $('#data').val();
			articolo.quantitaPredefinita= $('#quantitaPredefinita').val();
			articolo.prezzoAcquisto= $('#prezzoAcquisto').val();
			articolo.scadenzaGiorni= $('#scadenzaGiorni').val();
			articolo.barcode= $('#barcode').val();
			if($('#completeBarcode').prop('checked') === true){
				articolo.completeBarcode = true;
			}else{
				articolo.completeBarcode = false;
			}
			if($('#sitoWeb').prop('checked') === true){
				articolo.sitoWeb = true;
			}else{
				articolo.sitoWeb = false;
			}
			if($('#attivo').prop('checked') === true){
				articolo.attivo = true;
			}else{
				articolo.attivo = false;
			}

			var articoloJson = JSON.stringify(articolo);

			var alertContent = '<div id="alertArticoloContent" class="alert alert-@@alertResult@@ alert-dismissible fade show" role="alert">';
			alertContent = alertContent + '<strong>@@alertText@@</strong>\n' +
				'<button type="button" class="close" data-dismiss="alert" aria-label="Close"><span aria-hidden="true">&times;</span></button></div>';

			$.ajax({
				url: baseUrl + "articoli/" + $('#hiddenIdArticolo').val(),
				type: 'PUT',
				contentType: "application/json",
				dataType: 'json',
				data: articoloJson,
				success: function(result) {
					$('#alertArticolo').empty().append(alertContent.replace('@@alertText@@','Articolo modificato con successo').replace('@@alertResult@@', 'success'));
				},
				error: function(jqXHR, textStatus, errorThrown) {
					$('#alertArticolo').empty().append(alertContent.replace('@@alertText@@','Errore nella modifica dell articolo').replace('@@alertResult@@', 'danger'));
				}
			});
		});
	}

	if($('#newArticoloButton') != null && $('#newArticoloButton') != undefined){
		$(document).on('submit','#newArticoloForm', function(event){
			event.preventDefault();

			var articolo = new Object();
			articolo.codice = $('#codice').val();
			articolo.descrizione= $('#descrizione').val();
			if($('#categoriaArticolo option:selected').val() != -1){
				var categoriaArticolo = new Object();
				categoriaArticolo.id = $('#categoriaArticolo option:selected').val();
				articolo.categoria = categoriaArticolo;
			}
			if($('#fornitore option:selected').val() != -1){
				var fornitore = new Object();
				fornitore.id = $('#fornitore option:selected').val();
				articolo.fornitore = fornitore;
			}
			if($('#aliquotaIva option:selected').val() != -1){
				var aliquotaIva = new Object();
				aliquotaIva.id = $('#aliquotaIva option:selected').val();
				articolo.aliquotaIva = aliquotaIva;
			}
			if($('#unitaMisura option:selected').val() != -1){
				var unitaMisura = new Object();
				unitaMisura.id = $('#unitaMisura option:selected').val();
				articolo.unitaMisura = unitaMisura;
			}
			articolo.data= $('#data').val();
			articolo.quantitaPredefinita= $('#quantitaPredefinita').val();
			articolo.prezzoAcquisto= $('#prezzoAcquisto').val();
			articolo.scadenzaGiorni= $('#scadenzaGiorni').val();
			articolo.barcode= $('#barcode').val();
			if($('#completeBarcode').prop('checked') === true){
				articolo.completeBarcode = true;
			}else{
				articolo.completeBarcode = false;
			}
			if($('#sitoWeb').prop('checked') === true){
				articolo.sitoWeb = true;
			}else{
				articolo.sitoWeb = false;
			}
			if($('#attivo').prop('checked') === true){
				articolo.attivo = true;
			}else{
				articolo.attivo = false;
			}
			var articoloJson = JSON.stringify(articolo);

			var alertContent = '<div id="alertArticoloContent" class="alert alert-@@alertResult@@ alert-dismissible fade show" role="alert">';
			alertContent = alertContent + '<strong>@@alertText@@</strong>\n' +
				'<button type="button" class="close" data-dismiss="alert" aria-label="Close"><span aria-hidden="true">&times;</span></button></div>';

			$.ajax({
				url: baseUrl + "articoli",
				type: 'POST',
				contentType: "application/json",
				dataType: 'json',
				data: articoloJson,
				success: function(result) {
					$('#alertArticolo').empty().append(alertContent.replace('@@alertText@@','Articolo creato con successo').replace('@@alertResult@@', 'success'));
				},
				error: function(jqXHR, textStatus, errorThrown) {
					$('#alertArticolo').empty().append(alertContent.replace('@@alertText@@','Errore nella creazione dell articolo').replace('@@alertResult@@', 'danger'));
				}
			});
		});
	}
});

$.fn.getCategorieArticoli = function(){
	$.ajax({
		url: baseUrl + "categorie-articoli",
		type: 'GET',
		dataType: 'json',
		success: function(result) {
			if(result != null && result != undefined && result != ''){
				$.each(result, function(i, item){
					$('#categoriaArticolo').append('<option value="'+item.id+'">'+item.nome+'</option>');
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
					$('#fornitore').append('<option value="'+item.id+'">'+item.codice+'</option>');
				});
			}
		},
		error: function(jqXHR, textStatus, errorThrown) {
			console.log('Response text: ' + jqXHR.responseText);
		}
	});
}

$.fn.getAliquoteIva = function(){
	$.ajax({
		url: baseUrl + "aliquote-iva",
		type: 'GET',
		dataType: 'json',
		success: function(result) {
			if(result != null && result != undefined && result != ''){
				$.each(result, function(i, item){
					$('#aliquotaIva').append('<option value="'+item.id+'">'+item.valore+'</option>');
				});
			}
		},
		error: function(jqXHR, textStatus, errorThrown) {
			console.log('Response text: ' + jqXHR.responseText);
		}
	});
}

$.fn.getUnitaMisura = function(){
	$.ajax({
		url: baseUrl + "unita-misura",
		type: 'GET',
		dataType: 'json',
		success: function(result) {
			if(result != null && result != undefined && result != ''){
				$.each(result, function(i, item){
					$('#unitaMisura').append('<option value="'+item.id+'">'+item.etichetta+'</option>');
				});
			}
		},
		error: function(jqXHR, textStatus, errorThrown) {
			console.log('Response text: ' + jqXHR.responseText);
		}
	});
}

$.fn.extractIdArticoloFromUrl = function(){
    var pageUrl = window.location.search.substring(1);

	var urlVariables = pageUrl.split('&'),
        paramNames,
        i;

    for (i = 0; i < urlVariables.length; i++) {
        paramNames = urlVariables[i].split('=');

        if (paramNames[0] === 'idArticolo') {
        	return paramNames[1] === undefined ? null : decodeURIComponent(paramNames[1]);
        }
    }
}

$.fn.printVariable = function(variable){
    if(variable != null && variable != undefined && variable != ""){
        return variable;
    }
    return "";
}

$.fn.getArticolo = function(idCliente){

	var alertContent = '<div id="alertArticoloContent" class="alert alert-danger alert-dismissible fade show" role="alert">';
	alertContent = alertContent + '<strong>Errore nel recupero dell articolo.</strong>\n' +
    					'<button type="button" class="close" data-dismiss="alert" aria-label="Close"><span aria-hidden="true">&times;</span></button></div>';

    $.ajax({
        url: baseUrl + "articoli/" + idArticolo,
        type: 'GET',
        dataType: 'json',
        success: function(result) {
          if(result != null && result != undefined && result != ''){

			$('#hiddenIdArticolo').attr('value', result.id);
			$('#codice').attr('value', result.codice);
            $('#descrizione').attr('value', result.descrizione);
			if(result.categoria != null && result.categoria != undefined){
				$('#categoriaArticolo option[value="' + result.categoria.id +'"]').attr('selected', true);
			}
			if(result.fornitore != null && result.fornitore != undefined){
				$('#fornitore option[value="' + result.fornitore.id +'"]').attr('selected', true);
			}
			if(result.aliquotaIva != null && result.aliquotaIva != undefined){
				$('#aliquotaIva option[value="' + result.aliquotaIva.id +'"]').attr('selected', true);
			}
			if(result.unitaMisura != null && result.unitaMisura != undefined){
				$('#unitaMisura option[value="' + result.unitaMisura.id +'"]').attr('selected', true);
			}
			$('#data').attr('value', result.data);
			$('#quantitaPredefinita').attr('value', result.quantitaPredefinita);
			$('#prezzoAcquisto').attr('value', result.prezzoAcquisto);
			$('#scadenzaGiorni').attr('value', result.scadenzaGiorni);
			$('#barcode').attr('value', result.barcode);
			if(result.completeBarcode === true){
				$('#completeBarcode').prop('checked', true);
			}
			if(result.sitoweb === true){
				$('#sitoWeb').prop('checked', true);
			}
			if(result.attivo === true){
				$('#attivo').prop('checked', true);
			}

          } else{
            $('#alertArticolo').empty().append(alertContent);
          }
        },
        error: function(jqXHR, textStatus, errorThrown) {
            $('#alertArticolo').empty().append(alertContent);
            $('#updateClienteButton').attr('disabled', true);
            console.log('Response text: ' + jqXHR.responseText);
        }
    });
}

