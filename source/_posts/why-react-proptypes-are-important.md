title: Why React PropTypes are important
tags:
  - Javascript
  - React
id: 106
categories:
  - Uncategorized
date: 2015-06-02 08:56:04
---

_Props_ are the mechanism _React_ uses to let components communicate with each other. A parent component can pass it's child(ren) named prop values, which the child can then use in its internal logic. <!-- more --> It looks something like this:

```javascript
const ChildComponent = React.createClass({
    render() {
        return (
            <p>
                <i>{this.props.id}</i>: {this.props.message}
            </p>
        );
    }
});

const ParentComponent = React.createClass({
    render() {
        return <ChildComponent message="Narwhal" id={3}/>;
    }
});
```

As you can see, the _ParentComponent_ passes the string _"Narwhal"_ and number _3_ to the properties _'message'_ and _'id'_ of _ChildComponent_. React components have an internal property 'props'. This property contains all the props a component gets from its parent. So in this case _ChildComponent_ would get the message via _this.props.message_, everything great so far!

Imagine you are working in a bigger project with many, more complex components. Say a fellow developer is going to build a feature and he needs to use _ChildComponent_, how is he going to know _ChildComponent_ needs a property message and id to function properly? Yes, he will need too search the components code for usages of the _this.props_ object. He will also need to figure out what type those properties need to be. In more complex components this can be a time consuming activity.

This is where Reacts _propTypes_ come in. It's essentially a dictionary where you define what props your component needs and what type(s) they should be. How doesthis look like?

```javascript
const ChildComponent = React.createClass({
    propTypes: {
        message: React.PropTypes.string.isRequired
        id: React.PropTypes.number.isRequired
    }
    render() {
        return (
            <p>
                <i>{this.props.id}</i>: {this.props.message}
            </p>
        );
    }
});
```

_ChildComponent_ does exactly the same as before, however, your fellow developer will know by reading the _propTypes_ that he needs to pass in a property called message of type string. The _isRequired_ property tells you beloved colleagues that the property is required for the component to work. Here are a few more possibilities:

```javascript
propTypes: {
    //Id can be a number, or a string, but it needs to be defined!
    id: React.PropTypes.oneOfType([
        React.PropTypes.number,
        React.PropTypes.string
    ]).isRequired,

   //Messages should be an object with a title and text property of type string
    message: React.PropTypes.shape({  
        title: React.PropTypes.string,
        text: React.PropTypes.string
    }).isRequired,

    //The comments property needs to be an array of objects.
    comments: React.PropTypes.arrayOf(React.PropTypes.object),

    //The date needs to be an instance of type Date.
    date: React.PropTypes.instanceOf(Date)
}
```

So what happens if you do not conform to the defined _propTypes_? Well if you provide a prop of the wrong type or don't provide a required prop, React will log a warning to the console at runtime. React will only do this when you are in a development environment (defined by the global _NODE_ENV_ variable) to save performance in production.

> You can use envify to set the NODE_ENV variable. It is a global environment variable used by a lot of nodejs applications. You could have a seperate dev and production gulp task. In the production build you would set NODE_ENV to 'production'. For more information: [npmjs.com/package/envify](https://www.npmjs.com/package/envify).

The _propTypes_ object kind of defines the _'interface'_ for using a component. Always put it near the top of your component. Define a prop in the propTypes before you write any code using the actual prop. This prevents you from forgetting and makes you more aware of the _'dependencies'_ your component has to external data.

I think _'propTypes'_ is one of the strongest features of React. It also shows that the developers of React care and they want it to be a professional framework. Although _propTypes_ are optional, you should always use them!

## References
- React PropTypes: [facebook.github.io/react/docs/reusable-components.html](https://facebook.github.io/react/docs/reusable-components.html)
- Envify: [npmjs.com/package/envify](https://www.npmjs.com/package/envify)
