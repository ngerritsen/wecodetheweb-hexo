title: 'Hooking up React with redux using custom connectors'
tags:
  - ES2015
  - Javascript
  - React
  - Redux
  - Design patterns
id: 300
categories:
  - Uncategorized
date: 2016-01-08 18:00:00
---

**React and redux can be hooked up with the connect function provided by react-redux. But this can come with some testability complications. Or does it?**

<!-- more -->

I hear you thinking, what is this guy talking about? If you read the intro and need background information, check out [my article on Redux](/2015/09/29/functionally-managing-state-with-redux/). Otherwise, read on.

## The problem

Let's say we have a nice and simple app made in React with redux. Let me show you the code real quick.

```javascript
// main.js

import React from 'react'
import ReactDOM from 'react-dom'
import { Provider } from 'react-redux'

import store from './store'
import AppContainer from './app-container'

ReactDOM.render(
  <Provider store={store}>
    <AppContainer/>
  </Provider>,
  document.getElementById('#app')
)
```

So here we import our store (let's leave the store implementation out of scope), our _AppContainer_ component and wrap it in the _Provider_, passing it the _store_. This will make sure that all components in it have access to the store's state. We render this into the DOM to initialize our app.

```javascript
// app-container.js

import React, { Component } from 'react'
import { connect } from 'react-redux'

import App from './app'

class AppContainer extends Component {
  _makeTitlePretty (title) {
    title.toUpperCase()
  }

  render () {
    const { title, content } = this.props

    return <App
      title={this._makeTitlePretty(title)}
      content={content}
      />
  }
}

export default connect(state => state.currentArticle)(AppContainer)
```

This is our _AppContainer_ component, containers handle the connection with the redux store and possibly some view logic. The _connect_ function provided by _react-redux_ maps the state it gets from the Provider to the _AppContainer_ component. In this case we want it to have the _currentArticle_.

```javascript
// app.js

import React from 'react'

export default ({ title, content }) => (
  <div>
    <h1>{title}</h1>
    <p>{content}</p>
  </div>
)
```

Yeah, our app is really nice and simple, it gets the title and content passed in by the AppContainer and renders it.

So until now all is good! Our App component is perfectly testable. But how about the App container, how would we test that? I mean, it relies on it being wrapped in the _Provider_ component, component will throw an error if it does not have that context. What if we just want to pass props in directly. We could do the following:

```javascript
export { AppContainer as AppContainerUnconnected }
export default connect(state => state.currentArticle)(AppContainer)
```

This can work, we can test AppContainerUnconnected now, but it's pretty cumbersome having to manage two exports.

Also you could use the _Provider_ in your test, but that means overhead and relying on the _Provider_ to work as expected. This would also mean that you would also have to create a mocked _store_ in that test, mehh...

## Separating concerns

So what can we do about this? How about making a seperate class that just does the connection, and another one that does the business logic, a bit like a controller.

```javascript
// app-container.js

import React, { Component } from 'react'
import { connect } from 'react-redux'

import AppController from './app-controller'

class AppContainer extends Component {
  render () {
    return <AppController {...this.props}/>
  }
}

export default connect(state => state.currentArticle)(AppContainer)
```

```javascript
// app-controller.js

import React, { Component } from 'react'

import App from './app'

export default class AppController extends Component {
  _makeTitlePretty (title) {
    title.toUpperCase()
  }

  render () {
    const { title, content } = this.props

    return <App
      title={this._makeTitlePretty(title)}
      content={content}
      />
  }
}
```

Okay nice so we separated concerns. The _container_ is only responsible for connecting to the state. The _controller_ is only responsible for doing the view logic.

But now we have to manage an extra component for each section of our app. That's also really annoying right?

But why should the connecting part actually be a React component? Can't it just be a function?

```javascript
// app-connector.js

import { connect } from 'react-redux'

function mapStateToProps (state) {
  return state.currentArticle
}

export default function connectApp (Component) {
  return connect(mapStateToProps)(Component)
}
```

Now we can lose the previous Container thing and still have separated concerns! Let's rename the Controller back to Container for convention sake.

```javascript
// app-container.js

export default class AppContainer extends Component {
  _makeTitlePretty (title) {
    title.toUpperCase()
  }

  render () {
    const { title, content } = this.props

    return <App
      title={this._makeTitlePretty(title)}
      content={content}
      />
  }
}
```

Now that one is dead easy to test, no _Provider_ or unconnected export needed. Also the custom App connector is very flexible. It does not event do any assumptions on what component it actually connects. It just handles the connection.

The last thing to do is actually apply the connection:

```javascript
// main.js

import React from 'react'
import ReactDOM from 'react-dom'
import { Provider } from 'react-redux'

import store from './store'
import connectApp from './app-connector'
import AppContainer from './app-container'

const AppContainerConnected = connectApp(AppContainer)

ReactDOM.render(
  <Provider store={store}>
    <AppContainerConnected/>
  </Provider>,
  document.getElementById('#app')
)
```

This looks better already, yes you need an extra step to connect the _AppContainer_ but at least it's more clear what happens. When used in routes it's even more easy:

```javascript
// routes.js
import React from 'react'
import { Router, Route } from 'react-router'

import connectApp from './app-connector'
import AppContainer from './app-container'

export default
  <Router>
    <Route path="/" component={connectApp(AppContainer)}/>
  </Router>
```

## Downsides

This is still not perfect. You still need to keep an extra file for the connectors, so you lose a bit of context when reading a connector. Also although the connectors are separate, they still are a bit tied to the component, because you need to know what a component needs. Third you still have an untested piece of code which is the connector. And you also cannot have a _Container_ that has other _Containers_ as children, each with their own _connector_? When testing such a Container, you will have problems with the child containers not able to find the _Provider_. So still some stuff for you to think about!
