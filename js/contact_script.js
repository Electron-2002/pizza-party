$(document).ready(function(){

    $(this).scrollTop(0);
    
    $(window).scroll(function(){
        if(this.scrollY > 20){
            $('.navbar').addClass("sticky");
        }
        else{
            $('.navbar').removeClass("sticky");
        }
    });

    $('.menu-button').click(function(){
        $('.menu').toggleClass('active');
        $('.menu-button i').toggleClass('active');
    });
});