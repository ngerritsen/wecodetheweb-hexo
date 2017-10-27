const gulp = require('gulp');
const ftp = require('vinyl-ftp');
const gutil = require('gulp-util');
const minimist = require('minimist');
const args = minimist(process.argv.slice(2));

gulp.task('deploy', function() {
  const remotePath = '/public_html/wecodetheweb/';
  const conn = ftp.create({
    host: 'ftp.carehr.nl',
    user: args.user,
    password: args.password,
    log: gutil.log
  });

  gulp.src(['./public/**'])
    .pipe(conn.newer(remotePath))
    .pipe(conn.dest(remotePath));
});
