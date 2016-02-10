title: Faster CSS coding with Hayaku
tags:
  - CSS
  - IDE
  - SASS
id: 123
categories:
  - Uncategorized
date: 2015-06-17 20:45:50
---

**Lately a good friend of mine showed me this plugin for Sublime Text called Hayaku. I had never heard of it so I asked him what it was. It's like Emmet for CSS. Hey, I know Emmet, it makes writing HTML and CSS easier, so what's this about?**

<!-- more -->

So [Hayaku ](http://hayakubundle.com/)is a plugin for [Sublime Text](http://www.sublimetext.com/) and it's very cool. It is actually a tad bit different from [Emmet](http://emmet.io/), it is more of a fuzzy auto completer. You can write abbreviations for CSS rules, press tab, and Hayaku will try to guess what you ment, some examples:

```scss
.cool-class {
    /* bb */
    border-bottom: ;

    /* fs12 */
    font-size: 12px;

    /* fweib or fwb */
    font-weight: bold;

    /* c */
    color: #FFF;

    /* bra2 */
    -webkit-border-radius: 2px;
    border-radius: 2px;
}
```

As you can see it also is able to derive values from your abbreviations. You have to play with it for a while. I noticed it did not resolve everything to the result I expected, but most of the times it's right. It can also figure out different value types:

```scss
.even-cooler-class {
    /* mb20 */
    margin-bottom: 20px;

    /* mb20p */
    margin-bottom: 20%;

    /* mb20.0 */
    margin-bottom: 20.0em;

    /* mb20.0r */
    margin-bottom: 20.0rem;
}
```

Hey that's pretty nice! Another cool feature is that it can also take advantage of what's on your clipboard. Who didn't copy paste HEX codes for colors from Photoshop or something else to their CSS/SASS?  I did do that, a lot. Let's say you copied _#3498db_ from flatuicolors.com, a nice shade of blue. Now remember how in the first example_ 'c' + tab_ resulted in a color with value '_#FFF_', let's try that again:

```scss
.insane-test {
    /* c */
    color: #3498db;
}
```

Quite impressive, don't you think? Hayaku has been polite and put the copied color there for us, as if it knows our habits.

As you can see a very nice tool, you can be more productive if you get the hang of it. It is currently only available for Sublime Text, but other IDE's can provide similar functionalities.

Happy styling!

## References:

- Official website: [hayakubundle.com](http://hayakubundle.com/)
- How to install Sublime Text packages: [granneman.com...how-to-install-and-use-package-control](http://www.granneman.com/webdev/editors/sublime-text/packages/how-to-install-and-use-package-control/)
