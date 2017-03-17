angular.
module('implicitFood').
config(['$locationProvider', '$routeProvider',
    function config($locationProvider, $routeProvider) {
        $locationProvider.hashPrefix('!');

        $routeProvider.
        when('/play', {
            controller: 'myPlayCtrl',
            templateUrl: 'app/play/play-start.html'
        }).
        when('/my-profile', {
            controller: 'myProfileCtrl',
            templateUrl: 'app/my-profile/my-profile.html'
        }).
        otherwise('app/main-menu/main-menu.html');
    }
]);