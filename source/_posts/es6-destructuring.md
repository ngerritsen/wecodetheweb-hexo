title: ES6 Destructuring
tags:
  - ECMAScript 6
  - Javascript
id: 52
categories:
  - Uncategorized
date: 2015-05-25 19:00:03
---

**Destructuring must be my favorite feature of ECMAScript 6\. I don't exactly know why, I guess I just like the simplicity. It makes your code more clean and declarative.**

<!-- more -->

What destructuring does is it can extract seperate variables from an object or array. I guess you would like to see some code by now, let's say we have the following object:
<pre class="lang:js decode:true">const person = {
    name: 'John',
    age: 25,
    interests: ['programming', 'music', 'fitness']
}</pre>
We can now 'destructure' it like this:
<pre class="lang:js decode:true ">const {name, age, interests} = person;

console.log(name); // =&gt; 'John';
console.log(age); // =&gt; 25;
console.log(interests); // =&gt; ['programming', 'music', 'fitness'];</pre>
<span style="line-height: 1.428571429; -webkit-tap-highlight-color: transparent; -webkit-text-size-adjust: 100%;">You can also specify new variable names:</span>
<pre class="lang:default decode:true">const {name: personName, age: yearsOld} = person;

console.log(personName); // =&gt; 'John';
console.log(yearsOld); // =&gt; 25;</pre>
Arrays work the same, except the output is controlled by the order of the array, instead of the key names:
<pre class="lang:default decode:true">const [interest1, interest2] = person.interests;

console.log(interest1); // =&gt; 'programming'
console.log(interest2); // =&gt; 'music'</pre>
The array version is only useful if you know the order of the array, it can for instance be useful if you have a function that returns something like an array of coordinates:
<pre class="lang:default decode:true ">function getPosition() {
    const posX = 5;
    const posY = 3;
    return [posX, posY];
}

const [x, y] = getPosition();

console.log(x); // =&gt; 5
console.log(y); // =&gt; 3</pre>
There are two big advantages of using destructuring. The first one is that your code more readable. If you destructure an object at the top of a function or code block, it is clear to the reader what variables you are going to use.

The second plus is performance. Destructuring encourages programmers to put object properties in local variables before using them, which can improve application performance. Especially if you are accessing those variables multiple times, maybe in a loop, it is more efficiënt if the variables are locally defined.
> You see me using _const_ instead of _var_ a lot in this article. This is a new ECMAScript 6 feature which I will cover in a later article.
Personally I use destructuring a lot when accessing the props or state object in React. A render function without destructuring:
<pre class="lang:default decode:true ">render() {
    return (
        &lt;div&gt;
            &lt;h1&gt;{this.props.title}&lt;/h1&gt;
            &lt;img src={this.props.image.url} alt={this.props.image.title}/&gt;
            &lt;p&gt;{this.props.content}&lt;/p&gt;
        &lt;/div&gt;
    );
}</pre>
with destructuring:
<pre class="lang:default decode:true">render() {
    const {title, content, image} = this.props;
    return (
        &lt;div&gt;
            &lt;h1&gt;{title}&lt;/h1&gt;
            &lt;img src={image.url} alt={image.title}/&gt;
            &lt;p&gt;{content}&lt;/p&gt;
        &lt;/div&gt;
    );
}</pre>
At first sight the second method does not seem more efficient. But it declares what props are going to be used, the code is more readable and in larger render functions the advantages will become more evident. If you are coding ES6 in your project, try destructuring out!

### References

Try out ES6: [babeljs.io/repl/](https://babeljs.io/repl/)

Learn ES6: [babeljs.io/docs/learn-es6](https://babeljs.io/docs/learn-es6/#destructuring)

&nbsp;
