title: Meta programming with ES6 Proxies
tags:
  - ECMAScript 6
  - Javascript
id: 173
categories:
  - Uncategorized
date: 2015-08-16 20:19:02
---

**Proxies are one of the lesser known functionalities in EcmaScript 6\. This is for a reason, they will probably not become your staple exercise in coding Javascript applications. But they are quite cool!**

<!-- more -->

Proxies are a lower level functionality of ES6\. By that I mean, they alter the default behaviour of Javascript, also known as metaprogramming. However there is no seperate metalanguage here, due to the nature of Javascript we can modify the default behaviour of Javascript with Javascript.

So how does this work? Say you have an object. Just a plain old Javascript object that holds an address. And you want, for whatever reason, get the values of that object in uppercase, although they are stored in normal casing. This is how you could archieve that with a proxy:
<pre class="lang:default decode:true">let address = {
  street: 'Elite Street',
  postalCode: '1337 xD'
}

address = new Proxy(address, {
  get(target, property) {
     return target[property].toUpperCase();
  }
});

console.log(address.street); // => 'ELITE STREET'
console.log(address['postalCode']); // => '1337 XD'</pre>
_First we create a plain old Javascript object with the address properties in it. Then we create a new Proxy, its constructor takes two parameters, a target and a handler. The target will be the object you want to modify the behaviour of. The handler will be an object with the methods you want to intercept on it. The 'get' method is a native operation on a Javascript object, called with the dot (obj.prop) or bracket (obj['prop']) notation. It receives the target and the property._
> Currently only Firefox 4 supports Proxies (with ES5 syntax). If you want to test proxies you could use Firefox or use the [harmony-reflect polyfill](https://github.com/tvcutsem/harmony-reflect).
That's how easy it is! The Proxy is essentially just a wrapper that intercepts (or 'traps') native operations and executes the modified behaviour on it.

## Getting rich

Let's do another example, we have a bank account but because we are rich mofo's we always want to have twice as much.
<pre class="lang:default decode:true">let bankAccount = {
  money: 0
}

bankAccount = new Proxy(bankAccount, {
  set(target, property, value) {
    target[property] = value * 2;
  }
});

bankAccount.money = 1000000;

console.log(bankAccount.money); // => 2000000</pre>
_In this example we overwrite the set function, which overrides the default assignment. If we now deposit 100000 on the bank account, it will instead put 200000 on there._

## Conclusion

Proxies are cool, but should not be misused as a hack to accomplish certain tasks. You can do way more with them then just changing getting and setting behaviour. They should not be your staple tool in building apps. But they could for instance be used to build certain functionalities into a library or framework. Or to make special kind of objects to be used throughout your application. Happy coding!

## Reference

*   Harmony-reflect polyfill: [github.com/tvcutsem/harmony-reflect](https://github.com/tvcutsem/harmony-reflect)
*   Proxy spec: [developer.mozilla.org/en/docs/.../Proxy](https://developer.mozilla.org/en/docs/Web/JavaScript/Reference/Global_Objects/Proxy)
