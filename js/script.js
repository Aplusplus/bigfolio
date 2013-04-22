/*globals jQuery,Modernizr,log */
/*
  BigPortfolio
  Simple system for type based a one page / one project per screen portfolio

  Dependencies: jQuery, fitText, keymaster.js

  @author Uli Scöberl <uli@aplusplus.org>
  @author Marc Kremers <marckremers.com@gmail.com>
*/

(function(W,document,jQuery,undefined) {


  var $W = $(W);


  var FOLIO = {
      settings: $.extend({

        sectionPercentageHeight:'100',
        setHash:true,

        headlines: {
          compressor: 0.7,
          minFontSize:'1em',
          maxFontSize:'40em'
        }

      },W.FOLIO_SETTINGS)
    };

  var F = FOLIO;



  F.init = function(){
    log('Start');


    // setup sections as list for stroll … ?
    // $('.post').wrapAll('<ul id="list">').wrap('<li>');
    // F.sections = $('#list li');
    F.sections = $('.post');

    // responsive headline sizing
    // $("h1,h2").fitText(FOLIO.settings.headlines.compressor, FOLIO.settings.headlines);

    // // Bind Key control using keymaster.js
    // W.key('down',F.show_next);
    // W.key('up',F.show_prev);


    // scroll effect
    // F.articles = $('article');




    // make captions sticky
    if(!Modernizr.touch) {
      $('.post').headstick('.caption,.inner.text > h1');
    }

    // make the navigation

    F.sections.each(function(i){
      var $e = $(this),
          ne = $('<a/>',{
                href: '#'+$e.attr('id'),
                text: (i+1 > 10) ? i+1 : '0'+(i+1)
              });

          ne.appendTo('#quicknav');
    });

    $('nav').localScroll({
       axis:'y',
       duration:1500,
       easing:'easeInOutExpo'
    });
    // fit videos
    $(".post").fitVids();


    $W.on({
      resize: F.layout,
      scroll: F.scrollAdjust,
      load: function(){
        log('loaded');
        $W.resize().scroll();
      }
    }).resize().scroll();
  };







// Activate a content section
F.setActive = function($element) {


  F.active = $element;
  F.active.addClass('active');
  W.location.hash = '/'+FOLIO.active.attr('id');

  if(!FOLIO.startTitle) {
    FOLIO.startTitle = document.title;
  }
  document.title = FOLIO.startTitle +' → ' + FOLIO.active.find('h2').text();

  W.log('Set active',FOLIO.active.attr('id'));

};

F.scrollAdjust = function() {

  var scrollTop = $W.scrollTop();

  if(scrollTop < $W.height()*0.9) {
    $('html').removeClass('pass-header');
  } else {
    $('html').addClass('pass-header');
  }

};

F.layout = function(){
  W.log('layout');
  // size sections
  var wh = $W.height();
  // var h = Math.round(wh*(F.settings.sectionPercentageHeight/100));
  F.sections.each(function(){
      var $e = $(this);
      log($e.height(),wh);
      if($e.height()<wh) {
        $e.height(wh).addClass('below-min-h');
      }
  });
  // F.sections.height(h);
  // keep active project in viewport

  // center nav
  var $n = $('nav');

    $n.css({
      top:($W.height()-$n.height())/2
    });

};

FOLIO.show_next = function(){
  W.log('next…');
};

FOLIO.show_prev = function(){
  W.log('prev…');
};

$(FOLIO.init);



}(window,document,jQuery));