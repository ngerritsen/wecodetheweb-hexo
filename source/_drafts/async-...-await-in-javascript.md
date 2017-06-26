---
title: Async ... await in Javascript
tags:
  - Javascript
  - ES6
  - Node
id: 53
categories:
  - Uncategorized
date: 2017-06-25 00:00:00
---

__We've all been through callback hell, maybe we learned Promises and Observables to get some relief. Will async await liberate us once and for all?__

<!-- more -->

## Callback hell 🔥

We all know callback hell. We can prevent going to hell, but not using callbacks. I mean, look at a common Promise example:

```javascript
fetchUsers()
  .then((users) => {
    return fetchScores(users)
      .then((scores) => {
        return users.map(user => ({
          ...user,
          score: scores[user.id]
        }));
      });
  });
```

Why do we need to neset the second Promise? The whole advantage of Promises is that you do not need to nest right? Well, in this example I kinda need to, because I need the users after fetching the scores. I could solve this differently ofcourse, but it's extra hassle anyhow.

Callbacks will always be there in Javascript, and that's not a bad thing, it's what enables Javascripts asynchronousity and flexibility. It's just hard when dealing with a lot of them.

> Callbacks enable Javascripts asynchronousity, because when calling a browser or Node.js API like `setTimeout(callback, ms)`, the Javascript engine can continue, while giving the environment a function to call when setTimeout is done.

## Async await

Async await is a new syntax that is released with [ES2017](http://2ality.com/2016/02/ecmascript-2017.html). It uses two keywords: __async__ and __await__ to make asynchronous logic more easy.

The _async_ keyword can be used to mark a function as "asynchronous":

```javascript
async function fetchUsersWithScores() {
  // Now an async function
}
```

Asynchronous functions return a _Promise_. This fetchUsersWithScores function will now always return a Promise even if it's only doing synchronous logic.

The _await_ keyword is then used to _handle Promises_ inside the function:

```javascript
async function fetchUsersWithScores() {
  const users = await fetchUsers();

  return users;
}
```

We fetch the users using the same function, but notice how we are not chaining `.then()` to _fetchUsers_, although it returns a Promise? This is because await handles that_Promise for us. It "pauses" the function until _fetchUsers_ is done, and returns the result.

> Async marks a function as asynchronous, the function will always return a Promise. Await handles Promises inside the async function, making your logic seem synchronous.

We can now fetch the scores and tie them together easily:

```javascript
async function fetchUsersWithScores() {
  const users = await fetchUsers();
  const scores = await fetchScores(users);

  return users.map(user => ({
    ...user,
    score: scores[user.id]
  }));
}
```

So long, callback hell!

## Doesn't this defeat the purpose of Javascript?

Short answer, no! Note that the async keyword only marks the _current_ function as "asynchronous". Therefore await still only blocks the _current_ function execution, not all other functions in the application. You can still fully leverage concurrency when using __async await__.

Note that the fetchUsersWithScores function itself still returns a Promise:

```javascript
fetchUsersWithScores()
  .then(users => console.log(users));
```

I could actually run that function in parallel with something else if I wanted:

```javascript
fetchUsersWithScores()
  .then(users => console.log(users));

fetchTotalScore()
  .then(score => console.log(score));
```

And I could even await those two together using `Promise.all(...promises)`:

```javascript
fetchAllTheThings() {
  const [users, totalScore] = await Promise.all([
    fetchUsersWithScores(),
    fetchTotalScore()
  ]);

  return { users, totalScore };
}
```

_Promise.all waits for all Promises in an array to succeed and returns their results as an array._

You get the drill? Make a function async, await Promises inside, and return the result. But how about errors?

## Error handling

Normally you can chain a `.catch()` to a Promise to handle possible errors. However, as you've just seen, with await you get a single value as output. When an error occurs, it will throw the error, you can simply handle that with a regular __try - catch__:

```javascript
async function fetchUsersWithScores() {
  try {
    const users = await fetchUsers();
    const scores = await fetchScores(users);

    return users.map(user => ({
      ...user,
      score: scores[user.id]
    }));
  } catch (error) {
    console.error(error.stack);
  }
}
```

Another thing you could do, is not catching the error inside the async function (because you might not be able to do anything useful anyway), but chain a catch to it:

```javascript
fetchUsersWithScores()
  .then((usersWithScores) => {
    showUsers(usersWithScores)
  })
  .catch((error) => {
    showErrorPopup(error.message)
  });
```

## Looping

How do we go about looping? You might be tempted to use the `.forEach()`:

```javascript
async function saveUsers(users) {
  users.forEach((user) => {
    await saveUser(user)
  });
}
```

Nope, won't work! If you look closely, the await is _inside_ a callback, which is another function, this will crash because that callback is not async. How about making it async?

```javascript
async function saveUsers(users) {
  users.forEach(async (user) => {
    await saveUser(user)
  });
}
```

This does work, but saveUsers will __not__ wait for the result of the saveUser calls to be finished. We could maybe try to use a map?

```javascript
async function saveUsers(users) {
  const promises = users.map(async (user) => {
    await saveUser(user)
  });

  await Promise.all(promises);
}
```

Hmmm, saveUsers will wait for all promises to succeed, but there is not any point in making that async callback right? We could just map the save user calls as promises and be done with it.

There is also another pitfall, the saveUser calls are parallel, because the map does not wait for the async function to finish. You might not want that in certain use cases. A nice and clean wait to do this is by just using a __for...of__ loop:

```javascript
async function saveUsers(users) {
  for (user of users) {
    await saveUser(user)
  }
}
```

> When calling asynchronous things in parralel, map the promises to an array and await the `Promise.all()`. When a sequential flow is required, use a `for...of` with awaits.

## Callback hell solved?

I must say I'm pretty exited for the future. Async await solves the issues with combining multiple callbacks/Promises and makes more complex asynchronous flows way more easy to code.

I have a point of attention though. Async await "hides" some of the handling of Promises, but it's still vital for newcomers to know how these concepts work, or they will not surive Javascript. You still need Promises to handle the async functions and understand that await takes a Promise. You will also still need callbacks for all kinds of other API's.

## When can I use it

Async await is released with the [ES2017](http://2ality.com/2016/02/ecmascript-2017.html) spec. For [Node.js](https://nodejs.org/en/) users, if you upgrade to version 8+, you're good to go!

On the front-end you will need a transpiler like [Babel](https://babeljs.io/) to make async await shine. For Babel I would recommend using the ["env" preset](https://babeljs.io/docs/plugins/preset-env/) with the ["regenerator runtime"](https://babeljs.io/docs/usage/polyfill/) to make it work.
