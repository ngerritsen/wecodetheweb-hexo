const fs = require('fs')
const crypto = require('crypto')

function getCssHash() {
  const content = fs.readFileSync('./themes/wecodetheweb/source/css/main.css')
  return crypto.createHash('md5').update(content).digest('hex')
}

hexo.extend.helper.register('get_css_hash', getCssHash)
