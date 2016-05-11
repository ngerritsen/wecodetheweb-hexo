title: Keeping your code clean with ESLint  
tags:
  - ESLint
  - Javascript
id: 302
categories:
  - Uncategorized
date: 2016-03-20 16:31:50
---

**We all treat our codebases like they're our babies (right?). To keep it clean we can use linters, ESLint is relatively new but is it the better option?**

<!-- more -->

## Why lint your code?

We all want clean, stable codebases. There are multiple ways of assuring this. Unit tests, documentation, code reviews and code analysis. The last one is where _linting_ comes in to play. Linting is basically analyzing code on micro (syntactical) level. It analyzes things like comma placement and indentation, but also best practices like using string literals instead of the String constructor function and function complexity.

You especially want linting in development teams, because it will keep the code style consistent among developers (who all have different opinions and styles). It can also potentially prevent errors, for instance duplicate keys in an object or faulty comma placement. If linting fails, the code should not be allowed to be merged into the shared codebase, that's how to keep stuff clean!

Admitted, linting does not solve all your problems. You can still write badly structured code, or use a shitty architecture. But it does solve code issues on a more detailed level and I cannot imagine a reason why you would not want that!

## What to use?

There are several linters out there for Javascript: JSLint, JSHint, JSCS, ESLint. JSLint was the first one created in 2002 by Douglas Crockford. JSHint is basically an improved, configurable version of JSLint. JSCS is a linter more focussed on styles, you would normally complement JSHint with JSCS. ESLint is the new kid around the block, which basically makes the previous options irrelevant.

Why? Because it does what JSCS and JSHint do, and more. It is designed to be extensible with plugins and supports EcmaScript 6 and JSX syntax. It's completely configurable from the ground up, but also has the option to turn all recommended rules on. So the best of both worlds. Using React? There is a plugin for that, checking certain aspects of your React components, same for AngularJS. ESLint is the clear winner if you ask me.

## How to use ESLint

So, we have a code base and we want to lint it with ESLint. Where do we start? Well the easy option is using the command line. Fist install ESLint globally:

```bash
npm install eslint -g
```

Then run it on the folder where your Javascript files reside, in this case the `/src` folder:

```bash
eslint src
```

Easy right? However, ESLint won't give any errors (unless you have syntax errors), because we did not defined any rules. So, we will first create an ESLint config file in the root of our project called `.eslintrc`. Then we we'll add our first rule to it:

```json
{
  "rules": {
    "quotes": 1
  }
}
```

This says we want a warning if the _"quotes"_ rule fails anywhere. There are three levels of severity possible:

- 0: ignore
- 1: warning
- 2: error

Usually you don't want a rule at all or have it throw an error. In some rare cases you might just want a warning, but in my experience warnings will just pile up until your log becomes one big mess. Just enforce a rule by making it an error!

The default for the "quotes" rule is to use double quotes, but we actually want singles and we want to enforce that with an error!

```json
{
  "rules": {
    "quotes": [2, "single"]
  }
}
```

Boom! We made the rule severity a 2 and passed it a second option _"single"_. Most rules are customizable by using an array with the severity first and then defining other options. For instance when we always want a space after a comma but not before:

```json
{
  "rules": {
    "quotes": [2, "single"],
    "comma-spacing": [2, {
      "before": false,
      "after": true
    }]
  }
}
```

How do you know what to specify for each rule? No worries, the documentation explains all these rules and options and detail. Another useful option is to specify the environment and use the recommended rules (you can always override those later):

```json
{
  "extends": "eslint:recommended",
  "env": {
    "browser": true
  },
  "rules": {
    "quotes": [2, "single"]
  }
}
```

## Using ES6 and beyond

Support for newer versions of EcmaScript is built in and really easy to enable. Just put the following options in your config file:

```json
{
  "parserOptions": {
    "ecmaVersion": 6,
    "ecmaFeatures": {
        "jsx": true
    },
  },
  "rules": {
    /* Your rules */
  }
}
```

This allows you to use ES6 and JSX. You could also use a custom parser. For instance babel-eslint which supports all of the latests features for future EcmaScript versions:

```bash
npm install babel-eslint -g
```

```json
{
  "parser": "babel-eslint",
  /* Other options */
}
```

Last but not least ESLint has a lot of built in rules for ES6 and up, like preferring _let_ and _const_ over _var_, or the spacing around the arrow in an ES6 arrow function.

## Integration with Webpack
