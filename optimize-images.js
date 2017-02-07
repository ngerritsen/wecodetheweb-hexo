const fs = require('fs')
const path = require('path')
const imagemin = require('imagemin')
const imageminMozjpeg = require('imagemin-mozjpeg')
const imageminPngquant = require('imagemin-pngquant')
const recursiveFs = require('recursive-fs')

const PUBLIC_FOLDER = './public'
const IMAGE_EXTENSIONS = ['.jpg', '.png']

recursiveFs.readdirr('./public', (err, dirs, files) => {
  const filepaths = files
    .filter(file => IMAGE_EXTENSIONS.includes(path.extname(file)))
    .forEach(filepath => {
      imagemin([filepath], path.dirname(filepath), {
        plugins: [
          imageminMozjpeg(),
          imageminPngquant({ quality: '65-80' })
        ]
      })
        .then(files => {
          files.forEach(file => console.log(`Optimized image "${file.path}"`))
        })
    })
})
