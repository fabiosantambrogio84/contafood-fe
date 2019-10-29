var baseUrl = "/contafood-be/";

$(document).ready(function() {

	$('#produzioniTable').DataTable({
		"ajax": {
			"url": baseUrl + "produzioni",
			"type": "GET",
			"content-type": "json",
			"cache": false,
			"dataSrc": "",
			"error": function(jqXHR, textStatus, errorThrown) {
				console.log('Response text: ' + jqXHR.responseText);
				var alertContent = '<div id="alertProduzioneContent" class="alert alert-danger alert-dismissible fade show" role="alert">';
				alertContent = alertContent + '<strong>Errore nel recupero delle produzioni</strong>\n' +
					'            <button type="button" class="close" data-dismiss="alert" aria-label="Close"><span aria-hidden="true">&times;</span></button></div>';
				$('#alertProduzione').empty().append(alertContent);
			}
		},
		"language": {
			"search": "Cerca per codice, ricetta, confezione",
			"paginate": {
				"first": "Inizio",
				"last": "Fine",
				"next": "Succ.",
				"previous": "Prec."
			},
			"emptyTable": "Nessuna produzione disponibile",
			"zeroRecords": "Nessuna produzione disponibile"
		},
		"pageLength": 20,
		"lengthChange": false,
		"info": false,
		"autoWidth": false,
		"order": [
			[0, 'desc']
		],
		"columns": [
			{"name": "codice", "data": "codice"},
			{"name": "lotto", "data": "lotto"},
			{"name": "scadenza", "data": "scadenza"},
			{"name": "ricetta", "data": null, "orderable":false, render: function ( data, type, row ) {
				var ricettaResult = data.ricetta.codice+' - '+data.ricetta.nome;
				return ricettaResult;
			}},
			{"name": "numeroConfezioni", "data": "numeroConfezioni"},
			{"data": null, "orderable":false, "width":"10%", render: function ( data, type, row ) {
				var links = '<a class="detailsProduzione pr-2" data-id="'+data.id+'" href="#"><i class="fas fa-info-circle"></i></a>';
				links = links + '<a class="deleteProduzione" data-id="'+data.id+'" href="#"><i class="far fa-trash-alt"></i></a>';
				return links;
			}}
		]
	});

	$(document).on('click','.detailsProduzione', function(){
		var idProduzione = $(this).attr('data-id');

		var alertContent = '<div id="alertProduzioneContent" class="alert alert-danger alert-dismissible fade show" role="alert">';
		alertContent = alertContent + '<strong>Errore nel recupero della produzione.</strong></div>';
		
		$('#detailsProduzioneModal').modal('show');

		$('#detailsProduzioneModalTable').DataTable({
			"ajax": {
				"url": baseUrl + "produzioni/" + idProduzione + "/confezioni",
				"type": "GET",
				"content-type": "json",
				"cache": false,
				"dataSrc": "",
				"error": function(jqXHR, textStatus, errorThrown) {
					console.log('Response text: ' + jqXHR.responseText);
					$('#alertProduzione').append(alertContent);
				}
			},
			"language": {
				"search": "Cerca",
				"emptyTable": "Nessuna confezione disponibile",
				"zeroRecords": "Nessuna confezione disponibile"
			},
			"paging": false,
			"lengthChange": false,
			"info": false,
			"order": [
				[0,'desc']
			],
			"autoWidth": false,
			"columns": [
				{"data": null, "orderable":false, render: function ( data, type, row ) {
					return data.confezione.tipo;
					
				}},
				{"data": null, "orderable":false, render: function ( data, type, row ) {
					return data.confezione.peso;
					
				}},
				{"data": null, "orderable":false, render: function ( data, type, row ) {
					return data.numConfezioni;
				}}
			]
		});	
		
		
	});

	$(document).on('click','.deleteProduzione', function(){
		var idProduzione = $(this).attr('data-id');
		$('#confirmDeleteProduzione').attr('data-id', idProduzione);
		$('#deleteProduzioneModal').modal('show');
	});

	$(document).on('click','#confirmDeleteProduzione', function(){
		$('#deleteProduzioneModal').modal('hide');
		var idProduzione = $(this).attr('data-id');

		$.ajax({
			url: baseUrl + "produzioni/" + idProduzione,
			type: 'DELETE',
			success: function() {
				var alertContent = '<div id="alertProduzioneContent" class="alert alert-success alert-dismissible fade show" role="alert">';
				alertContent = alertContent + '<strong>Produzione</strong> cancellata con successo.\n' +
					'            <button type="button" class="close" data-dismiss="alert" aria-label="Close"><span aria-hidden="true">&times;</span></button></div>';
				$('#alertProduzione').empty().append(alertContent);

				$('#produzioniTable').DataTable().ajax.reload();
			},
			error: function(jqXHR, textStatus, errorThrown) {
				console.log('Response text: ' + jqXHR.responseText);
			}
		});
	});

	if($('#newProduzioneForm') != null && $('#newProduzioneForm') != undefined){
		$(document).on('change','#ricetta', function(){
			var idRicetta = $('#ricetta option:selected').val();
			var idCategoria = $('#ricetta option:selected').attr('data-id-categoria');
			var numGiorniScadenza = $('#ricetta option:selected').attr('data-num-giorni-scadenza');
			if(idCategoria != '-1'){
				$('#categoria option').attr('selected', false);
				$('#categoria option[value="' + idCategoria +'"]').attr('selected', true);
			}
			if(numGiorniScadenza != '-1'){
				var scadenza = moment().add(numGiorniScadenza, 'days').format('YYYY-MM-DD');
				//scadenza.setDate(scadenza.getDate() + parseInt(numGiorniScadenza));
				$('#scadenza').val(scadenza);
			}
			$.fn.loadIngredienti(idRicetta);
		});
	}

	if($('#newProduzioneButton') != null && $('#newProduzioneButton') != undefined){
		$(document).on('submit','#newProduzioneForm', function(event){
			event.preventDefault();

			var produzione = new Object();

			var ricetta = new Object();
			ricetta.id = $('#ricetta option:selected').val();
			produzione.ricetta = ricetta;

			var categoria = new Object();
			categoria.id = $('#categoria option:selected').val();
			produzione.categoria = categoria;

			var ingredientiLength = $('.formRowIngrediente').length;
			if(ingredientiLength != null && ingredientiLength != undefined && ingredientiLength != 0){
				var produzioneIngredienti = [];
				$('.formRowIngrediente').each(function(i, item){
					var produzioneIngrediente = {};
					var produzioneIngredienteId = new Object();
					var ingredienteId = item.id.replace('formRowIngrediente_','');
					produzioneIngredienteId.ingredienteId = ingredienteId;
					produzioneIngrediente.id = produzioneIngredienteId;

					produzioneIngrediente.lotto = $('#lottoIngrediente_'+ingredienteId).val();
					produzioneIngrediente.scadenza = $('#scadenzaIngrediente_'+ingredienteId).val();
					produzioneIngrediente.quantita = $('#quantitaIngrediente_'+ingredienteId).val();

					produzioneIngredienti.push(produzioneIngrediente);
				});
				produzione.produzioneIngredienti = produzioneIngredienti;
			}
			produzione.scadenza = $('#scadenza').val();
			produzione.quantitaTotale = $('#quantitaTotale').val();
			var generaLotto = $('input[name="generaLotto"]:checked').val();
			if(generaLotto){
				produzione.scopo = 'vendita';
			} else {
				produzione.scopo = 'campionatura';
			}
			
			var confezioniLength = $('.confezioneRow').length;
			produzione.numeroConfezioni = 0;
			if(confezioniLength != null && confezioniLength != undefined && confezioniLength != 0){
				produzione.numeroConfezioni = confezioniLength;
				var produzioneConfezioni = [];
				$('.confezioneRow').each(function(i, item){
					var produzioneConfezione = {};
					var produzioneConfezioneId = new Object();
					var confezioneId = $(this).find('select option:selected').val();
					produzioneConfezioneId.confezioneId = confezioneId;
					produzioneConfezione.id = produzioneConfezioneId;

					produzioneConfezione.numConfezioni = $(this).find('.confezioneNum').val();

					produzioneConfezioni.push(produzioneConfezione);
				});
				produzione.produzioneConfezioni = produzioneConfezioni;
			}

			var produzioneJson = JSON.stringify(produzione);

			var alertContent = '<div id="alertProduzioneContent" class="alert alert-@@alertResult@@ alert-dismissible fade show" role="alert">';
			alertContent = alertContent + '<strong>@@alertText@@</strong>\n' +
				'<button type="button" class="close" data-dismiss="alert" aria-label="Close"><span aria-hidden="true">&times;</span></button></div>';

			$.ajax({
				url: baseUrl + "produzioni",
				type: 'POST',
				contentType: "application/json",
				dataType: 'json',
				data: produzioneJson,
				success: function(result) {
					$('#alertProduzione').empty().append(alertContent.replace('@@alertText@@','Produzione creata con successo').replace('@@alertResult@@', 'success'));
				},
				error: function(jqXHR, textStatus, errorThrown) {
					$('#alertProduzione').empty().append(alertContent.replace('@@alertText@@','Errore nella creazione della produzione').replace('@@alertResult@@', 'danger'));
				}
			});
		});
	}

    if($('.confezioneDescr') != null && $('.confezioneDescr') != undefined){
        $(document).on('change','.confezioneDescr', function(){
			var idConfezione = $(this).val();
			if(idConfezione != '-1'){
				var peso = $(this).find(':selected').attr('data-peso');
				$(this).parent().next().find('input').val(peso);
				$(this).parent().next().next().find('input').val(1);
			}
			$.fn.computeQuantitaTotale();
			$.fn.computeQuantitaIngredienti();
		});
				
        $(document).on('click','.addConfezione', function(){
            var confezioneRow = $(this).parent().parent().parent().parent();
            var newConfezioneRow = confezioneRow.clone();
			newConfezioneRow.find('label').each(function( index ) {
			  $(this).remove();
			});
			newConfezioneRow.find('.confezionePeso').each(function( index ) {
			  $(this).val(null);
			});
			newConfezioneRow.find('.confezioneNum').each(function( index ) {
			  $(this).val(null);
			});
			newConfezioneRow.find('.addConfezione').each(function( index ) {
			  $(this).remove();
			});
			var removeLink = '<a href="#" class="removeConfezione"><i class="fas fa-minus"></i></a>';
			newConfezioneRow.find('.linkConfezione').after(removeLink);
			$('.confezioneRow').last().after(newConfezioneRow);
			newConfezioneRow.focus();
        });
		
		$(document).on('click','.removeConfezione', function(){
            var confezioneRow = $(this).parent().parent().parent();
            confezioneRow.remove();
			$.fn.computeQuantitaTotale();
			$.fn.computeQuantitaIngredienti();
        });
		
		$(document).on('change','.confezioneNum', function(){
			$.fn.computeQuantitaTotale();
			$.fn.computeQuantitaIngredienti();
		});
    }

});

$.fn.getCategorieRicette = function(){
	$.ajax({
		url: baseUrl + "categorie-ricette",
		type: 'GET',
		dataType: 'json',
		success: function(result) {
			if(result != null && result != undefined && result != ''){
				$.each(result, function(i, item){
					$('#categoria').append('<option value="'+item.id+'">'+item.nome+'</option>');
				});
			}
		},
		error: function(jqXHR, textStatus, errorThrown) {
			console.log('Response text: ' + jqXHR.responseText);
		}
	});
}

$.fn.extractIdRicettaFromUrl = function(){
    var pageUrl = window.location.search.substring(1);

	var urlVariables = pageUrl.split('&'),
        paramNames,
        i;

    for (i = 0; i < urlVariables.length; i++) {
        paramNames = urlVariables[i].split('=');

        if (paramNames[0] === 'idRicetta') {
        	return paramNames[1] === undefined ? null : decodeURIComponent(paramNames[1]);
        }
    }
}

$.fn.getConfezioni = function(){
	$.ajax({
		url: baseUrl + "confezioni",
		type: 'GET',
		dataType: 'json',
		success: function(result) {
			if(result != null && result != undefined && result != ''){
			    $.each(result, function(i, item){
                    $('.confezioneDescr').append('<option value="'+item.id+'" data-peso="'+item.peso+'">'+item.tipo+' '+item.peso+' gr.</option>');
				});
			}
		},
		error: function(jqXHR, textStatus, errorThrown) {
			console.log('Response text: ' + jqXHR.responseText);
		}
	});
}

$.fn.loadIngredienti = function(idRicetta){

	$.ajax({
		url: baseUrl + "ricette/" + idRicetta,
		type: 'GET',
		dataType: 'json',
		success: function (result) {
			if (result != null && result != undefined && result != '') {
				var labelHtml = '<div class="form-group col-md-12" id="formRowIngredientiBody"><label class="font-weight-bold">Ingredienti</label></div>';

				$('#formRowIngredienti').empty().append(labelHtml);

				if (result.ricettaIngredienti != null && result.ricettaIngredienti != undefined && result.ricettaIngredienti.length != 0) {
					result.ricettaIngredienti.forEach(function (item, i) {
						var id = item.id.ingredienteId;
						var codice = item.ingrediente.codice;
						var descrizione = item.ingrediente.descrizione;
						var prezzo = item.ingrediente.prezzo;
						var quantita = item.quantita;
						var percentuale = item.percentuale;

						var rowHtml = '<div class="form-row formRowIngrediente" data-id="' + id + '" id="formRowIngrediente_' + id + '" data-percentuale="'+percentuale+'">' +
							'<div class="form-group col-md-2">';

						if (i == 0) {
							rowHtml = rowHtml + '<label for="codiceIngrediente">Codice</label>';
						}
						rowHtml = rowHtml + '<input type="text" class="form-control" id="codiceIngrediente_' + id + '" disabled value="' + codice + '"></div>';
						rowHtml = rowHtml + '<div class="form-group col-md-4">';

						if (i == 0) {
							rowHtml = rowHtml + '<label for="descrizioneIngrediente">Descrizione</label>';
						}
						rowHtml = rowHtml + '<input type="text" class="form-control" id="descrizioneIngrediente_' + id + '" disabled value="' + descrizione + '"></div>';
						rowHtml = rowHtml + '<div class="form-group col-md-2">';

						if (i == 0) {
							rowHtml = rowHtml + '<label for="lottoIngrediente">Lotto</label>';
						}
						rowHtml = rowHtml + '<input type="text" class="form-control lottoIngrediente" id="lottoIngrediente_' + id + '"></div>';
						rowHtml = rowHtml + '<div class="form-group col-md-2">';

						if (i == 0) {
							rowHtml = rowHtml + '<label for="scadenzaIngrediente">Scadenza</label>';
						}
						rowHtml = rowHtml + '<input type="date" class="form-control scadenzaIngrediente" id="scadenzaIngrediente_' + id + '"></div>';
						rowHtml = rowHtml + '<div class="form-group col-md-2">';

						if (i == 0) {
							rowHtml = rowHtml + '<label for="quantitaIngrediente">Quantita (Kg)</label>';
						}
						rowHtml = rowHtml + '<input type="number" class="form-control quantitaIngrediente" id="quantitaIngrediente_' + id + '" step=".01" min="0" value="' + quantita + '" onchange="$.fn.computeCostoIngredienti(this);" disabled></div>';

						rowHtml = rowHtml + '</div></div>';
						rowHtml = rowHtml + '</div>';

						$('#formRowIngredienti').append(rowHtml);
					});
					$.fn.computeQuantitaIngredienti();
				}
			} else {
				$('#alertProduzione').empty().append(alertContent);
			}
		},
		error: function (jqXHR, textStatus, errorThrown) {
			$('#alertProduzione').append(alertContent);
			console.log('Response text: ' + jqXHR.responseText);
		}
	});
}

$.fn.getRicettaProduzione = function(idRicetta){

	var alertContent = '<div id="alertProduzioneContent" class="alert alert-danger alert-dismissible fade show" role="alert">';
	alertContent = alertContent +  '<strong>Errore nel recupero della ricetta.</strong>\n' +
    					'<button type="button" class="close" data-dismiss="alert" aria-label="Close"><span aria-hidden="true">&times;</span></button></div>';

	$.ajax({
        url: baseUrl + "ricette/" + idRicetta,
        type: 'GET',
        dataType: 'json',
        success: function(result) {
          if(result != null && result != undefined && result != ''){

          	$('#ricetta option[value=' + idRicetta +']').attr('selected', true);
          	$('#categoria option[value="' + result.categoria.id +'"]').attr('selected', true);

			$.fn.loadIngredienti(idRicetta);

          } else{
            $('#alertProduzione').empty().append(alertContent);
          }
        },
        error: function(jqXHR, textStatus, errorThrown) {
            $('#alertProduzione').append(alertContent);
            console.log('Response text: ' + jqXHR.responseText);
        }
    });
}

$.fn.computeQuantitaTotale = function() {
	var quantitaTotale;
	$('.confezioneNum').each(function(i, item){
		var numeroConfezioni = $(this).val();
		var peso = $(this).parent().parent().prev().find('input').val();
		if(numeroConfezioni != undefined && peso != undefined){
			var pesoConfezione = parseFloat(numeroConfezioni)*parseFloat(peso);
			if(quantitaTotale != null && quantitaTotale != undefined && quantitaTotale != ""){
				quantitaTotale = parseFloat(quantitaTotale) + parseFloat(pesoConfezione);
			} else {
				quantitaTotale = parseFloat(pesoConfezione);
			}
		}
	});
	if(quantitaTotale != null && quantitaTotale != undefined && quantitaTotale != ""){
		quantitaTotale = parseFloat(quantitaTotale)/1000;
	}
	$('#quantitaTotale').val(quantitaTotale);	
}

$.fn.computeQuantitaIngredienti = function() {
	var quantitaTotale = $('#quantitaTotale').val();
	if(quantitaTotale != null && quantitaTotale != undefined && quantitaTotale != ""){
		$('.formRowIngrediente').each(function(i, item){
			var percentuale = $(this).attr('data-percentuale');
			var quantitaIngrediente = parseFloat((parseFloat(percentuale)*parseFloat(quantitaTotale))/100);
			$(this).find('.quantitaIngrediente').val(quantitaIngrediente.toFixed(3));
		});
	}
}