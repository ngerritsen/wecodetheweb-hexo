title: Why We code the web is now statically generated
tags:
  - General
  - Static websites
id: 106
categories:
  - Uncategorized
date: 2015-12-17 08:56:04
---

__In case you haven't noticed. We code the web had a big makeover. It's not just the outside. Under the hood it is completely new. I moved away from Wordpress and it is now a plain old static HTML website, or is it?__

<!-- more -->

## What's up?

We code the web used to run on [Wordpress](https://wordpress.com/). And don't get my wrong, Wordpress is fine. A blog like this is the perfect case for Wordpress, it's not too complicated and content focussed. Wordpress has a really nice, user friendly admin panel, everyone can use it.

But there are a few problems. One is that Wordpress can be unpredictable, after an update a bug can appear and you would have no idea where it is coming from. A blog like this is too small to have staging environments or whatsoever, you just want it to work right away. Also it is a little clunky to setup. You need a server running PHP and MySQL. The you need to make database for your blog to store it's data on, so it's pretty much tied to the server now. Not very flexible.

And last but not least Wordpress can be quite slow. Consumer grade web hosting servers (like the one I use), are often not very fast. Remember that every time a user requests a page, the server has to generate that page with PHP and then send it back. There are plugins like [WP Supercache](https://nl.wordpress.org/plugins/wp-super-cache/) that partially solve this by caching that page, but still, the PHP code has to run and that gives extra delay.

Here's a nice performance measurement I did with [Securi](https://performance.sucuri.net) that Smashing Magazine also did for an [article](http://www.smashingmagazine.com/2015/11/modern-static-website-generators-next-big-thing/) about static website generation with their website.

![Smashing Magazine dynamic loading speeds](smashing-mag-dynamic.png "Smashing Magazine dynamic loading speeds")
_Dynamic loading speeds are okay, but not that fast..._

![Smashing Magazine static loading speeds](smashing-mag-static.png "Smashing Magazine static loading speeds")
_Static loading speeds are much faster as you can see!_

## Generate all the things!

So how do oldschool static websites solve this problem? I mean, it's not very convenient to manage seperate HTML files right? That's why we can leverage static website generation. You don't create each page manually, but generate them, from [markdown](https://en.wikipedia.org/wiki/Markdown).

There are a lot of options for static website generators out there. [Jeckyll](https://jekyllrb.com/) is a very well known one, but it runs on Ruby and I'm a Javascript guy. [Hexo](https://hexo.io/) stood out for me. It is simple, supports multiple templating languages and is very flexible. It was way more easy for me to create a theme for Hexo, then it has ever been for Wordpress.

## Hexo themes

Themes in Hexo are basically a bunch HTML templates, that are filled with content using Javascript. There multiple Javascript templating languages available that you can use. For instance a (simplified) example of a post template using the [EJS](http://www.embeddedjs.com/) templating language.

```HTML
<div class="post">
  <h1> <%= post.title %> </h1>
  <p> <%- post.content %> </p>
</div>
```

As you can see, just plain HTML with some special tags containing Javascript. For instance the tag _"<%="_ just means: "output the outcome of this expression here". _"<%-"_ just means: "output the outcome here, but don't escape the HTML". Similar to PHP's echo function.

You can also just use regular Javascript logic inside of your templates:

```JS
<ul>
<% for(var i = 0; i < posts.length; i++) {%>
  <li>
    <%- partial('./post.ejs', { post: posts[i] }) %>
  </li>
<% } %>
</ul>
```

The above piece of code will render the _post.ejs_ template for each post there is in the list.

## Generating the website

So how does this all come together? We now have a theme with a bunch of templates and maybe some CSS + Javascript to make it all nice and shiny. Also we have a folder with some markdown files containing the posts. This is where Hexo comes in. We can now run _"hexo generate"_ from the terminal  to generate the whole website. Yes, every page as a seperate HTML file. Hexo will just output this somewhere in a folder and boom, we are done.

![Static website generation with Hexo flow chart](static-website-generation-hexo.png "Static website generation with Hexo")

We now just have our website in a folder and we can test it locally, or upload it to a web host. It doesn't matter, it's just HTML! It will also be very fast! As soon as the user enters a page, the web server can immidiately serve the HTML, without any processing!

## Cons

This is all very nice and it works well for blogs, but there are some cons.
- Doesn't work for more complex websites like webshops
- No user friendly admin panel (at least not built in)
- You cannot edit your website live like with Wordpress
- No really suited for clients with no technical knowledge
- You always have to upload the whole website or at least the changed pages
- You have to do asset management (like images) yourself
- You have to do version control for the content yourself, for instance with [git](https://git-scm.com/)

This seems like there are a lot of cons. But for a regular blog and a blogger with some technical knowledge, these cons are no real drawback. Also, using markdown is a breeze and there are a lot of editors out there. At least, I'm happy with it and I hope you like the result!

## Reference

- Hexo [hexo.io](https://hexo.io/)
- Smashing Magazine on static website generators [smashingmagazine.com/...](http://www.smashingmagazine.com/2015/11/modern-static-website-generators-next-big-thing/)
- StaticGen - Top Static Site Generators [www.staticgen.com](https://www.staticgen.com/)
