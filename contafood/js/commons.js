$(document).ready(function() {

    var pageType = $('#accordionSidebar').attr('data-page-type');
    if(pageType != null && pageType != undefined && pageType == 'anagrafiche'){
        $('.navbar').load('../resources/topbar.html');
        $('#accordionSidebar').load('../resources/sidebar-anagrafiche.html');

    } else{
        $('.navbar').load('resources/topbar.html');
        $('#accordionSidebar').load('resources/sidebar.html');

    }
});