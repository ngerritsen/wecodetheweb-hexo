---
title: 'Convenient React modals with Portals and Context'
tags:
  - React
  - Javascript
id: 303
categories:
  - Uncategorized
date: 2018-05-18 17:46:05
---

**Modals can be repetitive to create, either when using Redux or just React, creating an isOpen state with open and close functions for each modal is no fun. There are already a lot of solutions to this issue, but in this article, we will solve it by using and learning about React 16 Portals and Context!**

<!-- more -->

So we'll create a modal setup without using Redux for now, first let's start with a basic Modal component without anything fancy:

```js
const Modal = ({ isOpen, children }) => {
  if (isOpen) {
    return (
      <div className="overlay">
        <div className="modal">{children}</div>
      </div>
    );
  }

  return null;
};
```

Obviously the `div` would be something styled to be a full screen overlay with a modal box inside. However, this modal does nothing else then just show or hide some modal with the passed in content using the `isOpen` flag. We still have some work to do!

## Portals

One problem that arises when implementing modals specifically, is their position in the DOM tree. Functionally they might belong to a specific part of your UI, for instance a settings button in the header or a delete button on a list item. But visually they are positioned fixed/absolute at the root level of the document.

This is the issue that React Portals address, let's assume you render your React app in the following HTML document:

```html
<body>
  <div id="app-root"><!-- React app will render here --></div>
  <div id="modal-root"><!-- We want our modals here --></div>
  <style>
    .overlay {
      position: fixed;
      top: 0; right: 0; left: 0; bottom: 0;
      text-align: center;
      background-color: rgba(0, 0, 0, 0.3);
      padding: 64px 32px;
    }

    .modal {
      display: inline-block;
      background-color: white;
      padding: 24px;
    }
  </style>
</body>
```

And this is our React app:

```js
const App = () => (
  <div>
    <h1>My React App</h1>
    <Modal isOpen>Welcome!</Modal>
    <p>Hello world.</p>
  </div>
);

ReactDOM.render(<App/>, document.getElementById('app-root'));
```

To make sure our modal renders inside the `#modal-root`, we can create a React Portal to warp space and time and teleport our modal outside of the `#app-root` to the `#modal-root`!

```js
const Modal = ({ isOpen, children }) => {
  if (isOpen) {
    return ReactDOM.createPortal(
      <div className="overlay">
        <div className="modal">{children}</div>
      </div>,
      document.getElementById('modal-root')
    );
  }

  return null;
};
```

This allows you to treat it like content that is somewhere inside the React app but visually display it somewhere else in the document. The cool thing is that React still treats it as part of the tree, so you can leverage context and it's events __will__ bubble up to it's parents.

## It's alive!

So we have got the visual part down, but now we want to actually be able to toggle the modal(s). Let's start with what you would do in React when having state, let's wrap it in a container component.

```js
class AppContainer extends React.Component {
  constructor(...args) {
    super(...args);
    this.state = { isModalOpen: true };
  }

  openModal() {
    this.setState({ isModalOpen: true });
  }

  closeModal() {
    this.setState({ isModalOpen: false });
  }

  render() {
    return <App
      isModalOpen={this.state.isModalOpen}
      openModal={() => this.openModal()}
      closeModal={() => this.closeModal()}
    />
  }
}
```

Pretty basic React container component that manages the state for our app. We update our App and render call to use the container and it's state:

```js
const App = ({ isModalOpen, openModal, closeModal }) => (
  <div>
    <h1>My React App</h1>
    <button onClick={openModal}>Show modal</button>
    <Modal isOpen={isModalOpen}>
      <p>Welcome!</p>
      <button onClick={closeModal}>Close</button>
    </Modal>
    <p>Hello world.</p>
  </div>
);
```

```js
ReactDOM.render(<AppContainer/>, document.getElementById('app-root'));
```

This works fine for one modal and one app, but what happens when our app gets bigger?

- We get more modals, so we need a lot of state with handlers to update them.
- We split up components, requiring us to pass down the state and handlers with props through multiple layers.

That's not so fun, we need something better.

## Context

Context has been around in React forever, but was not documented for a very long time. It is secretly used by a lot of third party libraries, like the widely used `react-redux`. Context is an alternative to props, where you don't have to pass it down through every component, but it's 'magically' available to all children in the tree.

This magic and undocumented part is also what made it such an iffy feature. Also the API to use it was not really amazing. You needed to implement a `getChildContext` method and define `childContextTypes` in a parent component. This made all child components that had a `contextTypes` property get the context.

The new context API makes the context a bit more explicit and less entangled with the components themselves. Let's use it.

First we define a 'context' this can be of any type, just a string or an object with values. This time let's make our modal system more scalable, instead of having a `isOpen` boolean flag, we will define and id of __which__ modal is open:

```js
const ModalContext = React.createContext({
  openModalId: '',
  openModal: () => {},
  closeModal: () => {},
});
```

Note that these values are just the default, we'll implement the open and close functions in a moment.

Now we can populate the context with data. Let's rework our `AppContainer` to a `ModalProvider`:

```js
class ModalProvider extends React.Component {
  constructor(...args) {
    super(...args);
    this.state = { openModalId: '' };
  }

  openModal(id) {
    this.setState({ openModalId: id });
  }

  closeModal() {
    this.setState({ openModalId: '' });
  }

  render() {
    return (
      <ModalContext.Provider value={{
        openModalId: this.state.openModalId,
        openModal: id => this.openModal(id),
        closeModal: () => this.closeModal()
      }}>
        {this.props.children}
      </ModalContext.Provider>
    );
  }
}
```

The interesting part is in the render function. The `ModalContext` we just defined has a property `Provider` which is a component that 'provides' the context to all it's children. The value property of this component defines the current value for the context. In this case we pass it the modal id from our state and the handlers we will use in our view.

> The naming convention Provider for components that provide context to child components is a pretty widely used one in the React community, the new context API confirms that.

Now we change our render call to use the provider in our app:

```js
ReactDOM.render(
  <ModalProvider>
    <App/>
  </ModalProvider>,
document.getElementById('app-root'));
```

Our whole app now potentially has access to this context, for our case this is what we want, but in some cases it makes sense to put a provider on a lower level.

So now it's time to use that context in our `Modal` component:

```js
const Modal = ({ id, children }) => (
  <ModalContext.Consumer>
    {({ closeModal, openModalId }) => {
      if (openModalId === id) {
        return ReactDOM.createPortal(
          <div className="overlay">
            <div className="modal">
              {children(closeModal)}
            </div>
          </div>,
          document.getElementById('modal-root')
        );
      }

      return null;
    }}
  </ModalContext.Consumer>
);
```

So there are two important things to note here, we have a `ModalContext.Consumer`, which is the counterpart of the Provider. This component receives the context provided by the provider. The consumer component __needs__ to be from the same context object as the provider to receive the props.

The second thing to note is that we render the children a bit different. The children now need to be a function that we can call, so that we can pass the `closeModal` handler to it. That also means we need to use the modal a bit differently in our app:

```js
// Inside the App component:
<Modal id="welcomeMessage">
  {(closeModal) => (
    <React.Fragment>
      <p>Welcome!!</p>
      <button onClick={closeModal}>Close</button>
    </React.Fragment>
  )}
</Modal>
```

First of all we give the modal a unique `id` so that when we open it the `ModalProvider` can store that id in the state. Second of all instead of directly passing our content, we pass a callback function by which we retrieve the `closeModal` handler. We can now use that handler in our button.

> The React.Fragment component is a component that itself does not get rendered, only it's children. It's just to wrap the `<p>` and `<button>` in one element without having to use a `<div>` or `<span>` that actually gets rendered.

So were almost there! The only thing we need is to open the modal. Because we replaced the `AppContainer` with the `ModalProvider` we don't have the `openModal` handler anymore in the `App` component. Let's create a component to toggle the modal:

```js
const ModalToggle = ({ id, children }) => (
  <ModalContext.Consumer>
    {children(() => openModal(id))}
  </ModalContext.Consumer>
);
```

This simple wrapper will allow us to get access to the `openModal` handler. When we render the button in our app, this is how the final `App` component will look:

```js
const App = () => (
  <div>
    <h1>My React App</h1>
    <ModalToggle id="welcomeMessage">
      {(openModal) => <button onClick={openModal}>Show welcome</button>}
    </ModalToggle>
    <Modal id="welcomeMessage">
      {(closeModal) => (
        <React.Fragment>
          <p>Welcome!!</p>
          <button onClick={closeModal}>Close</button>
        </React.Fragment>
      )}
    </Modal>
    <p>Hello world.</p>
  </div>
);
```

The app component got a few lines longer but now with a completely reusable modal. I mean, we could add another modal and it would just work as long as it has another id. Try to add a goodbye message below the 'Hello world' text for instance:

```js
// In the app component
<ModalToggle id="goodbyeMessage">
  {(openModal) => <button onClick={openModal}>Show goodbye</button>}
</ModalToggle>
<Modal id="goodbyeMessage">
  {(closeModal) => (
    <React.Fragment>
      <p>Goodbye!!</p>
      <button onClick={closeModal}>Close</button>
    </React.Fragment>
  )}
</Modal>
```
