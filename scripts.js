/*
Global Settings
*/
settings = {
    animationTime: 200, //time it takes to animate anything on the site
    dbug: !false, //output console logsd
    hideOffset: -1000, //how far the sliding animations will be hidden outside of <body>
    rotationDegree: 90, //rotation degree for the social button
    navigationClick: false, //set to true if you want navigation to show on click. else it will default to hover
}

/*
CSS breakpoints
*/
breakpoints = {
    mobileSearch: false, //mobile search drops down instead of sliding
    mobileNavigation: false, //navigation starts collapsing
    mobileSubNavigation: false, //subnavigation has 1 row instead of 2
    mobileMoreDropdown: false,
}




/*
Global Functions
*/
window.exists = function(elem) {

    return elem !== undefined && elem !== null && elem != "";
}

/*
Check if it is a touch-supporting phone/tablet/laptop
*/
window.isTouchEnabled = function() {

    return !!('ontouchstart' in window);
}



navigationDropdown = {

    dbug: false,

    trigger: null,
    icon: null,
    dropdown: null,
    close: null,
    overflow: null,
    scroll: 0,

    init: function(options) {

        var self = this;
        self.dbug && console.log("navigationDropdown init");

        /*
        Initiate globals
        */
        self.dbug = (options.dbug !== undefined) ? options.dbug : false;
        self.trigger = (options.trigger !== undefined) ? options.trigger : $("#navigation-button");
        self.icon = (options.icon !== undefined) ? options.trigger : $("#navigation-button").find(".icon");
        self.dropdown = (options.dropdown !== undefined) ? options.dropdown : $("#navigation-dropdown");
        self.close = (options.close !== undefined) ? options.close : $("#navigation-dropdown").find(".close");
        self.overflow = (options.overflow !== undefined) ? options.overflow : $("body").css("overflow-Y");

        /*
		Set dropdown visibility to 'hidden=true' until trigger is clicked
        */
        self.trigger.data("hidden", true);
    },

    topOffset: function() {

        return $("#navigation").offset().top - $("header").offset().top + $("#navigation").outerHeight();
    },

    clickTrigger: function() {

        var self = navigationDropdown;
        var deferred = $.Deferred();

        self.dbug && console.log("navigationDropdown click");

        //if we have already opened subnavigation and clicked the same link that's opened now
        if (self.trigger.data("hidden") !== undefined && !self.trigger.data("hidden"))
            deferred.resolve(false);
        else
            deferred.resolve(self.trigger);

        return deferred.promise();
    },

    /*
    Hide more dropdown 
    */
    hideTrigger: function() {

        var self = navigationDropdown;
        var deferred = $.Deferred();

        self.dbug && console.log("navigationDropdown hide");

        self.dropdown
            .animate({
                top: settings.hideOffset
            }, settings.animationTime, function() {

                self.trigger.data("hidden", true)
                self.icon.hide();

                deferred.resolve(true);
            });
        return deferred.promise();
    },

    /*
    Show more dropdown 
    */
    showTrigger: function() {

        var self = navigationDropdown;
        var deferred = $.Deferred();

        self.dbug && console.log("navigationDropdown show");

        self.trigger.data("hidden", false);
        self.icon.show();

        self.dropdown.animate({
            top: self.topOffset()

        }, settings.animationTime, function() {

            deferred.resolve(true);
        });

        return deferred.promise();
    },

    /*
    Show more dropdown 
    */
    scrollableOn: function() {

        var self = navigationDropdown;

        if (!breakpoints.mobileMoreDropdown)
            return;
        self.scroll = $(window).scrollTop();
        $('html, body').animate({
            scrollTop: 0
        }, 0, 'linear', function() {

            setTimeout(function() {

                var $wrap = self.dropdown;
                var height = $("#navigation").offset().top + $("#navigation").outerHeight(); //+$wrap.find(".close").outerHeight();
                height = $(window).height() - height;

                $wrap.css({
                    height: height,
                });
                $wrap.find(".wrap").css({
                    height: height - 40,
                });

                $wrap.find(".wrap").bind('mousewheel DOMMouseScroll', function(event) {
                    var eventScroll = event.originalEvent;
                    var delta = eventScroll.wheelDelta || -eventScroll.detail;

                    this.scrollTop += (delta < 0 ? 1 : -1) * 30;
                    event.preventDefault();
                });

                $("body").css({
                    overflowY: "hidden"
                });
            }, 500);

        });
    },
    scrollableOff: function() {

        var self = navigationDropdown;

        if (!breakpoints.mobileMoreDropdown)
            return;

        var $wrap = self.dropdown;
        $wrap.css({
            height: "auto",
        });
        $wrap.find(".wrap").css({
            height: "auto",
        });

        $("body").css({
            overflowY: self.overflow
        });
        $(window).scrollTop(self.scroll);

    },
}



subnavigationDropdown = {

    dbug: false,

    trigger: null,
    dropdown: null,
    close: null,
    navigation: null,

    init: function(options) {

        var self = subnavigationDropdown;

        self.dbug && console.log("subnavigationDropdown init");

        /*
        Initiate globals
        */
        self.dbug = (options.dbug !== undefined) ? options.dbug : false;
        self.dropdown = (options.dropdown !== undefined) ? options.dropdown : $("#subnavigation");
        self.close = (options.close !== undefined) ? options.close : $("#subnavigation").find(".close");
        self.navigation = (options.navigation !== undefined) ? options.navigation : $("#navigation");
        self.trigger = (options.trigger !== undefined) ? options.trigger : $("#navigation").find(".link");

        //set link dropdown visibility
        self.trigger.data("hidden", true);

    },

    slickSlider: function($elem) {

        var self = subnavigationDropdown;

        self.dbug && console.log("subnavigationDropdown slickSlider");
        if (!$elem.data("initiated"))
            $elem.parent().hide();
        $elem.imagesLoaded().then(function() {

            var params = {
                mobileFirst: true,
                draggable: true,
                swipe: true,
                swipeToSlide: true,
                adaptiveHeight: true,
                slidesToShow: 4,
                slidesToScroll: 4,
                appendArrows: $elem.parent(),
                prevArrow: '<button type="button" class="slick-prev">︿</button>',
                nextArrow: '<button type="button" class="slick-next">︿</button>',
            };

            var isDevice = breakpoints.mobileMoreDropdown && window.isTouchEnabled();
            var twoFrames = $.getWidth() < 540;
            if (isDevice || twoFrames) {

                params.slidesToShow = 2;
                params.slidesToScroll = 2;
            }


            $elem.on("init", function(event, slick) {

                //display slider after its done initializing
                if (!$elem.data("initiated"))
                    $elem.parent().show();

                //slick needs a kick sometimes on slow connections, this makes sure it shows up 
                if (!$elem.data("initiated")) {
                    $elem.parent().find(".slick-next").trigger("click");
                    $elem.data("initiated", true);
                }

                self.dbug && console.log("Initialized slick slider: " + $elem.hasClass("slick-initialized"));
            });
            $elem.slick(params);
        });
    },

    topOffset: function() {

        return $("#navigation").offset().top - $("header").offset().top + $("#navigation").outerHeight();
    },

    clickTrigger: function($elem) {

        var self = subnavigationDropdown;
        var deferred = $.Deferred();

        self.dbug && console.log("subnavigationDropdown click");

        if ($elem.data("hidden") !== undefined && !$elem.data("hidden"))
            deferred.resolve(false);
        else
            deferred.resolve($elem);

        return deferred.promise();
    },

    /*
    Hide more dropdown 
    */
    hideTrigger: function() {

        var self = subnavigationDropdown;
        var deferred = $.Deferred();

        self.dbug && console.log("subnavigationDropdown hide");

        self.dropdown
            .animate({
                top: settings.hideOffset
            }, settings.animationTime, function() {

                //set link dropdown visibility
                self.trigger.data("hidden", true);
                self.trigger.find(".icon").hide();

                deferred.resolve(true);
            });

        return deferred.promise();
    },

    /*
    Hide more dropdown 
    */
    showTrigger: function($elem) {

        var self = subnavigationDropdown;
        var deferred = $.Deferred();

        self.dbug && console.log("subnavigationDropdown show");

        var index = $elem.index();

        self.trigger.data("hidden", true);
        self.trigger.find(".icon").hide();

        $elem.find(".icon").show();
        $elem.data("hidden", false);

        self.dropdown
            .animate({
                top: self.topOffset()

            }, settings.animationTime, function() {

                //display the current subnavigation section
                self.dropdown.find("section").css({
                    display: 'none'
                });
                var $currentSection = self.dropdown.find("section[data-index=" + index + "]");

                //need to differentiate between mobile/desktop subnavigation for the carousel to render properly
                if (breakpoints.mobileSubNavigation)
                    $currentSection.css({
                        display: "block"
                    });
                else
                    $currentSection.css({
                        display: "table"
                    });

                deferred.resolve($currentSection.find(".slick-slider"));
            });

        return deferred.promise();
    },
}


$(document).ready(function() {


    /*
    Set navigation visibility after menu is loaded - @@@@ rework this
    */
    $("#navigation").find("#navigation-visible-links").fadeIn();
    $("#navigation").find(".navigation-button,.account-button")
        .css({
            opacity: 0,
            visibility: "visible"
        })
        .animate({
            opacity: .8,
        }, settings.animationTime, function() {
            $("#navigation").removeAttr("style");
        });

    /*
    Adjust navigation settings to react to click/touch and not hover
    */
    if (window.isTouchEnabled())
        settings.navigationClick = true;

    /*
    ################################################
    header (main site header)
    ################################################
    */
    header.init({
        dbug: !true
    });


    /*
    ################################################
    navigationDropdown (the more link on main menu)
    ################################################
    */
    navigationDropdown.init({
        dbug: true
    });

    if (settings.navigationClick) {
        //Bindings on navigationDropdown (the more link on main menu) 
        navigationDropdown.trigger.click(function(event) {
            event.preventDefault();

            subnavigationDropdown.hideTrigger();
            navigationSearch.hideTriggerMobile();
            navigationSearch.hideTriggerDesktop();

            navigationDropdown.clickTrigger().then(function(response) {

                if (response)
                    navigationDropdown.scrollableOn();
                else
                    navigationDropdown.scrollableOff();

                //navigation currently hidden, show it
                if (response)
                    navigationDropdown.showTrigger();
                else
                    navigationDropdown.hideTrigger();
            });
        });
    } else {
        navigationDropdown.trigger.mouseenter(function(event) {
            event.preventDefault();

            subnavigationDropdown.hideTrigger();
            navigationSearch.hideTriggerMobile();
            navigationSearch.hideTriggerDesktop();

            //if we initiate too many carousels at the same time it will break. 
            navigationDropdown.scrollableOn();
            navigationDropdown.showTrigger();

        });
        navigationDropdown.dropdown.mouseleave(function(event) {
            event.preventDefault();

            if (breakpoints.mobileSubNavigation && window.isTouchEnabled())
                navigationDropdown.scrollableOff();

            navigationDropdown.hideTrigger();
        });
    }

    navigationDropdown.close.click(function() {

        settings.dbug && console.log("Close navigation with button: " + settings.hideOffset);

        navigationDropdown.scrollableOff();
        navigationDropdown.hideTrigger();
    });


    /*
	################################################
	subnavigationDropdown (the dropdown for the second level menu)
	################################################
	*/
    subnavigationDropdown.init({
        dbug: !true
    });

    if (settings.navigationClick) {

        subnavigationDropdown.trigger.click(function(event) {
            event.preventDefault();

            navigationDropdown.hideTrigger();
            navigationSearch.hideTriggerMobile();
            navigationSearch.hideTriggerDesktop();

            subnavigationDropdown.clickTrigger($(this)).then(function(response) {

                //navigation currently hidden, show it
                if (response) {
                    subnavigationDropdown.showTrigger(response).then(function(response) {

                        if (response)
                            subnavigationDropdown.slickSlider(response);
                    });
                } else
                    subnavigationDropdown.hideTrigger();
            });
        });

    } else {
        subnavigationDropdown.trigger.mouseenter(function(event) {
            event.preventDefault();

            navigationDropdown.hideTrigger();
            navigationSearch.hideTriggerMobile();
            navigationSearch.hideTriggerDesktop();

            subnavigationDropdown.showTrigger($(this)).then(function(response) {
                if (response)
                    subnavigationDropdown.slickSlider(response);
            });
        });
        subnavigationDropdown.dropdown.mouseleave(function(event) {
            event.preventDefault();

            subnavigationDropdown.hideTrigger();
        });
    }

    //close whole section 
    subnavigationDropdown.close.click(function() {

        settings.dbug && console.log("Close navigation with button: " + settings.hideOffset);

        navigationDropdown.hideTrigger();
        subnavigationDropdown.hideTrigger();
    });




});

$(window).load(function() {


    /*
    Gloabl bindings
    */
    (function() {

        //reset subnavigation on screen resize 
        $(window).resize(function() {

            settings.dbug && console.log("Close all dropdowns on resize: " + $.getWidth());

            if (false) //we will make it into a dropdown with a fom inside later
                navigationAccount.hideTrigger();
            navigationDropdown.hideTrigger();
            subnavigationDropdown.hideTrigger();
            navigationSearch.hideTriggerDesktop();
            navigationSearch.hideTriggerMobile();
        });

        //reset subnavigation on blur
        $("main").bind("click", function() {

            settings.dbug && console.log("Close all dropdowns on blur");

            if (false) //we will make it into a dropdown with a fom inside later
                navigationAccount.hideTrigger();
            navigationDropdown.hideTrigger();
            subnavigationDropdown.hideTrigger();
            navigationSearch.hideTriggerDesktop();
            navigationSearch.hideTriggerMobile();
        });

        //resizer on scroll 
        $(window).bind("scroll touchmove", function() {

            if ($(window).scrollTop() > header.getOffset())
                header.headerFix();
            else
                header.headerRelease();
        });


    })();
});



$(function() {


    /*
    Get width of window, exact
    */
    $.getWidth = function() {
        return Math.max($(window).width(), window.innerWidth);
    }

    /*
    Get direction of scroll, true for up or static, false for down
    */
    $.scrollDirectionUp = function() {

        if (window.scrollTop === undefined)
            window.scrollTop = 0;
        var result = $(window).scrollTop() <= window.scrollTop;

        window.lastScrollTop = $(window).scrollTop();
        return result;
    }

    /*
    Add or remove spinner depending on state of spinner
    */
    $.fn.loadingIcon = function() {
        var $loadingel = $("#loading-icon");

        if (!$loadingel.length) {
            settings.dbug && console.log("spinner start");
            this.append("<div class='loading-icon' id='loading-icon'></div>");
        } else {
            settings.dbug && console.log("spinner end");
            $loadingel.remove();
        }
    };




    /*
	Allow an event to fire after all images are loaded
  	*/
    $.fn.imagesLoaded = function() {

        // get all the images (excluding those with no src attribute)
        var $imgs = this.find('img[src!=""]');
        // if there's no images, just return an already resolved promise
        if (!$imgs.length) {
            return $.Deferred().resolve().promise();
        }

        // for each image, add a deferred object to the array which resolves when the image is loaded (or if loading fails)
        var dfds = [];
        $imgs.each(function() {

            var dfd = $.Deferred();
            dfds.push(dfd);
            var img = new Image();
            img.onload = function() {
                dfd.resolve();
            }
            img.onerror = function() {
                dfd.resolve();
            }
            img.src = this.src;

        });

        // return a master promise object which will resolve when all the deferred objects have resolved
        // IE - when all the images are loaded
        return $.when.apply($, dfds);

    }

    /*
	JS rotation
 	*/
    $.fn.rotate = function() {

        var $elie = $(this);
        var degree = 0;
        var timer;

        if ($elie.data("rotated") === undefined || $elie.data("rotated") == false) {
            $elie.data("rotated", false);
            $elie.data("limit", 0);
            degree = settings.rotationDegree;
        }

        settings.dbug && console.log("rotated: " + $elie.data("rotated"));
        settings.dbug && console.log("limit: " + $elie.data("limit"));
        settings.dbug && console.log("degree: " + degree);
        settings.dbug && console.log("");

        function rotateHelper() {

            //click to close soclai bar  
            if ($elie.data("rotated")) {

                $elie.css({
                    WebkitTransform: 'rotate(' + degree + 'deg)'
                });
                $elie.css({
                    '-moz-transform': 'rotate(' + degree + 'deg)'
                });
                timer = setTimeout(function() {
                    ++degree;
                    rotateHelper();
                }, .5);

                if (degree >= 45) {
                    clearTimeout(timer);
                    $elie.data("rotated", false);
                    $elie.data("limit", 0);
                }

                //click to open soclai bar
            } else {

                $elie.css({
                    WebkitTransform: 'rotate(' + degree + 'deg)'
                });
                $elie.css({
                    '-moz-transform': 'rotate(' + degree + 'deg)'
                });
                timer = setTimeout(function() {
                    --degree;
                    rotateHelper();
                }, .5);

                if (degree <= $elie.data("limit")) {
                    clearTimeout(timer);
                    $elie.data("rotated", true);
                    $elie.data("limit", settings.rotationDegree);
                }
            }
        }
        rotateHelper();

        return $(this);
    };




});



/*
Adjust breakpoints
*/
$(function() {

    breakpoints.mobileSubNavigation = $.getWidth() <= 800 || window.isTouchEnabled();
    breakpoints.mobileSearch = $.getWidth() <= 740;
    breakpoints.mobileNavigation = $.getWidth() <= 680;
    breakpoints.mobileMoreDropdown = $.getWidth() <= 650;

    $(window).resize(function() {

        breakpoints.mobileSubNavigation = $.getWidth() <= 800 || window.isTouchEnabled();
        breakpoints.mobileSearch = $.getWidth() <= 740;
        breakpoints.mobileNavigation = $.getWidth() <= 680;
        breakpoints.mobileMoreDropdown = $.getWidth() <= 650;

    });
    $(window).load(function() {

        breakpoints.mobileSubNavigation = $.getWidth() <= 800 || window.isTouchEnabled();
        breakpoints.mobileSearch = $.getWidth() <= 740;
        breakpoints.mobileNavigation = $.getWidth() <= 680;
        breakpoints.mobileMoreDropdown = $.getWidth() <= 650;

    });
});
