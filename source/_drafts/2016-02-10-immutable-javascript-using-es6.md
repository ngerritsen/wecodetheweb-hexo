title: 'Immutable Javascript using ES6 and beyond'
tags:
  - ES6
  - Javascript
  - Design patterns
id: 301
categories:
  - Uncategorized
date: 2016-02-10 22:15:00
---
__Writing immutable Javascript code is a good practice. There are some awesome libraries around like Immutable.js, to help you with this, but could we survive with just vanilla, next generation Javascript?__

<!--more-->

Short answer, yes. ES6 and ES.Next contain some functions and syntax that can achieve immutable behaviour without any hassle. In this article I will show you how to use them, fun!

> ES.Next refers to the next version(s) of EcmaScript. Yearly releases of EcmaScript are coming, containing features that are already available using a transpiler like Babel.

## The problem

First of all, why is _immutability_ important? Well, mutating data can produce code that's hard to read and error prone. For primitive values (like numbers and strings), it is pretty easy to write 'immutable' code, because primitive values cannot be mutated. They always refer to the actual value, so if the value changes, the reference changes.

Objects (and arrays) are a different story, they are passed by 'reference'. This means that if you would pass an object to another variable, and then mutate it, it will be the same object and therefore will also be mutated in the old variable. Example:

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

Can you see the problem here? When we change 'newObj', we also automatically change the old 'obj' variable. This is because they refer to the same object. Let's see how we can solve this.

## Going immutable

Instead of passing the object and mutating it, we can be better off creating a completely _new_ object.

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

_Object.assign_ is an ES6 feature that takes objects as parameters. It will _merge_ all objects you pass it into the _first_ one. You are probably wondering what that `{}` object literal is doing there. Because the first object we passed it is a new 'empty' object, we merge everything into that new object. If the first parameter would be 'person' we would still mutate person. This solution works, we kept person intact, we treated it as _immutable_!

> Why didn't we put `{ age: 30 }` as the first parameter, that is also a 'new' object, right? Well it would indeed create a new object, but it would override the age 30 with age 28 from the 'person' object. This is because the merge process operates from left to right.

However, EcmaScript actually has a special syntax, that enables us to do this even more easy, in the pipeline. It's called object spread and it is currently in Stage 2 (draft). But now worries, it is already available using the Babel transpiler. It looks as follows:

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

Again, same result. This time, even cleaner code. First, the 'spread' operator (`...`), copies all the properties from person, to the new object. Then we define a new property that overrides the old one. Note that order matters, if `age: 30` would be defined above `...person`, it would be overridden by `age: 28`. How does mutation and immutability work for arrays?

## Arrays

Let's do a little example of how you could add an item to an array:

```js
const characters = [ 'Obi-Wan', 'Vader' ]
const newCharacters = characters

newCharacters.push('Luke')
console.log(characters === newCharacters) // true
```

Same problem as with the objects. We're desperately failing in creating a new array, we just mutated the old one. Gladly ES6 contains a spread operator for array's! This feature even is already released to the final version. Here's how to use it:

```js
const characters = [ 'Obi-Wan', 'Vader' ]
const newCharacters = [ ...characters, 'Luke' ]

console.log(characters === newCharacters) // false
console.log(characters) // [ 'Obi-Wan', 'Vader' ]
console.log(newCharacters) // [ 'Obi-Wan', 'Vader', 'Luke' ]
```

Nice! We created a _really_ new array containing the old characters plus 'Luke', leaving the old array intact. 
