$(document).ready(function() {
	var baseUrl = "http://localhost:8090/contafood-be/";

	$('#fornitoriTable').DataTable({
		"ajax": {
			"url": baseUrl + "fornitori",
			"type": "GET",
			"content-type": "json",
			"cache": false,
			"dataSrc": "",
			"error": function(jqXHR, textStatus, errorThrown) {
				console.log('Response text: ' + jqXHR.responseText);
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
			"emptyTable": "Nessun fornitore disponibile",
			"zeroRecords": "Nessun fornitore disponibile"
		},
		"pageLength": 20,
		"lengthChange": false,
		"info": false,
		"columns": [
			{"name": "codice", "data": "codice"},
			{"name": "ragioneSociale", "data": "ragioneSociale"},
			{"data": null, render: function ( data, type, row ) {
				var links = '<a class="updateFornitore pr-2" data-id="'+data.id+'" href="#"><i class="far fa-edit"></i></a>';
				links = links + '<a class="deleteFornitore" data-id="'+data.id+'" href="#"><i class="far fa-trash-alt"></i></a>';
				return links;
			}}
		]
	});

	/*
	$.ajax({
    	url: baseUrl + "fornitori",
    	type: 'GET',
    	dataType: 'json',
    	success: function(result) {
		  if(result != null && result != undefined && result != ''){
			//var jsonData = JSON.stringify(result);
			//console.log('--> ' + jsonData);
			result.forEach(function(elem, index){
				console.log("Fornitore num "+index+" - "+JSON.stringify(elem));
			});
			$('#fornitoriTable').DataTable({
				"ajax": {
					"url": baseUrl + "fornitori",
					"content-type": "json",
					"cache": false,
					"dataSrc": ""
				},
				"language": {
					"search": "Cerca",
					"paginate": {
						"first": "Inizio",
						"last": "Fine",
						"next": "Succ.",
						"previous": "Prec."
					},
					"emptyTable": "Nessun fornitore disponibile",
					"zeroRecords": "Nessun fornitore disponibile"
				},
				"pageLength": 20,
				"lengthChange": false,
				"info": false,
				"data": result,
				"columns": [
					{"name": "codice", "data": "codice"},
					{"name": "ragioneSociale", "data": "ragioneSociale"},
					{"data": null, render: function ( data, type, row ) {
						var links = '<a class="updateFornitore" data-id="'+data.id+'" href="#"><i class="far fa-edit"></i></a>';
						links = links + '<a class="deleteFornitore" data-id="'+data.id+'" href="#"><i class="far fa-trash-alt"></i></a>';
						return links;
						// <i class="far fa-edit"></i>
					}}
				]
			});

		  } else{
			//$('#fornitoriMainDiv').html('<p font-size:24px;">Nessun dato disponibile</p>')
		  }
    	},
		error: function(jqXHR, textStatus, errorThrown) {
		  console.log('Response text: ' + jqXHR.responseText);
		}
  	});
	*/
	$(document).on('click','.deleteFornitore', function(){
		var fornitoreId = $(this).attr('data-id');
		$('#confirmDeleteFornitore').attr('data-id', fornitoreId);
		$('#deleteFornitoreModal').modal('show');
	});

	$(document).on('click','#confirmDeleteFornitore', function(){
		$('#deleteFornitoreModal').modal('hide');
		var fornitoreId = $(this).attr('data-id');

		$.ajax({
			url: baseUrl + "fornitori/" + fornitoreId,
			type: 'DELETE',
			success: function() {
				var alertContent = '<strong>Fornitore</strong> cancellato con successo.\n' +
					'            <button type="button" class="close" data-dismiss="alert" aria-label="Close"><span aria-hidden="true">&times;</span></button>';
				$('#alertFornitore').addClass('alert alert-success alert-dismissible fade show').attr('role','alert');
				$('#alertFornitore').html(alertContent);

				$('#fornitoriTable').DataTable().ajax.reload();
			},
			error: function(jqXHR, textStatus, errorThrown) {
				console.log('Response text: ' + jqXHR.responseText);
			}
		});

	});

});
