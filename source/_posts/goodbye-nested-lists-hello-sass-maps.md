title: 'Goodbye nested lists, hello SASS maps!'
tags:
  - SASS
id: 64
categories:
  - Uncategorized
date: 2015-05-26 09:22:47
---

**SASS lists are great, and with multidimensional lists you can get a key-value-like experience, but not completely..**

<!-- more -->

Let's start out with an example case. We want to have buttons on our website (who doesn't), but we want them in multiple colors. Off course, lazy programmers we are, we don't want to define a class for each color. Let's do that with multidimensional lists.
<pre class="lang:sass decode:true ">$button-colors: (
  red #e74c3c,
  blue #3498db,
  green #2ecc71,
)

@each $button-color in $button-colors {
  .button-#{nth($button-color, 1)} {
    background-color: nth($button-color, 2);
  }
}

/* .button-red { background-color: #e74c3c }
   .button-blue { background-color: #3498db }
   .button-green { background-color: #2ecc71 } */</pre>
In the example above we make a list with all the button colors we want. Each item of the list, is a list of two items: the color name (a string) and the color value (Hex Code). Then in the _@each_ loop, we loop through all the colors. For each color we use the _nth_ function to get the first or second item in the list. The first item will be the color name, the second the color value.
> In most programming languages, a list or array starts with index _0_, in SASS it starts with _1 _(which is quite 'odd' ;-)). This is important to know when using the _nth_ function.
Now let's refactor this, using SASS maps:
<pre class="lang:default decode:true">$button-colors: (
  red: #e74c3c,
  blue: #3498db,
  green: #2ecc71,
)

@each $name, $color in $button-colors {
  .button-#{$name} {
    background-color: $color;
  }
}</pre>
This will give the exact same result as in the example above, but the code is cleaner. As you can see the list is now a map with key value pair. The key being the color name and the value being the color hex value. Then we loop through the colors just like before, but now we define a placeholder name for the key and the value (in that order). Now we can just use those variables instead of having to get the _'nth'_ item of a nested list.

As you can see a subtle but nice feature! You will need SASS 3.3 to compile this, try it out. I am excited to hear other use cases that you come up with!
