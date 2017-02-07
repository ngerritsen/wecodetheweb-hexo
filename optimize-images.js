const fs = require('fs')
const path = require('path')
const imagemin = require('imagemin')
const imageminMozjpeg = require('imagemin-mozjpeg')
const imageminPngquant = require('imagemin-pngquant')

const POST_SOURCE_FOLDER = './source/_posts'
const IMAGE_GLOB = '*.{jpg,png}'

fs.readdirSync(POST_SOURCE_FOLDER)
  .map(filename => path.join(POST_SOURCE_FOLDER, filename))
  .filter(filepath => fs.statSync(filepath).isDirectory())
  .forEach(filepath => {
    imagemin([path.join(filepath, IMAGE_GLOB)], filepath, {
      plugins: [
        imageminMozjpeg(),
        imageminPngquant({quality: '65-80'})
      ]
    })
      .then(files => {
        files.forEach(file => console.log(`Processed image "${file.path}"`))
      })
  })
