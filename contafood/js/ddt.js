var baseUrl = "/contafood-be/";

$(document).ready(function() {

	$('#ddtArticoliTable').DataTable({
		"searching": false,
		"language": {
			"paginate": {
				"first": "Inizio",
				"last": "Fine",
				"next": "Succ.",
				//"previous": "<i class=\"fa fa-backward\" aria-hidden=\"true\"></i>"
				"previous": "Prec."
			},
			"emptyTable": "",
			"zeroRecords": ""
		},
		"pageLength": 10,
		"lengthChange": false,
		"info": false,
		"autoWidth": false,
		"order": [
			[0, 'asc']
		]
	});

	$(document).on('click','.detailsProduzione', function(){
		var idProduzione = $(this).attr('data-id');

		var alertContent = '<div id="alertProduzioneContent" class="alert alert-danger alert-dismissible fade show" role="alert">';
		alertContent = alertContent + '<strong>Errore nel recupero della produzione.</strong></div>';

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
		$('#detailsProduzioneModal').modal('show');
	});

	$(document).on('click','.closeProduzione', function(){
		$('#detailsProduzioneModalTable').DataTable().destroy();
		$('#detailsProduzioneModal').modal('hide');
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
			produzione.dataProduzione = $('#dataProduzione').val();
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
			produzione.scopo = $('input[name="generaLotto"]:checked').val();
			produzione.filmChiusura = $('#filmChiusura').val();
			produzione.lottoFilmChiusura = $('#lottoFilmChiusura').val();
			
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
					produzioneConfezione.lotto = $(this).find('.confezioneLotto').val();

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

					$('#newProduzioneButton').attr("disabled", true);

					// Returns to the page with the list of Produzione
					setTimeout(function() {
						window.location.href = "produzioni.html";
					}, 1000);
				},
				error: function(jqXHR, textStatus, errorThrown) {
					$('#alertProduzione').empty().append(alertContent.replace('@@alertText@@','Errore nella creazione della produzione').replace('@@alertResult@@', 'danger'));
				}
			});
		});
	}

	$(document).on('change','#cliente', function(){
		var cliente = $('#cliente option:selected').val();
		if(cliente != null && cliente != ''){
			$.ajax({
				url: baseUrl + "clienti/"+cliente+"/punti-consegna",
				type: 'GET',
				dataType: 'json',
				success: function(result) {
					if(result != null && result != undefined && result != ''){
						$('#puntoConsegna').empty();
						$.each(result, function(i, item){
							var label = item.nome+' - '+item.indirizzo+' '+item.localita+', '+item.cap+' ('+item.provincia+')';
							$('#puntoConsegna').append('<option value="'+item.id+'">'+label+'</option>');
						});
					}
					$('#puntoConsegna').removeAttr('disabled');

				},
				error: function(jqXHR, textStatus, errorThrown) {
					$('#alertDdt').empty().append(alertContent.replace('@@alertText@@','Errore nel caricamento dei punti di consegna').replace('@@alertResult@@', 'danger'));
				}
			});

		} else {
			$('#puntoConsegna').empty();
			$('#puntoConsegna').attr('disabled', true);
		}
	});

	$(document).on('change','#articolo', function(){
		var articolo = $('#articolo option:selected').val();
		if(articolo != null && articolo != ''){
			var udm = $('#articolo option:selected').attr('data-udm');
			var iva = $('#articolo option:selected').attr('data-iva');
			var quantita = $('#articolo option:selected').attr('data-qta');
			var prezzoBase = $('#articolo option:selected').attr('data-prezzo-base');

			$('#udm').attr('value', udm);
			$('#iva').attr('value', iva);
			$('#quantita').attr('value', quantita);
			$('#prezzo').attr('value', prezzoBase);

		} else {
			$('#udm').attr('value', null);
			$('#iva').attr('value', null);
			$('#lotto').attr('value', null);
			$('#quantita').attr('value', null);
			$('#pezzi').attr('value', null);
			$('#prezzo').attr('value', null);
			$('#sconto').attr('value', null);
		}
	});

	$(document).on('click','#addArticolo', function(event){
		event.preventDefault();

		var articoloId = $('#articolo option:selected').val();

		if(articoloId == null || articoloId == undefined || articoloId == ''){
			$('#addDdtArticoloAlert').removeClass("d-none");
			return;
		} else {
			$('#addDdtArticoloAlert').addClass("d-none");
		}

		var articolo = $('#articolo option:selected').text();
		var udm = $('#udm').val();
		var iva = $('#iva').val();
		var lotto = $('#lotto').val();
		var quantita = $('#quantita').val();
		var pezzi = $('#pezzi').val();
		var prezzo = $('#prezzo').val();
		var sconto = $('#sconto').val();
		var iva = $('#iva').val();

		var deleteLink = '<a class="deleteDdtArticolo" data-id="'+articoloId+'" href="#"><i class="far fa-trash-alt" title="Rimuovi"></i></a>';

		var table = $('#ddtArticoliTable').DataTable();
		var rowNode = table.row.add( [
			articolo,
			lotto,
			quantita,
			pezzi,
			prezzo,
			sconto,
			iva,
			deleteLink
		] ).draw( false ).node();
		$(rowNode).css('text-align', 'center');
		$(rowNode).addClass('rowArticolo');

		$.fn.computeTotale();
	});

	$(document).on('click','.deleteDdtArticolo', function(){
		var elem = $(this);
		elem.parent().parent().remove();

		$('#ddtArticoliTable').focus();

		$.fn.computeTotale();
	});

});

$.fn.preloadFields = function(){
	$.ajax({
		url: baseUrl + "ddts/progressivo",
		type: 'GET',
		dataType: 'json',
		success: function(result) {
			if(result != null && result != undefined && result != ''){
				$('#progressivo').attr('value', result.progressivo);
				$('#annoContabile').attr('value', result.annoContabile);
				$('#data').val(moment().format('YYYY-MM-DD'));
			}
		},
		error: function(jqXHR, textStatus, errorThrown) {
			console.log('Response text: ' + jqXHR.responseText);
		}
	});
}

$.fn.getClienti = function(){
	$.ajax({
		url: baseUrl + "clienti",
		type: 'GET',
		dataType: 'json',
		success: function(result) {
			if(result != null && result != undefined && result != ''){
				$.each(result, function(i, item){
					var label = '';
					if(item.dittaIndividuale){
						label += item.cognome + ' - ' + item.nome;
					} else {
						label += item.ragioneSociale;
					}
					label += ' - ' + item.indirizzo + ' ' + item.citta + ', ' + item.cap + ' (' + item.provincia + ')';

					var agente = item.agente;
					var idAgente = '-1';
					if(agente != null) {
						idAgente = agente.id;
					}
					$('#cliente').append('<option value="'+item.id+'" data-id-agente="'+idAgente+'">'+label+'</option>');
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
		url: baseUrl + "utils/tipologie-trasporto-ddt",
		type: 'GET',
		dataType: 'json',
		success: function(result) {
			if(result != null && result != undefined && result != ''){
				$.each(result, function(i, item){
					var tipologiaTrasporto = item;
					if(item != null && item != '' && item == 'Mittente'){
						$('#tipoTrasporto').append('<option value="'+item+'" selected>'+item+'</option>');
					} else {
						$('#tipoTrasporto').append('<option value="'+item+'">'+item+'</option>');
					}

				});
			}
		},
		error: function(jqXHR, textStatus, errorThrown) {
			console.log('Response text: ' + jqXHR.responseText);
		}
	});
}

$.fn.getTipologieTrasporto = function(){
	$.ajax({
		url: baseUrl + "articoli?attivo=true",
		type: 'GET',
		dataType: 'json',
		success: function(result) {
			if(result != null && result != undefined && result != ''){
				$.each(result, function(i, item){
					var dataUdm = '';
					var udm = item.unitaMisura;
					if(udm != null && udm != undefined){
						dataUdm = udm.etichetta;
					}
					var dataIva = '';
					var iva = item.aliquotaIva;
					if(iva != null && iva != undefined){
						dataIva = iva.valore;
					}
					var dataQta = item.quantitaPredefinita;
					var dataPrezzoBase = item.prezzoListinoBase;
					$('#articolo').append('<option value="'+item.id+'" data-udm="'+dataUdm+'" data-iva="'+dataIva+'" data-qta="'+dataQta+'" data-prezzo-base="'+dataPrezzoBase+'">'+item.codice+' '+item.descrizione+'</option>');

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
						rowHtml = rowHtml + '<input type="date" class="form-control scadenzaIngrediente" id="scadenzaIngrediente_' + id + '" style="font-size: smaller;"></div>';
						rowHtml = rowHtml + '<div class="form-group col-md-2">';

						if (i == 0) {
							rowHtml = rowHtml + '<label for="quantitaIngrediente">Quantita (Kg)</label>';
						}
						rowHtml = rowHtml + '<input type="number" class="form-control quantitaIngrediente" id="quantitaIngrediente_' + id + '" step=".01" min="0" value="' + quantita + '" onchange="$.fn.computeCostoIngredienti(this);" disabled style="text-align: right;"></div>';

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

$.fn.parseValue = function(value, resultType){
	if(value != null && value != undefined && value != ''){
		if(resultType == 'float'){
			return parseFloat(value);
		} else if(resultType == 'int'){
			return parseInt(value);
		} else {
			return value;
		}
	} else {
		if(resultType == 'float'){
			return 0.0;
		} else {
			return 0;
		}
	}
}

$.fn.computeTotale = function() {
	var totale;
	$('.rowArticolo').each(function(i, item){
		var quantita = $(this).children().eq(2).text();
		quantita = $.fn.parseValue(quantita, 'float');
		var pezzi = $(this).children().eq(3).text();
		pezzi = $.fn.parseValue(pezzi, 'int');
		var prezzo = $(this).children().eq(4).text();
		prezzo = $.fn.parseValue(prezzo, 'float');
		var sconto = $(this).children().eq(5).text();
		sconto = $.fn.parseValue(sconto, 'float');
		var iva = $(this).children().eq(6).text();
		iva = $.fn.parseValue(iva, 'int');

		var quantitaPerPrezzo = (quantita * prezzo);
		var totaleConIva = quantitaPerPrezzo + (quantitaPerPrezzo * (iva/100));

		if(totale == null || totale == undefined || totale == ''){
			totale = 0;
		}
		totale += (totaleConIva - sconto);
	});

	if(totale != null && totale != undefined && totale != ""){
		totale = parseFloat(totale);
	}
	$('#totale').val(totale);
}
