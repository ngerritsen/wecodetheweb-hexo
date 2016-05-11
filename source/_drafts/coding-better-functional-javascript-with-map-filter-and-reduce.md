# Code better, functional Javascript with map, filter and reduce

__There is a clear trend going on in the Javascript world, where people prefer a functional programming style in Javascript. Let's see how we can leverage Javascript's three most powerful built in functional methods.__

## Arrays, arrays everywhere

In general programs are about working with data. Web applications are no different. It can be DOM elements you're traversing through, or a list of users your retrieve from the server. Most often, it comes down to lists. Big lists, small lists, nested lists, lists of objects. And in Javascript, this means arrays. But what's a good way to deal with them?

## To mutate or not to mutate

You could seperate the methods that work with arrays into two categories: mutating and not mutating. You can check out this [MDN article](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Array#Methods_2) about array methods. The _Mutators_ mutate the Array and the _Accessors_ and the _Iterators_ do not, they return a __new array__ every time you call them. In functional programming mutating data is considered _evil_. Most functional programming languages use immutable data types by default. The upside of not mutating data is that your code is less error prone, you are always working with the array or object you expect, without having to worry about it being mutated somewhere else. So let's do that!

## Map, filter, reduce

When you're writing logic dealing with arrays, these 3 are you're friends. 99% of the logic can be written using these three methods. Let's do an example. I have an array of users, and I want to change the age of one. We can use `map`!

```js
const users = [
  { id: 1, name: 'John', age: 22, gender: 'm' },
  { id: 2, name: 'Ellis', age: 46, gender: 'f'},
  { id: 3, name: 'Sara', age: 30, gender: 'f'},
]

const newUsers = users.map(user => {
    if (user.id === 1) {
      return { ...user, age: 23 }
    }

    return user
})
```

 So here we call map on the 'users' array. Map loops through all the items and allows you to return a new item for each one. As you can see we check if we are at the user we want to change (in this case John) and then we return a new version of John where he is 23 (using ES6 object spread). If the user is __not__ the one we're intereseted in, we just return the old user.

An important thing to notice is that we do not change the `users` array. Instead we get a new array `newUsers`, this is the core of _immutability_.

> In this article we use ES6 examples. However map, filter and reduce are perfectly fine in good old ES5. They are supported by all major browsers and IE 9 and up.

Now let's try something else, we only need the female users in this case. We can use `filter`!

```js
const femaleUsers = users.filter(user => user.gender === 'f')
```

Wow, that looks easy! Filter loops through all the items in an array and let's your return `true` or `false` for each item. It it's true, keep the item, if it's false, remove it. Because we return `user.gender === 'f'` only a female user will return `true`, thus we only keep those in the list.

Now let's do a more complicated example. Let's say we want the total age of all females in the list. We can combine `filter` and `reduce`!

```js
const totalFemaleAge = users
    .filter(user => user.gender === 'f')
    .reduce((totalAge, user) => totalAge + user.age, 0)
```

`totalFemaleAge` will now equal _76_ :). So what did we do? Well first we got a list of all female users by using `filter`. Then we called `reduce` on that list. Reduce loops through that list, but the callback function has an extra parameter (here named `totalAge`). This is the _previously returned value_. But what is the previous value the _first_ time it loops? Well that's why reduce takes a second parameter, the _initial value_. For this one we start with `0`. For every item we return the previous value + the age of the current user. When it's done with all the values we get the last return back.

The reduce might seem a bit confusing at first, but when you start to fiddle around with it you'll get comfortable using it.

## What about sorting and pushing?

Map, filter and reduce (and combinations of them) can solve 99% of your problems. But what about pushing stuff into the array? And sorting? Well push is a mutating method and we don't want that, so how to add items to an array without mutating it? In _ES6_ you can use the neat _array spread operator_: `...`.

```js
const newUser = { id: 4, name: 'Paul', age: 38, gender: 'm' }
const newUsers = [...users, newUser]
```

Here we create a new array, add all the items of `users` to it, plus the `newUser`. If you're stuck with _ES5_, I would suggest using `concat` on a new array, to avoid mutating the old one:

```js
var newUsers = [].concat(users, newUser)
```

Sorting is a nasty one. The native array sort in Javascript is old and mutates the array instead of creating a new one. A simple solution could be to use slice:

```js
users
  .slice()
  .sort((a, b) => a.name > b.name)
```

So what slice does is return a shallow copy of (a part of) the array. If you omit the parameters it will just return a copy of the whole array. Then we sort on that copy, to make sure we do not mutate the old one. I do agree that it is a bit _hacky_ but it's simple and it works.

## Third party libraries

There are a lot of third party libraries for Javascript that help with working with arrays. [lodash](https://lodash.com/) is a very well known library with array helpers that are not mutating. [Immutable.js](https://facebook.github.io/immutable-js/docs/#/) is a really awesome one from Facebook that allows you to work with immutable data structures. The downside of both is that in the case of a web application, they add extra weight to your Javascript. Lodash is pretty small, but Immutable is notably big. Try to build your app without them (but ofcourse try them out) and use them when you feel the need to.
