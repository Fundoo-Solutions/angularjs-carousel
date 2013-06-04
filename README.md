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


