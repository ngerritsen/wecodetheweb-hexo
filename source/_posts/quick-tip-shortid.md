title: 'Quick tip: shortId'
tags:
  - Javascript
id: 74
categories:
  - Quickies
date: 2015-05-27 07:19:06
---

Generating id's, no matter the concern, it always comes in handy. Check out this little fella!

<pre class="lang:js decode:true ">import shortid from 'shortid';
const id = shortid.generate();

<!-- more -->

console.log(id); // => AcBx2A4</pre>
Unique, url friendly id's, short and simple :-).
<pre class="lang:sh decode:true">npm install shortid</pre>
Github: [github.com/dylang/shortid](https://github.com/dylang/shortid)
