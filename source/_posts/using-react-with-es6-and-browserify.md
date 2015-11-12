title: Using React with ES6 and Browserify
tags:
  - Browserify
  - ECMAScript 6
  - Gulp
  - React
id: 22
categories:
  - Uncategorized
date: 2015-05-22 14:30:15
---

**ECMAScript 6 is great! It gives us Javascript developers a long time longed for set of core functionalities like classes, imports and more. Browsers do not support [most of the features yet,](http://kangax.github.io/compat-table/es6/) but we can use transpilers to be able to use ES6.**

<!-- more -->

When using React, you can use ES6 to make your life more easy. First of all you need a transpiler, [Babel](https://babeljs.io/) is the way to go as of today. It transpiles ES6 with JSX (Facebook's special syntax for React).

## Transpiling

In the following example I will be using Browserify for dependency management and Gulp for running al the tasks. Browserify will allow us to use the ES6 'import' syntax to import one Javascript file into another.

```javascript
var gulp = require('gulp');
var browserify = require('browserify');

gulp.task('bundle', function() {
    return browserify({
        extensions: ['.js', '.jsx'],
        entries: 'main.js',
    })
});
```

We first make a new gulp task and load our libraries. We make a new browserify bundle by calling browserify. If you want to use the .jsx extension you can provide browserify the .jsx extension name, this way browserify will by default recognize .jsx files without you explicitly having to define it. Our entry file is main.js, from this file we import other files.

```javascript
var gulp = require('gulp');
var browserify = require('browserify');
var babelify = require('babelify');

gulp.task('bundle', function() {
    return browserify({
        extensions: ['.js', '.jsx'],
        entries: 'main.js',
    })
    .transform(babelify.configure({
        ignore: /(bower_components)|(node_modules)/
    }))
});
```

Then we apply the transpilation from JSX + ES6 to plain ES5 Javascript. If we import any third party libraries from node_modules or bower_components, we will not transpile them, they should allready be in production ready code.

```javascript
var gulp = require('gulp');
var browserify = require('browserify');
var babelify = require('babelify');
var source = require('vinly-source-stream');

gulp.task('bundle', function() {
    return browserify({
        extensions: ['.js', '.jsx'],
        entries: 'main.js',
    })
    .transform(babelify.configure({
        ignore: /(bower_components)|(node_modules)/
    }))
    .bundle()
    .on("error", function (err) { console.log("Error : " + err.message); })
    .pipe(source('bundle.js'))
    .pipe(gulp.dest('dist'));
});
```

Then we run the .bundle() function on our bundle. This will bundle all the imported Javascript files into one. We log any errors that will occur and then output a file named bundle.js and put it in the dist folder. This will contain all our application code, yeah!

So a quick recap:
1.  Make browserify bundle (a.k.a collect al the files)
2.  Transform files with babelify from ES6 + JSX to plain ES5
3.  Bundle them into one file

## Coding

Now that we can handle ES6 + JSX code, how should your React code itself look? Well for React classes you can now do:

```javascript
import React from 'react';

export default class MyComponent extends React.component {
    render() {
        return <div>Hello World</div>;
    }
}
```

This is nice because you now have a "real" ES6 class, so you can use inheritance, constructors and getter/setter methods. However, you cannot use mixins, at Facebook they are currently working on a better solution for that. I use mixins a lot so I use a more "classic" approach:

```javascript
import React from 'react';

export default React.createClass({
    render() {
        return <div>Hello World</div>;
    }
});
```

This looks almost the same as the ES5 version, so why use ES6 anyway?

*   You can use the ES6 import/export syntax
*   You can still use the method shorthand like in classes
*   Inside and outside of you components you will write all kinds of Javascript code, in which you can use all the ES6 sugar :-);

> Note: Babelify actually compiles the import statements to the NodeJS require syntax. This allows Browserify to leverage the NodeJS module system for resolving dependencies.

I think unless your development environment makes it impossible to run the transpilations, using ES6 is a no brainer. It makes you future proof, write cleaner code and it is fun!

## Reference

- Browserify: [browserify.org](http://browserify.org/)
- Babel ES6: [babeljs.io/](https://babeljs.io/)
- Babelify: [github.com/babel/babelify](https://github.com/babel/babelify)
- React: [facebook.github.io/react/](https://facebook.github.io/react/)
