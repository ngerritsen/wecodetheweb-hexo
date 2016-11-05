title: Writing better, functional Javascript with map, filter and reduce
tags:
  - General
  - Javascipt
  - Code quality
id: 1
categories:
  - Uncategorized
date: 2016-05-11 20:26:29
---

__There is a clear trend going on in the Javascript world. We prefer a functional programming style in our Javascript applications. Let's see how we can leverage Javascript's three most powerful built in functional array methods.__

<!-- more -->

## Arrays, arrays everywhere

Programs are about working with data. Web applications are no different. It can be DOM elements you're traversing through, or a list of users your retrieve from the server. Most often, it comes down to lists. Big lists, small lists, nested lists, lists of objects. And in Javascript, this means arrays. But what's a good, functional way to deal with them?

## To mutate or not to mutate

We could seperate the methods that work with arrays into two categories: mutating and not mutating. You can check out this [MDN article](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Array#Methods_2) about array methods. The _Mutators_ mutate the Array and the _Accessors_ and the _Iterators_ do not, they return a __new array__ every time you call them.

In functional programming mutating data is considered _evil_. Not mutating data makes your code less error prone. You're always sure that you are working with the array or object you expect, without having to worry about it being mutated somewhere else. So let's do that!

## Map, filter, reduce

When you're writing logic dealing with arrays, these 3 are you're friends. Almost all of the array related logic can be written using these three methods. Let's do an example. I have an array of users, and I want to change the age _John_ to _23_. We can use `map` for that!

```js
const users = [
  { id: 1, name: 'John', age: 22, gender: 'm' },
  { id: 2, name: 'Ellis', age: 46, gender: 'f'},
  { id: 3, name: 'Sara', age: 30, gender: 'f'},
]

const newUsers = users.map(user =>
    user.id === 1 ?
      { ...user, age: 23 } :
      user
)
```

 So here we call `map` on the 'users' array. Map loops through all the items in the array and allows you to return a new "version" for each item. As you can see we check if we are at the user we want to change (in this case John) and then we return a new version of John where he is 23 (using ES6 object spread). If the user is __not__ the one we're interested in, we just return the old user.

An important thing to notice is that we do not change the `users` array. Instead we create a new array and store it in `newUsers`. This is the essence of _immutability_.

> In this article we I use ES6 examples. However map, filter and reduce are perfectly fine in good old ES5. They are supported by all major browsers plus IE 9 and up.

Now let's try something else, in this example, we want an array with only the the female users. We can use `filter` for that!

```js
const femaleUsers = users.filter(user => user.gender === 'f')
```

Wow, that looks easy! Filter loops through all the items in an array and let's your return `true` or `false` for each item. If it's true, keep the item, if it's false, remove it. Because we return `user.gender === 'f'`, only a female user will return `true`, thus we only keep those in the list.

So let's say I want to convert an array into a key value pair object. For some real time data storage techniques this is can be convenient. This is a case where `reduce` comes in handy. Reduce turns an array into _something else_, that can be a simple value, another array or in our case, an object.

```js
const keyedUsers = users.reduce((usersObject, user) => {
  return {
    ...usersObject,
    [user.id]: user
  }
}, {})
```

Reduce loops through an array, allowing you to construct a final value, by doing something with it for every item. It takes a callback where the first parameter is the _previously returned value_ (here called `usersObject`). The second one is the current item you're at. We add every item to the `usersObject` with it's _id_ as the _key_, returning the _new_ `usersObject` for the next one to use and so forth.

But what is the previous value for the _first_ item? Well that's why reduce takes a second parameter, the _initial value_. For this one we start with an empty object`{}`.

Now let's do a combined example. Let's say we want the total age of all females in the list. We can combine `filter` and `reduce` to do this!

```js
const totalFemaleAge = users
    .filter(user => user.gender === 'f')
    .reduce((totalAge, user) => totalAge + user.age, 0)
```

`totalFemaleAge` will now equal _76_ :). So what did we do? First we got a list of all female users by using `filter`. Then we called `reduce` on that list.

> Reduce might seem a bit confusing at first, but when you start to fiddle around with it you'll get comfortable using it.

## What about sorting and pushing?

Map, filter and reduce (and combinations of them) can provide almost all of your array needs. But what about pushing stuff into the array? And sorting? Well `push` is a mutating method and we don't want that. How do we add items to an array without mutating it? In _ES6_ we can use the neat _array spread operator_: `...`.

```js
const newUser = { id: 4, name: 'George', age: 38, gender: 'm' }
const newUsers = [...users, newUser]
```

Here we create a new array, add all the items of `users` to it, plus the `newUser`. If you're not using _ES6_, I would suggest using `concat` on a new array, to avoid mutating the old one:

```js
var newUsers = [].concat(users, newUser)
```

Sorting is a nasty one. The native array sort in Javascript is old and mutates the array instead of creating a new one. A simple solution could be to use slice:

```js
users
  .slice()
  .sort((a, b) => a.name > b.name)
```

`slice` returns a shallow copy of (a part of) an array. If you omit the parameters it will just return a copy of the _whole_ array. Then we sort _on that copy_, to make sure we do not mutate the old one. I do agree that it is a bit _hacky_ but it's simple and it works.

## What about forEach?

`forEach` loops through an array and let's you do "something" with each item, returning nothing in the end. Keep in mind that most cases where you __think__ you need `forEach`, you actually need `map`, `filter` or `reduce`, especially if you're not into the "functional" mindset yet. `forEach` __is__ valid in cases where you want to do a certain "side effect" for each item. For instance, sending a notification to each user:

```js
users.forEach(user => {
  sendNotification(user, 'Hello user!')
})
```

But be careful with side effects, they can be hard to test and debug.

## Third party libraries

There are a lot of third party libraries for Javascript that help with working with arrays. [lodash](https://lodash.com/) is a very well known library, with array helpers that are not mutating. [Immutable.js](https://facebook.github.io/immutable-js/docs/#/) is a really awesome one from Facebook that allows you to work with immutable data structures.

The downside of both is that in the case of a web application, is that they add extra weight to your application. Lodash is pretty small, but Immutable is notably big. Try to build your app without them (but ofcourse try them out) and use them when you feel the need to.

## Conclusion

Map, filter and reduce are in my opinion Javascript's most useful built in functions. Learning when to use them will force you to write better structured code. There will be clear _steps_ data is going through and you'll always work with clean references to arrays, not being used anywhere else.

## Reference

- [Array methods on MDN](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Array#Methods_2)
