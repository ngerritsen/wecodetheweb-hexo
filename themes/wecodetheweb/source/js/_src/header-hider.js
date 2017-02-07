var debounce = require('./debounce')

module.exports = function headerHider ($) {
  var $window = $(window)
  var $tools = $('.tools')
  var startReading = 500

  handleReadingTools()
  $(window).scroll(debounce(handleReadingTools, 25))

  function handleReadingTools() {
    var distance = $window.scrollTop()

    if (distance > startReading) {
      $tools.addClass('is-sticky')
    } else {
      $tools.removeClass('is-sticky')
    }
  }
}
