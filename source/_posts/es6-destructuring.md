---
title: ES6 Destructuring
tags:
  - ES6
  - Javascript
id: 52
categories:
  - Uncategorized
date: 2015-05-25 19:00:03
---

**Destructuring must be my favorite feature of ECMAScript 6\. I don't exactly know why, I guess I just like the simplicity. It makes your code more clean and declarative.**

<!-- more -->

What destructuring does is it can extract seperate variables from an object or array. I guess you would like to see some code by now, let's say we have the following object:

```javascript
const person = {
  name: 'John',
  age: 25,
  interests: ['programming', 'music', 'fitness']
}
```

We can now 'destructure' it like this:

```javascript
const {name, age, interests} = person;

console.log(name); // => 'John';
console.log(age); // => 25;
console.log(interests); // => ['programming', 'music', 'fitness'];
```

You can also specify new variable names:

```javascript
const {name: personName, age: yearsOld} = person;

console.log(personName); // => 'John';
console.log(yearsOld); // => 25;
```

Arrays work the same, except the output is controlled by the order of the array, instead of the key names:

```javascript
const [interest1, interest2] = person.interests;

console.log(interest1); // => 'programming'
console.log(interest2); // => 'music'
```

The array version is only useful if you know the order of the array, it can for instance be useful if you have a function that returns something like an array of coordinates:

```javascript
function getPosition() {
  const posX = 5;
  const posY = 3;
  return [posX, posY];
}

const [x, y] = getPosition();

console.log(x); // => 5
console.log(y); // => 3
```

There are two big advantages of using destructuring. The first one is that your code more readable. If you destructure an object at the top of a function or code block, it is clear to the reader what variables you are going to use.

The second plus is performance. Destructuring encourages programmers to put object properties in local variables before using them, which can improve application performance. Especially if you are accessing those variables multiple times, maybe in a loop, it is more efficiënt if the variables are locally defined.

> You see me using _const_ instead of _var_ a lot in this article. This is a new ECMAScript 6 feature which I will cover in a later article.

Personally I use destructuring a lot when accessing the props or state object in React. A render function without destructuring:

```javascript
render() {
  return (
    <div>
      <h1>{this.props.title}</h1>
      <img src={this.props.image.url} alt={this.props.image.title}/>
      <p>{this.props.content}</p>
    </div>
  );
}
```

with destructuring:

```javascript
render() {
  const {title, content, image} = this.props;
  return (
    <div>
      <h1>{title}</h1>
      <img src={image.url} alt={image.title}/>
      <p>{content}</p>
    </div>
  );
}
```

At first sight the second method does not seem more efficient. But it declares what props are going to be used, the code is more readable and in larger render functions the advantages will become more evident. If you are coding ES6 in your project, try destructuring out!

## References
- Try out ES6: [babeljs.io/repl/](https://babeljs.io/repl/)
- Learn ES6: [babeljs.io/docs/learn-es6](https://babeljs.io/docs/learn-es6/#destructuring)
