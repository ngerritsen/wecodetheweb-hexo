title: Why you should ditch Angular controllers for directives
tags:
  - AngularJS
  - Directives
  - Javascript
id: 155
categories:
  - Uncategorized
date: 2015-07-18 08:02:52
---

**[AngularJS ](https://angularjs.org/)has been around for a while. Although [AngularJS 2.0](https://angular.io/) is going to have a completely different api, it's current api is kinda settled and mature. But it's starting to get old. 6 years is quite a lot for a front-end framework and the competition is moving fast. But still AngularJS is a solid and complete framework with a big community behind it. Controllers have become the staple component of an Angular application, but should they be?**

<!-- more -->

Since I ditched the controller + template way of building my Angular application for using only directives I found my applications to be more modular, fail safe and easy to read. I will give you some reasons why.

## Isolation

Directives are self contained components and have an isolate scope. They have their own template which corresponds to their own scope. This way you will have to explicitly decide what data you pass into them which forces you to think of a solid, modular way of building your application.

## Re-usable components

Building small directives with clear purposes makes your application easy to read and maintain. Directives encourage building re-useable components which can be moved around the whole application or even multiple applications.

## Simplicity

Only having one type of building block (a directive) makes your application simpler. Although directives are not the simplest AngularJS component, they are the most versatile and powerful.

## Being future proof

The web is moving towards a modular, component based approach to front-end applications, and so is AngularJS. AngularJS 2.0 will drop most current concepts and an Angular app will be composed of 'components'. Components are conceptually comparable to what directives are today, so it will be more easy to migrate to Angular 2.0 (or another component based frameworks).

## No controllers anymore?

You can still use controllers, but only within a directive. Controllers are very useful because they can take advantage of the AngularJS dependency injection system to communicate with services or other dependencies. For more simple directives that only need data input from their parent, you can use the link or compile functions. However, as much business logic as possible needs to be moved to services or factories.

## How about routing?

Normally you would route to a certain controller and/or template. If you only have directives you obviously can't. One way is to accept that AngularJS routing (either AngularJS or UI Router) works this way and use templates for routes with directives in them. But, the way I like to do it is the following:
<pre class="lang:js decode:true">//Inside of the app config
$stateProvider
    .state('chat', {
      url: '/chat',
      //Using the directive tag as a route template
      template: '<chat></chat>'
    })
    .state('settings', {
      url: '/settings',
      template: '<settings></settings>'
    });</pre>
<pre class="lang:xhtml decode:true"><!--Inside of index.html-->
<body ng-app="ChatApp">
  <ui-view></ui-view>
</body></pre>
In the route configuration (in this example I use UI Router, but it can also be Angular's own router), I just insert the directive tag as a template. This might be considered bad practice by some and you should keep a policy where an inline template in a route may only be one directive. This prevents you from misusing this approach.

How about nested routes? Same way:
<pre class="lang:js decode:true">//Inside of the app config
$stateProvider
    .state('settings', {
      url: '/settings',
      template: '<settings></settings >'
    })
    .state('settings.general', {
      url: '/general',
      template: '<settings-general></settings-general>'
    })
    //etc..</pre>
<pre class="lang:xhtml decode:true"><!--Inside of the settings directive template-->
<ul class="settings-menu">
    <li><a ui-sref="settings.general"></a>
    <li><a ui-sref="settings.advanced"></a>
</ul>

<ui-view></ui-view></pre>
The parent view (in this case the settings directive) contains a _ui-view_ tag, in which the sub view ( the _settings-general_ directive) will be rendered if the current active route is _settings.general_.
> Tip: prefix all your own directives to distinguish them from third parties or Angular's own directives. For instance if you would be building Facebook, prefix your directive names with '_-fb_'.
Lately I refactored a medium size AngularJS web application at work. First I wrapped all controllers and their templates into directives and set up the routing. Then I split up all big directives into smaller directives and moved most business logic services. Then I put re-occuring functionality into re-usable directives. I immediately found the application more easy to understand and work with, my colleagues had the same experience.

## Conclusion

A directive should be seen as the main building block of an Angular application. Although directives seem a bit complicated at first, once you get the hang of it, they are actually make you application simpler. Directives enable you to build a modular, component based application. Just try it out and let me know what you think!

## Reference

*   AngularJS official documentation: [docs.angularjs.org/guide](https://docs.angularjs.org/guide)
*   Inspiring article: [teropa.info/blog/how-ive-improved-my-angular-apps-by-banning-ng-controller](http://teropa.info/blog/2014/10/24/how-ive-improved-my-angular-apps-by-banning-ng-controller.html)
*   Angular.io: [angular.io](https://angular.io/)
