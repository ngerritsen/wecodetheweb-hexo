title: 'Handling async in Redux with Sagas'
tags:
  - ES6
  - Javascript
  - Redux
  - Flux
  - Design patterns
id: 300
categories:
  - Uncategorized
date: 2016-01-23 18:57:00
---
__Using Redux is a nice way to code structured, testable Javascript applications. But there's still one thing that can prove to be a challenge, asynchronous operations.__

<!--more-->

> If you don't know about redux, you can check out my article about it: [
"Functionally managing state with Redux"](2015/09/29/functionally-managing-state-with-redux/)

[Asynchrony](https://en.wikipedia.org/wiki/Asynchrony_(computer_programming) is not hard to achieve in Javascript, the language is perfectly suited for it. But testing async behaviour and implementing it in a structured way, is another story.

## Actions

In [redux](http://rackt.org/redux/index.html), the events happening in the application are called [Actions](http://rackt.org/redux/docs/basics/Actions.html). Actions are just plain objects containing a description of an event, they get dispatched to the store which handles them further. Actions are made by convenience functions called _Action creators_. Because of this, the one dispatching the action, does not need to know it's exact structure.

```javascript
function saveScore (score) {
  return {
    type: SAVE_SCORE,
    score
  }
}

// usage
store.dispatch(saveScore(9001))
```

This means you can also do some logic before returning the Action itself. However, this logic needs to be synchronous, because in the end you need to return a plain object. But what if you need to do async logic?

## Async actions

Say we want to save the score to the server. We want to dispatch actions as follows:

```javascript
=> SAVE_SCORE
  (save to server)
    => SAVE_SCORE_SUCCEEDED
```

We could use [redux-thunk](https://github.com/gaearon/redux-thunk) middelware for this. This middleware allows us to dispatch functions instead of plain objects. These functions will be passed a reference to `store.dispatch`. Here's how we could implement our save score action with redux-thunk middleware:

```javascript
function saveScore (score) {
  return dispatch => {
    dispatch({
      type: SAVE_SCORE,
      score
    })

    fetch('/scores', { method: 'POST', { score } })
      .then(dispatch => {
        dispatch({
          type: SAVE_SCORE_SUCCEEDED
        })
      })
  }
}
```

This looks pretty good, there's a nice overview of what happens. The downside is testability. A lot of async action is happening inside the Action creator:
  1. A function is returned that first dispatches an action.
  2. Fetch is called which returns a promise.
  3. A callback is registered at the promise, which on it's turn dispatches an action.

A test would look something like this:

```javascript
it('works', done => {
  const server = sinon.fakeServer.create()
  server.respondWith('GET', '/scores', [
    200,
    { Content-Type: 'application/json' },
    '{ "success": true }'
  ])

  const mockStore = createMockStore([ thunk ])
  const expectedActions = [
    { type: SAVE_SCORE, score: 9001 },
    { type: SAVE_SCORE_SUCCEEDED }
  ]
  const store = mockStore({}, expectedActions, done)

  store.dispatch(saveScore(9001))
  server.respond()
  server.restore()
})
```

This is fine and it works. But imagine having a lot of actions doing API calls and also having to test error handling. It will be more work doing and debugging all the mocking and setup, instead of actual testing.

## Using middleware

Why not use middleware, we could write generic middleware that does requests, and use it in our action like this:

```javascript
function saveScore (score) {
  return {
    type: SAVE_SCORE,
    score,
    request: {
      method: 'GET',
      url: '/test',
      success (dispatch) {
        dispatch({
          type: SAVE_SCORE_SUCCEEDED
        })
      }
    }
  }
}

// usage
store.dispatch(saveScore(9001))
```

But then your Action creators still need to pass a callback along with the Action. So although they are now vanilla actions again, to test their behaviour you still need to do all the mocking.

> Middleware runs every time an action enters the store, before it reaches the reducer. Middleware is mostly used to perform generic operations on certain or all actions, like logging or doing requests.

## A Saga

[Redux-saga](https://github.com/yelouafi/redux-saga) has a really nice solution for this issue. It separates the async logic from the action by putting it into '_Sagas_'. Sagas can be seen as little stories that _describe_ the _behaviour_ of one or more Actions.

Sagas work like daemons that run in the background. Redux-saga's '_sagaMiddleware_' runs and controls these Sagas. The Sagas themselves are ES6 _generator functions_, this allows redux-saga to have control over every single step the Saga does.

This is how the Saga for our action would look:

```javascript
function* saveScoreSaga () {
  while(true) {
    // Wait for the SAVE_SCORE action
    const { score } = yield take(SAVE_SCORE)

    try {
      // Tell redux-saga to call fetch with the specified options
      yield call(fetch, '/scores', { method: 'GET', body: { score } })
      // Tell redux-saga to dispatch the saveScoreSucceeded action
      yield put(saveScoreSucceeded())
    catch (err) {
      // You get it
      yield put (saveScoreFailed(err))
    }
  }
}

const middlewares = [ sagaMiddleware(saveScoreSaga) ]
const createStoreWithSagas = applyMiddleware(middlewares)(createStore)
const store = createStoreWithSagas(mainReducer)
```

Let's break this down, first of all `function*` means that this is a _'generator function'_. As you notice, this is an infinite while loop, don't panic! Generators don't run by themselves. The `while(true)` will just make sure the Saga will keep running throughout the application lifetime. We create the middleware by calling `sagaMiddleware(...sagas)` passing it the Sagas it needs to run. We use `applyMiddleware(...mw)` to apply the _sagaMiddlware_ to the store.

> Generator functions are an ES6 feature. For more information on generators, David Walsch has an [awesome article](https://davidwalsh.name/es6-generators) on this subject.

We start with calling redux-sagas _take_ function. This function returns a take object. We _yield_ this object by using the special keyword `yield`. This take object let's the sagaMiddleware know that we want to wait for a specific action. The generator function will now pause until the caller (the sagaMiddleware), resumes it. When the sagaMiddleware received the 'SAVE_SCORE' action, we continue to the next yield..

> Right of the yield keyword, you can place a value you want to _return_ to the caller. On the left, you can _retrieve_ a value back from the caller. Both are optional.

Now we _fetch_ the scores, notice that we do not call fetch directly. We use redux-sagas _call_ function, which creates an object that tells the sagaMiddleware to call fetch with the given arguments. We _yield_ this object to the sagaMiddleware. The sagaMiddleware will now execute this call and when it's done, resume the Saga. This means that to us, this just feels like a synchronous function!

> The function you pass to call needs to return a Promise. This way redux-saga can recognize it as an asynchronous operation and wait for it. There also is a _cps_ function for functions that take a callback instead of returning a Promise.

If the call succeeds, we yield a _put_ object with an action of type *SAVE_SCORE_SUCCEEDED*. This tells the sagaMiddleware that we want to dispatch an action. When the request fails we put an action of type *SAVE_SCORE_FAILED*.

Our action creators can now just return plain and simple objects:

```javascript
function saveScore (score) {
  return {
    type: SAVE_SCORE,
    score
  }
}

function saveScoreSucceeded () {
  return {
    type: SAVE_SCORE_SUCCEEDED
  }
}

function saveScoreFailed (err) {
  return {
    type: SAVE_SCORE_FAILED,
    err
  }
}
```

These action creators will be a breeze to test! This makes you wonder if we even need them anymore. I think there still are some use case where you  want to do some simple, synchronous operations in an action creator.

Now how do we test the Saga?

```javascript
it('works when the request succeeds', () => {
  const it = saveScoreSaga()

  expect(it.next().value).to.deep.equal(take(SAVE_SCORE))

  expect(it.next({ score: 7 }).value)
    .to.deep.equal(call(fetch, '/scores', { method: 'GET', body: { score: 7 } }))

  expect(it.next().value).to.deep.equal(put(saveScoreSucceeded()))
})
```

Look at how simple that test is! By calling `it.next(value)` we can continue to the next step, optionally passing a value. This is _exactly_ what the sagaMiddleware also does when running the Saga. The result of each `it.next()` has a _value_ property, containing the value the generator _yields_ at that point. Because we yield plain objects, we can just use a deep equal to check if they are correct.

## Nesting Sagas

It is also possible to nest Sagas. Let's say we have a generic _requestSaga_ for doing requests, maybe because we want to do some default error handling in there:

```javascript
function* requestSaga (method, url, body) {
  // Do request
  return { err: error, res: result }
}

function* saveScoreSaga () {
  while(true) {
    const { score } = yield take(SAVE_SCORE)
    const { err, res } = yield call(requestSaga, 'POST', '/scores', { score })

    if (err) {
      yield put (saveScoreFailed(err))
    } else {
      yield put(saveScoreSucceeded())
    }
  }
}
```

Instead of calling an asynchronous function, we can call another Saga. This will wait for the other Saga to finish and then continue.

## Non blocking Sagas

Yielding _call_ actually blocks the Saga. No other *SAVE_SCORE* action will be handled until this one has finished. In most cases that is desired behaviour, but sometimes you might want it to be able to handle tasks in parallel. Redux-saga has the _fork_ function for that. We could use that as follows:

```javascript
function* saveScoreSaga (score) {
  const { err, res } = yield call(requestSaga, 'POST', '/scores', { score })

  if (err) {
    yield put(saveScoreFailed(err))
  } else {
    yield put(saveScoreSucceeded())
  }
}

function* watchSaveScoreSaga () {
  while(true) {
    const { score } = yield take(SAVE_SCORE)
    yield fork(saveScoreSaga(score))
  }
}

const middlewares = [ sagaMiddleware(watchSaveScoreSaga) ]
// Etc..
```

Now, when the *SAVE_SCORE* action is retrieved, the _watchSaveScoreSaga_ will call the _saveScoreSaga_ and then __immediately__ continue, going back to `yield take(SAVE_SCORE)` again. This way multiple scores can be saved in parallel. Note that we now need to register the _watchSaveScoreSaga_ instead of the _saveScoreSaga_ at the _sagaMiddleware_.

> You only need to register the Sagas that actually _take_ actions. The others can be considered 'sub' Sagas, only called by others.

## Why not use ES2016/Next async await?

_Async functions_ are a new feature coming to the next version of EcmaScript. They are currently in _stage-3_, meaning they are a candidate for the next version. They work as follows:

```javascript
async function saveScore (score) {
  try {
    const res = await fetch('/scores', { method: 'POST', { score } })
    // Do something
  } catch (err) {
    // Handle error
  }
}
```

This function is marked as asynchronous by the `async` keyword. As soon as the the async function hits the `await` keyword, it waits for the promise behind it to resolve, then continues. This really nice and clean. But then again, it does _not_ solve the issue of testability. This async function __actually calls__ fetch, while the Saga merely __yields a description of__ what to call. The latter makes unit testing dead easy, saving you from having to mock anything.

## Conclusion

Sagas are _awesome_, they are a really nice way of doing async in redux. They succeed at seperating concerns and making testing really easy. It might be confusing at first, but once you start trying Sagas out it all starts to make sense. There are other implementations out there for handling side effects, like [redux-side-effect](https://github.com/gregwebs/redux-side-effect), [redux-effects](https://github.com/redux-effects/redux-effects) and [redux-loop](https://github.com/RaiseMarketplace/redux-loop). But, in my opinion, none of them solves it as elegantly as redux-saga. Happy coding!

## Reference
- Redux-saga: [github.com/yelouafi/redux-saga](https://github.com/yelouafi/redux-saga)
- Redux docs: [rackt.org/redux](http://rackt.org/redux/index.html)
- Basics of ES6 generators: [davidwalsh.name/es6-generators](https://davidwalsh.name/es6-generators)
