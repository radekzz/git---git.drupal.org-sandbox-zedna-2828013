/*
    Plugin Name: Image Lazy Load
    Description: Image lazy load plugin to boost page load time and save bandwidth by removing all the images, background-images, responsive images and iframes. Elements will load just when reach visible part of screen.
    Version: 1.1
    Author: Radek Mezulanik
    Author URI: https://cz.linkedin.com/in/radekmezulanik
    License: GPL2
    */

(function ($) {
    //get options from DB
    Drupal.behaviors.image_lazy_load = {
    attach: function (context, settings) {
        var skipIframe = settings.image_lazy_load.skip_iframe;
        var skipParent = settings.image_lazy_load.skip_parent;
        var loadonposition = parseInt(settings.image_lazy_load.load_position);

    $('document').ready(function () {

        //set visible part of screen
        var scrollBottom = $(window).scrollTop() + $(window).height();

        //remove & backup source from images
        $('img').each(function () {
            this.setAttribute('src-backup', this.src);
        }).attr('src', '');

        //remove & backup source set from responsive images
        //for some browsers, `bgbak` is undefined; for others, `bgbak` is false -> check both like: if (typeof srcsetbak !== typeof undefined && srcsetbak !== false)
        $('img').each(function () {
            var srcsetbak = $(this).attr('srcset');
            if (srcsetbak) {
                $(this).attr("srcset-backup", srcsetbak);
            }
        }).attr('srcset', '');

        //remove & backup source from iframes
        if (skipIframe == "false") {
            $('iframe').each(function () {
                if (skipParent.length != 0) {
                    var found = $(this).parents().hasClass(skipParent); //look for ignored parent
                }
                if (found && skipParent.length != 0) {
                    //skip this iframe
                } else {
                    this.setAttribute('src-backup', this.src);
                    this.setAttribute('src', '');

                }
            });
        }

        //remove & backup background-image from all elements
        $("*").each(function () {
            if ($(this).css('background-image') !== 'none') {
                var bg = $(this).css('background-image');
                $(this).attr("background-image-backup", bg);
                $(this).css('background-image', 'none');
            }
        });


        //give back source of visible images and responsive images
        $('img').each(function () {
            var elements = $(this);
            var elementsoffset = elements.offset();
            var isvisibleOriginal = parseInt(elementsoffset.top);
            var isvisible = isvisibleOriginal + loadonposition;
            if (scrollBottom >= isvisible) {
                this.src = this.getAttribute('src-backup');
                var srcsetbak = $(this).attr("srcset-backup");
                if (srcsetbak) {
                    $(this).attr("srcset", srcsetbak);
                }
            };
        });

        //give back source of visible iframes
        if (skipIframe == "false") {
            $('iframe').each(function () {
                var elements = $(this);
                var elementsoffset = elements.offset();
                var isvisibleOriginal = parseInt(elementsoffset.top);
                var isvisible = isvisibleOriginal + loadonposition;
                if (scrollBottom >= isvisible) {
                    if (skipParent.length != 0) {
                        var found = $(this).parents().hasClass(skipParent); //look for ignored parent
                    }
                    if (found && skipParent.length != 0) {
                        //skip this iframe
                    } else {
                        this.src = this.getAttribute('src-backup');
                    }
                };
            });
        }

        //give back background-image of all visible elements
        $("*").each(function () {
            var bgbak = $(this).attr("background-image-backup");
            if (bgbak) {
                var elements = $(this);
                var elementsoffset = elements.offset();
                var isvisibleOriginal = parseInt(elementsoffset.top);
                var isvisible = isvisibleOriginal + loadonposition;
                if (scrollBottom >= isvisible) {
                    $(this).css("background-image", bgbak);
                };
            }
        });
    });

      $(document, context).scroll(function () {

        //set visible part of screen
        var scrollBottom = $(window).scrollTop() + $(window).height();

        //give back source of visible images
        $('img').each(function () {
            var isLoaded = $(this).attr("src");
            var isLoaded2 = $(this).attr("srcset");
            var hasBackup = $(this).attr("srcset-backup");
            var elements = $(this);
            var elementsoffset = elements.offset();
            var isvisibleOriginal = parseInt(elementsoffset.top);
            var isvisible = isvisibleOriginal + loadonposition;
            if (scrollBottom >= isvisible) {

                if (!isLoaded) { //check if source is not set
                    this.src = this.getAttribute('src-backup');
                }
                if (!isLoaded2) { //check if source is not set
                    if (hasBackup) {
                        $(this).attr("srcset", hasBackup);
                    }
                }
            };
        });

        //give back source of visible iframes
        if (skipIframe == "false") {
            $('iframe').each(function () {
                var isLoaded = $(this).attr("src");
                var elements = $(this);
                var elementsoffset = elements.offset();
                var isvisibleOriginal = parseInt(elementsoffset.top);
                var isvisible = isvisibleOriginal + loadonposition;
                var hasBackup = $(this).attr("src-backup"); //check if iframe has backup source
                if (skipParent.length != 0) {
                    var found = $(this).parents().hasClass(skipParent); //look for ignored parent
                }
                    if (scrollBottom >= isvisible) {
                        if (!isLoaded) { //check if source is not set
                            if (found && skipParent.length != 0) {
                                //ignored paret was found, so leave it as it is
                            } else {
                                this.src = this.getAttribute('src-backup');

                            }
                        }
                    };
            });
        }

        //give back background-image of all visible elements
        $("*").each(function () {
            var bgbak = $(this).attr("background-image-backup");
            if (bgbak) {
                var elements = $(this);
                var elementsoffset = elements.offset();
                var isvisibleOriginal = parseInt(elementsoffset.top);
                var isvisible = isvisibleOriginal + loadonposition;
                if (scrollBottom >= isvisible) {
                    if ($(this).css('background-image') == 'none') { //check if source is not set
                        $(this).css("background-image", bgbak);
                    }
                };
            }
        });
      });
}
    };
})(jQuery);
