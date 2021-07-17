$("#loginModal .nav-tabs button").on("click", function () {
    $("#loginModal .nav-tabs button").removeClass("active");
    $(this).addClass("active");
    let data_hef = $(this).attr("data-bs-target");

    $("#loginModal .tab-content .tab-pane").removeClass("active show");
    $(data_hef).addClass("active show");
});

$(".btn-ranger a").on("click", function () {
    let data_hef = $(this).attr("data-bs-target");

    $("#loginModal .nav-tabs button").removeClass("active");
    $("#loginModal .tab-content .tab-pane").removeClass("active show");

    $("#" + data_hef).addClass("active show");
    $(".btn-" + data_hef).addClass("active");
});

$('.content-item .item h2').on('click', function () { 
    if($(this).hasClass('active')) {
        $(this).removeClass('active');
        $(this).parent().find('.item_list').slideUp();
    } else {
        $(this).addClass('active');
        $(this).parent().find('.item_list').slideDown();
    }
});

$(".list-box-tutorial").on("click", function () {
    $(".list-box-tutorial").removeClass("active");
    $(this).addClass("active");
});
