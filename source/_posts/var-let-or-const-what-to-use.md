title: 'Var, let or const, what to use?'
tags:
  - ECMAScript 6
  - Javascript
id: 69
categories:
  - Uncategorized
date: 2015-05-27 17:46:05
---

**The Javascript world has grown, a lot. Instead of a simple scripting language, it is now used as a full blown programming language for the web. Not to forget it's server side capabilities with NodeJS. ECMAScript 6 brings some features to make Javascript a more 'mature' language. A good example is the new _let_ and _const_ variable types.**

<!-- more -->

What is the difference and which one should you use? Well, the 'old' _var _variable declaration used to be function scoped. To show what this means, we will use a little code example:
<pre class="lang:js decode:true">if (true) {
    var a = 3;
}

function f() {
    var b = 5
}

f();

console.log(a); // => 4
console.log(b); // => undefined</pre>
In the example above we can see that _a_ is _4_, but _b_ is _'not defined'. _Variable _b_ is only known inside function _f_, not outside of it. Variable _a_ however is known outside of the _if_ statement.
> A code block is essentially a 'group' of statements, enclosed in {} curly braces. They are mostly used in if/else statements and loops. You could see a function als a kind of special code block stored in an object, it behaves differently.
Let and const are block scoped, meaning that they are only known  inside the code block they were defined in. Let's see how that works:
<pre class="lang:default decode:true">if (true) {
    let a = 3;
}

function f() {
    let b = 5
}

f();

console.log(a); // => undefined
console.log(b); // => undefined</pre>
As you can see, _let_ is undefined outside of functions and code blocks (like an if statement). Const works exactly the same, but it has an extra property, it cannot be changed, as the following example will show:
<pre class="lang:default decode:true">const a = 3;
a = 5 // => Error!</pre>
> Currently most browsers do not check for constant reassignment. Only Firefox will throw an error if you do this. Also some javascript code _linters_ detect disallowed _const_ assignments.
So what should you use? Well, accessing variables declared inside a code block from outside the code block, is a bad practice. It indicates code smell and you probably should refactor. I would advice only to use _let_ and _const. _Consider_ var _'legacy' in ES6\. Try to always use _const_ if you don't need to reassign the variable. You will see that you can use _const_ a lot more then you think. This improves code readability, because it tells the reader how the variable is going to be used. If it is a _let_, it is probably going to be re-assigned. If it is a _const_, it is going to be used as read-only.

So that's it! Rember: _var_ is function scoped, _let_ and _const_ are block scoped, where _const_ is read-only after declaration. Happy coding!
