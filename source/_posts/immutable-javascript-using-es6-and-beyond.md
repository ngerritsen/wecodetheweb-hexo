title: 'Immutable Javascript using ES6 and beyond'
tags:
  - ES6
  - ES.Next
  - Javascript
  - Design patterns
id: 301
categories:
  - Uncategorized
date: 2016-02-12 22:15:00
---
__Writing immutable Javascript code is a good practice. There are some awesome libraries around like [Immutable.js](https://facebook.github.io/immutable-js/) to help you with this. But could we survive with just vanilla, next generation Javascript?__

<!--more-->

Short answer, yes. ES6 and ES.Next contain some awesome features that can help you achieve immutable behaviour without any hassle. In this article I will show you how to use them, it's fun!

> ES.Next refers to the next version(s) of EcmaScript. [Yearly releases](http://www.2ality.com/2015/11/tc39-process.html) of EcmaScript are coming, containing features that are already available using a transpiler like [Babel](http://babeljs.io/).

## The problem

First of all, why is _immutability_ important? Well, mutating data can produce code that's hard to read and error prone. For primitive values (like numbers and strings), it is pretty easy to write 'immutable' code, because primitive values cannot be mutated themselves. Variables containing primitive types always point to the actual value. If you pass it to another variable, the other variable get's a fresh copy of that value.

Objects (and arrays) are a different story, they are passed by _reference_. This means that if you would pass an object to another variable, they will both refer to the same object. If you would then mutate the object from either variable, they will both reflect the changes. Example:

```js
const person = {
  name: 'John',
  age: 28
}

const newPerson = person

newPerson.age = 30
console.log(newPerson === person) // true
console.log(person) // { name: 'John', age: 30 }
```

Can you see the problem here? When we change `newObj`, we also automatically change the old `obj` variable. This is because they refer to the same object. In most cases this is unwanted behaviour and _bad_ practice. Let's see how we can solve this.

![Immutablity is bad for you](immutability.png)

## Going immutable

Instead of passing the object and mutating it, we will be better off creating a __completely new__ object:

```js
const person = {
  name: 'John',
  age: 28
}

const newPerson = Object.assign({}, person, {
  age: 30
})

console.log(newPerson === person) // false
console.log(person) // { name: 'John', age: 28 }
console.log(newPerson) // { name: 'John', age: 30 }
```

`Object.assign` is an ES6 feature that takes objects as parameters. It will _merge_ all objects you pass it into the _first_ one. You are probably wondering why the first parameter is an empty object `{}`. If the first parameter would be 'person' we would still mutate person. If it would be `{ age: 30 }`, we'd overwrite _30_ with _28_ again because that would be coming after. This solution works, we kept person intact, we treated it as _immutable_!

> Want to try out these code examples without too much hassle? Head over to [JSBin](http://jsbin.com/?js,console). In the left panel click _Javascript_ and change it to _ES6/Babel_. You can now code in ES6 :).

However, EcmaScript actually has a _special syntax_ that enables us to do this even more easily. It's called _object spread_ and it is currently in _Stage 2_ (draft). But now worries, it's already available using the [Babel](http://babeljs.io/docs/plugins/preset-stage-2/) transpiler. It looks as follows:

```js
const person = {
  name: 'John',
  age: 28
}

const newPerson = {
  ...person,
  age: 30
}

console.log(newPerson === person) // false
console.log(newPerson) // { name: 'John', age: 30 }
```

Again, same result. This time, even cleaner code. First, the 'spread' operator (`...`), copies all the properties from person to the new object. Then we define a new 'age' property that overrides the old one. Note that order matters, if `age: 30` would be defined above `...person`, it would be overridden by `age: 28`.

How about removing an item? No we won't use delete, this would again, mutate the object. This actually is a bit harder, you can do it as follows:

```js
const person = {
  name: 'John',
  password: '123',
  age: 28
}

const newPerson = Object.keys(person).reduce((obj, key) => {
  if (key !== property) {
    return { ...obj, [key]: person[key] }
  }

  return obj
}, {})
```

As you can see we pretty much have to code the whole operation ourselves. You could put this functionality in a central place as a generic utility. But how does mutation and immutability work for arrays?

## Arrays

Let's do a little example of how you could add an item to an array in a mutating way:

```js
const characters = [ 'Obi-Wan', 'Vader' ]
const newCharacters = characters

newCharacters.push('Luke')

console.log(characters === newCharacters) // true :-(
```

The same problem as with objects. We're desperately failing in creating a new array, we just mutated the old one. Gladly ES6 contains a _spread operator_ for array's! This feature is even already in the final version of ES6. Here's how to use it:

```js
const characters = [ 'Obi-Wan', 'Vader' ]
const newCharacters = [ ...characters, 'Luke' ]

console.log(characters === newCharacters) // false
console.log(characters) // [ 'Obi-Wan', 'Vader' ]
console.log(newCharacters) // [ 'Obi-Wan', 'Vader', 'Luke' ]
```

Nice, that was easy! We created a _new_ array containing the old characters _plus_ 'Luke', leaving the old array intact.

Let's see how to do some other operations on arrays, without mutating the original one:

```js
const characters = [ 'Obi-Wan', 'Vader', 'Luke' ]

// Removing Vader
const withoutVader = characters.filter(char => char !== 'Vader')
console.log(withoutVader) // [ 'Obi-Wan', 'Luke' ]

// Changing Vader to Anakin
const backInTime = characters.map(char => char === 'Vader' ? 'Anakin' : char)
console.log(backInTime) // [ 'Obi-Wan', 'Anakin', 'Luke' ]

// All characters uppercase
const shoutOut = characters.map(char => char.toUpperCase())
console.log(shoutOut) // [ 'OBI-WAN', 'VADER', 'LUKE' ]

// Merging two character sets
const otherCharacters = [ 'Yoda', 'Finn' ]
const moreCharacters = [ ...characters, ...otherCharacters ]
console.log(moreCharacters) // [ 'Obi-Wan', 'Vader', 'Luke', 'Yoda', 'Finn' ]
```

See how nice these 'functional' operators are? The ES6 _arrow function_ syntax makes them even more neat. They return a new array every time you run them, one exception is the _ancient_ sort method:

```js
const characters = [ 'Obi-Wan', 'Vader', 'Luke' ]

const sortedCharacters = characters.sort()

console.log(sortedCharacters === characters) // true :-(
console.log(characters) // [ 'Luke', 'Obi-Wan', 'Vader' ]
```

Yeah, I know. In my opinion _push_ and _sort_ should have the same behaviour as _map, filter_ and _concat_, return new arrays. But they don't and changing that now would probably break the internet. If you need to use sort, you can use _slice_ to fix this:

```js
const characters = [ 'Obi-Wan', 'Vader', 'Luke' ]

const sortedCharacters = characters.slice().sort()

console.log(sortedCharacters === characters) // false :-D
console.log(sortedCharacters) // [ 'Luke', 'Obi-Wan', 'Vader' ]
console.log(characters) // [ 'Obi-Wan', 'Vader', 'Luke' ]
```

The `slice()` feels a little 'hacky' but it works.

As you can see, you can achieve immutability pretty easy using just plain, _modern_ Javascript! In the end it's all about common sense and understanding _what_ your code actually does. If you don't program with care, Javascript can be unpredictable.

## A word on performance

What about performance, isn't creating new objects time and memory consuming? Well, true, it comes with a bit more overhead. But that disadvantage is very small compared to the advantages.

One of the more complicated operations in Javascript is tracking if an object changed. Solutions like `Object.observe(object, callback)` are pretty heavy. However, if you keep your state _immutable_ you can just rely on `oldObject === newObject` to check if state changed or not, this is way less CPU demanding.

Second big advantage is code quality. Making sure your state is immutable forces you to think better of your application structure. It encourages programming in a more functional way, makes your code easy to follow and reduces the possibility of nasty bugs. Win, win, right?

## Reference
- ES6 compatibility table: [kangax.github.io/compat-table/es6](http://kangax.github.io/compat-table/esnext/)
- ES.Next compatibility table: [kangax.github.io/compat-table/esnext](http://kangax.github.io/compat-table/esnext/)
