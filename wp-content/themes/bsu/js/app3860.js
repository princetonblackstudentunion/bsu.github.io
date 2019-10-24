/* globals Modernizr */

(function($){

    var module = {
        showLoader : function () {
            $('.loader').fadeIn();
        },
        hideLoader : function () {
            $('.loader').fadeOut();
        },
        ajaxLoad : function(href) {
            if (window.history.pushState) {
                window.history.pushState({}, '', href);
                module.showLoader();
                $.get(href, {}, function (data) {
                    module.hideLoader();
                    //console.log(data);
                    $('#popup-content').scrollTop(0);
                    $('#popup-content').html(data);
                    $('#popup-content').scrollTop(0);
                    $('#popup').fadeIn();
                });
            }
        },

        ajaxLoadVideo : function (href) {
            module.showLoader();
            $.get(href, {}, function (data) {
                module.hideLoader();
                //console.log(data);
                $('.video-player-container').html(data);
                $('.video-player').fadeIn();

            });
        }
    };

    $(document).ready(function(){

        $('.synopsis-container').click(function(ev){
              window.location.href = 'about/index.html';
        });



        $('.lantern-container').click(function(ev){
            window.location.href = 'contact/index.html';
        });

        $('.author-container').click(function(ev){
            window.location.href = 'resources/index.html';
        });

        $('.notify-container').click(function(ev){

        });





        $(document).delegate('a.ajax, a.ajaxVideo','click',function(ev) {
            if (window.history.pushState) {
                var href = $(this).attr("href");
                if (href !== '#'/* && href.indexOf('http') !== 0*/) {
                    if ($(this).hasClass('ajaxVideo')) {
                        module.ajaxLoadVideo(href);
                    } else {
                        module.ajaxLoad(href);
                    }
                    window.Menu.menuClose();
                    ev.preventDefault();
                    return false;
                }
            }
        });

        // setInterval(function(){
        //     $('.date-container h2').toggle();
        //     $('.date-mobile-container h2').toggle();
        // }, 3000);
    });

    window.Ajax = module;

})(window.jQuery);
/* globals Modernizr */

(function($){
    var isWebKit = 'WebkitAppearance' in document.documentElement.style;

    var minHeight = 670;
    var tabletBreakPoint = 1000;

    $.fn.fullscreenVideo = function (options) {
        var $container = options.container || $(window);
        var ele = this;
        function onResize() {
            var windowHeight = $container.height();
            var windowWidth = $container.width();

            if ($(window).width < tabletBreakPoint) {
                var aspect2X = options.videoHeight / options.videoWidth;
                var vidHeightX = windowWidth * aspect2X;
                $(ele).css({
                    height: vidHeightX,
                    width: $container.width(),
                    marginLeft: 0,
                    marginTop: 0
                });

            } else {
                if (/(iPad|iPhone|iPod)/g.test( navigator.userAgent )) {
                    $(ele).css({
                        height: windowHeight,
                        width: windowWidth,
                        marginLeft: 0,
                        marginTop: 0
                    });
                } else {
                    var modW = windowWidth / options.videoWidth;
                    var modH = windowHeight / options.videoHeight;
                    var aspect = options.videoWidth / options.videoHeight;
                    var aspect2 = options.videoHeight / options.videoWidth;
                    var vHeight = modW < modH ? windowHeight : 'auto';
                    var vWidth = modW < modH ? 'auto' : windowWidth;
                    var vidWidth = modW < modH ? windowHeight * aspect : windowWidth;
                    var vidHeight = modW > modH ? windowWidth * aspect2 : windowHeight;
                    var margLeft = modW < modH ? ((windowWidth - vidWidth) / 2) : 0;
                    var margTop = modW > modH ? ((windowHeight - vidHeight) / 2) : 0;
                    $(ele).css({
                        height: vHeight,
                        width: vWidth,
                        marginLeft: margLeft,
                        marginTop: margTop
                    });
                }
            }
        }

        $(window)
            .on ('resize',onResize)
            .trigger ('resize');
    };

    $(document).ready(function(){
        $(window)
            .on ('resize',function(){
                var windowHeight = $(window).height();
                var windowWidth = $(window).width();
                var wHeight = window.innerHeight?window.innerHeight:$(window).height();

                if ($(window).width() <= 375) {
                    $('.logo-container').height(Math.ceil(wHeight / 2) - 33);
                    $('.video-container').height(Math.ceil(wHeight / 2) - 34);
                } else {
                    $('.logo-container').height('');
                    $('.video-container').height('');
                }
                if (windowWidth > 1000) {
                    // desktop
                    if (windowHeight < minHeight && windowWidth > tabletBreakPoint) {
                        //$('.menu-container').css({'position':'absolute'});
                        $('.page-container').css({'position':'relative'});
                        $('html').removeClass('no-scroll');
                    } else {
                        //$('.menu-container').css({'position':''});
                        $('.page-container').css({'position':''});
                        $('html').addClass('no-scroll');
                    }
                } else {
                    // tablet / mobile
                    $('.page-container').css({'position':''});
                    $('html').removeClass('no-scroll');
                }

                if (!isWebKit) {
                    if ($(window).width() > 1000) {
                        $('.book-container .bx-wrapper').css({
                            'position': 'absolute',
                            'top': '50%',
                            'margin-top': 0-$('.book-container .bx-wrapper').height() / 2
                        });
                    } else {
                        $('.book-gallery').css({
                            'position': 'relative',
                            'top': 'auto',
                            'margin-top': 0
                        });
                    }
                    $('.synopsis-text').css({
                        'position':'absolute',
                        'top':'50%',
                        'margin-top':20-$('.synopsis-text').height()/2
                    });
                    $('.author').css({
                        'position':'absolute',
                        'top':'50%',
                        'margin-top':20-$('.author').height()/2
                    });
                }
            })
            .trigger ('resize');

        setTimeout(function() {
            $(window).scrollTop(0);
            $(window).trigger('resize');
        },250);

        setTimeout(function() {
            $(window).scrollTop(0);
            $(window).trigger('resize');
        },500);

        if (Modernizr.touch) {
            $('HTML').addClass('touch');
        } else {
            $('HTML').addClass('no-touch');
        }

        $('.btnModalClose').click(function(ev){
            ev.preventDefault();
            $('#popup-content').scrollTop(0);
            $('#popup').fadeOut(function(){
            });
        });

        $('#video').fullscreenVideo ({
            videoWidth:1280,
            videoHeight:720,
            container:$('.video-container .border')
        });

        var playing = false;
        $('.still').click(function(ev){
            ev.preventDefault();

            if (playing) {
                $('.still').css({'background-image':'none'}).animate({opacity:1});
                $('#video')[0].pause();
            } else {
                $('.still').animate({opacity:0});
                $('#video').fadeIn();
                $('#video')[0].play();
            }
            playing=!playing;
        });




        $(document).delegate('.press','click',function(ev) {
            ev.preventDefault();
            var a = $(this).find('a');
            var href = a.attr("href");
            if (a.hasClass('ajaxVideo')) {
                window.Ajax.ajaxLoadVideo(href);
            } else if (href !== '' && href !== '#') {
                window.open(href);
            }
        });

        if ($("#popup-content").html().trim().length > 0) {
            $('#popup').show();
        }

        if ($(".video-player-container").html().trim().length > 0) {
            $('.video-player').show();
        }

        var videoPlayerPlaying = false;
        $(document).delegate('.video-player-still','click',function(ev){
            ev.preventDefault();

            if (videoPlayerPlaying) {
                $('.video-player-still').css({'background-image':'none'}).animate({opacity:1});
                $('#video-player')[0].pause();
            } else {
                $('.video-player-still').animate({opacity:0});
                $('#video-player')[0].play();
            }
            videoPlayerPlaying=!videoPlayerPlaying;
        });



        $(document).delegate('.btnVideoPlayerClose','click',function(ev){
            ev.preventDefault();
            $('.video-player').fadeOut();
            $('#video-player')[0].pause();
        });

        $(window).scrollTop(0);

        setTimeout(function(){
            initSliders ();
        },250);
    });


    function initSliders () {

        //var bxDates = $(".dates").bxSlider({
        //    startSlide:0,
        //    speed:750,
        //    infiniteLoop:true,
        //    auto:true,
        //    autoHover:true,
        //    pause:4000,
        //    pager:false,
        //    adaptiveHeight:false
        //});

        var bxBook = $(".book-gallery").bxSlider({
            startSlide:0,
            speed:750,
            infiniteLoop:true,
            auto:true,
            autoHover:true,
            pause:6000,
            onSlideBefore:function($slideElement, oldIndex, newIndex){
                $('.book-title').html($($slideElement).attr('alt'));
              //  console.log($slideElement);
                $slideElement.hide().fadeIn(1000);
            }
        });
        bxBook.goToSlide(0);

        $('.btnNext').click(function(ev) {
            ev.preventDefault();
            bxBook.goToNextSlide();
        });

        $('.btnPrev').click(function(ev) {
            ev.preventDefault();
            bxBook.goToPrevSlide();
        });

        var bxPodcast = $(".podcast_image_inner_wrapper").bxSlider({
            startSlide:0,
            speed:750,
            infiniteLoop:true,
            auto:true,
            autoHover:true,
            pause:6000,
            onSlideBefore:function($slideElement, oldIndex, newIndex){
                // $('.book-title').html($($slideElement).attr('alt'));
              //  console.log($slideElement);
                // $slideElement.hide().fadeIn(1000);
            }
        });
        bxPodcast.goToSlide(0);

        $('.btnNext-podcast').click(function(ev) {
            console.log("IN NEXT");
            ev.preventDefault();
            bxPodcast.goToNextSlide();
        });

        $('.btnPrev-podcast').click(function(ev) {
            console.log("IN PREV");
            ev.preventDefault();
            bxPodcast.goToPrevSlide();
        });
    }

})(window.jQuery);
/* globals Modernizr */

(function($){

    $(document).ready(function(){

        $(document).delegate('.backToTop','click',function(ev){
            ev.preventDefault();
            $('.modal-content').animate({scrollTop:0});
        });
    });

})(window.jQuery);
/* globals Modernizr */

(function($){

    $(document).ready(function(){

        var showLoading = $('body').hasClass('home');
        showLoading = false;
        if (showLoading) {
            var int = setInterval(function () {
                var qActive = $('.quote.active');
                var i = $('.quote').index(qActive);
                var l = $('.quote').length;
                var iNew = i;
                while (iNew === i) {
                    var r = Math.random();
                    iNew = Math.floor(r * l);
                    qActive.fadeOut().removeClass('active');
                    $('.quote:eq(' + iNew + ')').delay(400).fadeIn().addClass('active');
                }
            }, 2000);

            setTimeout(function () {
                $('.loading').fadeOut();
                clearInterval(int);

                var d = 100;

                $('.menu-container').hide().delay(0).fadeIn();
                $('.book-container').hide().delay(1 * d).fadeIn();
                $('.video-container').hide().delay(2 * d).fadeIn();
                $('.top-container').hide().delay(3 * d).fadeIn();
                $('.logo-container').hide().delay(4 * d).fadeIn();
                //$('.date-container').hide().delay(2*d).fadeIn();
                $('.bottom-container').hide().delay(5 * d).fadeIn();
                $('.notify-container').hide().delay(5 * d).fadeIn();
                $('.synopsis-container').hide().delay(6 * d).fadeIn();
                $('.author-container').hide().delay(7 * d).fadeIn();
                $('.social-container').hide().delay(8 * d).fadeIn();
                $('.lantern-container').hide().delay(9 * d).fadeIn();
            }, 6000);
        } else {
            $('.loading').hide();
        }
    });

})(window.jQuery);
/* globals Modernizr */

(function($){

    var menuTO = null;
    var menuHeight = 55;
    var menuMobile = false;
    var mobileNavHeight = 419;
    var menuMinHeight = 232;

    var module = {
        menuHide: function (noDelay) {
            clearTimeout(menuTO);

            var delay = noDelay?0:100;

            menuTO = setTimeout(function () {
                $('.menu-container').stop(true, true).css({height: menuHeight});
            }, delay);
        },
        menuShow: function () {
            clearTimeout(menuTO);
            var topCHeight = $('.top-container').height()+65-10;
            topCHeight = topCHeight<menuMinHeight?menuMinHeight:topCHeight;
            if ($('.menu-container').height() < topCHeight) {
                $('.menu-container').height(topCHeight);
            } else {
                $('.menu-container').height(topCHeight);
            }
        },
        menuClose: function (noDelay) {
            if (menuMobile) {
                $('.menu-container').stop(true, true).css({height: menuHeight});
                $('.menu-container > nav > ul').hide();
            } else {
                $('.menu-container').stop(true, true).css({height: menuHeight});
                $('.menu-container > nav > ul > li > ul').hide();
            }
        },

        mobileMenuHide : function () {
            $('.menu-container').scrollTop(0);
            $('.menu-container').stop(true, true).animate({height: menuHeight});
            $('.menu-container > nav > ul').stop(true, true).fadeOut();
            $('.menu-container ul li ul').css('display','');
            mobileNavHeight = $('.menu-container nav').outerHeight()+37;
            $('.menu-container').height(mobileNavHeight);
        }
    };

    $(document).ready(function(){

        $(window)
            .on ('resize',function(){

            if ($(window).width() <= 767 && !menuMobile) {
                menuHeight = 37;
                menuMobile = true;
                $('.menu-container > nav > ul').hide();
            } else if ($(window).width() > 767 && menuMobile) {
                menuHeight = 55;
                menuMobile = false;
                $('.menu-container > nav > ul').show();
            }
            $('.menu-container').stop(true, true).css({height: menuHeight});
        }).trigger ('resize');

        // mobile menu!
        $('.menu').click(function(ev){
            ev.preventDefault();
            if ($('.menu-container').height() < mobileNavHeight) {
                $('.menu-container').stop(true, true).animate({height: mobileNavHeight});
                $('.menu-container > nav > ul').stop(true, true).fadeIn();
            } else {
                module.mobileMenuHide();
            }
        });

        var ul = null;
        //$('.menu-container > nav > ul > li').hover(function(){
        //    if (menuMobile) {return;}
        //    var _this = this;
        //    if ($(_this).hasClass('submenu')) {
        //        module.menuShow();
        //        $(_this).find('ul').finish().show();
        //    } else {
        //        //module.menuHide();
        //    }
        //},function () {
        //    if (menuMobile) {return;}
        //    var _this = this;
        //    if ($(_this).hasClass('submenu')) {
        //        $(_this).find('ul').finish().hide();
        //    }
        //    //module.menuHide();
        //});

        //$('.menu-container ').hover(function(){
        //    //module.menuShow();
        //},function () {
        //    if (menuMobile) {return;}
        //    module.menuHide();
        //});

        $(document).delegate('.menu-container a','click',function(ev) {
            // by default don't do anything - code in ajax.js will load handle clicks

            if ($(this).hasClass('ajax') && window.history.pushState) {
                ev.preventDefault();
            }

            //if ($(window).width() < 767 && $(this).parent().hasClass('submenu')) {
            //    ev.preventDefault();
            //    var ul = $(this).parent().find('ul');
            //    if (ul.is(':visible')) {
            //        ul.hide();
            //    } else {
            //        $('.menu-container ul li ul').css('display','');
            //        ul.show();
            //    }
            //    mobileNavHeight = $('.menu-container nav').outerHeight()+37;
            //    var wHeight = window.innerHeight?window.innerHeight:$(window).height();
            //    wHeight-=20;
            //    mobileNavHeight = mobileNavHeight > wHeight?wHeight:mobileNavHeight;
            //    $('.menu-container').stop(true, true).animate({height: mobileNavHeight});
            //}
            //
            //if ($(window).width() < 767 && $(this).parent().hasClass('home')) {
            //    module.mobileMenuHide();
            //    $('#popup').fadeOut();
            //    $('.video-player').fadeOut();
            //    window.history.pushState({}, '', '/');
            //}

            $('.menu-container').scrollTop(0);
        });
    });

    window.Menu = module;

})(window.jQuery);
