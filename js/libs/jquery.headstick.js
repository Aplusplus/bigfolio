/*globals jQuery,log */
/*! 
* Headstick.js V 0.1
*
* Copyright 2013, Uli Schöberl http://aplusplus.org
* Released under the WTFPL license 
* http://sam.zoy.org/wtfpl/
*
* Date: 19.04.2013

// Usage
$('.post').headstick('.caption')

*/

(function($) {

  $.fn.headstick = function(headlineSelector, options) {

    // Setup options

    var settings = $.extend({
        onStick: 'headstick.stick',
        onUnstick: 'headstick.unstick',
        top:'0px'
      }, options),
      $W = $(window),
      $elements = $(this),
      measurements = [],
      fixedElements = [];

    // check if there is something to fix at all
    if (!$(headlineSelector, this).length || !headlineSelector) {
      log('headstick.js ERROR: no headlines found in ', this);
      return;
    }


    // static measurement references for performance
    function _updateReferences() {

      log('_update references');

      measurements = [];
      fixedElements = [];

      $elements.each(function(){
        var $container = $(this),
            $fixedElement = $(headlineSelector,this);

        fixedElements.push({
          element:$fixedElement,
          height:$fixedElement.outerHeight()
        });
        measurements.push({
          top:$container.offset().top,
          height:$container.height()
        });
      });

    }


    function calcStickCSS() {


      var viewportOffset = $W.scrollTop();

      if (viewportOffset <= 0) {
        return;
      }



      $elements.each(function(i) {

        log('check for stick…');

        var $slide = $(this),
            fixedElementHeight = fixedElements[i].height,
            posPoint = measurements[i].top + measurements[i].height - fixedElementHeight;



        if (viewportOffset >= measurements[i].top && viewportOffset < (measurements[i].top + measurements[i].height)) {


          if (posPoint > viewportOffset) {

            fixedElements[i].element.css({
              top: settings.top,
              bottom: '',
              position: 'fixed'
            }).addClass('headfix-active');

            $slide.trigger(settings.onStick);


          } else {

            fixedElements[i].element.css({
              top: 'auto',
              bottom: '0px',
              position: 'absolute'
            }).removeClass('headfix-active');
          }


        } else {


          // above 
          if (measurements[i][0] < viewportOffset) {

            fixedElements[i].element.css({
              top: 'auto',
              bottom: '0px',
              position: 'absolute'
            }).addClass('headfix-active');

          } else {

            fixedElements[i].element.css({
              top: '',
              bottom: '',
              position: ''
            }).removeClass('headfix-active');

            $slide.trigger(settings.onUnstick);

          }

        }




      });
    }




    $W.on({
      scroll: function(){
        // window.requestAnimFrame(calcStickCSS);
        calcStickCSS();
      },
      resize: function(){
        _updateReferences();
      },
      load: function(){
        _updateReferences();
      }
    }).resize().scroll();

  };

})(jQuery);