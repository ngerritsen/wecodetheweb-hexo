title: Unit testing asynchronous Angular services
tags:
  - AngularJS
  - Jasmine
  - Javascript
  - Promises
id: 171
categories:
  - Uncategorized
date: 2015-09-01 13:03:57
---

**Angular is built to be testable. But when I tried to test an Angular service that had a dependency on another service ánd communicated asynchronously with it, I faced a bit of a challenge.**

<!-- more -->

When you are unit testing a piece of code, you don't want to depend on other components to function correctly. Thats why we use placeholders like mocks for those dependencies. Let's say we have an _iceCreamApp_ we want to test. It has an _iceCreamService_ which can add or remove ice cream from the application. We also have a _dataService_ that handles communication with the server via Angular's _$http_ service. The _iceCreamService_ depends on this _dataService_ and communicates with it:

```javascript
angular
  .module('iceCreamApp', [])
  .service('iceCreamService', iceCreamService)
  .service('dataService', dataService);

function iceCreamService(dataService) {
  var service = {
    retrieveIceCream: retrieveIceCream,
    getIceCream: getIceCream
  }

  var iceCream = [];

  return service;

  function getIceCream() {
    return iceCream;
  }

  function retrieveIceCream() {
    dataService
      .getAllIceCream()
      .then(function(result) {
        iceCream = result.data;
      });    
  }
}

function dataService($http) {
  var service = {
    getAllIceCream: getAllIceCream
  }

  return service;

  function getAllIceCream() {
    //Some logic
    return $http.get('api/icecream');
  }
}
```

## Angular & Angular Mocks

Let's step back for a moment. Angular has an extensive dependency injection system. In a nutshell it works as follows. There is a global _angular_ object that keeps track of all the modules and their components. If you make a module you can register it at Angular with `angular.module('module name', [/*deps*/])`. Then you can register components at that module with: `angular.module('module name').*componentType*.('component name', implementation)`.

Angular Mocks (aka ngMock) is a library that provides you with all kinds of tools to extract stuff from this system inside your unit tests. The most valuable tools are:

*   _module_, a function to load a module in your tests
*   _inject_, a function to get any component (except controllers) in your tests
*   _$controller_, a service to get controller instances in your tests
*   _$httpBackend_, a service to mock the behaviour of angular's _$http_ service in you tests

## Building the tests

So how do we go about testing our _iceCreamApp_? We could use the _$httpBackend_ service provided by Angular Mocks simulate the _dataService's_ HTTP calls. But for now we <span style="text-decoration: underline;">only</span> want to test the _iceCreamService_, not _dataService._ Using _$httpBackend_ would mean that we also depend on _dataService_ working properly, we don't want that in a unit test.

> For this article I used Jasmine as a test framework. But you can use the same solution in any javascript test framework like Mocha or QUnit.

No, we have to make a 'mocked' _dataService._ But how do we let our test use the fake _dataService_ instead of the 'real' one? If you are testing an Angular controller that depends on a service this is quite obvious, you can use the _$controller_ service of Angular Mocks to inject a fake _dataService_ into the controller like this:

```javascript
describe('ice cream controller', function() {
  var $controller;
  var mockedDataService = function() { //some fake methods };
  var iceCreamController;

  beforeEach() {
    module('iceCreamApp');

    inject(function(_$controller_){
      $controller = _$controller_;
    });

    iceCreamController = $controller('IceCreamCtrl', {
      dataService: new mockedDataService()
    });
  }

  it('does what i expect', function() {
    //test stuff..
  });
}
```

But how do you achieve the same effect when testing a service (instead of a controller) that depends on another service? The _$controller_ service has the functionality to specify fake dependencies on _controllers_, but a _service_ is directly injected via the Angular Mocks '_inject_' method, the moment a service is injected it is also initialized. So there is no way to intercept and add fake/mocked dependencies? There is, here is how to do it:

```javascript
describe('ice cream controller', function() {
  var mockedDataService = function() { //some fake methods };
  var iceCreamService;

  beforeEach() {
    module('iceCreamApp');

    module(function($provide){
      $provide.service('dataService', mockedDataService);
    });

    inject(function(_iceCreamService_){
      iceCreamService = _iceCreamService_;
    });
  }

  it('does what i expect', function() {
    //test stuff..
  });
}
```

It's kind of nasty in my opinion, but here is what happens. First we just load our application with the module function provided by Angular Mocks. But then we use the module function again to get access to the _$provider_ service.

Essentially, what the _$provider_ service does is register components at a Angular module. What we do is register the _mockedDataService_ with '_dataService_' as the component name, basically overriding the original one. When the _iceCreamService_ is then injected and it tries to get the _dataService_, it gets the mocked version.

> You can read the word 'service' a lot in this article. The confusion can be that Angular's own framework contains services, but users can also create their own services. So for instance the_ $provider, $http_ and _$controller_ service are services made by Angular, the _iceCreamService_ and _dataService_ are services made by us (the users). Most of the time Angular's own services are prefixed with '_$_'.

Pretty cool huh? So now, let's zoom in a bit on the _mockedDataService_. The _dataService_ has one method: _getAllIceCream_. The _iceCreamService_ we are testing needs that method so we need to implement it.

```javascript
var mockedDataService = function() {
  return {
    getAllIceCream: jasmine.createSpy()
  }
}
```

Hey that's something new. `jasmine.createSpy()` creates a 'fake' method that can collect data about if, how and how many times it is called. Now we can verify that the method is actually called:

```javascript
//All test setup gibberish
describe('when retrieving ice cream', function() {
  it('should call the dataService', function() {
    iceCreamService.retrieveIceCream();

    expect(mockedDataService.getAllIceCream).toHaveBeenCalled();
  });
});
```

## Getting async

What happens in this test, is call the _iceCreamService_ with the _retrieveIceCream_ method and expect the _getAllIceCream_ method to have been called. But actually, when running this test, javascript will throw an error. Because if you look closely at the _iceCreamService_ it expects the _getAllIceCream_ method to return a promise:

```javascript
function retrieveIceCream() {
    dataService
      .getAllIceCream()
      .then(function(result) {
        iceCream = result.data;
      });    
  }
```

So we have to make the _mockedDataService_ to also return a (dummy) promise.

```javascript
describe('ice cream controller', function() {
  var $controller;
  var $q;
  var getAllIceCreamDeferred;
  var mockedDataService = function() {
    return {
      getAllIceCream: jasmine.createSpy()
    }
  };
  var iceCreamController;

  beforeEach() {
    module('iceCreamApp');

    module(function($provide){
      $provide.service('dataService', mockedDataService);
    });

    inject(function(_iceCreamService_, _$q_){
      iceCreamService = _iceCreamService_;
      $q = _$q_;
    });
  }

  describe('when retrieving ice cream', function() {
    it('should call the dataService', function() {
      var dummyData = ['ice', 'cream'];
      expectGetAllIceCream();

      iceCreamService.retrieveIceCream();
      flushGetAllIceCream(dummyData);

      expect(mockedDataService.getAllIceCream).toHaveBeenCalled();
      expect(iceCreamService.
    });
  });

  function expectGetAllIceCream() {
    getAllIceCreamDeferred = $q.defer();
    mockedDataService.getAllIceCream.and.returnValue(getAllIceCreamDeferred.promise);
  }

  function flushGetAllIceCream(iceCream) {
    getAllIceCreamDeferred.resolve(iceCream);
  }
}
```

What have we done here? The mockedDataService stayed the same, it still has a jasmine spy as a method. But now we've added the expectGetAllIceCream and flushGetAllIceCream methods. expectGetAllIceCream sets up the getAllIceCream method to return a promise. The flushGetAllIceCream resolves the promise. If you want to know more about promises check out [this awesome video](https://youtu.be/33kl0iQByME) by David Smith.

In the test we first expect the promise, this sets up the _getAllIceCream_ method to return a promise. This way the code doesn't crash and we have a promise we can resolve. Then we call _retrieveIceCream_, this method will call the _getAllIceCream_ method on the (mocked) _dataService_ and retrieves the promise. _retrieveIceCream_ now adds a callback to the promise with _.then(callback)_.

> Promises are actually just objects that manage callbacks. Instead of directly passing a callback to a function you let the function return an object that you can register the callback at. This makes for more manageable as well as flexible code and prevents you from getting into [callback hell](http://callbackhell.com/)...

Then we resolve the promise with `flushGetAllIceCream(dummyData)`, now the callback that was registered is executed with the data we passed _flushGetAllIceCream_. Finally we verify if _getAllIceCream_ is called and that _retrieveIceCream_ added the new data to the _iceCreamService_ with two _expect_ calls.

As you can see you need quite some setup to test Angular services that asynchronously communicate with each other. But once you have it set up it's actually quite simple! Happy testing!

## Reference

*   AngularJS: [angularjs.org](https://angularjs.org/)
*   Angular Mocks (ngMock): [docs.angularjs.org/api/ngMock](https://docs.angularjs.org/api/ngMock)
*   $q Promises: [docs.angularjs.org/api/ng/service/$q](https://docs.angularjs.org/api/ng/service/$q)
*   Jasmine: [jasmine.github.io/2.0/introduction](http://jasmine.github.io/2.0/introduction.html)
