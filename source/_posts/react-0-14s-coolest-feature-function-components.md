title: "React 0.14's coolest feature: function components"
tags:
  - ECMAScript 6
  - React
id: 283
categories:
  - Uncategorized
date: 2015-10-03 09:13:19
---

**[React 0.14](https://facebook.github.io/react/blog/2015/09/10/react-v0.14-rc1.html) introduced some cool additions, one of them is a more simple way to create components. This is one of those nifty little features that makes developers happy :-).**

<!-- more -->

This feature is meant for simple components that don't use state and purely render based on props every time. Basically, you just provide React a function that takes props as an argument, and returns DOM elements!

This is how you would 'normally' create a (simple) component in React (using _ES6_):

```javascript
class Ingredients extends React.Component {
  //comment
  render() {
    return (
      <ul>
        {this.props.ingredients.map((ingredient) => (
          <li>{ingredient}</li>}
        )
      </ul>
    }
  }
}
```

And now in the new 'functional way':

```javascript
let Ingredients = (props) => (
  <ul>
    {props.ingredients.map((ingredient) => <li>{ingredient}</li>}
  </ul>
)
```

See? Way simpler, same result. And if you are old fashioned or don't have any other choice, here's the _ES5_ version:

```
function Ingredients(props) {
  return (
    <ul>
      {props.ingredients.map(function (ingredient) {
        return <li>{ingredient}</li>;
      }
    </ul>
  );
}
```

Notice how ES6 really shines here, you can even use _[destructuring](https://developer.mozilla.org/en/docs/Web/JavaScript/Reference/Operators/Destructuring_assignment)_ inside of the parameter declaration to make it even more neat:

```javascript
let Ingredients = ({ ingredients }) => (
  <ul>
    {ingredients.map((i) => <li>{i}</li>}
  </ul>
)
```

There is another nice plus the React team mentioned. In the future, these components will be rendered more performant than '_normal_' components. Because they are more predictable React can remove some operations on them and render them more efficient.

## Downsides

Currently, this feature has some downsides:

*   Not all component features are available, like state and life cycle methods.
*   Testing is harder, some React test utilities don't work on this type of component.

**Update**: I've written a little snippet/lib that can convert function components into 'normal' ones for testing purposes [github.com/ngerritsen/react-stateless-wrapper](https://github.com/ngerritsen/react-stateless-wrapper)

But the first point can also be seen as a plus. This type of component encourages you to compose you application of many simple (and performant) components.

So, I really like this feature, try it out. Happy coding!

## Reference

*   React 0.14 release notes: [facebook.github.io/react/blog/.../react-v0.14-rc1](https://facebook.github.io/react/blog/2015/09/10/react-v0.14-rc1.html)
*   ES6 Arrow functions: [developer.mozilla.org/en-US/docs/.../Arrow_functions](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Functions/Arrow_functions)
