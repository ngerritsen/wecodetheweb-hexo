title: Better Javascript apps by optimizing state
tags:
  - ESLint
  - Javascript
id: 302
categories:
  - Uncategorized
date: 2016-03-20 16:31:50
---

**Client side applications hold a lot of state, some view related, some data related. But how do we make sure state is reliable and managable?**

<!-- more -->

## Keeping the minimum amount of state

What does this mean? Well, we're developers, so let's look at some code examples.

    This article is not written in the context of any library or framework. The view examples are JSX syntax, but it doesn't matter.

Take a look at the following example:

```js
let state = {
  brand: 'BMW',
  model: '3 series',
  displayName: 'BMW 3 series'
}
```

We can store our state like this, I can imagine this is easy to use in our views:

```html
<h2>{car.displayName}</h2>
```

But, if we would update the car's brand or model, we would also have to update the displayName. Do we want this knowledge in our application logic? What if we want to display the name in a different way?

We could easily improve our state by storing just the brand and model. We can then combine them in our view:

```js
let state = {
  brand: 'BMW',
  model: '3 series'
}
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

Better right? This way we need less logic in our state and we keep knowledge about viewing data in our view. Simple rule:

    Don't store any state you can defer from other state.

Of course there are some edge cases, but generally this rule applies.

## What about view related state?

It is not a bad thing to keep state about your view in your application state. Because in the end we're building front-end applications, with the sole purpose of letting users interact with their data through views. But we should not mix view state with data. Let's take a look at another example. In this case, the user can sort a list of car brands:

```js
let state = {
  brands: ['Mercedes', 'BMW', 'Toyota']
}
```

```js
// application logic
function sortBrands() {
  state.brands = state.brands.slice()
    .sort(a, b) => a > b)
}
```

We can now just display the brands in our view:

```html
<ul>
  {brands.map(brand => (
    <li>{brand}</li>
  )}
</ul>
<button onClick={sort}>Sort</button>
```

At first sight this seems like a nice solution. We keep the more complex searching code in our application logic. When the user clicks the sort button, the brands are sorted in the state. The view then simply shows those brands.

But should the data in our state really be changed because in a certain view we want to display the sorted car brands?What if we want to display them non-sorted elsewhere?

The flaw in our design here is that we mixed up our view state with our data. The brands did not actually change, we just want to display them sorted. Therefore we should not change the brands data in our state, we should store our view state seperately:

```js
let state = {
  brands: ['Mercedes', 'BMW', 'Toyota'],
  sort: false
}
```

```js
// application logic
function sortBrands() {
  state.sort = !state.sort
}
```

As you can see we now toggle the sorting more easily in our application. We do not touch the brands array anymore as the state of it stays the same.

```js
// view logic
let displayedBrands = brands
if (sort) {
  displayedBrands = brands.slice()
    .sort(a, b) => a > b)
}
```

```html
<ul>
  {displayedBrands.map(brand => (
    <li>{brand}</li>
  )}
</ul>
<button onClick={sort}>Sort</button>
```

Now we sort the brands in our view logic, based on if the sort flag is set to true. This gives us the flexibility to display them differently elsewhere, but still gives us the power of having the application state as a single source of truth. You can see this change also enabled us to toggle the sorting on and off without any effort.

Each part of the state should be responsible for once piece of information, not influencing other state.

I did not mention view state in my "quote" above, because it doesn't matter. If one piece of state influences the other, you should probably reconsider what you're storing.

Nested state

Sometimes state takes has some kind of hierarchy. Think of a tree shaped structures like the animals and species or sitemaps. You could store a sitemap like this:

```js
{
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
}
```

This data makes sense right? It's structured exactly as how it would be shown in the user navigation. It's pretty easy to display in our view by making a recursive link.

```html
const Link({ page, children }) => (
  <div class="link">
    - <a href="{page}">{page}</a>
    <div class="link__children">
      {children.map(c => <Link page={c.page}, children={c.children}/>}
    </div>
  </div>
)
```

But what happens when you wan't to actually make changes to this state. I sitemap will probably be pretty static, but for a management interface it might be editable. What if we want to change move the `/contact` under `/blog`? With the current state we would need to recursively search for it, and staying immutable becomes really hard. I'm not even going to show the code here, because it would become pretty complex.

What if we would store this state in a flat list?

```js
[
  { page: '/', parent: null},
  { page: '/blog', parent: '/' },
  { page: '/articles', parent: '/blog' },
  { page: '/contact', parent: '/' }
]
```

Now it's dead easy to move an item!

```js
function move(page, to) {
  return pages
    .map(p => (p.page === page) ? { ...p, parent: to } : p)
}
```

Removing, deleting and renaming are a little bit more complex, but you get the idea, a flat list is more easy to manage. The functional array methods `map` and `filter` will keep the list immutable for us. Another pro is that this is probably how the sitemap is stored on the server (especially in relational databases), so it's easy to save and retrieve the sitemap.

How do we view this list? For that we probably want to convert it to the tree we had at first. The big difference is that, that tree structure would be temporary, just for rendering, our single source of truth stays a simple list.

    Store state in a flat way, optimized for storage, not for viewing.

## Conclusion

Chose state that is easy to manage and unambiguous over state that is easy to view. Of course there are edge cases, especially when performance is critical. At that point you could let the server generate the tree for you, or apply [memoization](https://www.sitepoint.com/implementing-memoization-in-javascript/) for fast re-renders. Common sense should get you pretty far. Application state is not a dump of data, design it with care.
