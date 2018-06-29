$(function () {
    $('.toggle').click(function () {
        $('.nav-list').toggleClass('active');
    });

    $(document).on('click', '#navbar li a, .nav-list li a, .navigation a', function (e) {
        var href = $(this).attr('href');
        if (href === '#' || /^http.*/.test(href)) {
            return;
        }
        e.preventDefault();
        $('.nav-list').removeClass('active');
        location.hash = href;
        $('iframe').attr('src', href);

        for(var i=0;i<document.getElementsByClassName("whitelist").length;i++){
            document.getElementsByClassName("whitelist")[i].style.color = '#9d9d9d'
        }
        e.target.style.color = 'white'
        sessionStorage.selectedTabName = e.target.innerHTML
    });

    var href = location.hash.substring(1) || 'map.html';
    $('iframe').attr('src', href);

    if (sessionStorage.selectedTabName == null) {
        sessionStorage.selectedTabName = '地图展示'
    }

    for(var i=0; i < document.getElementsByClassName("whitelist").length; i++) {
        var a = document.getElementsByClassName("whitelist")[i]
        if (a.innerHTML === sessionStorage.selectedTabName) {
            a.style.color = 'white'
        } else {
            a.style.color = '#9d9d9d'
        }
    }

    $(window).on('blur',function() {
        $('.dropdown-toggle').parent().removeClass('open');
    });
});
