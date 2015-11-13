title: Software principles in Front-end development
tags:
  - General
id: 130
categories:
  - Uncategorized
date: 2015-07-08 16:18:15
---

**I am mainly a front-end developer, but I've also programmed quite some C# .NET software. I learned a lot about the SOLID principles, TDD, DRY etc.. and in my opinion these principles are a bit unrecognized in the front-end world. Should they get more attention?**

<!-- more -->

This seems to be quite a big statement against the front-end world, but don't get me wrong. I'm not saying general software development principles are unknown to front-end developers, they are just more on the background. Everyone is busy trying to catch up with the latest frameworks and tools (which is completely understandable), sometimes forgetting about the core principles of software development.

## Whats up?

The web used to be HTML with CSS and maybe some Javascript magic on top of it. Front-end coding principles became very popular when [Zen Garden](http://www.csszengarden.com/) and [SMACSS](https://smacss.com/) came up with CSS guidelines, showing the power of seperation of concerns. Also the whole [Semantic Web](https://en.wikipedia.org/wiki/Semantic_Web) standards trend had a big impact. HTML and CSS are covered. But what about Javascript? The basic good and bad practices are well-known but still neglected by some front-end developers. Also a lot of front-end developers (like me) did not follow a specific software development study, so they did not learn general software principles at school. Therefore I also believe that working together with a bunch of experienced developers is very useful.

## ![Photo-Dec-07-1-45-14-PM](http://wecodetheweb.com/wp-content/uploads/2015/07/Photo-Dec-07-1-45-14-PM.jpg)

&nbsp;

## SOLID principles

How about SOLID principles? I'm not going to line them up here because there is tons of lecture on that out there. They are basically a set of principles that make you aware of and give you guidelines to make sure that your code is maintainable and extendable. These principles are widely adopted by the software development world and I think it would be very useful to raise more awareness of these principles in the front-end world.

## DRY!

Don't repeat yourself, this is a principle that applies to any language, even to CSS or (generated) HTML! Instead of doing the same thing (slightly different) twice, it might be wise to create one functionality and use it twice, different languages or environments will have different ways of achieving this. Instead of filling _div.button_ and _div.button-large_ with _background-color: green,_ it could be more DRY to create a class '_button-success_' and use that in both. It's just a simple example but you get the point, not repeating yourself makes your code easier to maintain.

[dontrepeatyourself1](http://wecodetheweb.com/wp-content/uploads/2015/07/dontrepeatyourself1.jpg)

## TDD

TDD is something that does exist for a while in the front-end world and was highly popularized by the AngularJS team. Unit tests are tests that test a single component of your code. That could be a React class or an AngularJS service for instance. You test the behavior (mostly input and output) of a component, but preferably not the inner workings. If you change the code of a component, but in the end it does the exact same thing, the same tests should still succeed. Popular testing frameworks for Javascript are [Jasmine](http://jasmine.github.io/) and [Mocha](http://unitjs.com/guide/mocha.html).

## Style

Coding style is also important. Code itself is read more then it is written, so it is very important that it is readable. You can save time and errors by spending a little extra time on code style. Some subjects you should for instance pay attention to are: naming, naming conventions, punctuation, file size, line width etc... Even more important than the styling rules them self, is to communicate them with your team and stick to them! A style rule has no value if nobody follows it.
```javascript
//Brain food, which one is better?

var w = "i'm Niels!";
var welcome = "i'm Niels!";
var message = "i'm Niels!";
var welcomeMessage = "i'm Niels!";
```

The above example is a nice one to think about. It is obvious that the first one is bad, the second one is also a bit, mehh, it does not really describe what we're dealing with. Number 3 and 4 are better. However, it depends on the context which one you would use. Are you currently in a context where it is clear that we are welcoming someone (for instance a welcome screen), then it might be enough to call the variable just '_message_'. If you would call it _welcomeMessage_ it might raise questions, are there more messages? But, if you have multiple different messages in the same context, it will actually be useful to know that this is the _welcomeMessage_. Are you bearing with me? Right now it is not important which one is better. I want to show you that style and details are important, because let's face it, you are reading a whole paragraph about one variable name!

## Literature

I would suggest reading the books [Clean code](http://www.amazon.com/Clean-Code-Handbook-Software-Craftsmanship/dp/0132350882/ref=pd_bxgy_14_img_y) and [Agile software principles, practices and patterns](http://www.amazon.com/gp/product/0131857258/ref=pd_lpo_sbs_dp_ss_2?pf_rd_p=1944687442&amp;pf_rd_s=lpo-top-stripe-1&amp;pf_rd_t=201&amp;pf_rd_i=0135974445&amp;pf_rd_m=ATVPDKIKX0DER&amp;pf_rd_r=1EMYH9XHDMWW2WCNRF3Q) from '_Uncle bob_'. They cover the subjects I described above. The code examples are written C#, not Javascript, but that does not really matter. Not all examples will apply directly to Javascript because the language is different, but most idea's are perfectly use-able in any programming language. I think these principles are very good to keep in mind when coding some SASS, React or any website or web application. Use principles found in books pragmatically, they are not meant to be followed literally.

## Framework specific style guides

Front-end frameworks are now moving towards more '_modular_' and '_vanilla_' friendly approaches, where you can use your own regular Javascript code as much as possible. But still, there are some framework specific 'patterns' you are kinda forced to follow. Frameworks tend to have their own little practices and patterns which you can vary on. For instance in React you will always have the concept of '_React classes_' (well, at least for now). React classes will have some standard methods in them, but you can vary on what you put in one class or use different naming conventions, method orders etc..

So it would be nice if you had some guidance on how to create these structures to make them consistent and thus easier to maintain. There are a lot of style guides available for any framework, also the official documentation of some frameworks contain best practices. I will list some of them below, they are however, by no means the 'ultimate' style guides. It is never a bad idea to create some guidelines with your own team.

## Conclusion

The goal of this article is not to give you a guide on front-end code style, or to teach you how to write better code. The only thing I'm trying to do is raise awareness, make you re-think what you've already been doing. Why? I've seen a lot of code that can be considered 'bad', or at least not thought about very well. It's not that I consider myself the perfect coder, I just realize that it is important and I want myself to improve on it. This is a continuous process, becoming more important while the front-end development world is becoming more and more mature.

## Reference

- Pillars of high quality code (a blog series from an ex colleague): [michielvandermeer.com/pillars-of-high...](http://michielvandermeer.com/pillars-of-high-quality-code-introduction/)
- Clean code: [amazon.com/Clean-Code-Handbook-Software-Craftsmanship/dp/0132350882](http://www.amazon.com/Clean-Code-Handbook-Software-Craftsmanship/dp/0132350882/ref=pd_bxgy_14_img_y)
- Agile software principles, practices and patterns: [amazon.com/gp/product/0131857258](http://www.amazon.com/gp/product/0131857258/ref=pd_lpo_sbs_dp_ss_2?pf_rd_p=1944687442&amp;pf_rd_s=lpo-top-stripe-1&amp;pf_rd_t=201&amp;pf_rd_i=0135974445&amp;pf_rd_m=ATVPDKIKX0DER&amp;pf_rd_r=1EMYH9XHDMWW2WCNRF3Q)
- EcmaScript 6 style guide by Elie Rotenberg: [github.com/elierotenberg/coding-styles/blob/master/es6.md](https://github.com/elierotenberg/coding-styles/blob/master/es6.md)
- AngularJS style guide by John Papa: [github.com/johnpapa/angular-styleguide](https://github.com/johnpapa/angular-styleguide)
- React style guide by David Chang: [reactjsnews.com/react-style-guide-patterns-i-like](https://reactjsnews.com/react-style-guide-patterns-i-like/)
