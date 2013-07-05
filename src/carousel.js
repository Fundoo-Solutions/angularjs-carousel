/**
 * Heavily inspired by and liberally borrowed from Cubiq's SwipeView (http://cubiq.org/swipeview).
 * This takes SwipeView as the base, replaces CSS3 animations for jQuery animations
 * to enable IE8 and IE9 support, adds ability to have more divs instead
 * of a fixed 3, and uses jQuery data instead of HTML5 data for IE8 support.
 *
 * Lots of hooks for AngularJS directive support as well.
 */

var Carousel = function (el, options) {
  var i,
    div,
    className,
    pageIndex;

  this.wrapper = typeof el === 'string' ? document.querySelector(el) : el;
  this.options = {
    text: null,
    numberOfPages: 3,
    numberOfDivsOnEachSide: 1,
    snapThreshold: null,
    hastyPageFlip: false,
    loop: false
  };

  // User defined options
  for (i in options) {
    if(options.hasOwnProperty(i)){
      this.options[i] = options[i];
    }
  }

  this.wrapper.style.overflow = 'hidden';
  this.wrapper.style.position = 'relative';

  this.masterPages = [];
  this.numDivs = (2 * this.options.numberOfDivsOnEachSide) + 1;

  div = document.createElement('div');
  div.id = 'carousel-slider';
  div.style.cssText = 'position:relative;top:0;height:100%;width:100%;';
  this.wrapper.appendChild(div);
  this.slider = div;

  this.refreshSize();

  var nonLoopPageCounter = 1;

  for (i=-this.options.numberOfDivsOnEachSide; i < (this.options.numberOfDivsOnEachSide + 1); i++) {
    div = document.createElement('div');
    div.id = 'carousel-masterpage-' + (i+ this.options.numberOfDivsOnEachSide);
    div.style.cssText = 'position:absolute;top:0;height:100%;width:100%;left:' + i*100 + '%';
    //if (!div.dataset) {div.dataset = {};}
    if (this.options.loop === true) {
      pageIndex = i < 0 ? this.options.numberOfPages + i : i;
    } else {
      pageIndex = i < 0 ? this.options.numberOfDivsOnEachSide + nonLoopPageCounter++ : i;
    }
    $(div).data('pageIndex', pageIndex);
    $(div).data('upcomingPageIndex', pageIndex);

    if (!this.options.loop && i === -1) {div.style.visibility = 'hidden';}

    this.slider.appendChild(div);
    this.masterPages.push(div);
  }

  className = this.masterPages[this.options.numberOfDivsOnEachSide].className;
  this.masterPages[this.options.numberOfDivsOnEachSide].className = !className ? 'carousel-active' : className + ' carousel-active';
  this.currentMasterPage = this.options.numberOfDivsOnEachSide;
};

Carousel.prototype = {
  currentMasterPage: 1,
  x: 0,
  page: 0,
  pageIndex: 0,
  customEvents: [],

  onFlip: function (fn) {
    $(this.wrapper).on('carouselflip', fn);
    this.customEvents.push(['flip', fn]);
  },

  onReset: function (fn) {
    $(this.wrapper).on('carouselreset', fn);
    this.customEvents.push(['reset', fn]);
  },

  destroy: function () {
    while ( this.customEvents.length ) {
      $(this.wrapper).off('carousel' + this.customEvents[0][0]);
      this.customEvents.shift();
    }
  },

  refreshSize: function () {
    this.wrapperWidth = this.wrapper.clientWidth;
    this.pageWidth = this.wrapperWidth;
    this.maxX = -this.options.numberOfPages * this.pageWidth + this.wrapperWidth;
    this.snapThreshold = this.options.snapThreshold === null ?
      Math.round(this.pageWidth * 0.15) :
      /%/.test(this.options.snapThreshold) ?
        Math.round(this.pageWidth * this.options.snapThreshold.replace('%', '') / 100) :
        this.options.snapThreshold;
  },

  updatePageCount: function (n) {
    this.options.numberOfPages = n;
    this.maxX = -this.options.numberOfPages * this.pageWidth + this.wrapperWidth;
  },

  goToPage: function (p, reset) {
    var i, index;

    if (reset) {
      this.updatePageCount(1);
    }

    this.masterPages[this.currentMasterPage].className = this.masterPages[this.currentMasterPage].className.replace(/(^|\s)carousel-active(\s|$)/, '');
    for (i=0; i<this.numDivs; i++) {
      var className = this.masterPages[i].className;
      if (!/(^|\s)carousel-loading(\s|$)/.test(className)) {
        this.masterPages[i].className = !className ? 'carousel-loading' : className + ' carousel-loading';
      }
      this.masterPages[i].style.visibility = '';
    }

    p = p < 0 ? 0 : p > this.options.numberOfPages-1 ? this.options.numberOfPages-1 : p;
    this.page = p;
    this.pageIndex = p;
    this.__pos(-p * this.pageWidth);

    this.currentMasterPage = (this.page + 1) - Math.floor((this.page + 1) / this.numDivs) * this.numDivs;

    this.masterPages[this.currentMasterPage].className = this.masterPages[this.currentMasterPage].className + ' carousel-active';

    var divsOnEachSide = Math.floor(this.numDivs / 2);

    var sequenceOfIndicesFromMaster = [];
    for (i = 0; i < this.numDivs; i++) {
      index = this.currentMasterPage + i;
      if (index >= this.numDivs) {
        index -= this.numDivs;
      }
      if (i <= divsOnEachSide) {
        sequenceOfIndicesFromMaster.push(index);
      } else {
        sequenceOfIndicesFromMaster.unshift(index);
      }
    }

    for (i = 0; i < sequenceOfIndicesFromMaster.length; i++) {
      index = sequenceOfIndicesFromMaster[i];
      if (i < divsOnEachSide) {
        var minusPages = (divsOnEachSide - i);
        this.masterPages[index].style.left = this.page * 100 - (minusPages * 100) + '%';
        $(this.masterPages[index]).data('upcomingPageIndex', this.page - minusPages < 0 ? this.options.numberOfPages - minusPages : this.page - minusPages);
        if ($(this.masterPages[index]).data('upcomingPageIndex') !== this.page - minusPages) {
          this.masterPages[index].style.visibility = 'hidden';
        }
      } else {
        var plusPages = (i - divsOnEachSide);
        this.masterPages[index].style.left = this.page * 100 + (plusPages * 100) + '%';
        $(this.masterPages[index]).data('upcomingPageIndex', this.page >= this.options.numberOfPages - plusPages ? plusPages : this.page + plusPages);
      }
    }

    if (reset) {
      this.__reset();
    }
  },

  hasNext: function() {
    return this.page < this.options.numberOfPages - 1;
  },
  hasPrevious: function() {
    return this.page > 0;
  },
  next: function () {
    if (!this.options.loop && this.x === this.maxX) {return;}

    this.directionX = -1;
    this.x -= 1;
    this.__checkPosition();
  },

  prev: function () {
    if (!this.options.loop && this.x === 0){ return;}

    this.directionX = 1;
    this.x += 1;
    this.__checkPosition();
  },

  /**
   *
   * Pseudo private methods
   *
   */
  __pos: function (x) {
    this.x = x;
    var self = this;
    $(this.slider).animate({left: x}, 500, 'swing', function() {
      self.__flip();
    });
  },

  __checkPosition: function () {
    this.refreshSize();
    var pageFlip,
      pageFlipIndex,
      className;

    this.masterPages[this.currentMasterPage].className = this.masterPages[this.currentMasterPage].className.replace(/(^|\s)carousel-active(\s|$)/, '');
    // Flip the page
    if (this.directionX > 0) {
      this.page = -Math.ceil(this.x / this.pageWidth);
      this.currentMasterPage = (this.options.numberOfDivsOnEachSide + ((this.page) % this.numDivs)) % this.numDivs;

      this.pageIndex = this.pageIndex === 0 ? this.options.numberOfPages - 1 : this.pageIndex - 1;

      pageFlip = this.currentMasterPage - 1;
      pageFlip = pageFlip < 0 ? this.numDivs - 1 : pageFlip;
      this.masterPages[pageFlip].style.left = this.page * 100 - 100 + '%';

      pageFlipIndex = this.page - 1;
    } else {
      this.page = -Math.floor(this.x / this.pageWidth);
      this.currentMasterPage = (this.options.numberOfDivsOnEachSide + ((this.page) % this.numDivs)) % this.numDivs;

      this.pageIndex = this.pageIndex === this.options.numberOfPages - 1 ? 0 : this.pageIndex + 1;

      pageFlip = this.currentMasterPage + 1;
      pageFlip = pageFlip > (this.numDivs - 1) ? 0 : pageFlip;
      this.masterPages[pageFlip].style.display = '';
      this.masterPages[pageFlip].style.left = this.page * 100 + 100 + '%';

      pageFlipIndex = this.page + 1;
    }

    // Add active class to current page
    className = this.masterPages[this.currentMasterPage].className;
    if(!/(^|\s)carousel-active(\s|$)/.test(className)) {
      this.masterPages[this.currentMasterPage].className = !className ? 'carousel-active' : className + ' carousel-active';
    }

    this.masterPages[this.currentMasterPage].style.visibility = '';

    // Add loading class to flipped page
    className = this.masterPages[pageFlip].className;
    if(!/(^|\s)carousel-loading(\s|$)/.test(className)) {
      this.masterPages[pageFlip].className = !className ? 'carousel-loading' : className + ' carousel-loading';
    }

    pageFlipIndex = pageFlipIndex - Math.floor(pageFlipIndex / this.options.numberOfPages) * this.options.numberOfPages;
    $(this.masterPages[pageFlip]).data('upcomingPageIndex', pageFlipIndex);		// Index to be loaded in the newly flipped page

    var newX = -this.page * this.pageWidth;

    // Hide the next page if we decided to disable looping
    if (!this.options.loop) {
      this.masterPages[pageFlip].style.visibility = newX === 0 || newX === this.maxX ? 'hidden' : '';
    }

    this.__pos(newX);
    if (this.options.hastyPageFlip) {
      this.__flip();
    }

  },

  __flip: function () {
    this.__event('flip');

    for (var i=0; i<this.numDivs; i++) {
      this.masterPages[i].className = this.masterPages[i].className.replace(/(^|\s)carousel-loading(\s|$)/, '');		// Remove the loading class
      $(this.masterPages[i]).data('pageIndex', $(this.masterPages[i]).data('upcomingPageIndex'));
    }
  },

  __reset: function () {
    this.__event('reset');

    for (var i=0; i<this.numDivs; i++) {
      this.masterPages[i].className = this.masterPages[i].className.replace(/(^|\s)carousel-loading(\s|$)/, '');		// Remove the loading class
      $(this.masterPages[i]).data('pageIndex', $(this.masterPages[i]).data('upcomingPageIndex'));
    }
  },

  __event: function (type) {
    var ev = null;
    $(this.wrapper).trigger('carousel' + type);
  }
};


angular.module('fundoo.directives', []).directive('carousel', ['$compile', function($compile) {
  return {
    restrict: 'A',
    scope: {
      onPageUpcoming: '&',
      giveCarouselTo: '&'
    },
    terminal: true,
    compile: function(elem, attrs) {
      var carouselHtmlTemplate =  $compile(angular.element(elem.html()));

      elem.html('<div class="carousel-container"></div>');

      return function(scope, elem, attrs) {
        var carouselContainer = elem.find('>:first-child');
        carouselContainer.addClass(attrs.carouselClass);
        var carousel = new Carousel(carouselContainer[0], {numberOfPages: 1, loop: false});
        var tmplCbFunction = function(index) {
          return function(scope) {
            carouselHtmlTemplate(scope, function(clonedElem) {
              if (carousel.masterPages[index].firstChild) {
                carousel.masterPages[index].replaceChild(clonedElem[0], carousel.masterPages[index].firstChild);
              } else {
                carousel.masterPages[index].appendChild(clonedElem[0]);
              }
            });
          };
        };
        var initialCarouselLoad = function() {

          var nonLoopPageCounter = 1;
          for (var i = -carousel.options.numberOfDivsOnEachSide; i <= carousel.options.numberOfDivsOnEachSide; i++) {
            var pageIndex;
            if (carousel.options.loop === true) {
              pageIndex = i < 0 ? carousel.options.numberOfPages + i : i;
            } else {
              pageIndex = i < 0 ? carousel.options.numberOfDivsOnEachSide + nonLoopPageCounter++ : i;
            }
            scope.onPageUpcoming({page: pageIndex, tmplCb: tmplCbFunction(i + carousel.options.numberOfDivsOnEachSide)});
          }
        };
        scope.giveCarouselTo({carousel: carousel});

        initialCarouselLoad();

        carousel.onReset(function() {
          initialCarouselLoad();
        });

        carousel.onFlip(function () {
          var upcoming, i;

          for (i=0; i < carousel.numDivs; i++) {
            upcoming = $(carousel.masterPages[i]).data('upcomingPageIndex');
            if (upcoming !== $(carousel.masterPages[i]).data('pageIndex')) {
              scope.onPageUpcoming({page: upcoming, tmplCb: tmplCbFunction(i)});
            }
          }
        });

        // Handle resizing of the page
        function resizeCarousel() {
          carousel.refreshSize();
          carousel.goToPage(carousel.page);
        }

        // The browser resize event is sent multiple times while a user is
        // dragging the browser to resize. So we do this stuff to ensure that
        // we only do a resize once the user has finished his resizing activities.
        var rtime = new Date(1, 1, 2000, 12, 0, 0);
        var timeout = false;
        var delta = 200;
        $(window).resize(function() {
          rtime = new Date();
          if (timeout === false) {
            timeout = true;
            setTimeout(resizeend, delta);
          }
        });

        function resizeend() {
          if (new Date() - rtime < delta) {
            setTimeout(resizeend, delta);
          } else {
            timeout = false;
            resizeCarousel();
          }
        }
      };
    }
  };
}]);
