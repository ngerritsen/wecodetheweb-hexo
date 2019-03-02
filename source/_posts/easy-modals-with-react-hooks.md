---
title: 'Easy React Modals with Hooks and Portals'
tags:
  - React
  - Javascript
id: 304
categories:
  - Uncategorized
date: 2019-03-02 13:00:00
---

**Modals, there are a thousand ways of implementing them, but the biggest challenge is to keep them simple and flexible. Let's do that with React Hooks & Portals!**

<!-- more -->

> The code in this article can be found at [Codepen](https://codepen.io/aesthetickz/pen/pYywpJ).

So first off, let's state the requirements of our modal component:

1. Can be opened & closed, _duh!_ 🤓
2. Visual components should be decoupled from logic.
3. Can be used in anywhere in the app.

The second point is important. We want the component to be flexible, so that the consumer can compose any combination of visual components. But we do not want to be re-implementing the logic of toggling these UI elements every time. If we get this right, we can use this implementation for different types of modals, tooltips or collapsible panels.

The third point is something that is always a challenge with modals in particular. They need to be in the root of the DOM for visual styling purposes. This results in the modal content being far away from it's actual context on the page. Luckily we can solve this issue with Portals 👽.

## Creating the toggle

The first part is toggling. There are a lot of ways you can do this, but you always need to keep state about it somewhere. We can use Redux for this, or a stateful class component. But, to keep it nice and functional, we are going to use the new [React Hooks](https://reactjs.org/docs/hooks-intro.html).

```jsx
const ToggleContent = ({ toggle, content }) => {
  const [isOpen, setIsOpen] = useState(false);
  const close = () => setIsOpen(false);
  const open = () => setIsOpen(true);

  return (
    <>
      {toggle(open)}
      {isOpen && content(close)}
    </>
  );
};
```

There is a __LOT__ going on here! Let's get over it line by line.

First of all this is a _functional_ React component. You are all probably familiar with those by now. This means it cannot have state or lifecycle hooks, right? Well with the new React Hooks it can.

There are several hooks you can use, but in this case we are only going to use the `useState` hook. We need it to keep track of if our modal is open or closed. By calling `useState(initialValue)` on the top of our component, we tell React to create a state value, in this case we set it to be `false` initially. The `useState` hook returns us an array of two things, the _current value_ of the state and a _setter function_ to update the state.

```jsx
const [isOpen, setIsOpen] = useState(false);
```

Then, for convenience, we pre-define the `open` and `close` functions to set our state to `true` or `false`.

```jsx
const close = () => setIsOpen(false);
const open = () => setIsOpen(true);
```

In the returned value we render two things: the __toggle__ and the __content__. These are props provided by the consumer of the `ToggleContent` component. The `toggle` prop is rendering the button that opens our modal. The `content` prop is the actual modal (or tooltip, or popup or whatever). By using the `&&` operator we conditionlly render the content, it is only shown when `isOpen` is set to `true`.

```jsx
<>
  {toggle(open)}
  {isOpen && content(close)}
</>
```

You might find it strange _how_ we render the props passed in by the user. You might be used to rendering props containing content like this: `{toggle}`. But in this case we are using a technique called [render props](https://reactjs.org/docs/render-props.html). This means that these props are _functions_ that _return_ the content, which is why it looks like: `{toggle(open)}`. Doing this allows us to pass the `open` and `close` functions to the consumer.

> What are those weird `<> </>` elements? These are [React Fragements](https://reactjs.org/docs/fragments.html), elements that are themselves __NOT__ rendered to the actual DOM, but their children __ARE__. They are merely there to wrap our toggle and content elements into a single, virtual element. This is because a React component is required to return only one element.

Wow, a lot of concepts to wrap our heads around! _Hooks, render props, fragments_. Maybe actually using the `ToggleContent` component might clear things up.

## Using the toggle

So now that we have our toggle logic, let's use it in our App!

```html
<h1>My amazing app</h1>
<div id="app"></div>
```

```jsx
const App = () => (
  <p>
    Click to reveal a secret:

    <ToggleContent
      toggle={open => <button onClick={open}>Open</button>}
      content={close => (
        <p>
          There is no spoon...
          <button onClick={close}>Close</button>
        </p>
      )}
    />
  </p>
);

ReactDOM.render(<App />, document.getElementById('app'));
```

First off we pass in the the toggle itself. It's a simple button, but the interesting part is that it is wrapped in an arrow function, this is how you pass in a _render prop_. Because we do it like this, the button now has access to the `open` function, so that we can open the toggle on click.

For the content we do the same as for the toggle, this time it gets the `close` function, so that we can use it for a close button in the modal.

> In this example the `ToggleContent` component provides us with only one argument for each render prop. But you could make it even more flexible by passing the `open`, `close` and `isOpen` arguments to both render props. This way you can do even more complex interactions in your user interface.

## Creating an actual Modal

If you are following along, by this time, you should have a working 'modal'! Although it is not _really_ a modal, it's just content being added below the toggle. A modal is generally a box that that overlays the page. But luckily, we've made our `ToggleContent` component so flexible, that we can pass in our own components. Let's create a nice boxy modal:

```jsx
const Modal = ({ children }) => (
  ReactDOM.createPortal(
    <div className="modal">
      {children}
    </div>,
    document.getElementById('modal-root')
  )
);
```

```css
.modal {
  position: fixed;
  top: 12px;
  padding: 12px;
  background-color: white;
  border: 1px solid grey;
}
```

So this is our actual, visual Modal component. The content of it is defined by the consumer, using the `children` prop (not a render prop this time). The styling defines a simple box that is positioned fixed on top of our page. But to make sure it is always in the same position, not influenced by it's surrounding elements, we want it to be rendered at the root level of the page.

We could do that by always placing it at the root level of our React app. But that is generally not convenient. A modal might be used for confirming the submission of a contact form, somewhere deep down in the app. It would not feasable putting the modal for that at the root level.

This is where [React Portals](https://reactjs.org/docs/portals.html) come to the resqueue. Portals allow you to render an element from anywhere in the virtual DOM tree to a specific location in the actual DOM. It will always end up in the location you specify, in this example `#modal-root`. We need to make sure that element exists on our page:

```html
<h1>My amazing app</h1>
<div id="app"></div>
<div id="modal-root"></div>
```

 The modal should now always be rendered inside the `#modal-root` element, even if it is nested somewhere deep in the app! To finalize, we use the modal in our existing app:

 ```jsx
const App = () => (
  <p>
    Click to reveal a secret:

    <ToggleContent
      toggle={open => <button onClick={open}>Open</button>}
      content={close => (
        <Modal>
          There is no spoon...
          <button onClick={close}>Close</button>
        </Modal>
      )}
    />
  </p>
);
```

Note that only the `Modal` part will be rendered in `#modal-root`. The button to open the modal will still be rendered inside the `<p>`, just where we want it 👍.

## Conclusion

We now have a modal that you can use anywhere, multiple times, on the page! We used _hooks_ and _render props_ to create a reuseable `ToggleContent` component, that you can use for any modal-like use case. We used _portals_ to create a visual `Modal` component that can be used anywhere, but is positioned consistently on the page. Awesome!

## Reference

- [Code in Codepen](https://codepen.io/aesthetickz/pen/pYywpJ)
- [React Portals](https://reactjs.org/docs/portals.html)
- [React Fragements](https://reactjs.org/docs/fragments.html)
- [Render props](https://reactjs.org/docs/render-props.html)
- [React Hooks](https://reactjs.org/docs/hooks-intro.html)
