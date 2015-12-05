title: Why We code the web is now staticly generated
tags:
  - General
  - Static websites
id: 106
categories:
  - Uncategorized
date: 2015-12-05 08:56:04
---

In case you haven't noticed. We code the web had a big makeover. It's not just the outside. Under the hood it is completely new.
It is now your plain old static HTML website, or is it?

<!-- more -->

## What's up?

We code the web used to run on Wordpress. And don't get my wrong, Wordpress is fine. A blog like this is the perfect case for Wordpress,
it's not too complicated and content focussed. Wordpress has a really nice, user friendly admin panel, even my grandma could use it.

But there are a few problems. One is that Wordpress can be unpredictable, after an update a bug can appear and you would have no idea
where it is coming from. A blog like this is too small to have staging environments or whatsoever, you just want it to work right away.

Also it is a little clunky to setup. You need a server running PHP and MySQL. The you need to make database for your blog to store it's
data on, so it's pretty much tied to the server now. Not very flexible.

And last but not least Wordpress can be quite slow. Consumer grade web hosting servers (like the one I use), are often not very fast.
Remember that every time a user requests a page, the server has to generate that page with PHP and then send it. There are plugins
like WP Supercache that partially solve this by caching that page, but still, the PHP code has to run and that gives extra delay.

## Hexo

So how do static websites solve this problem? I mean, it's not very convenient to manage seperate HTML files right?
That's why we can use static website generation. You don't create each page manually, but generate them, from markdown.

There are a lot of options for static website generators out there. Jeckyll is a very well known one, but it runs on Ruby and I'm a Javascript guy.
Hexo stood out for me. It is simple, supports multiple templating languages and is very flexible. It was way more easy for me to create a theme
for Hexo, then it has ever been for Wordpress.

Themes in Hexo are basically a bunch HTML templates, that are filled with content using Javascript. For instance a (simplified) example of
a post template using the EJS templating language.

```EJS
<div class="post">
  <h1> <%= post.title %> </h1>
  <p> <%- post.content %> </p>
</div>
```

As you can see, just plain HTML with some special tags containing Javascript. For instance the tag "<%=" just means: "output the outcome
of this expression here". "<%-" just means: "output the outcome here, but don't escape the HTML". Similar to PHP's echo function.

You can also just use regular Javascript logic inside of your templates:

```EJS
<ul>
<% for(var i = 0; i < posts.length; i++) {%>
  <li>
    <%- partial('./post.ejs', { post: posts[i] }) %>
  </li>
<% } %>
</ul>
```

The above piece of code will render the post.ejs template for each post there is in the list.

## Generating the website

So how does this all come together? We now have a theme with a bunch of templates and maybe some CSS + Javascript to make it all nice and shiny.
Also we have a folder with some markdown files containing the post. This is where Hexo comes in. We can now run "hexo generate" from the terminal  to generate the whole website. Yes, every page as a seperate HTML file. Hexo will just output this somewhere in a folder and boom, we are done.

We now just have our website in a folder and we can test it locally, or upload it to a web host. It doesn't matter, it's just HTML!
It will also be very fast! As soon as the user enters a page, the web server can immidiately serve the HTML, without any processing!
