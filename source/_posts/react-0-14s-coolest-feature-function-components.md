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
<pre class="lang:js decode:true">class Ingredients extends React.Component {
  render() {
    return (
      &lt;ul&gt;
        {this.props.ingredients.map((ingredient) =&gt; (
          &lt;li&gt;{ingredient}&lt;/li&gt;}
        )
      &lt;/ul&gt;
    }
  }
}</pre>
And now in the new 'functional way':
<pre class="lang:js decode:true">let Ingredients = (props) =&gt; (
  &lt;ul&gt;
    {props.ingredients.map((ingredient) =&gt; &lt;li&gt;{ingredient}&lt;/li&gt;}
  &lt;/ul&gt;
)</pre>
See? Way simpler, same result. And if you are old fashioned or don't have any other choice, here's the _ES5_ version:
<pre class="lang:default decode:true">function Ingredients(props) {
  return (
    &lt;ul&gt;
      {props.ingredients.map(function (ingredient) {
        return &lt;li&gt;{ingredient}&lt;/li&gt;;
      }
    &lt;/ul&gt;
  );
}</pre>
Notice how ES6 really shines here, you can even use _[destructuring](https://developer.mozilla.org/en/docs/Web/JavaScript/Reference/Operators/Destructuring_assignment)_ inside of the parameter declaration to make it even more neat:
<pre class="lang:js decode:true">let Ingredients = ({ ingredients }) =&gt; (
  &lt;ul&gt;
    {ingredients.map((i) =&gt; &lt;li&gt;{i}&lt;/li&gt;}
  &lt;/ul&gt;
)</pre>
There is another nice plus the React team mentioned. In the future, these components will be rendered more performant than '_normal_' components. Because they are more predictable React can remove some operations on them and render them more efficient.

### Downsides

Currently, this feature has some downsides:

*   Not all component features are available, like state and life cycle methods.
*   Testing is harder, some React test utilities don't work on this type of component.

**Update**: I've written a little snippet/lib that can convert function components into 'normal' ones for testing purposes [github.com/ngerritsen/react-stateless-wrapper](https://github.com/ngerritsen/react-stateless-wrapper)

But the first point can also be seen as a plus. This type of component encourages you to compose you application of many simple (and performant) components.

So, I really like this feature, try it out. Happy coding!

### Reference

React 0.14 release notes: [facebook.github.io/react/blog/.../react-v0.14-rc1](https://facebook.github.io/react/blog/2015/09/10/react-v0.14-rc1.html)

ES6 Arrow functions: [developer.mozilla.org/en-US/docs/.../Arrow_functions](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Functions/Arrow_functions)

&nbsp;
