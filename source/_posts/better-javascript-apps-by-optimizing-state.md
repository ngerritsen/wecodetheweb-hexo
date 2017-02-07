---
title: Better Javascript apps by optimizing state
tags:
  - ESLint
  - Javascript
  - Code quality
id: 302
categories:
  - Uncategorized
date: 2016-08-26 16:31:50
---

**Client side applications hold a lot of state, some view related, some data related. But how do we make sure state is reliable and managable?**

<!-- more -->

## Keeping the minimum amount of state

What does this mean? Well, we're developers, so let's look at some code examples.

> This article is not written in the context of any library or framework. The view examples are JSX syntax, but it doesn't matter.

We're building an app that lists cars. Take a look at the following example:

```js
let state = {
  brand: 'BMW',
  model: '3 series',
  displayName: 'BMW 3 series'
};
```

We can store our state like this, you can imagine this is easy to use in our views:

```html
<h2>{car.displayName}</h2>
```

But, if we would update the car's brand or model, we would also have to update the `displayName`. Do we want this knowledge in our application logic? What if we want to display the name in a different way?

We could easily improve our state by storing just the brand and model. We can then combine them in our view:

```js
let state = {
  brand: 'BMW',
  model: '3 series'
};
```

```html
<h2>{car.model} {car.name}</h2>
```

We can now display the car in a different elsewhere without any changes to the state:

```html
<p>
  <strong>{car.model}:</strong>
  {car.name}
</p>
```

Better right? This way we keep knowledge about displaying data in our view. Simple rule:

> Don't store any state you can defer from other state.

Of course there are some edge cases, but this rule generally applies. This is not the same as normalizing data, like in a database. Find a good balance between de-normalized and normalized structures.

## What about view related state?

It's not a bad thing to keep state about your view in your application state. Because in the end we're building front-end applications, with the sole purpose of letting users interact with their data through views. But we should not mix view state with data. Let's take a look at another example. In this case, the user can sort a list of car brands:

```js
let state = {
  brands: ['Mercedes', 'BMW', 'Toyota']
};
```

```js
// application logic
function sortBrands(brands) {
  return brands.slice().sort((a, b) => a > b);
}
```

We can now display the brands in our view:

```html
<ul>
  {brands.map(brand => (
    <li>{brand}</li>
  )}
</ul>
<button onClick={sort}>Sort</button>
```

At first sight this seems like a nice solution. We keep the more complex sorting code in our application logic. When the user clicks the sort button, the brands are sorted and saved in the state. The view then simply shows those brands.

But should the brand list in our state really be changed because a certain view wants to display the sorted car brands? What if we want to display them non-sorted elsewhere?

The flaw in our design here is that we mixed up our view state with our data. We don't want the brands to change, we just want to display them in a sorted manner. Therefore we should not change the brands, we should store what we actually want:

```js
let state = {
  brands: ['Mercedes', 'BMW', 'Toyota'],
  sort: false
};
```

```js
// application logic
function sortBrands(sort) {
  return !sort;
}
```

As you can see we now toggle the sorting more easily in our application. We do not touch the brands array anymore as the state of it stays the same.

```js
// view logic
const sortBrands = (brands) =>
  brands.slice().sort((a, b) => a > b);

const displayBrands = sort ? sortBrands(brands) : brands;
```

```html
<ul>
  {displayBrands.map(brand => (
    <li>{brand}</li>
  )}
</ul>
<button onClick={sort}>Sort</button>
```

Now we sort the brands in our view logic, based on if the sort flag is set to true or false. This gives us the flexibility to display them differently elsewhere, but still gives us the power of having the application state as a single source of truth. You can see this change also enabled us to toggle the sorting on and off really easily.

> Each part of the state should be responsible for one piece and one type of information, not influencing other state.

Notice I did not mention view state in the _"quote"_ above, because it doesn't matter. If one piece of state influences the other, you should probably reconsider what you're storing.

## Nested state

Sometimes state has some kind of hierarchy. Think of a tree shaped structures like the a tree of life or a sitemap. You could for instance store a sitemap like this:

```js
let state = {
  page: '/',
  children: [
    {
      page: '/blog',
      children: [
        {
          page: '/articles',
          children: []
        }
      ]
    },
    {
      page: '/contact',
      children: []
    }
};
```

This data makes sense right? It's structured exactly as how it would be shown in a typical tree view. It's pretty easy to display by making a recursive link element.

```html
const Link = ({ page, children }) => (
  <li>
    - <a href="{page}">{page}</a>
    <ul>
      {children.map(child => <Link {...child}/>}
    </ul>
  </li>
);
```

But what happens when you want to actually make changes to this state? A sitemap will probably be pretty static, but for a management interface it might be editable. What if we want to change move the `/contact` page under `/blog`? With the current state we would need to recursively search for it, and staying immutable also becomes really hard. I'm not even going to show the code here, because it would become pretty complex.

What if we would store this state in a flat list?

```js
let state = [
  { page: '/', parent: null},
  { page: '/blog', parent: '/' },
  { page: '/articles', parent: '/blog' },
  { page: '/contact', parent: '/' }
];
```

Now it's dead easy to move an item!

```js
function move(pages, page, to) {
  return pages.map(item => {
    if (item.page !== page) {
      return item;
    }
    return { ...item, parent: to };
  });
}
```

Removing, deleting and renaming are a little bit more complex, but you get the idea: a flat list is more easy to manage. The functional array methods `map` and `filter` will keep the list immutable for us. Another pro is that this is probably how the sitemap is stored on the server (especially in relational databases), so it's easy to save and retrieve the sitemap.

How do we display this flattened tree? For that we probably want to convert it to the tree we had at first:

```js
// view logic
function pagesToTree(pages) {
  const topPage = pages.find(page => !page.parent);
  return generateTree(topPage, pages);
}

function generateTree(topPage, pages) {
  return {
    page: topPage.page,
    children: pages
      .filter(page => page.parent === topPage.page)
      .map(page => generateTree(page, pages))
  };
}
```

Admitted, it is some substantial logic added to the application. But the big difference is that, this tree structure would be temporary, just for rendering, our single source of truth stays a simple list.

> Store state in a flat way, optimized for storage, not for views.

This situation not always be desirable when performance is critical and the tree is really big. At that point you could apply [memoization](https://www.sitepoint.com/implementing-memoization-in-javascript/) for fast re-renders. But you could ask yourself: how likely is it that you want to show hundreds or thousands of tree items in one view?

## A word on immutability

I already wrote an [article about immutability](/2016/02/12/immutable-javascript-using-es6-and-beyond/). All things mentioned there also apply here. State should always be kept immutable, never mutate, always overwrite it with new state!

## Conclusion

Prefer state that is flat and unambiguous over state that is easy to display. Common sense should get you pretty far. Application state is not a dump of data, design it with care and you will see your code make more sense, be easier to refactor and have less bugs.
