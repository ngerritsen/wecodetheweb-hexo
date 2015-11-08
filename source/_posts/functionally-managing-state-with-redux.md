title: Functionally managing state with Redux
tags:
  - Flux
  - Javascript
  - React
  - Redux
id: 263
categories:
  - Uncategorized
date: 2015-09-29 15:24:22
---

**The [Flux](https://facebook.github.io/flux/) application design pattern is still going strong and gaining popularity. There are countless libraries around, helping you implement Flux. But lately, one has been standing out. <!-- more --> [Redux](http://rackt.github.io/redux/docs/introduction) is definitely the most simple implementation of Flux I have seen so far and it's very functional too, actually, it's just a bunch of functions!**
> If you don't know about Flux yet, read my article about it: [Flux, what and why?](http://wecodetheweb.com/2015/08/22/flux-what-and-why/), or go and [Google some Flux...](http://lmgtfy.com/?q=Flux%20js)

### Functions, functions everywhere

So what is _redux_ all about? Given, it's an implementation of Flux. But it looks quite different (all examples will be in ES6). We are going to cover the three basic concepts: the _store_, _reducers _and _actions_. Let's start with the _store_. So how do you create one in redux ?
<pre class="lang:js decode:true">import { createStore } from 'redux'

let store = createStore(reducer)</pre>
Yes, just one line (excluding the import). And this is the last store you will need, yes, only one. Your  application will have one store with one big object containing you application state. So what is that [startCode]reducer[endCode] all about?
<pre class="lang:default decode:true">function reducer(state, action) {
  //modify state
  return state
}</pre>
A _reducer_ is a just Javascript function, nothing fancy. It takes the current state and returns the next state! Just pass it to the store, and the store will use that reducer to update it's state. Pretty simple right? No side effects, no magic.

But what will trigger the store to update it's state? That's where _actions_ come in to play, they are also just ... functions!
<pre class="lang:default decode:true ">const ADD_MONEY = 'ADD_MONEY'
function addMoney(amount) {
  return {
    type: ADD_MONEY,
    amount: amount
  }
}</pre>
Again: no side effects, no magic. This action just takes an amount of money and returns an action object. The action object is essentially a message that you send to the _store_  and tells the _reducers_ what to do. The object composition is completely up to you, but following the Flux pattern, at least specify the <span style="text-decoration: underline;">type</span> of the action. String constants are an easy way to specify types.

Now let's modify our reducer to handle this action:
<pre class="lang:default decode:true">function reducer(state = 0, action) {
  switch(action.type) {
    case ADD_MONEY:
      return state + action.amount
    default:
      return state
  }
}</pre>
So, we start off with a default of 0 money. Then if an action is fired, we check if it is an _ADD_MONEY_ type action. If it is, we return a new state with the money added. If it is not an _ADD_MONEY_ type action we do nothing, we just return the old state.
> Notice how we don't modify the old state, this is a very important fact. Always return a <span style="text-decoration: underline;">new</span> state, <span style="text-decoration: underline;">never</span> mutate the old state. You could use a library like [ImmutableJS](https://facebook.github.io/immutable-js/) to assure this behaviour, or use [startCode]Object.assign(..)[endCode] to create a new state every time.
So, how do we fire off this action? I mean, we need some money right?
<pre class="lang:default decode:true">store.dispatch(addMoney(1000000)) //1 million!</pre>
One line, that's it! [startCode]addMoney[endCode] will return an action object of type [startCode]ADD_MONEY[endCode] with an amount value of 1000000\. The store will pass that action to the reducer, which will determine the new state. This new state is then stored in the store and can be accessed like this:
<pre class="lang:default decode:true">store.getState() // =&gt; 1000000</pre>

### The cycle

So to recap. There are three main concepts in redux. The store, actions and reducers. Actions trigger state changes, the store holds the state and reducers calculate the next state. Here is a simplified scheme of how the redux cycle works:

![redux-cycle](http://wecodetheweb.com/wp-content/uploads/2015/09/redux-cycle.png)
> Actions are triggered by either views, other actions or events/callbacks from, for instance, the server.

### Getting serious

That was pretty cool right? Not a lot of code, no magic, just simple Javascript functions. Notice how we only did one import from redux, just the _createStore_ method. Everything else is plain Javascript. But, especially when you already know Flux, this will raise some questions like:'_Only one store, how do I keep code manageble then?_', '_How do I wire this up to my views?_'. Well, let's answer at least these two questions.

Let's say our application has a bigger state then just money. Let's say it has money and awesomeness. How do we do this? We can just create 2 reducers!
<pre class="lang:default decode:true">function moneyReducer(state = 0, action) {
  switch(action.type) {
    case ADD_MONEY:
      return state + action.amount
    default:
      return state
  }
}

function awesomenessReducer(state = 0, action) {
  switch(action.type) {
    case INCREASE_AWESOMENESS:
      return state + action.amount
    default:
      return state
  }
}</pre>
And then combine them like this:
<pre class="lang:default decode:true">function mainReducer(state = {}, action) {
  return {
    money: moneyReducer(state.money, action),
    awesomeness: awesomenessReducer(state.awesomeness, action)
  }
}

let store = createStore(mainReducer)</pre>
This will result in both reducers output being combined into one object. We could also use a helper provided by redux:
<pre class="lang:default decode:true">import { combineReducers, createStore } from 'redux'

let store = createStore(combineReducers({
  money: moneyReducer
  awesomeness: awesomenessReducer
}))</pre>
This has the exact same result and is completely optional, but can be more convenient.

Get state still works the same, but now it returns an object with two properties:
<pre class="lang:default decode:true">store.getState() // =&gt; { money: 0, awesomeness: 0 }
store.dispatch(addMoney(500000))
store.getState() // =&gt; { money: 500000, awesomeness: 0 }</pre>
The store updates the state according to the action you pass to it. There are no weird side effects, just simple input output logic.

### Wiring up React

So how do we wire the store up to a view? I mean, all this stuff is fun, but we want to interact with it right, otherwise what's the point? Let's do this example with, yes, React.

First we create a React Component:
<pre class="lang:default decode:true">import React, { Component }  from 'react'
import { connect, Provider } from 'react-redux'

class MyCoolComponent extends Component {
  constructor(props, context) {
    super(props, context)
    this.giveMoney = this.giveMoney.bind(this)
  }

  giveMoney(e) {
    e.preventDefault()
    this.props.dispatch(addMoney(10))
  }

  render() {
    const { money, awesomeness } = this.props
    return (
      &lt;div&gt;
        &lt;p&gt;`I have ${money}€, and I\'m ${awesomeness} awesome!`&lt;/p&gt;
        &lt;button onClick={this.giveMoney}&gt;Give me 10€&lt;/button&gt;
      &lt;/div&gt;
    )
  }
}</pre>
This component needs the _money_ and _awesomeness_ props to be passed to it. It will then render a nice message about me and a button to give me more money :). If someone clicks the button, the _giveMoney_ method is called. It will need the _dispatch_ function from the store (also passed via the props) and then pass the _addMoney_ action to the dispatch function.

Now we have to _connect_ the component to redux, so that it can pass us the money and awesomeness props. To do this we will use the package '_react-redux_', which will '_connect_' our view to our store. This will let the view update automatically when the state of the store changes.
<pre class="lang:default decode:true">import { connect, Provider } from 'react-redux'

connect((state) =&gt; state)(MyCoolComponent)

ReactDOM.render(
  &lt;Provider store={store}&gt;
    &lt;MyCoolComponent&gt;
  &lt;/Provider&gt;,
  document.getElementById('container')
)</pre>
First we import the _connect_ function and the _Provider_ component from '_react-redux_'. Then we connect _MyCoolComponent_ to the store. The connect method takes a function that allows you to control how the state is passed to the component. For now just [startCode](state) =&gt; state[endCode] will be sufficient. Then we pass _MyCoolComponent_ to the function connect returns, our component is now ready for connection with redux.

At last we render our component into the DOM, but we wrap it in the _Provider_ component. We pass the _Provider_ component the store, the _Provider_ will now connect the '_connected_' components inside of it with the store. And that's it. Our component now updates when the state of the store changes.

### Conclusion

I think this is enough for this article. If you are confused right now, don't worry, it takes some time to get your head around the concept. It's a bit different from what you might be used to. There is a _lot_ more you can do with redux (like [middleware](http://rackt.github.io/redux/docs/advanced/Middleware.html), [debug tooling](https://github.com/gaearon/redux-devtools)) and it has a very vibrant community around it. The documentation of redux is very good and the library is maintained actively. The only way to learn more about it, is to <span style="text-decoration: underline;">play</span> with it! Happy playing!

### Reference

Redux documentation: [rackt.github.io/redux/docs/introduction](http://rackt.github.io/redux/docs/introduction)

Redux on GitHub: [github.com/rackt/redux](https://github.com/rackt/redux)

React-redux: [github.com/rackt/react-redux](https://github.com/rackt/react-redux)

Flux: [facebook.github.io/flux](https://facebook.github.io/flux/)
