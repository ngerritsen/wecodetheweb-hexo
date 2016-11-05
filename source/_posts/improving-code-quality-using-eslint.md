title: Improving code quality using ESLint
tags:
  - ESLint
  - Javascript
  - Code quality
id: 180
categories:
  - Uncategorized
date: 2016-11-05 18:28:00
---

**ESLint the Javascript linter of choice today. But it can do more than just checking semicolons and quotes. In this article we'll go over how to configure ESLint to really help improve your code.**

<!-- more -->

## Getting started with ESLint

Although this article is not about the basics of [ESLint](http://eslint.org/), I will take a moment to show you how to get started. First of all install ESLint globally to get started. Make sure you have [Node.js](https://nodejs.org/en/) on your machine and run the following command from the terminal:

```bash
npm install eslint -g
```

That's it, ESLint is installed. Now go to any folder you want to work from and create a file called `.eslintrc`. Put the following configuration in there:

```json
{
  "extends": "eslint:recommended",
  "parserOptions": {
    "ecmaVersion": 2016
  }
}
```

We just use the recommended ESLint rules for now. Now create a Javascript file called `lint-me.js` in the same folder and put the following code in it:

```js
function shout(message) {
  return message.toUpperCase() + '!!!';
}
```

> The ecmaVersion setting is neccesary for ESLint to recognize ES2016 syntax (you do not need the ESLint Babel plugin anymore). I always use ES2016 or higher in my blog posts and examples to promote progression in the Javascript world.

Now run ESLint using the following command:

```bash
eslint ./lint-me.js
```

You should see one error saying: _"'shout' is defined but never used"_. ESLint's recommended rules check for most common mistakes. Of course creating a function but never using it is a waste! Try to fix it by adding: `shout('Wecodetheweb is awesome');`. Now run ESLint again, it will give no errors anymore. That's it!

## Recommended rules

When you are just starting out, start by extending the recommended rules like we just did. Why? Because you might not be able to select all the rules that you might need by yourself and you might not have developed a clear code style yet.

> If the config file is empty, no rules will be applied. Only syntax errors will make ESLint error. If you extend a set of rules, all rules you define yourself will override those from the set.

The recommended rules catch the most common errors and bad practices in your code. Things like unknown variables being used, unreachable code or duplicate keys on objects will make ESLint error. Stuff that no developer wants! All rules that have a checkmark listed [here](http://eslint.org/docs/rules/) are included in the recommended set.

## Reducing complexity

Most people start using linters because they want all their team members to use the same conventions, like _single quotes_ or _two spaces of indentation_. Although that is certainly useful and you should probably do that, we'll focus on improving actual code quality. Let's start by reducing **'cyclomatic complexity'**.

Cyclomatic complexity is measured by the amount of _branches_ a piece of code (in our case, a single function) has. Branches are the routes you can take trough the code. High complexity is bad because it makes code hard to understand and therefore it is easy for bugs slip though. Also it makes maintaining the code a pain.

Consider the following example:

```js
function isHappy(user) {
  if (user.happiness > 6) {
    return true;
  }

  return false;
}
```

This function has a cyclomatic complexity of 2, because there are two routes. You can either exit via the if statement or via the end. 2 is a nice and low complexity level! Let's configure ESLint so that it will keep our complexity low:

```json
{
  "parserOptions": {
    "ecmaVersion": 2016
  },
  "rules": {
    "complexity": [2, 5]
  }
}
```

The first value **'2'** means this rule should trigger an _error_. The default value for complexity is __20__ (!) which is way too high. Therefore we pass it the value **5**. Now when a function has a higher complexity than five, it will trigger an error.

Somewhere between 4 and 6 is a nice value for complexity. Just try it out, take a complex piece of code from your existing codebase and run it through ESLint with this complexity setting, happy refactoring! 😎

## Reducing the amount of statements

Functions should be short and concise. This makes them easy to read, maintain and reduces bugs.

```js
function isHealthy(player, config) {
  const healthPercentage = player.health * 100;
  const isAboveInjuryLimit = healthPercentage > config.injuryLimit;
  const isSick = player.diseases.length > 0;

  return !isAboveInjuryLimit && !isSick;
}
```

The above function has 4 statements (which is fine 😇). More statements means more lines of code, make sure this is true by configuring the max statements per line rule. We want to keep our functions small like this. Let's configure ESLint to check this for us:

```json
{
  "parserOptions": {
    "ecmaVersion": 2016
  },
  "rules": {
    "complexity": [2, 5],
    "max-statements": [2, 7],
    "max-statements-per-line": [2, {
      "max": 1
    }]
  }
}
```

Somewhere around 7 is a nice value for max statements, you could go even lower. Max statements per line should be one, this makes statements easy to detect.

## Reducing nesting

Remember callback hell? 🔥

```js
doSomethingAsync(result => {
  doSomethingElse(result.thing, err => {
    if (!err) {
      if (result.success) {
        if (true) {
          doLastAsyncThing(() => {
            console.log(result);
          });
        }
      }
    }
  });
});

```

Don't do this! You can extract the parts into functions or use something like Promises to prevent this. But let's make sure this does not happen anymore using two more rules:

```json
{
  "parserOptions": {
    "ecmaVersion": 2016
  },
  "rules": {
    "complexity": [2, 5],
    "max-statements": [2, 7],
    "max-statements-per-line": [2, {
      "max": 1
    }],
    "max-nested-callbacks": [2, 2],
    "max-depth": [2, {
      "max": 2
    }]
  }
}
```

This will make sure we never nest blocks and callbacks more then two levels deep, saving us from complex, hard to read and debug, tree-like code. 🎄

## Other rules

These were some important rules that can help you write better code. But this is just the tip of the iceberg. Some of my favorite rules are:

- `"eqeqeq": 2` - Makes sure you never use `==` or `!=` to check equality, because you know, it couses trouble.
- `"no-eval": 2` - We all know using eval is a generally bad idea...
- `"no-var": 2, "prefer-const": 2` - When using _ES2015_ or above (which you should if you can). This rule encourages you to never use `var`'s and use `const`'s instead of `let`'s where possible, this forces you to think twice before reassigning a variable and not use the inferior function scoped `var`.
- `"max-lines": [2, 90]` - Limits the maximum lines per file. It's not that important what the exact value is, just makes sure you don't get those 200+ line monsters.
- `"no-return-assign": 2, "no-param-reassign": 2, "array-callback-return": 2` - Can save you from those nasty 'assignments that should be comparisons' bugs inside [functional array methods](/2016/05/11/writing-better-functional-javascript-with-map-filter-and-reduce).

> For rules that you don't want or need to set the value from you can just set the error level: `"rule": 2`. Otherwise you need to pass an array with the value as the second item: `"rule": [2, 'value']`. What type of value it has differs per rule and is documented on the [ESLint website](http://eslint.org/docs/rules/).

We came up with a pretty decent configuration already! Check it out:

```json
{
  "extends": "eslint:recommended",
  "parserOptions": {
    "ecmaVersion": 2016
  },
  "rules": {
    "array-callback-return": 2,
    "complexity": [2, 5],
    "eqeqeq": 2,
    "max-statements": [2, 7],
    "max-statements-per-line": [2, {
      "max": 1
    }],
    "max-nested-callbacks": [2, 2],
    "max-depth": [2, {
      "max": 2
    }],
    "max-lines": [2, 90],
    "no-eval": 2,
    "no-return-assign": 2,
    "no-param-reassign": 2,
    "no-var": 2,
    "prefer-const": 2
  }
}
```

## Of the shelf configurations

I can imagine you don't want to check out _all_ the rules that ESLint has to offer, but just want a 'good' config. There are some pre-defined configs out there that you can use. I also created one called [eslint-config-ngerritsen](https://www.npmjs.com/package/eslint-config-ngerritsen). You can use it as follows:

```bash
npm install eslint-config-ngerritsen -g
```

```json
{
  "extends": "ngerritsen"
}
```

I got you covered selecting a pretty strict ruleset. It also has the rules for _ES2016_ and above. Ofcourse you are free to override any rule by defining your own rules afterwards or creating your own config using this one as a base. Other well know configs are [eslint-config-google](https://www.npmjs.com/package/eslint-config-google), [eslint-config-airbnb](https://www.npmjs.com/package/eslint-config-airbnb) and [eslint-config-standard](https://www.npmjs.com/package/eslint-config-standard).

## Conclusion

ESLint can be used to make your code style consistent, prevent errors but also improve code quality. One of the first things I do when creating a Javascript project is adding ESLint. There are so much rules and even plugins to choose from, the possibilities are endless. Just start with the recommended set or someone else's config and fine tune rules as you go.

_Note that just having an ESLint config in place will have no advantage of no one ever runs it. Make sure it runs automatically when you commit or push code using a [pre-commit hook](https://github.com/observing/pre-commit) or a CI tool like [Travis](https://travis-ci.org/)._

## Reference

- ESLint official website: [eslint.org](http://eslint.org/)
- eslint-config-ngerritsen: [https://www.npmjs.com/package/eslint-config-ngerritsen](https://www.npmjs.com/package/eslint-config-ngerritsen)
