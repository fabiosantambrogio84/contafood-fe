$(document).ready(function() {

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

});
