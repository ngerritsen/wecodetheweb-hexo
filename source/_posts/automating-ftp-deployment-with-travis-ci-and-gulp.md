title: Automating FTP deployment with Travis CI and Gulp
tags:
  - CI
  - Gulp
  - Javascript
  - Travis
id: 217
categories:
  - Uncategorized
date: 2015-08-27 10:26:29
---

**Continuous integration is an important subject, I cannot think of a development world without it. There are a lot of options for CI, but [Travis](https://travis-ci.org/) is a nice and simple one. For personal projects it's free with unlimited repo's, perfect! However, it requires you to code your own build script. I had some trouble figuring out a good way to do FTP deployments. So, how do you upload files to FTP servers with Travis?**

<!-- more -->

## Travis

Travis is a Continuous Integration service that integrates with GitHub. You can sign in to Travis with your GitHub account, you can specify which repo's it should watch. When you push new changes those repo's, Travis gets the version of your project on their servers. It then executes the _.travis.yml_ build script that should be in your project's root.

## Defining a build

The only way to specify build tasks is in the _.travis.yml_ file. What can we specify? Well, for instance, we can set environment variables and run command line commands. It looks like this:

```yaml
language: node_js
install:
  - npm install
  - bower install
script:
  - gulp build</pre>
```

We set the environment to _node_js_, this is typical for front-end projects as npm and build tools like gulp all run on node. Then the 'install' tasks are executed. Tasks are just command line commands, so they can be anything, but here we run the typical npm and bower install commands. Then the 'script' tasks are executed, these are the actual build tasks. In this example it is a gulp build.

## Adding FTP uploads

This Travis build is nice and all, but these tasks are executed in a temporary virtual machine on Travis' server. What would be the use of this, if the output never leaves that virtual machine? Let's upload the result to our FTP server, so our website is updated:

```yaml
env:
  global:
    - "FTP_USER=user"
    - "FTP_PASSWORD=password"
after_success:
    "curl -T index.html -u $FTP_USER:$FTP_PASSWORD ftp://wecodetheweb.com/public_html/"
```

This is an example from Travis' own [docs](http://docs.travis-ci.com/user/deployment/custom/). First define some environment variables with the user name and password for accessing the FTP server. Then use good old _curl_ to upload _index.html_ to the FTP.

Of course, we don't want our password in plain text on GitHub, Travis can encrypt it for us with a special [command line tool](http://docs.travis-ci.com/user/encryption-keys/). We can then replace the plain variables with the encrypted ones:

```yaml
env:
  global:
    - secure: fjlZRoknWj6+UA8U65B+TZmFQv71PdsIc..
    - secure: XDdTZHvlVWMjpYgzMPKIEeRu+8namsdex..
after_success:
    "curl -T index.html -u $FTP_USER:$FTP_PASSWORD ftp://wecodetheweb.com/public_html/"
```

## Using vinyl-ftp

This is all fine, but _curl_ is a bit limited in options. You have to add a command for each file, or combine them with the tedious _find_ command. No, as we allready use Gulp in this example project, why not add a gulp task for uploading the files an folders to FTP?

We need three components for this: _minimist_ for passing command line arguments and vinyl_-ftp_ for the ftp uploading functionality and _gulp-util _for logging, _npm install vinyl-ftp gulp-util minimist --save-dev_.

First we initialize minimist to get the user name and password from the command line arguments. This way we can later on pass the encrypted username and password defined in the .travis.yml to the gulp task.

```javascript
var minimist = require('minimist');
var args = minimist(process.argv.slice(2));
```

Now that we retrieved these arguments from the command line inside our gulp file. We can define the FTP uploading task:

```javascript
var ftp = require('vinyl-ftp');
var gutil = require('gulp-util');
var minimist = require('minimist');
var args = minimist(process.argv.slice(2));

gulp.task('deploy', function() {
  var remotePath = '/public_html/';
  var conn = ftp.create({
    host: 'wecodetheweb.com',
    user: args.user,
    password: args.password,
    log: gutil.log
  });

  gulp.src(['index.html', './**/*.css'])
    .pipe(conn.newer(remotePath))
    .pipe(conn.dest(remotePath));
};
```

It's that simple :). First we create new ftp connection with _vinyl-ftp_. Because we use gulp, we can now use glob patterns to gather the files to upload with gulp.src. Then, by piping the globs to the ftp connection, _vinyl-ftp_ will automatically uploads all those files and creates missing folders on the server if needed. This task can now be run from the command line like: *gulp deploy --user 'coolUser' --password 'mySecretPassword'*.

> The _conn.newer(destination)_ method searches the destination for newer files, if there are newer files on the server then those files will not be uploaded with _conn.dest(destination)_.

## Integrating with Travis

This is the simplest part. The only thing we have to do is replace the _curl_ command with our new gulp ftp command!

```yaml
env:
  global:
    - secure: fjlZRoknWj6+UA8U65B+TZmFQv71PdsIc..
    - secure: XDdTZHvlVWMjpYgzMPKIEeRu+8namsdex..
after_success:
  gulp deploy --user $FTP_USER --password $FTP_PASSWORD</pre>
That was easy right! Setting up a Travis build can be challenging. But the result is rewarding, no more manual file copying to servers, just push to GitHub and in a few minutes your changes are live!
```

## Reference

*   Travis: [travis-ci.org](https://travis-ci.org)
*   vinyl-ftp: [npmjs.com/package/vinyl-ftp](https://www.npmjs.com/package/vinyl-ftp)
*   minimist: [npmjs.com/package/minimist](https://www.npmjs.com/package/minimist)
