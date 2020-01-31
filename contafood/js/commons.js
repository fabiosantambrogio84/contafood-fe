$(document).ready(function() {

    var pageType = $('#accordionSidebar').attr('data-page-type');
    if(pageType != null && pageType != undefined){
        if(pageType == 'anagrafiche'){
            $('.navbar').load('../commons/topbar.html');
            $('#accordionSidebar').load('../commons/sidebar-anagrafiche.html');
        } else if(pageType == 'configurazione'){
            $('.navbar').load('../commons/topbar.html');
            $('#accordionSidebar').load('../commons/sidebar-configurazione.html');
        } else if(pageType == 'produzione'){
            $('.navbar').load('../commons/topbar.html');
            $('#accordionSidebar').load('../commons/sidebar-produzione.html');
        } else if(pageType == 'magazzino'){
            $('.navbar').load('../commons/topbar.html');
            $('#accordionSidebar').load('../commons/sidebar-magazzino.html');
        } else if(pageType == 'ordini'){
            $('.navbar').load('../commons/topbar.html');
            $('#accordionSidebar').load('../commons/sidebar-ordini.html');
        } else if(pageType == 'contabilita'){
            $('.navbar').load('../commons/topbar.html');
            $('#accordionSidebar').load('../commons/sidebar-contabilita.html');
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
