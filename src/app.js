angular.module('FundooCarouselApp', ['fundoo.directives'])
  .controller('MainCtrl', ['$scope', 'FlickrApi', function($scope, flickr) {
    var carousel;

    $scope.hasPrevious = function() {
      return carousel ? carousel.hasPrevious() : false;
    };
    $scope.previous = function() {
      if (carousel) { carousel.prev(); }
    };
    $scope.hasNext = function() {
      return carousel ? carousel.hasNext() : false;
    };
    $scope.next = function() {
      if (carousel) { carousel.next(); }
    };

    var loadPhotos = function(carouselScope, page) {
      carousel.updatePageCount(6);
      carouselScope.photos = flickr.getPhotos(page);
      carouselScope.getPhotoUrl = function(photo) {
        return flickr.getPhotoUrl(photo);
      };
    };
    $scope.loadPage = function(page, tmplCb) {
      var newScope = $scope.$new();
      loadPhotos(newScope, page);
      tmplCb(newScope);
    };
    $scope.onCarouselAvailable = function(car) {
      carousel = car;
    };
  }]).factory('FlickrApi', function() {
    var pages = [
      [
        { "id": "8610594328", "secret": "e0a01f093f", "server": "8398", "farm": 9, "title": "Back from Work [Explored]", "isprimary": 0 },
        { "id": "8609770312", "secret": "ce2cc025ee", "server": "8392", "farm": 9, "title": "Chhau Masks of Charida [Explored]", "isprimary": 0 },
        { "id": "8605097271", "secret": "84b6ec7e0e", "server": "8120", "farm": 9, "title": "স্তব্ধতার গান......The Sound of Silence [Explored]", "isprimary": 0 },
        { "id": "8602385755", "secret": "b26323b04c", "server": "8532", "farm": 9, "title": "Sandakphu @ Sunset [Explored]", "isprimary": 0 },
        { "id": "8600778114", "secret": "6636515c02", "server": "8227", "farm": 9, "title": "Spring Colours [Explored]", "isprimary": 0 }
      ], [
        { "id": "8593917187", "secret": "a274587f5c", "server": "8241", "farm": 9, "title": "Celebration [Explored]", "isprimary": 0 },
        { "id": "8592654144", "secret": "3654566f78", "server": "8105", "farm": 9, "title": "Spring Garden [Explored]", "isprimary": 1 },
        { "id": "8590057990", "secret": "9948a167ea", "server": "8095", "farm": 9, "title": "Spring Solar System [Explored]", "isprimary": 0 },
        { "id": "8585649920", "secret": "43dc41c8bb", "server": "8518", "farm": 9, "title": "Cherry Blossom [Explored]", "isprimary": 0 },
        { "id": "8583184576", "secret": "52eb4819d8", "server": "8372", "farm": 9, "title": "Flambeau [Explored]", "isprimary": 0 }
      ], [
        { "id": "8580890561", "secret": "45c23c4225", "server": "8231", "farm": 9, "title": "Spring Garden [Explored]", "isprimary": 0 },
        { "id": "8428963019", "secret": "9525636b0f", "server": "8186", "farm": 9, "title": "Sandakphu [Explored]", "isprimary": 0 },
        { "id": "8426344513", "secret": "e2e6bb897f", "server": "8514", "farm": 9, "title": "Life process continues to flow... [Explored]", "isprimary": 0 },
        { "id": "8423110349", "secret": "ce1da3ab8f", "server": "8472", "farm": 9, "title": "Varanasi [Explored]", "isprimary": 0 },
        { "id": "8418889023", "secret": "a4e0cf98e2", "server": "8326", "farm": 9, "title": "To Get A Perfect Sunset.... [Explored]", "isprimary": 0 }
      ], [
        { "id": "8417868981", "secret": "7a4811fb3d", "server": "8212", "farm": 9, "title": "Murguma Lake at Sunset [Explored]", "isprimary": 0 },
        { "id": "8413140020", "secret": "c82a9a2bc5", "server": "8356", "farm": 9, "title": "The Peasant and The Photographer [Explored]", "isprimary": 0 },
        { "id": "8404264476", "secret": "9395407e0a", "server": "8466", "farm": 9, "title": "Every Day A New Beginning ! [Explored]", "isprimary": 0 },
        { "id": "8401996292", "secret": "dfc05d1414", "server": "8515", "farm": 9, "title": "Red In White [Explored]", "isprimary": 0 },
        { "id": "8398341696", "secret": "1e90a37771", "server": "8473", "farm": 9, "title": "Bengal in Winter [Explored]", "isprimary": 0 }
      ], [
        { "id": "8395243202", "secret": "faae05edf7", "server": "8227", "farm": 9, "title": "SEA.....SAND......SUNSET.....SHADOW [Explored]", "isprimary": 0 },
        { "id": "8233392271", "secret": "bcd284de10", "server": "8342", "farm": 9, "title": "Back from work.....[Explored]", "isprimary": 0 },
        { "id": "8230954133", "secret": "b34c08caab", "server": "8060", "farm": 9, "title": "নীলকন্ঠ  পাখির খোঁজে [Explored]", "isprimary": 0 },
        { "id": "8210730110", "secret": "1145031dec", "server": "8057", "farm": 9, "title": "Catch The Dream [Explored]", "isprimary": 0 },
        { "id": "8205723341", "secret": "70fd23564a", "server": "8207", "farm": 9, "title": "The Gate [Explored]", "isprimary": 0 }
      ], [
        { "id": "8204067606", "secret": "afcaae887d", "server": "8347", "farm": 9, "title": "Life in the Mist [Explored]", "isprimary": 0 },
        { "id": "8201251807", "secret": "599bcd9439", "server": "8485", "farm": 9, "title": "Chhath......Festival Portrait [Explored]", "isprimary": 0 },
        { "id": "8193202609", "secret": "e187f099c4", "server": "8203", "farm": 9, "title": "The Temple Bells [Explored]", "isprimary": 0 },
        { "id": "8031568446", "secret": "0d1c1b0b83", "server": "8310", "farm": 9, "title": "তামট । Plain Tiger [Explored]", "isprimary": 0 },
        { "id": "8035496828", "secret": "0b950f69f6", "server": "8036", "farm": 9, "title": "Explore Front Page", "isprimary": 0 }
      ]
    ];
    return {
      getPhotos: function(page) {
        // Ideally, go off and fetch the next page of data fromt he server, but we'll do it locally in the sample
        return pages[page];
      },
      getPhotoUrl: function(photo) {
        return 'http://farm' + photo.farm + '.staticflickr.com/' + photo.server + '/' + photo.id + '_' + photo.secret + '_s.jpg';
      }
    };
  });
