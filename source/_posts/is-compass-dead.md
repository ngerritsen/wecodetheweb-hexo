title: Is Compass dead?
tags:
  - Gulp
  - SASS
id: 9
categories:
  - Uncategorized
date: 2015-05-20 16:31:50
---

**For a long time I have been a dedicated user of the SASS+Compass stack. It is great not having to provide workarounds and fixes for each browser in your CSS. Compass mixins saved me a lot of trouble. So why ask the question in this title?**

<!-- more -->

As a front-end developer I use Gulp a lot, but nothing is more annoying than an error in you Gulp build. On time my compass task kept failing for some reason and I started googling about it. I noticed a lot of articles where people actually ditched Compass for autoprefixer. Autoprefixer actually searches through your CSS files for rules that are not compatible with all browsers. Then it adds all the rules that are needed to make the rule work with all browsers. An example of a Gulp task with autoprefixer:
<pre class="lang:js decode:true">gulp.task('sass', function () {
    return gulp.src('./src/main.scss')
        .pipe(sass({
             sourceMaps: true
         })
        .pipe(postcss([ autoprefixer({ browsers: ['last 2 version'] }) ]))
        .pipe(gulp.dest('./dest'));
});</pre>
The task above would compile your main.scss to a main.css, pass the main.css file to autoprefixer, which will in his turn prefix/extend all of the cross browser incompatible rules. Note the 'last 2 version' string. You can actually define which browsers you want to support! For instance you could do:
<pre class="lang:js decode:true ">.pipe(postcss([ autoprefixer({ browsers: ['ie 6 ie 7 chrome 40'] }) ]))
// No :( lets not support IE6 anymore!
.pipe(postcss([ autoprefixer({ browsers: ['last 3 version', &gt; 10%] }) ]))
// This will support the last 3 versions of each major browser with a usage statistic of over 10%
</pre>
So a lot of options and no more using compass mixins in your SASS, so instead of:
<pre class="lang:sass decode:true">.class {
    @include border-radius(10px);
}</pre>
You can now just:
<pre class="lang:sass decode:true ">.class {
    border-radius: 10px;
}</pre>
Meaning that you can just write the native rules, so your code  is not dependent on Compass or any other library anymore. On top of all this autoprefixer is also available for Visual Studio and various other environments.

This is not the whole story however, Compass actually does more. It adds some useful mixins for typography and image spriting. It is more of a SASS mixin library than just a prefixer Therefore the comparison is questionable, but most Compass users I encounter only use it for cross-browser support.

Compass is not actually dead, it offers a lot of cool functionality.But in a lot of cases I think the autoprefixer solution is more elegant en flexible. But in the end, use what ever you want!

## Reference:

[github.com/postcss/autoprefixer](https://github.com/postcss/autoprefixer)

[compass-style.org/](http://compass-style.org/)

&nbsp;
