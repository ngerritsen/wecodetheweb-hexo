var $ = require('jquery')
var postHeadingFader = require('./post-heading-fader')
var headerHider = require('./header-hider')
var backToTop = require('./back-to-top')
var setCopyrightYear = require('./set-copyright-year')

function main () {
  postHeadingFader($)
  headerHider($)
  backToTop($)
  setCopyrightYear($)
}

$.ready(main)
