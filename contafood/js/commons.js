$(document).ready(function() {

    var pageType = $('#accordionSidebar').attr('data-page-type');
    if(pageType != null && pageType != undefined){
        if(pageType == 'anagrafiche'){
            $('.navbar').load('../commons/topbar.html');
            $('#accordionSidebar').load('../commons/sidebar-anagrafiche.html');
        } else if(pageType == 'configurazione'){
            $('.navbar').load('../commons/topbar.html');
            $('#accordionSidebar').load('../commons/sidebar-configurazione.html');
        }

    } else{
        $('.navbar').load('commons/topbar.html');
        $('#accordionSidebar').load('commons/sidebar.html');

    }
});