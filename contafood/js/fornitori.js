$(document).ready(function() {
	var baseUrl = "http://localhost:8090/contafood-be/";
	
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
	                return '<a class="deleteFornitore" data-id="'+data.id+'" href="#"><i class="far fa-trash-alt"></i></a>';
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
	
});