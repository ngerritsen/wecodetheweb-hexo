---
title: Effortless unit testing with AVA
tags:
  - Testing
  - Ava
  - Javascript
id: 302
categories:
  - Uncategorized
date: 2016-04-19 23:45:29
---

**There are a lot of test runners out there. [Mocha](http://mochajs.org/), [Jasmine](http://jasmine.github.io/), [tape](https://github.com/substack/tape) and more. I hear you thinking: "another framework?". But Ava is a worthy alternative for the existing solutions.**

<!-- more -->

## Simplicity

First of all AVA is **simple**. It's really easy to set up. First install ava: `npm install ava -g`, then run ava by running `ava`. AVA will by default detect tests using common patterns. Let's make one:

```js
// test.js
import test from 'ava'

test('one plus one is two', t => {
  t.equal(1 + 1, 2)
})
```

This is it, simple as that. Maybe you are thinking, ES6 code? Don't you have to transpile that? No, AVA supports ES6 by default, awesome!

## Efficiency

Tests run in parallel by default, this means that in general they will run faster. You're able to run them in serial if needed. However, having your tests run in parallel also forces you to make sure all your tests are completely independent of each other, which is always a good practice.

## Asynchronous

AVA supports asynchronous testing by default:

```js
test('async test', t => {
  t.plan(1)

  setTimeout(() => {
    t.is(3, 1 + 2)
  }, 1000)
})
```

We let AVA know that one assertion is coming up, so AVA will wait for the timeout to finish. If you return a promise you don't have to wait at all.

```js
test('async test', t => {
  return Promise.resolve('wecodetheweb')
    .then(text => {
      t.is(text, 'wecodetheweb');
    });
})
```

## Only one

Another nifty feature that you can only run the test that you are working on. This can be handy if you have a lot of tests and you want to focus one fixing one at a time:

```js
test('one plus one is two', t => {
  t.equal(1 + 1, 2)
})

test.only('two plus one is three', t => {
  t.equal(1 + 2, 3)
})
```

It will now only run the second test.

## Mocking

AVA has no mocking built in, to mock functions just use [Sinon.js](http://sinonjs.org/). Install sinon by running `npm install sinon --save-dev`. Then use it in your tests:

```js
import sinon from 'sinon'

const myFunction = sinon.spy()

test('my function is running!', t => {
  myFunction()

  t.true(myFunction.called)
})
```

## Running AVA locally

Installing AVA globally is okay to play around with it. But in a "real" project you want your dependencies to be local. To setup AVA for your project simply run `npm install ava --save-dev`. Then add the following script to your _package.json_:

```json
{
  "scripts": {
    "test": "ava",
    "test:watch": "ava --watch"
  }
}
```

You can now run your tests using `npm run test` or `npm run test:watch` if you want to let them automatically run on change.

## Code coverage

Getting code coverage reports is also really easy. AVA runs tests using so called "subprocesses", this is why just using _istanbul_ for code coverage will not work. Luckily there is a wrapper around istanbul that supports subprocesses called [nyc](https://github.com/bcoe/nyc). Install nyc using `npm install nyc --save-dev`, then run it with `nyc ava`.

## Conclusion

AVA is really worth a try, it combines the ease of use of Jasmine with the simplicity of tape. It works for both front- and back-end Javascript applications. I can start summing up all the features in this article, but that's what the [documentation](https://github.com/sindresorhus/ava) is for.

## Reference

- AVA: [github.com/sindresorhus/ava](https://github.com/sindresorhus/ava)
- Sinon.js: [sinonjs.org](http://sinonjs.org/)
- nyc: [github.com/bcoe/nyc](https://github.com/bcoe/nyc)
