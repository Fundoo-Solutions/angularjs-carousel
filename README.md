# A Lazy Loading, DOM-light AngularJS Carousel

## Why?

Because everyone loves a carousel! And Twitter Bootstrap's carousel leaves a lot to be desired.

But on a serious note, here's why we ended up creating Yet Another Carousel:

* *Light on DOM* - We ran into a use case where we needed to display 1000's of items in a carousel. And make it
  load fast and be responsive. And whatever was out there wasn't cutting it.
* *Lazy Loading* - As mentioned above, loading 1000 items upfront? Not a good idea. So we needed something that was
  smart about how it loaded items,  and when it did so.
* *Simple to use* - We needed to re use it multiple times, and rewriting it from scratch every time, or needing to
  tweak it slightly every time was not fun. So we made it as reusable as possible.
* *Browser Compatibility* - While normal people use Google Chrome or Firefox, or even IE10 sometimes, we needed to
  support IE9 and **gasp** IE8. So CSS transitions were out!

We ended up creating this directly, which was heavily inspired (and liberally borrows) from
http://cubiq.org/swipeview[Cubiq's SwipeView]. Of course, we modified the guts of the beast, and replaced touch related
 events with click, and what not, but the core philosophy and the trick of using 3 divs for the carousel are all from him.

## Requirements

Not too steep. All you need to get this working are

1. AngularJS (Duh!)
2. JQuery (To support transitions in IE9, and IE8!)
3. The directive code

No extra CSS, all done with jQuery animations!

## Browser Support

Ah, and here we get to the reason behind the jQuery necessity. The Carousel works on

* Firefox
* Chrome
* Safari
* IE8+ (probably 7 as well, but untested)

## Using it

There are two parts to using the Carousel Directive, the HTML and the JS Controller code.

Let us take a look at the HTML first:

```
<div carousel
     carousel-class="photo-carousel"
     on-page-upcoming="loadPage(page, tmplCb)"
     give-carousel-to="onCarouselAvailable(carousel)">
     <div class="myCarouselPage">
       Content goes here
       {{scope.awesomeContent}}
     </div>
</div>
<a href="" ng-click="prev()">Previous</a>
<a href="" ng-click="next()">Next</a>
```

There are four major attributes of note in the HTML

1. *carousel* : This marks the DOM element as a Carousel component. Without it, the rest are useless
2. *on-page-upcoming*: This is the function on the controller that is called whenever the carousel directive
   needs to load a certain page. It is called with the page number (Zero based, so page 1 is 0)
3. *give-carousel-to*: Now this function is called when the carousel is bootstrapped, and gives access to
   the controller to the directive. This is used for writing helpful functions to decide to show and hide
   the next / previous page links, and reset the carousel.
4. *carousel-class*: If you want to specify a class to be added to each page of the carousel.

Now, let us take a look at the controller code to get this to work:

```
// The following code is in the controller

var carousel;
$scope.loadPage = function(page, tmplCb) {
  var carouselPageScope = $scope.$new();
  // Assign / load all the items you want to carouselPageScope.
  // Do work
  // Ensure that the carousel knows how many total pages there are
  carousel.updatePageCount(totalPages);
  tmplCb(carouselPageScope);
};
$scope.onCarouselAvailable(car) {
  carousel = car;
};
$scope.hasNext = function() {
  return carousel ? carousel.hasNext() : false;
};
$scope.hasPrevious = function() {
  return carousel ? carousel.hasPrevious() : false;
};
$scope.next = function() {
  if (carousel) carousel.next();
};
$scope.prev = function() {
  if (carousel) carousel.prev();
};
```

We have quite a bit happening here, but there is really two major functions, and the rest are pretty boiler-plate:

1. *loadPage*: THe load page function, as mentioned above takes two arguments. And it has two responsibilities. It needs
   to (ideally) create a new scope, and then fetch the contents for that particular page, and set it on this scope. The
   data on the scope can be set / reassigned at any point, as long as the reference to the scope is maintained. So async
   calls are not a problem!
2. *onCarouselAvailable*: THis gives the controller a handle on the carousel. Nothing more, nothing less.
3. *The pagination functions*: These are used to hide / show the next and previous links, based on the state of the carousel.

## Where can I see a demo?

Glad you asked. Go check out our GitHub page for the [AngularJS-Carousel-Demo]

## Who are we?

We are Fundoo Solutions, an awesome company based out of India who just love AngularJS. Check out our [website] or our [LinkedIn] page.

## License

The code above is open sourced, and licensed under the MIT License, which is the simplest and easiest to understand, and most open.
Basically, feel free to use this code or modify it as per your needs. The actual license is below:

### The MIT License

> Copyright (C) 2011-2013 Vojta Jína.
>
> Permission is hereby granted, free of charge, to any person
> obtaining a copy of this software and associated documentation files
> (the "Software"), to deal in the Software without restriction,
> including without limitation the rights to use, copy, modify, merge,
> publish, distribute, sublicense, and/or sell copies of the Software,
> and to permit persons to whom the Software is furnished to do so,
> subject to the following conditions:
>
> The above copyright notice and this permission notice shall be
> included in all copies or substantial portions of the Software.
>
> THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND,
> EXPRESS OR IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF
> MERCHANTABILITY, FITNESS FOR A PARTICULAR PURPOSE AND
> NONINFRINGEMENT. IN NO EVENT SHALL THE AUTHORS OR COPYRIGHT HOLDERS
> BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER LIABILITY, WHETHER IN AN
> ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM, OUT OF OR IN
> CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN THE
> SOFTWARE.



[AngularJS-Carousel-Demo]: http://fundoo-solutions.github.io/angularjs-carousel/
[website]: http://www.befundoo.com
[LinkedIn]: http://www.linkedin.com/company/fundoo-solutions

