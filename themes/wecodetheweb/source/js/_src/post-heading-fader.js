module.exports = function postHeadingFader ($) {
  var $window = $(window)
  var $postHeadingOverlay = $('.post--heading-overlay')
  var postHeadingOverlayHeight = $postHeadingOverlay.height()
  var headerHight = $('.header').height()
  var minimumOverlay = 0.2
  var start = headerHight
  var end = postHeadingOverlayHeight;
  var range = end - start

  $(window).scroll(fadeHeading)
  setInterval(fadeHeading, 100)
  fadeHeading()

  function fadeHeading () {
    var distance = $window.scrollTop()
    var difference = distance - start
    difference = difference < 0 ? 0 : difference

    var opacity = minimumOverlay + ( 1 - minimumOverlay ) * ( difference / range )

    if (typeof distance === 'number') {
      $postHeadingOverlay.css({
        'opacity': opacity > 1 ? 1 : opacity
      })
    }
  }
}
