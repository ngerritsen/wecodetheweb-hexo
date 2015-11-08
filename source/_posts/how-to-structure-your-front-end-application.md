title: How to structure your front-end application
tags:
  - General
id: 84
categories:
  - Uncategorized
date: 2015-05-28 12:47:30
---

**I have always been very picky about a good folder structure. I enjoy working in a neatly structured project. How do we go about this in a front-end application?**

<!-- more -->

## Base structure

A lot of project scaffolds put the application code itself into a sub folder, mostly called 'app'. This is to seperate the app folder from the development tooling (gulp, npm etc.). I think this is a good practice, because the non-application files can become quite a lot. So we could now have:
<pre class="lang:ruby decode:true">/app
/node_modules
gulpfile.js
package.json
.gitignore
etc...</pre>

## App structure

Let's dive into the app folder. A lot of project will have an _index.html_, put it in the root. A javascript web app will probably have something like a _main.js_, from where all modules are loaded, or the initial page load is handled. Also put this file in the root. Most files that will go in the root of your webserver could go here (like the favicon and stuff like that). Now we would have something like this:
<pre class="lang:ruby decode:true">/app
    index.html
    main.js</pre>
Now you really have to think about how you can divide your application into features. You will benefit from a flat, feature based folder structure. Let's say it is a chat application we are building. It will have messages, a chat window and maybe a settings panel. Any developer starting to work in your code base should find their way easily. If someone has to do adjustments to the _chat-window_, what is more clear than having a _chat-window_ folder? The following examples are for an Angular project, but your base structure should be framework agnostic.
<pre class="lang:ruby decode:true">/app
    /chat-window
        chat-window.html
        chat-window-controller.js
        chat-window-service.js
        chat-window-input-directive.js
        chat-window-input.html
    /messages
        message-service.js
        message-directive.js
        message.html
    /settings
        settings.html
        settings-controller.js
        settings-service.js</pre>
For React + Flux the folders would be the same, but instead of the directives and html files you would have React components, and services would be Flux stores and actions. I personally prefer lowercase names divided by dashes. Offcourse you could have framework specific sub folders like directives (if you have a lot) or react-components. It is also common to have a 'core' folder in the root of you app, which contains general single-use-ish stuff like routing and configuration.

For unit tests, I really like to put them right next to the file with the module they test. So for instance the settings folder with unit tests:
<pre class="lang:ruby decode:true">/app
    /settings
        settings.html
        settings-controller.js
        settings.controller.test.js
        settings-service.js
        settings-service.test.js</pre>
This is personal preference and the downside is that the file count of a folder can grow very fast. A lot of people just add a test folder with the tests. You could also do this:
<pre class="lang:default decode:true">/app
    /settings
        /_test
            settings.controller.test.js
            settings-service.test.js
        settings.html
        settings-controller.js
        settings-service.js</pre>
If you would do that, I would recommend to place a sub folder named 'test', 'spec' or '_test' or something like that next to the files you are going to test. A seperate test folder in the root of your project with all the tests in it, in my experience, is less convenient. Post-fix the test files with .test' or '.spec'. You can configure your test runner to only search for files that have these post-fixes.

Make sub folders if a folder becomes too large. Let's say you have a common feature with shared components/modules for you project (layout elements, buttons, utility functions). You will have to create subfolders at a certain point, but try not to go crazy with a lot of nested subfolders, it will become a labyrinth. Consistency is important.
<pre class="lang:ruby decode:true">/app
    /shared
        /layout
            *layout components*
        /user-input
            *buttons, input elements etc...*
        /utility
            *utility functions*</pre>

## Assets and bower

Every project has assets. These contain mostly the styling aspects like SASS/CSS, imagery, fonts, icons etc... I like to put an assets folder in the root of my /app like this:
<pre class="lang:ruby decode:true">/app
    /assets
        /styles
        /images
        /fonts</pre>
Bower components is a hard one. I would say there are three options:

*   Don't use bower if you don't need it, only npm (provides simplicity)
*   Put the bower_components in the root of your /app folder
*   Put the bower_components in the root of your project
So we now have a pretty complete project! This would be the final result:
<pre class="lang:ruby decode:true">/app
    /assets
        /styles
        /images
        /fonts
    /chat-window
    /messages
    /settings
    /shared
        /layout
        /input-elements
        /utility
    favicon.ico
    index.html
    main.js
/bower_components
/node_modules
bower.json
gulpfile.js
package.json
.gitignore</pre>
This is by no means a new structure I invented, a lot of project boilerplates available are already structured in a similar way. This is just my take on it and it is always good to think about something, instead of taking it for granted. This brings me to the most important point of you project structure, it should fit YOUR needs! This is just a guide to help you in the right direction and give you some idea's. But your front-end project may be surrounded by back-end projects or has to confirm to your team's policy, always take those factors in to account.

I hope this guide makes you rethink your project structure and help you in the right direction. Please reply in the comment section about your ideas and experiences! Happy developing!
