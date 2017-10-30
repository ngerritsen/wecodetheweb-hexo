const fs = require('fs')

function getCriticalCss(filename) {
  return fs.readFileSync('./themes/wecodetheweb/source/css/main.critical.css')
}

hexo.extend.helper.register('get_critical_css', getCriticalCss)
