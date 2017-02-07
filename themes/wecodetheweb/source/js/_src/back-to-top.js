module.exports = function backToTop ($) {
  $('.tools').click(scrollToTop)

  function scrollToTop () {
    $('html, body').animate({ scrollTop: 0 }, 'slow')
  }
}
