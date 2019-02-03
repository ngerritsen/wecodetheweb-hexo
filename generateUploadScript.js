'use strict';

const fs = require('fs');
const recursiveFs = require('recursive-fs')

recursiveFs.readdirr('./public', (_, __, files) => {
  const script = files
    .map(file => `curl -H 'X-Key: '$UPLOAD_KEY -H 'X-Filepath: wecodetheweb/${file.replace(/^public\//, '')}' -F 'data=@${file}' https://carehr.nl/http-upload/`)
    .join('\n');

  fs.writeFileSync('./upload.sh', script, 'utf-8');

  console.log('Generated upload.sh'); // eslint-disable-line no-console
});
