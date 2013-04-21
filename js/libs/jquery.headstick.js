/*globals jQuery,log */
/*! 
* Headstick.js V 0.1
*
* Copyright 2013, Uli SChöberl http://aplusplus.org
* Released under the WTFPL license 
* http://sam.zoy.org/wtfpl/
*
* Date: 19.04.2013

// Usage
if(!Modernizr.touch) {
  $('.post').headstick('.caption',{})
}

*/

(function($) {

  $.fn.headstick = function(headlines, options) {

    // Setup options

    var fix = headlines,
      settings = $.extend({
        onStick: 'headstick.stick',
        onUnstick: 'headstick.unstick'
      }, options),
      $W = $(window),
      $elements = $(this);


    if (!$(headlines, this).length || !headlines) {
      log('headstick.js ERROR: no headlines found in ', this);
      return;
    }



    function calcStickCSS() {

      log('calc headline sticking',fix);

      var viewportOffset = $W.scrollTop(),
          viewportHeight = $W.height();

      if (viewportOffset <= 0) {
        return;
      }

      $elements.each(function() {

        var $slide = $(this),
          offset = $slide.offset().top,
          height = $slide.height(),
          $fixedElement = $(fix,$slide),
          fixedElementHeight = $fixedElement.outerHeight(),
          posPoint = offset + height - fixedElementHeight;

        if (viewportOffset >= offset && viewportOffset < (offset + height)) {

          $slide.trigger(settings.onStick);

          if (posPoint > viewportOffset) {

            $fixedElement.css({
              top: '',
              bottom: '',
              position: 'fixed'
            }).addClass('headfix-active');

          } else {

            $fixedElement.css({
              top: 'auto',
              bottom: '0px',
              position: 'absolute'
            }).removeClass('headfix-active');
          }

          if ($slide.data('pe.sqln')) {

            // determine amount scrolled
            var scrolled = viewportOffset - (offset),
              percentage = scrolled / (height - viewportHeight),
              sqElCount = $slide.data('pe.sqln') - 1;


            log($slide.attr('id'), sqElCount, percentage, Math.round(sqElCount * percentage));

            $('.sq-el', $slide).removeClass('active').eq(Math.round(sqElCount * percentage)).addClass('active');

          }



        } else {



          // above 
          if (offset < viewportOffset) {

            $fixedElement.css({
              top: 'auto',
              bottom: '0px',
              position: 'absolute'
            }).addClass('headfix-active');

          } else {

            $fixedElement.css({
              top: '',
              bottom: '',
              position: ''
            }).removeClass('headfix-active');

          }

          $slide.trigger(settings.onUnstick);

        }

      });
    }


    log('register headstick',$elements);
    $W.on('scroll', function(){
      window.requestAnimFrame(calcStickCSS);
    });
  };

})(jQuery);