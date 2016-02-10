title: 'React inline styles with Radium & TinyColor'
tags:
  - CSS
  - Javascript
  - Radium
  - React
  - TinyColor
id: 297
categories:
  - Uncategorized
date: 2015-10-14 15:31:16
---

**CSS is an old standard. It's pretty basic and there are currently a lot of alternatives for styling web applications. Of course we have the pre-processors like [LESS](http://lesscss.org/) and [SASS](http://sass-lang.com/). [CSS Modules](https://github.com/css-modules/css-modules) is also a nice one which I'll probably cover in another post. In the end they all output plain CSS again, but ah well, what other options do you have? What about inline styles? In Javascript.. WHAT?!**

<!-- more -->

The last sentence may have sounded like a sin to you. But let's take a moment to think about this: why are inline styles bad? They are bad because they are hard to maintain, hard to override with CSS and don't provide any organisation whatsoever. But what if we threw Javascript into the mix, Javascript can take on the task of organising the styles and even do SASS like operations on them. This is exactly what React inline styles allow you to do.

So how do React inline styles look like?

```javascript
class PrettyMessage extends Component {
  render () {
    return <p style={prettyStyle}>Hello</p>
  }
}

const prettyStyle = {
  color: '#ff0000',
  backgroundColor: '#000',
  borderRadius: '3px'
  //I know, it's not pretty
}
```

The CSS itself is just a Javascript object, the properties are _camelCase_ in stead of _lower-case-dashes_ and the values are strings. We can use the style by assigning it to the style property of an element in React. This will convert it to an inline style.

This allows you to make really independent React components! You have your Javascript, markup and styling in one component. But what if you wanted to do SASS-like operations, like lighten a color? It's very easy with [TinyColor](https://github.com/bgrins/TinyColor)!

```javascript
import tinycolor from 'tinycolor2'

const BLACK = '#000'

const prettyStyle = {
  color: tinycolor('#ff0000').setAlpha(.5).toString(),
  backgroundColor: tinycolor(BLACK).lighten(10).toString(),
  borderRadius: '3px'
}
```

Because this is all just Javascript, we have endless possibilities! We could also compose styles from a base style with `Object.assign()`.

```javascript
const BLACK = '#000'
const RED = '#ff0000'
const WHITE = '#fff'

const prettyStyleBase = {
  color: RED,
  borderRadius: '3px'
}

const styles = {
  prettyStyleLight: Object.assign({}, prettyStyleBase, {
    color: tinycolor(prettyStyleBase.color).lighten(10).toString()
    backgroundColor: WHITE
  }),

  prettyStyleDark: Object.assign({}, prettyStyleBase, {
    backgroundColor: tinycolor(BLACK).setAlpha(.5).toString(),
  })
}
```

We could now use these styles in our component as follows:

```javascript
class PrettyMessage extends Component {
  render () {
    const { dark } = this.props
    const style = dark ? styles.prettyStyleDark : styles.prettyStyleLight

    return <p style={style}>Hello</p>
  }
}
//Styles are defined here
```

That's nice. Styles are now just Javascript objects. We can do everything with them Javascript can do. How about this function:

```javascript
function createButton(color) {
  const isLight = tinycolor(color).isLight()

  return {
    backgroundColor: color
    color: isLight ? 'black' : 'white'
    borderRadius: 2px
  }
}
```

It creates a button style based on the color you give it. That color will be the background color. If it's a _light_ color the text will be _black_, otherwise the text will be _white_. It's a bit like a SASS mixin, except for that you have even more possibilities.

Now we want to use _hover_ styles on our button. This is a tough one, because we use inline styles instead of CSS, we can't use `:hover`. This is where [Radium](http://projects.formidablelabs.com/radium/) comes in. It's a decorator for React classes, which allows you to use a `:hover` property in your style objects. It uses Javascript to detect if the user is hovering over an element or not and switches the styles accordingly. Let's do the button example with a hover style:

```javascript
import React, { Component } from 'react'
import Radium from 'radium'
import tinycolor from 'tinycolor2'

@Radium
class FabulousButton extends Component {
  render () {
    return <button style={styles.button}>I am fabulous</button>
  }
}

const HOT_PINK = '#ff69b4'

const styles = {
  button: createButtonStyle(HOT_PINK)
}

function createButtonStyle(color) {
  const isLight = tinycolor(color).isLight()

  return {
    backgroundColor: color
    color: isLight ? 'black' : 'white'
    borderRadius: 2px,

    ':hover': {
      backgroundColor: tinycolor(color).darken(15).toString()
    }
  }
}
```

We can now just use _hover_ styles in our style object and Radium handles the rest.

As you can see, lot's of possibilities. I'm eager to hear about anyone that applied this in their projects and what their experiences are. Happy styling!

## Reference

*   React inline styles: [facebook.github.io/react/tips/inline-styles](https://facebook.github.io/react/tips/inline-styles.html)
*   Radium: [projects.formidablelabs.com/radium](http://projects.formidablelabs.com/radium/)
*   TinyColor: [github.com/bgrins/TinyColor](https://github.com/bgrins/TinyColor)
