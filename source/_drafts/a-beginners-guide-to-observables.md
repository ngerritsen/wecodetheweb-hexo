---
title: A beginners guide to observables
tags:
  - Javascript
  - Observables
  - RxJS
id: 52
categories:
  - Uncategorized
date: 2017-02-15 19:00:03
---

**Reactive programming is the next thing in Javascript land. Observables, asynchronous event streams, ReactiveX, Cycle.js. What is all this stuff? And why should you care?**

<!-- more -->

I hear you thinking: "I just grasp how Promises work and now I have to learn Observables?" I get it, Javascript land is very turbulent and you want to learn everything. But let me reassure you, Promises are still relevant, so are callbacks. What are these Observables then?

## Meet, the event stream

Let's take a common example of clicking a button and then handling the result:

```js
button.addEventListener('click', (event) => {
  const text = event.currentTarget.textContent;

  if (text === 'Hello') {
    alert('Hello')
  }
})
```

This is how you would do it using the regular browser API. Probably fine for this simple use case, but you can already see some complexity arising with the if statement. Every click is an event. All we want to do here is filter out all clicks on buttons don't have the text `'Hello'`. What if we could treat all events as if they are just an array?

```js
Rx.Observable.fromEvent(button, 'click')
  .map(event => event.currentTarget.textContent)
  .filter(text => text === 'Hello')
  .subscribe(text => alert(text))
```
