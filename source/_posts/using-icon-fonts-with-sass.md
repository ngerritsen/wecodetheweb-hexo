title: Using icon fonts with SASS
tags:
  - Bootstrap
  - CSS
  - Fontawesome
  - SASS
id: 40
categories:
  - Uncategorized
date: 2015-05-25 09:10:35
---

Sometimes you want to display an icon in your website somewhere, but you do not want to touch the HTML. For instance if you have an auto-generated link in your CMS and you want to prefix it with an icon. This is actually very easy to do, because that is exactly what icon font vendors like [Bootstrap Glyphicons](http://getbootstrap.com/components/) and [FontAwesome](http://fortawesome.github.io/Font-Awesome/) already do!

<!-- more -->

Most of the times they let you add icons with an HTML tag like this:
<pre class="lang:xhtml decode:true"><i class="fa fa-rocket"></i></pre>
This is how you would add a rocket icon in font-awesome. As you can see it is an _'i'_ element with two classes. The element type does not really matter, but the classes do. The first class _'fa'_ adds the base style rules for adding an icon. If we check out the [FontAwesome GitHub project](https://github.com/FortAwesome/Font-Awesome):
<pre class="lang:css decode:true">.fa {
  display: inline-block;
  font: normal normal normal 14px/1 FontAwesome;
  font-size: inherit;
  text-rendering: auto;
  -webkit-font-smoothing: antialiased;
  -moz-osx-font-smoothing: grayscale;
  transform: translate(0, 0);
}</pre>
As you can see it sets up the element for being inline with text elements, the _font-size_ being _14px_, some rendering settings and most important: the _font-family_ being _'FontAwesome'_. This is what makes the icon appear if we add a certain character code. So how does it add the character code? Let's check out the _'fa-rocket'_ class:
<pre class="lang:css decode:true ">.fa-rocket:before {
  content: "\f135";
}</pre>
As you can see, it adds the character _'\f135'_ before the content of the _'i'_ element. Because the element is (should be) empty, it will only contain _'\f135' _which is a rocket icon in the FontAwesome font.

So how can we take advantage of this knowledge? Let's say we want to display a globe icon before a link of class _'web-link'._ As we are using SASS we will start making a mixin:
<pre class="lang:default decode:true">@mixin fontawesome-icon {
  font-family: FontAwesome;
  text-rendering: auto;
  -webkit-font-smoothing: antialiased;
  -moz-osx-font-smoothing: grayscale;
}</pre>
> You can use vanilla CSS to add the style rules to certain classes directly, but SASS makes this way more flexible.
I have stripped some of the default styles, because they are not necessary and you might want to use your own spacing/sizing. Now we create a variable for the icon(s) we want to use and use them in our _'web-link'_ class:
<pre class="lang:sass decode:true">$globe-icon: '\f0ac';

.web-link {
  //Other styling

  &amp;::before {
    @include fontawesome-icon();
    color: #333;
    content: $globe-icon;
    margin-right: 6px;
  }
}</pre>
We have now created a usable icon insertion method in our own webpage. Now render the element in our HTML and we should get something like the result below.
<pre class="lang:xhtml decode:true "><a href="http://some-external-link.com" class="web-link">Some external link</a></pre>
[![External icon link](http://wecodetheweb.com/wp-content/uploads/2015/05/Schermafbeelding-2015-05-25-om-10.49.34.png)](http://wecodetheweb.com/wp-content/uploads/2015/05/Schermafbeelding-2015-05-25-om-10.49.34.png)

FontAwesome already provides you with a [FontAwesome SASS project](https://github.com/FortAwesome/font-awesome-sass), containing all the icons and mixins like we just created. But we have now learned how this works and can create our own mixins, suiting our needs and using other icon sets. For instance Bootstrap Glyphicons will work almost the same except for other character codes and using the _'Glyphicon Halflings'_ font instead of _'FontAwesome'_.
> You can either get the character codes for the icons by digging into the source code of the icon sets, inspecting the icons with your browser or looking at various cheatsheets like [this one](http://fortawesome.github.io/Font-Awesome/cheatsheet/) for FontAwesome.
I hope that by now you understand how icon font insertion works and are able to take advantage of this for your own projects! For instance I have used it for the blockquotes with the _'light bulb'_ icons in this post. Happy coding!

&nbsp;
