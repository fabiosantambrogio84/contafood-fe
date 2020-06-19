var baseUrl = "/contafood-be/";

$.fn.loadGiacenzeTable = function(url) {
	$('#giacenzeTable').DataTable({
		"processing": true,
		"ajax": {
			"url": url,
			"type": "GET",
			"content-type": "json",
			"cache": false,
			"dataSrc": "",
			"error": function(jqXHR, textStatus, errorThrown) {
				console.log('Response text: ' + jqXHR.responseText);
				var alertContent = '<div id="alertGiacenzaContent" class="alert alert-danger alert-dismissible fade show" role="alert">';
				alertContent = alertContent + '<strong>Errore nel recupero delle giacenze</strong>\n' +
					'            <button type="button" class="close" data-dismiss="alert" aria-label="Close"><span aria-hidden="true">&times;</span></button></div>';
				$('#alertGiacenza').empty().append(alertContent);
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
			"emptyTable": "Nessuna giacenza disponibile",
			"zeroRecords": "Nessuna giacenza disponibile"
		},
		"pageLength": 20,
		"lengthChange": false,
		"info": false,
		"autoWidth": false,
		"order": [
			[1, 'asc'],
			[4, 'asc'],
			[5, 'asc']
		],
		"columns": [
			{"data": null, "orderable":false, "width": "2%", render: function ( data, type, row ) {
				var checkboxHtml = '<input type="checkbox" data-id="'+data.id+'" id="checkbox_'+data.id+'" class="deleteGiacenzaCheckbox">';
				return checkboxHtml;
			}},
			{"name": "articolo", "data": null, render: function ( data, type, row ) {
				var articolo = data.articolo;
				if(articolo != null){
					var articoloHtml = articolo.codice + ' '+articolo.descrizione;
					return articoloHtml;
				} else {
					return '';
				}
			}},
			{"name": "attivo", "data": null, render: function ( data, type, row ) {
				var articolo = data.articolo;
				if(articolo != null){
					var attivo = articolo.attivo;
					if(attivo != null){
						//return attivo;
						return attivo == true ? 'Si' : 'No';
					} else {
						return '';
					}
				} else {
					return '';
				}
			}},
			{"name": "fornitore", "data": null, render: function ( data, type, row ) {
				var articolo = data.articolo;
				if(articolo != null){
					var fornitore = articolo.fornitore;
					return fornitore.ragioneSociale;
				} else {
					return '';
				}
			}},
			{"name": "lotto", "data": "lotto"},
			{"name": "scadenza", "data": null, "width":"8%", render: function ( data, type, row ) {
				if(data.scadenza != null){
					var a = moment(data.scadenza);
					return a.format('DD/MM/YYYY');
				} else {
					return '';
				}
			}},
			{"name": "quantita", "data": "quantita"},
			{"data": null, "orderable":false, "width":"4%", render: function ( data, type, row ) {
				var links = '<a class="detailsGiacenza pr-2" data-id="'+data.id+'" href="#"><i class="fas fa-info-circle" title="Dettagli"></i></a>';
				return links;
			}}
		],
		"createdRow": function(row, data, dataIndex,cells){
			$(row).css('font-size', '12px');
			$(cells[1]).css('text-align','left');
			$(cells[2]).css('text-align','left');
			$(cells[3]).css('text-align','left');
			$(cells[4]).css('text-align','left');
			$(cells[6]).css('font-weight','bold');
			if(data.quantita == 0){
				$(row).css('background-color', '#dedcd7');
			}
		}
	});
}

$(document).ready(function() {

	$.fn.loadGiacenzeTable(baseUrl + "giacenze-articoli");

	$(document).on('click','#deleteGiacenzeBulk', function(){
		$('#deleteGiacenzeBulkModal').modal('show');
	});

	$(document).on('click','#confirmDeleteGiacenzeBulk', function(){
		$('#deleteGiacenzeBulkModal').modal('hide');

		var alertContent = '<div id="alertGiacenzaContent" class="alert alert-@@alertResult@@ alert-dismissible fade show" role="alert">';
		alertContent = alertContent + '<strong>@@alertText@@</strong>\n' +
			'<button type="button" class="close" data-dismiss="alert" aria-label="Close"><span aria-hidden="true">&times;</span></button></div>';

		var numChecked = $('.deleteGiacenzaCheckbox:checkbox:checked').length;
		if(numChecked == null || numChecked == undefined || numChecked == 0){
			var alertContent = '<div id="alertGiacenzaContent" class="alert alert-danger alert-dismissible fade show" role="alert">';
			alertContent = alertContent + '<strong>Selezionare almeno una giacenza</strong>\n' +
				'            <button type="button" class="close" data-dismiss="alert" aria-label="Close"><span aria-hidden="true">&times;</span></button></div>';
			$('#alertGiacenza').empty().append(alertContent);
		} else{
			var giacenzeIds = [];
			$('.deleteGiacenzaCheckbox:checkbox:checked').each(function(i, item) {
				var id = item.id.replace('checkbox_', '');
				giacenzeIds.push(id);
			});
			$.ajax({
				url: baseUrl + "giacenze-articoli/operations/delete",
				type: 'POST',
				contentType: "application/json",
				dataType: 'json',
				data: JSON.stringify(giacenzeIds),
				success: function(result) {
					$('#alertGiacenza').empty().append(alertContent.replace('@@alertText@@','Giacenze cancellate con successo').replace('@@alertResult@@', 'success'));

					$('#giacenzeTable').DataTable().ajax.reload();
				},
				error: function(jqXHR, textStatus, errorThrown) {
					$('#alertGiacenza').empty().append(alertContent.replace('@@alertText@@','Errore nella cancellazione delle giacenze').replace('@@alertResult@@', 'danger'));
				}
			});
		}
	});

	$(document).on('click','.detailsGiacenza', function(){
		var idGiacenza = $(this).attr('data-id');

		var alertContent = '<div id="alertGiacenzaContent" class="alert alert-danger alert-dismissible fade show" role="alert">';
		alertContent = alertContent + '<strong>Errore nel recupero della giacenza.</strong></div>';

		$.ajax({
			url: baseUrl + "giacenze-articoli/" + idGiacenza,
			type: 'GET',
			dataType: 'json',
			success: function(result) {
				if(result != null && result != undefined && result != '') {
					var articolo = result.articolo;
					if(articolo != null){
						$('#articolo').text(articolo.codice+' '+articolo.descrizione);
					}
					$('#lotto').text(result.lotto);
					if(result.scadenza != null){
						$('#scadenza').text(moment(result.scadenza).format('DD/MM/YYYY'));
					} else {
						$('#scadenza').text("");
					}
					$('#quantita').text(result.quantita);

					if(result.movimentazioni != null && result.movimentazioni != undefined){
						$('#detailsGiacenzaModalTable').DataTable({
							"data": result.movimentazioni,
							"language": {
								"paginate": {
									"first": "Inizio",
									"last": "Fine",
									"next": "Succ.",
									"previous": "Prec."
								},
								"search": "Cerca",
								"emptyTable": "Nessuna movimentazione presente",
								"zeroRecords": "Nessuna movimentazione presente"
							},
							"pageLength": 100,
							"lengthChange": false,
							"info": false,
							"autoWidth": false,
							"searching": false,
							"order": [
								[0, 'desc']
							],
							"columns": [
								{"name": "data", "data": "data", "visible":false},
								{"name": "movimentazione", "data": null, render: function (data, type, row) {
									var result = '';
									if (data.descrizione != null) {
										if (data.inputOutput != null) {
											if(data.inputOutput == 'INPUT'){
												result = '<span style="color:green;padding-right:5px;"><i class="fas fa-arrow-down"></i></span>';
											} else if(data.inputOutput == 'OUTPUT'){
												result = '<span style="color:red;padding-right:5px;"><i class="fas fa-arrow-up"></i></span>';
											}
										}
										result += data.descrizione;
									}
									return result;
								}}
							],
							"createdRow": function(row, data, dataIndex,cells){
								$(row).css('text-align', 'center');
								/*
								if(data.inputOutput != null){
									var backgroundColor = '';
									if(data.inputOutput == 'INPUT'){
										backgroundColor = 'green';
									} else if(data.inputOutput == 'OUTPUT'){
										backgroundColor = 'red';
									} else {
										backgroundColor = 'trasparent';
									}
									$(row).css('background-color', backgroundColor);
								}
								*/
							}
						});
					}

				} else{
					$('#detailsGiacenzaMainDiv').empty().append(alertContent);
				}
			},
			error: function(jqXHR, textStatus, errorThrown) {
				$('#detailsGiacenzaMainDiv').empty().append(alertContent);
				console.log('Response text: ' + jqXHR.responseText);
			}
		})

		$('#detailsGiacenzaModal').modal('show');
	});

	$(document).on('click','.closeGiacenza', function(){
		$('#detailsGiacenzaModalTable').DataTable().destroy();
		$('#detailsGiacenzaModal').modal('hide');
	});

	$(document).on('click','#resetSearchGiacenzaButton', function(){
		$('#searchGiacenzaForm :input').val(null);
		$('#searchGiacenzaForm select option[value=""]').attr('selected', true);

		$('#giacenzeTable').DataTable().destroy();
		$.fn.loadGiacenzeTable(baseUrl + "giacenze");
	});

	if($('#searchGiacenzaButton') != null && $('#searchGiacenzaButton') != undefined) {
		$(document).on('submit', '#searchGiacenzaForm', function (event) {
			event.preventDefault();

			var articolo = $('#searchArticolo').val();
			var attivo = $('#searchAttivo').val();
			var idFornitore = $('#searchFornitore option:selected').val();
			var lotto = $('#searchLotto').val();
			var scadenza = $('#searchScadenza').val();

			var params = {};
			if(articolo != null && articolo != undefined && articolo != ''){
				params.articolo = articolo;
			}
			if(attivo != null && attivo != undefined && attivo != ''){
				params.attivo = attivo;
			}
			if(idFornitore != null && idFornitore != undefined && idFornitore != ''){
				params.idFornitore = idFornitore;
			}
			if(lotto != null && lotto != undefined && lotto != ''){
				params.lotto = lotto;
			}
			if(scadenza != null && scadenza != undefined && scadenza != ''){
				params.scadenza = scadenza;
			}
			var url = baseUrl + "giacenze?" + $.param( params );

			$('#giacenzeTable').DataTable().destroy();
			$.fn.loadGiacenzeTable(url);

		});
	}

	if($('#newGiacenzaButton') != null && $('#newGiacenzaButton') != undefined){

		$('#articolo').selectpicker();

		$(document).on('submit','#newGiacenzaForm', function(event){
			event.preventDefault();

			var giacenza = new Object();

			var idArticolo = $('#articolo option:selected').val();
			if(idArticolo != null && idArticolo != ''){
			    var articolo = new Object();
                articolo.id = idArticolo;
				giacenza.articolo = articolo;
			}
			giacenza.lotto = $('#lotto').val();
			giacenza.scadenza = $('#scadenza').val();
			giacenza.quantita = $('#quantita').val();

			var giacenzaJson = JSON.stringify(giacenza);

			var alertContent = '<div id="alertGiacenzaContent" class="alert alert-@@alertResult@@ alert-dismissible fade show" role="alert">';
			alertContent = alertContent + '<strong>@@alertText@@</strong>\n' +
				'<button type="button" class="close" data-dismiss="alert" aria-label="Close"><span aria-hidden="true">&times;</span></button></div>';

			$.ajax({
				url: baseUrl + "giacenze",
				type: 'POST',
				contentType: "application/json",
				dataType: 'json',
				data: giacenzaJson,
				success: function(result) {
					$('#alertGiacenza').empty().append(alertContent.replace('@@alertText@@','Giacenza creata con successo').replace('@@alertResult@@', 'success'));

					// Returns to giacenze-articoli.html
					setTimeout(function() {
						window.location.href = "giacenze-articoli.html";
					}, 1000);
				},
				error: function(jqXHR, textStatus, errorThrown) {
					$('#alertGiacenza').empty().append(alertContent.replace('@@alertText@@','Errore nella creazione della giacenza').replace('@@alertResult@@', 'danger'));
				}
			});
		});
	}
});

$.fn.printVariable = function(variable){
	if(variable != null && variable != undefined && variable != ""){
		return variable;
	}
	return "";
}

$.fn.preloadSearchFields = function(){
	$.ajax({
		url: baseUrl + "fornitori?codiceTipo=FORNITORE_ARTICOLI",
		type: 'GET',
		dataType: 'json',
		success: function(result) {
			if(result != null && result != undefined && result != ''){
				$.each(result, function(i, item){
					$('#searchFornitore').append('<option value="'+item.id+'" >'+item.ragioneSociale+'</option>');
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
					$('#articolo').append('<option value="'+item.id+'">'+item.codice+' '+item.descrizione+'</option>');

					$('#articolo').selectpicker('refresh');
				});
			}
		},
		error: function(jqXHR, textStatus, errorThrown) {
			console.log('Response text: ' + jqXHR.responseText);
		}
	});
}
