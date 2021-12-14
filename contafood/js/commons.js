$(document).ready(function() {

    /*
        ================================
        MENU
        ================================
     */
    var pageType = $('#accordionSidebar').attr('data-page-type');
    if(pageType != null && pageType != undefined){
        $('.navbar').load('../commons/topbar.html');
        if(pageType == 'anagrafiche'){
            $('#accordionSidebar').load('../commons/sidebar-anagrafiche.html');
        } else if(pageType == 'configurazione'){
            $('#accordionSidebar').load('../commons/sidebar-configurazione.html');
        } else if(pageType == 'produzione'){
            $('#accordionSidebar').load('../commons/sidebar-produzione.html');
        } else if(pageType == 'magazzino'){
            $('#accordionSidebar').load('../commons/sidebar-magazzino.html');
        } else if(pageType == 'ordini'){
            $('#accordionSidebar').load('../commons/sidebar-ordini.html');
        } else if(pageType == 'contabilita'){
            $('#accordionSidebar').load('../commons/sidebar-contabilita.html');
        } else if(pageType == 'lotti-statistiche'){
            $('#accordionSidebar').load('../commons/sidebar-lotti-statistiche.html');
        } else if(pageType == 'stampe'){
            $('#accordionSidebar').load('../commons/sidebar-stampe.html');
        }

    } else{
        $('.navbar').load('commons/topbar.html');
        $('#accordionSidebar').load('commons/sidebar.html');
    }

    // Toggle the side navigation
    $(document).on('click','#sidebarToggle, #sidebarToggleTop', function(){
        $("body").toggleClass("sidebar-toggled");
        $(".sidebar").toggleClass("toggled");
        if ($(".sidebar").hasClass("toggled")) {
          $('.sidebar .collapse').collapse('hide');
        };
    });

    /*
        ================================
        END MENU
        ================================
     */

    $(document).on('change','#dataTrasporto', function(){
        $.fn.emptyArticoli();

        $.fn.loadArticoliFromOrdiniClienti();
    });

    $(document).on('change','#puntoConsegna', function(){
        $.fn.emptyArticoli();

        $.fn.loadArticoliFromOrdiniClienti();
    });

    $(document).on('change','.pezzi', function(){
        $.fn.checkPezziOrdinati();
    });

    $(document).on('change','#data', function(){
        $.fn.emptyArticoli();

        var data = $(this).val();
        var cliente = $('#cliente option:selected').val();
        if(data != null && data != undefined && data != '' && cliente != null && cliente != undefined && cliente != ''){
            $.fn.loadScontiArticoli(data, cliente);
        }
    });

});

/*
    ================================
    FUNCTIONS
    ================================
 */
$.fn.isDdt = function(){
    var result = false;
    var ddtLength = $('#containerDdt').length;
    if(ddtLength > 0){
        result = true;
    }
    return result;
}

$.fn.isFatturaAccompagnatoria = function(){
    var result = false;
    var fatturaAccompagnatoriaLength = $('#containerFatturaAccompagnatoria').length;
    if(fatturaAccompagnatoriaLength > 0){
        result = true;
    }
    return result;
}

$.fn.isRicevutaPrivato = function(){
    var result = false;
    var ricevutaPrivatoLength = $('#containerRicevutaPrivato').length;
    if(ricevutaPrivatoLength > 0){
        result = true;
    }
    return result;
}

$.fn.isDdtAcquisto = function(){
    var result = false;
    var ddtAcquistoLength = $('#containerDdtAcquisto').length;
    if(ddtAcquistoLength > 0){
        result = true;
    }
    return result;
}

$.fn.extractDataTrasportoFromUrl = function(){
    var pageUrl = window.location.search.substring(1);

    var urlVariables = pageUrl.split('&'),
        paramNames,
        i;

    for (i = 0; i < urlVariables.length; i++) {
        paramNames = urlVariables[i].split('=');

        if (paramNames[0] === 'dt') {
            return paramNames[1] === undefined ? null : decodeURIComponent(paramNames[1]);
        }
    }
}

$.fn.extractOraTrasportoFromUrl = function(){
    var pageUrl = window.location.search.substring(1);

    var urlVariables = pageUrl.split('&'),
        paramNames,
        i;

    for (i = 0; i < urlVariables.length; i++) {
        paramNames = urlVariables[i].split('=');

        if (paramNames[0] === 'ot') {
            return paramNames[1] === undefined ? null : decodeURIComponent(paramNames[1]);
        }
    }
}

$.fn.getStatoOrdineClienteEvaso = function(){

    var idStatoOrdineEvaso = 2;

    $.ajax({
        url: baseUrl + "stati-ordine/evaso",
        type: 'GET',
        ajax: false,
        dataType: 'json',
        success: function(result) {
            if(result != null && result != undefined && result != ''){
                idStatoOrdineEvaso = result.id;
            }

        },
        error: function(jqXHR, textStatus, errorThrown) {
            console.log('Errore nel recupero dello stato ordine evaso');
        }
    });

    return idStatoOrdineEvaso;
}

$.fn.getLottoRegExp = function(articolo){
    var lottoRegexp = articolo.barcodeRegexpLotto;
    var fornitore = articolo.fornitore;
    if($.fn.checkVariableIsNull(lottoRegexp)) {
        if(!$.fn.checkVariableIsNull(fornitore)){
            lottoRegexp = fornitore.barcodeRegexpLotto;
        }
    }
    return lottoRegexp;
}

$.fn.getDataScadenzaRegExp = function(articolo){
    var dataScadenzaRegexp = articolo.barcodeRegexpDataScadenza;
    var fornitore = articolo.fornitore;
    if($.fn.checkVariableIsNull(dataScadenzaRegexp)) {
        if(!$.fn.checkVariableIsNull(fornitore)){
            dataScadenzaRegexp = fornitore.barcodeRegexpDataScadenza;
        }
    }
    return dataScadenzaRegexp;
}

$.fn.fixDecimalPlaces = function(quantita, decimalPlaces){
    var quantitaFixed = quantita;

    if(quantita != null && quantita != undefined && quantita != ''){
        if(typeof quantita != "string"){
            quantita = quantita.toString();
        }

        if(quantita.indexOf('.') != -1){
            var numDecimalPlaces = quantita.substring(quantita.indexOf('.')+1, quantita.length).length;
            if(numDecimalPlaces > decimalPlaces){
                quantitaFixed = quantita.substring(0, quantita.indexOf('.')+1);
                quantitaFixed += quantita.substring(quantita.indexOf('.')+1, quantita.indexOf('.')+4);
            }
        }
    }

    return quantitaFixed;
}

$.fn.checkVariableIsNull = function(variable){
    if(variable == null || variable == undefined || variable == ''){
        return true;
    }
    return false;
}

$.fn.normalizeIfEmptyOrNullVariable = function(variable){
    if(variable != null && variable != undefined && variable != ''){
        return variable;
    }
    if(variable == null || variable == undefined){
        return '';
    }
    return '';
}

$.fn.formatNumber = function(value){
    return parseFloat(Number(Math.round(value+'e2')+'e-2')).toFixed(2);
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

$.fn.emptyArticoli = function(){

    var idTable;
    if($.fn.isDdt()){
        idTable += '#ddtArticoliTable';
    } else if($.fn.isFatturaAccompagnatoria()){
        idTable += '#fatturaAccompagnatoriaArticoliTable';
    } else if($.fn.isRicevutaPrivato()){
        idTable += '#ricevutaPrivatoArticoliTable';
    }

    $(idTable).DataTable().rows()
        .remove()
        .draw();
}

$.fn.validateLotto = function(){
    var validLotto = true;
    // check if all input fields 'lotto' are not empty
    $('.lotto').each(function(i, item){
        var lottoValue = $(this).val();
        if($.fn.checkVariableIsNull(lottoValue)){
            validLotto = false;
            return false;
        }
    });
    return validLotto;
}

$.fn.validateDataTrasporto = function(){
    var valid = true;

    var data = $('#data').val();
    var dataTrasporto = $('#dataTrasporto').val();
    if(data != null && dataTrasporto != null){
        var data_d = new Date(data);
        var dataTrasporto_d = new Date(dataTrasporto);
        if(dataTrasporto_d < data_d){
            valid = false;
        }
    }

    return valid;
}

$.fn.checkPezziOrdinati = function(){

    var articoliMap = new Map();
    var articoliArray = [];
    var ordiniClientiArticoliArray = [];

    $('.rowArticolo').each(function(i, item){
        var idArticolo = $(this).attr('data-id');
        var numeroPezzi = $(this).children().eq(5).children().eq(0).val();
        numeroPezzi = $.fn.parseValue(numeroPezzi, 'int');

        var totaliPezzi;
        if(articoliMap.has(idArticolo)){
            totaliPezzi = articoliMap.get(idArticolo);
        } else {
            totaliPezzi = 0;
        }
        totaliPezzi = totaliPezzi + numeroPezzi;
        articoliMap.set(idArticolo, totaliPezzi);

        articoliArray.push(idArticolo);

    });

    $('.ordineClienteArticolo').each(function(i, item){
        var idArticolo = $(this).attr('data-id-articolo');
        ordiniClientiArticoliArray.push(idArticolo);
    });

    articoliMap.forEach( (value, key, map) => {
        var ordiniClientiArticoloLength = $('#ordiniClientiArticoliTable span[data-id-articolo='+key+']').length;

        if(ordiniClientiArticoloLength != 0){
            var numeroPezziOrdinati = $('#ordiniClientiArticoliTable span[data-id-articolo='+key+']').parent().parent().children().eq(3).text();
            var numeroPezziEvasi = $('#ordiniClientiArticoliTable span[data-id-articolo='+key+']').parent().parent().attr('data-start-num-pezzi-evasi');
            numeroPezziOrdinati = $.fn.parseValue(numeroPezziOrdinati, 'int');
            numeroPezziEvasi = $.fn.parseValue(numeroPezziEvasi, 'int');
            value = $.fn.parseValue(value, 'int');

            var newNumeroPezziEvasi = numeroPezziEvasi + value;

            var backgroundColor;
            if(newNumeroPezziEvasi == numeroPezziOrdinati){
                backgroundColor = 'transparent';
            } else if(newNumeroPezziEvasi < numeroPezziOrdinati){
                backgroundColor = rowBackgroundRosa;
            } else {
                backgroundColor = rowBackgroundGiallo;
            }
            $('#ordiniClientiArticoliTable span[data-id-articolo='+key+']').parent().parent().css('background-color', backgroundColor).attr('data-num-pezzi-evasi', newNumeroPezziEvasi);

            var table = $('#ordiniClientiArticoliTable').DataTable();
            var rowData = table.row("[data-id-articolo='"+key+"']").data();
            rowData["numeroPezziEvasi"] = newNumeroPezziEvasi;
            table.row("[data-id-articolo='"+key+"']").data(rowData).draw();
        }

    });

    $(ordiniClientiArticoliArray).not(articoliArray).each(function(i, item){
        $('#ordiniClientiArticoliTable span[data-id-articolo='+item+']').parent().parent().css('background-color', rowBackgroundVerde);
    })
}

$.fn.computeTotale = function() {
    var ivaMap = new Map();
    var totaleDocumento = 0;

    $('.rowArticolo').each(function(i, item){
        var totale = $(this).children().eq(8).text();
        totale = $.fn.parseValue(totale, 'float');
        var iva = $(this).children().eq(9).text();
        iva = $.fn.parseValue(iva, 'int');

        var totaliIva;
        if(ivaMap.has(iva)){
            totaliIva = ivaMap.get(iva);
        } else {
            totaliIva = [];
        }
        totaliIva.push(totale);
        ivaMap.set(iva, totaliIva);

    });
    ivaMap.forEach( (value, key, map) => {
        var totalePerIva = value.reduce((a, b) => a + b, 0);
        var totaleConIva = totalePerIva + (totalePerIva * key/100);

        totaleDocumento += totaleConIva;

        if($.fn.isFatturaAccompagnatoria() || $.fn.isRicevutaPrivato()){
            // populating the table with iva and imponibile
            $('tr[data-valore='+key+']').find('td').eq(1).text($.fn.formatNumber((totalePerIva * key/100)));
            $('tr[data-valore='+key+']').find('td').eq(2).text($.fn.formatNumber(totalePerIva));
        }
    });

    if(totaleDocumento != null && totaleDocumento != undefined && totaleDocumento != ""){
        totaleDocumento = parseFloat(totaleDocumento);
    }
    $('#totale').val(Number(Math.round(totaleDocumento+'e2')+'e-2'));
}

$.fn.computeTotaleAndImponibile = function() {
    var ivaMap = new Map();
    var totaleIva = 0;
    var totaleDocumento = 0;
    var imponibileDocumento = 0;

    $('.rowProdotto').each(function(i, item){
        var iva = $(this).children().eq(9).text();
        iva = $.fn.parseValue(iva, 'float');
        var totale = $(this).children().eq(8).text();
        totale = $.fn.parseValue(totale, 'float');

        var totaliIva;
        if(ivaMap.has(iva)){
            totaliIva = ivaMap.get(iva);
        } else {
            totaliIva = [];
        }
        totaliIva.push(totale);
        ivaMap.set(iva, totaliIva);

    });
    ivaMap.forEach( (value, key, map) => {
        var totalePerIva = value.reduce((a, b) => a + b, 0);
        var totaleConIva = totalePerIva + (totalePerIva * key/100);

        totaleIva += (totalePerIva * key/100);
        imponibileDocumento += totalePerIva;
        totaleDocumento += totaleConIva;
    });

    totaleIva = parseFloat(totaleIva);
    totaleDocumento = parseFloat(totaleDocumento);
    imponibileDocumento = parseFloat(imponibileDocumento);
    $('#totale').val($.fn.formatNumber(totaleDocumento));
    $('#totaleIva').val($.fn.formatNumber(totaleIva));
    $('#totaleImponibile').val($.fn.formatNumber(imponibileDocumento));
}

$.fn.loadArticoliFromOrdiniClienti = function(){

    var alertLabel = 'alert';
    if($.fn.isDdt()){
        alertLabel += 'Ddt';
    } else if($.fn.isFatturaAccompagnatoria()){
        alertLabel += 'FattureAccompagnatorie';
    } else if($.fn.isRicevutaPrivato()){
        alertLabel += 'RicevutaPrivato';
    }

    var idStatoOrdineEvaso = $.fn.getStatoOrdineClienteEvaso();

    var dataConsegna = $('#dataTrasporto').val();
    var idCliente = $('#cliente option:selected').val();
    var idPuntoConsegna = $('#puntoConsegna option:selected').val();

    if($.fn.normalizeIfEmptyOrNullVariable(idCliente) != ''
        && $.fn.normalizeIfEmptyOrNullVariable(idPuntoConsegna) != ''
        && $.fn.normalizeIfEmptyOrNullVariable(dataConsegna) != ''){

        var url = baseUrl + "ordini-clienti/aggregate?idCliente="+idCliente;
        url += "&idPuntoConsegna="+idPuntoConsegna;
        url += "&dataConsegnaLessOrEqual="+moment(dataConsegna).format('YYYY-MM-DD');
        url += "&idStatoNot="+idStatoOrdineEvaso;

        $('#ordiniClientiArticoliTable').DataTable().destroy();

        $('#ordiniClientiArticoliTable').DataTable({
            "ajax": {
                "url": url,
                "type": "GET",
                "content-type": "json",
                "cache": false,
                "dataSrc": "",
                "error": function(jqXHR, textStatus, errorThrown) {
                    console.log('Response text: ' + jqXHR.responseText);
                    var alertContent = '<div id="'+alertLabel+'Content" class="alert alert-danger alert-dismissible fade show" role="alert">';
                    alertContent = alertContent + '<strong>Errore nel recupero degli ordini clienti</strong>\n' +
                        '            <button type="button" class="close" data-dismiss="alert" aria-label="Close"><span aria-hidden="true">&times;</span></button></div>';
                    $('#'+alertLabel).empty().append(alertContent);
                }
            },
            "language": {
                // "search": "Cerca",
                "paginate": {
                    "first": "Inizio",
                    "last": "Fine",
                    "next": "Succ.",
                    "previous": "Prec."
                },
                "emptyTable": "Nessun ordine cliente trovato",
                "zeroRecords": "Nessun ordine cliente trovato"
            },
            //"retrieve": true,
            "searching": false,
            "responsive":true,
            "pageLength": 5,
            "lengthChange": false,
            "info": false,
            "autoWidth": false,
            "order": [
                [1, 'asc']
            ],
            "columns": [
                {"name": "codiciOrdiniClienti", "data": "codiciOrdiniClienti", "width":"10%"},
                {"name": "articolo", "data": null, "width":"20%", render: function ( data, type, row ) {
                        var articolo = data.articolo;
                        var span = '<span class="ordineClienteArticolo "';
                        span += 'data-id-articolo="'+data.idArticolo+'" data-ids-ordini="'+data.idsOrdiniClienti+'"';
                        span += '>'+articolo+'</span>';
                        return span;
                    }},
                {"name": "prezzoListinoBase", "data": "prezzoListinoBase", "width":"5%"},
                {"name": "numeroPezziDaEvadere", "data": "numeroPezziOrdinati", "width":"3%"},
                {"name": "numeroPezziEvasi", "data": "numeroPezziEvasi", "width":"3%"}
            ],
            "createdRow": function(row, data, dataIndex,cells){
                $(row).css('background-color',rowBackgroundVerde).css('font-size', 'smaller');
                $(row).attr('data-id-articolo', data.idArticolo);
                $(row).attr('data-start-num-pezzi-evasi', data.numeroPezziEvasi);
                $(cells[0]).css('text-align','center');
                $(cells[1]).css('text-align','center');
                $(cells[2]).css('text-align','center');
                $(cells[3]).css('text-align','center');
                $(cells[4]).css('text-align','center');
            }
        });
    }
}

$.fn.groupArticoloRow = function(insertedRow){
    var insertedRowIndex = insertedRow.attr("data-row-index");
    var articoloId = insertedRow.attr("data-id");
    var	lotto = insertedRow.children().eq(1).children().eq(0).val();
    var	scadenza = insertedRow.children().eq(2).children().eq(0).val();
    var quantita = insertedRow.children().eq(4).children().eq(0).val();
    var pezzi = insertedRow.children().eq(5).children().eq(0).val();
    //var pezziDaEvadere = insertedRow.children().eq(6).children().eq(0).val();
    var	prezzo = insertedRow.children().eq(6).children().eq(0).val();
    var	sconto = insertedRow.children().eq(7).children().eq(0).val();

    var found = 0;
    var currentRowIndex = 0;
    //var currentIdOrdineCliente;
    var currentIdArticolo;
    var currentLotto;
    var currentScadenza;
    var currentPrezzo;
    var currentSconto;
    var currentPezzi = 0;
    //var currentPezziDaEvadere = 0;
    var currentQuantita = 0;

    var articoliLength = $('.rowArticolo').length;
    if(articoliLength != null && articoliLength != undefined && articoliLength != 0) {
        $('.rowArticolo').each(function(i, item){

            if(found != 1){
                currentRowIndex = $(this).attr('data-row-index');
                if(currentRowIndex != insertedRowIndex){
                    //currentIdOrdineCliente = $(this).attr('data-id-ordine-cliente');
                    currentIdArticolo = $(this).attr('data-id');
                    currentLotto = $(this).children().eq(1).children().eq(0).val();
                    currentScadenza = $(this).children().eq(2).children().eq(0).val();
                    currentPrezzo = $(this).children().eq(6).children().eq(0).val();
                    currentSconto = $(this).children().eq(7).children().eq(0).val();
                    if(currentSconto == '0'){
                        currentSconto = '';
                    }
                    //currentPezziDaEvadere = $(this).children().eq(6).children().eq(0).val();

                    if($.fn.normalizeIfEmptyOrNullVariable(currentIdArticolo) == $.fn.normalizeIfEmptyOrNullVariable(articoloId)
                        && $.fn.normalizeIfEmptyOrNullVariable(currentLotto) == $.fn.normalizeIfEmptyOrNullVariable(lotto)
                        && $.fn.normalizeIfEmptyOrNullVariable(currentPrezzo) == $.fn.normalizeIfEmptyOrNullVariable(prezzo)
                        && $.fn.normalizeIfEmptyOrNullVariable(currentSconto) == $.fn.normalizeIfEmptyOrNullVariable(sconto)
                        && $.fn.normalizeIfEmptyOrNullVariable(currentScadenza) == $.fn.normalizeIfEmptyOrNullVariable(scadenza)){
                        found = 1;
                        currentQuantita = $(this).children().eq(4).children().eq(0).val();
                        currentPezzi = $(this).children().eq(5).children().eq(0).val();
                    }
                }
            }
        });
    }

    var table;
    if($.fn.isDdt()){
        table = $('#ddtArticoliTable').DataTable();
    } else if($.fn.isFatturaAccompagnatoria()){
        table = $('#fatturaAccompagnatoriaArticoliTable').DataTable();
    } else if($.fn.isRicevutaPrivato()){
        table = $('#ricevutaPrivatoArticoliTable').DataTable();
    }

    if(found >= 1){

        var totale = 0;
        quantita = $.fn.parseValue(quantita, 'float');
        prezzo = $.fn.parseValue(prezzo, 'float');
        sconto = $.fn.parseValue(sconto, 'float');
        pezzi = $.fn.parseValue(pezzi, 'int');

        var quantitaPerPrezzo = ((quantita + $.fn.parseValue(currentQuantita,'float')) * prezzo);
        var scontoValue = (sconto/100)*quantitaPerPrezzo;
        totale = Number(Math.round((quantitaPerPrezzo - scontoValue) + 'e2') + 'e-2');

        // aggiorno la riga
        $.fn.aggiornaRigaArticolo(table,currentRowIndex,currentQuantita,currentPezzi,lotto,scadenza,prezzo,sconto,
            quantita,pezzi,null,null,null,totale);

        table.row("[data-row-index='"+insertedRowIndex+"']").remove().draw();
    }

    $.fn.computeTotale();

    $.fn.checkPezziOrdinati();
}

$.fn.groupProdottoRow = function(insertedRow){
    var insertedRowIndex = insertedRow.attr("data-row-index");
    var articoloId = insertedRow.attr("data-id");
    var	lotto = insertedRow.children().eq(1).children().eq(0).val();
    var	scadenza = insertedRow.children().eq(2).children().eq(0).val();
    var quantita = insertedRow.children().eq(4).children().eq(0).val();
    var pezzi = insertedRow.children().eq(5).children().eq(0).val();
    var	prezzo = insertedRow.children().eq(6).children().eq(0).val();
    var	sconto = insertedRow.children().eq(7).children().eq(0).val();

    var found = 0;
    var currentRowIndex = 0;
    var currentIdArticolo;
    var currentLotto;
    var currentScadenza;
    var currentPrezzo;
    var currentSconto;
    var currentQuantita = 0;
    var currentPezzi = 0;

    var ddtProdottiLength = $('.rowProdotto').length;
    if(ddtProdottiLength != null && ddtProdottiLength != undefined && ddtProdottiLength != 0) {
        $('.rowProdotto').each(function(i, item){

            if(found != 1){
                currentRowIndex = $(this).attr('data-row-index');
                if(currentRowIndex != insertedRowIndex){
                    //currentIdOrdineCliente = $(this).attr('data-id-ordine-cliente');
                    currentIdArticolo = $(this).attr('data-id');
                    currentLotto = $(this).children().eq(1).children().eq(0).val();
                    currentScadenza = $(this).children().eq(2).children().eq(0).val();
                    currentPrezzo = $(this).children().eq(5).children().eq(0).val();
                    currentSconto = $(this).children().eq(6).children().eq(0).val();
                    if(currentSconto == '0'){
                        currentSconto = '';
                    }

                    if($.fn.normalizeIfEmptyOrNullVariable(currentIdArticolo) == $.fn.normalizeIfEmptyOrNullVariable(articoloId)
                        && $.fn.normalizeIfEmptyOrNullVariable(currentLotto) == $.fn.normalizeIfEmptyOrNullVariable(lotto)
                        && $.fn.normalizeIfEmptyOrNullVariable(currentPrezzo) == $.fn.normalizeIfEmptyOrNullVariable(prezzo)
                        && $.fn.normalizeIfEmptyOrNullVariable(currentSconto) == $.fn.normalizeIfEmptyOrNullVariable(sconto)
                        && $.fn.normalizeIfEmptyOrNullVariable(currentScadenza) == $.fn.normalizeIfEmptyOrNullVariable(scadenza)){
                        found = 1;
                        currentQuantita = $(this).children().eq(4).children().eq(0).val();
                        currentPezzi = $(this).children().eq(5).children().eq(0).val();
                    }
                }
            }
        });
    }

    var table = $('#ddtAcquistoProdottiTable').DataTable();
    if(found >= 1){

        var totale = 0;
        quantita = $.fn.parseValue(quantita, 'float');
        prezzo = $.fn.parseValue(prezzo, 'float');
        sconto = $.fn.parseValue(sconto, 'float');
        pezzi = $.fn.parseValue(pezzi, 'int');

        var quantitaPerPrezzo = ((quantita + $.fn.parseValue(currentQuantita,'float')) * prezzo);
        var scontoValue = (sconto/100)*quantitaPerPrezzo;
        totale = Number(Math.round((quantitaPerPrezzo - scontoValue) + 'e2') + 'e-2');

        // aggiorno la riga
        $.fn.aggiornaRigaProdotto(table,currentRowIndex,articoloId,currentQuantita,currentPezzi,lotto,scadenza,prezzo,sconto,quantita,pezzi,null,null,totale);
        table.row("[data-row-index='"+insertedRowIndex+"']").remove().draw();
    }

    $.fn.computeTotaleAndImponibile();

}

$.fn.inserisciRigaArticolo = function(table,currentIdOrdineCliente,articoloId,articolo,
                                      lottoHtml,scadenzaHtml,udm,quantitaHtml,pezziHtml,prezzoHtml,scontoHtml,
                                      totale,iva){

    var deleteLinkClass = 'delete';
    if($.fn.isDdt()){
        deleteLinkClass += 'DdtArticolo';
    } else if($.fn.isFatturaAccompagnatoria()){
        deleteLinkClass += 'FatturaAccompagnatoriaArticolo';
    } else if($.fn.isRicevutaPrivato()){
        deleteLinkClass += 'RicevutaPrivatoArticolo';
    } else if($.fn.isDdtAcquisto()){
        deleteLinkClass += 'DdtProdotto';
    }
    var deleteLink = '<a class="'+deleteLinkClass+'" data-id="'+articoloId+'" href="#"><i class="far fa-trash-alt" title="Rimuovi"></i></a>';

    var rowsCount = table.rows().count();

    var rowNode = table.row.add( [
        articolo,
        lottoHtml,
        scadenzaHtml,
        udm,
        quantitaHtml,
        pezziHtml,
        prezzoHtml,
        scontoHtml,
        totale,
        iva,
        deleteLink
    ] ).draw( false ).node();
    $(rowNode).css('text-align', 'center').css('color','#080707');
    var cssClass = 'rowArticolo';
    $(rowNode).addClass(cssClass);
    $(rowNode).attr('data-id', articoloId);
    $(rowNode).attr('data-row-index', parseInt(rowsCount) + 1);
}

$.fn.aggiornaRigaArticolo = function(table,currentRowIndex,currentQuantita,currentPezzi,lotto,scadenza,prezzo,sconto,
                                     quantita,pezzi,codiceFornitore,lottoRegExp,dataScadenzaRegExp,totale){

    var newQuantita = (quantita + $.fn.parseValue(currentQuantita,'float'));
    var newPezzi = pezzi + $.fn.parseValue(currentPezzi,'int');

    var newQuantitaHtml = '<input type="number" step=".001" min="0" class="form-control form-control-sm text-center compute-totale ignore-barcode-scanner" value="'+ $.fn.fixDecimalPlaces(newQuantita, 3) +'">';
    var newPezziHtml = '<input type="number" step="1" min="0" class="form-control form-control-sm text-center compute-totale ignore-barcode-scanner pezzi" value="'+newPezzi+'">';

    var lottoHtml = '<input type="text" class="form-control form-control-sm text-center compute-totale lotto group" value="'+lotto+'" data-codice-fornitore="'+codiceFornitore+'" data-lotto-regexp="'+lottoRegExp+'" data-scadenza-regexp="'+dataScadenzaRegExp+'">';
    var scadenzaHtml = '<input type="date" class="form-control form-control-sm text-center compute-totale ignore-barcode-scanner scadenza group" value="'+moment(scadenza).format('YYYY-MM-DD')+'">';

    //var pezziDaEvadereHtml = '<input type="number" step="1" min="0" class="form-control form-control-sm text-center compute-totale ignore-barcode-scanner pezziDaEvadere" value="'+pezziDaEvadere+'">';
    var prezzoHtml = '<input type="number" step=".001" min="0" class="form-control form-control-sm text-center compute-totale ignore-barcode-scanner group" value="'+prezzo+'">';
    var scontoHtml = '<input type="number" step=".001" min="0" class="form-control form-control-sm text-center compute-totale ignore-barcode-scanner group" value="'+sconto+'">';

    var rowData = table.row("[data-row-index='"+currentRowIndex+"']").data();
    rowData[1] = lottoHtml;
    rowData[2] = scadenzaHtml;
    rowData[4] = newQuantitaHtml;
    rowData[5] = newPezziHtml;
    rowData[6] = prezzoHtml;
    rowData[7] = scontoHtml;
    rowData[8] = totale;
    table.row("[data-row-index='"+currentRowIndex+"']").data(rowData).draw();
}

$.fn.inserisciRigaProdotto = function(table,articoloId,articolo,lottoHtml,scadenzaHtml,udm,quantitaHtml,pezziHtml,prezzoHtml,scontoHtml,totale,iva,tipo){

    var deleteLink = '<a class="deleteDdtProdotto" data-id="'+articoloId+'" href="#"><i class="far fa-trash-alt" title="Rimuovi"></i></a>';

    var rowsCount = table.rows().count();

    var rowNode = table.row.add( [
        articolo,
        lottoHtml,
        scadenzaHtml,
        udm,
        quantitaHtml,
        pezziHtml,
        prezzoHtml,
        scontoHtml,
        totale,
        iva,
        deleteLink
    ] ).draw( false ).node();
    $(rowNode).css('text-align', 'center').css('color','#080707');
    $(rowNode).addClass('rowProdotto');
    $(rowNode).attr('data-id', articoloId);
    $(rowNode).attr('data-tipo', tipo);
    $(rowNode).attr('data-row-index', parseInt(rowsCount) + 1);
}

$.fn.aggiornaRigaProdotto = function(table,currentRowIndex,articoloId,currentQuantita,currentPezzi,lotto,scadenza,prezzo,sconto,
                                     quantita,pezzi,codiceFornitore,lottoRegExp,dataScadenzaRegExp,totale){

    var newQuantita = (quantita + $.fn.parseValue(currentQuantita,'float'));
    var newPezzi = pezzi + $.fn.parseValue(currentPezzi,'int');

    var newQuantitaHtml = '<input type="number" step=".001" min="0" class="form-control form-control-sm text-center compute-totale ignore-barcode-scanner" value="'+ $.fn.fixDecimalPlaces(newQuantita, 3) +'">';
    var newPezziHtml = '<input type="number" step="1" min="0" class="form-control form-control-sm text-center compute-totale ignore-barcode-scanner pezzi" value="'+newPezzi+'">';

    var lottoHtml = '<input type="text" class="form-control form-control-sm text-center compute-totale lotto group" value="'+lotto+'" data-codice-fornitore="'+codiceFornitore+'" data-lotto-regexp="'+lottoRegExp+'" data-scadenza-regexp="'+dataScadenzaRegExp+'">';
    var scadenzaHtml = '<input type="date" class="form-control form-control-sm text-center compute-totale ignore-barcode-scanner scadenza group" value="'+moment(scadenza).format('YYYY-MM-DD')+'">';
    var prezzoHtml = '<input type="number" step=".001" min="0" class="form-control form-control-sm text-center compute-totale ignore-barcode-scanner group" value="'+prezzo+'">';
    var scontoHtml = '<input type="number" step=".001" min="0" class="form-control form-control-sm text-center compute-totale ignore-barcode-scanner group" value="'+sconto+'">';

    var rowData = table.row("[data-row-index='"+currentRowIndex+"']").data();
    rowData[1] = lottoHtml;
    rowData[2] = scadenzaHtml;
    rowData[4] = newQuantitaHtml;
    rowData[5] = newPezziHtml;
    rowData[6] = prezzoHtml;
    rowData[7] = scontoHtml;
    rowData[8] = totale;
    table.row("[data-row-index='"+currentRowIndex+"']").data(rowData).draw();
}
