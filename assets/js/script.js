function resizeHeadline(){
    var winH = jQuery(window).height();
    var vc = jQuery('.headline .vertically-centered');
    var mainNav = jQuery('.main-navigation');
    jQuery('.headline').height(winH);
    vc.css('margin-top',(( winH - mainNav.height() - vc.height() )/2) - 70);
    refreshMenuPos();
}

function refreshMenuPos(){
    var winH = jQuery(window).height();
    var mainNav = jQuery('.main-navigation');
    var scrollTop = jQuery(window).scrollTop();
    var headline = jQuery('.headline');

    if(scrollTop >= winH-mainNav.height() || headline.length === 0){
        mainNav.addClass('navbar-fixed-top');
        mainNav.removeClass('navbar-absolute-bottom');
        mainNav.css('top', 0);
        $('.droppable').css('top', '50px');
    }else{
        mainNav.addClass('navbar-absolute-bottom');
        mainNav.removeClass('navbar-fixed-top');
        mainNav.css('top', winH - mainNav.height());
        $('.droppable').css('top', '0px');
    }
}


function switchDropdownPosition(){
    if(jQuery('.headline').length == 1){
        var headlineHeight  = jQuery('.headline').height();
        var scrollTop       = jQuery(window).scrollTop();
        if(headlineHeight/2 > scrollTop){
            jQuery('.main-navigation li.dropdown').removeClass('dropdown').addClass('dropup');
        }else{
            jQuery('.main-navigation li.dropup').removeClass('dropup').addClass('dropdown');
        }
    }
}

jQuery(document).ready(function(){
    resizeHeadline();
    refreshMenuPos();
    switchDropdownPosition();
    jQuery(window).on('resize', resizeHeadline);
    jQuery(window).on('resize', switchDropdownPosition);
    jQuery(window).on('scroll', refreshMenuPos);
    jQuery(window).on('scroll', switchDropdownPosition);

    $('#drop-the-nav').on('click', function(e){
        e.preventDefault();
        if($('.droppable').hasClass("hiden")) {
            $('.droppable').slideDown("fast", "easeOutBack");
            $('.droppable').removeClass("hiden");
            $('.droppable').addClass("shown");
        } else {
            $('.droppable').slideUp("fast", "easeInBack");
            $('.droppable').removeClass("shown");
            $('.droppable').addClass("hiden");
        }
        
    })

    /**
     * focusing on content
     */
    
    // $("#main-content").hover(function(){
    //     $(this).siblings(".sidebar-widget").fadeTo("slow", 0.3 );
    // }, function() {
    //     $(this).siblings(".sidebar-widget").fadeTo("slow", 1 );
    // })

});


