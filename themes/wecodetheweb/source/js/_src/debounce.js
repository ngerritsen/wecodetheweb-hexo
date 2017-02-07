module.exports = function debounce(func, wait) {
  var timeout

  return function () {
    var context = this
    var args = arguments

    function later () {
      timeout = null
      func.apply(context, args)
    }

    clearTimeout(timeout)
    timeout = setTimeout(later, wait)
  }
}
