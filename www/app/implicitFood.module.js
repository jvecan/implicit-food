var implicitFood = angular.module("implicitFood", ['myProfile', 'play', 'ngCordova', 'ngRoute']);


implicitFood.config(function($locationProvider, $routeProvider) {
    //  $locationProvider.html5Mode(true);
    $locationProvider.hashPrefix('');
    $routeProvider
        .when("/play", {
            activetab: 'play',
            controller: 'playStartCtrl',
            controllerAs: 'playStartController',
            templateUrl: "app/play/start.html"
        })
        .when("/play-start-food", {
            activetab: 'play',
            controller: 'playStartFoodCtrl',
            controllerAs: 'playStartFoodController',
            templateUrl: 'app/play/start-food.html',
            resolve: {
                healthyFoods: foodGame => foodGame.initializeHealthyItems(),
                unhealthyFoods: foodGame => foodGame.initializeUnhealthyItems(),
            }
        })
        .when("/play-start-attribute", {
            activetab: 'play',
            controller: 'playStartAttributeCtrl',
            controllerAs: 'playStartAttributeController',
            templateUrl: 'app/play/start-attribute.html',
            resolve: {
                positiveWords: attributeGame => attributeGame.initializePositiveWords(),
                negativeWords: attributeGame => attributeGame.initializeNegativeWords(),
            }
        })
        .when('/', {
            controller: 'mainMenuController',
            templateUrl: 'app/main-menu/main-menu.html',
            resolve: {
                message: function(checkDatabase) {
                    return checkDatabase.getDatabaseStatus();
                }
            }
        })
        .when("/play-game-food", {
            activetab: 'play',
            controller: 'playGameFoodCtrl',
            controllerAs: 'playGameFoodController',
            templateUrl: 'app/play/game-food.html'
        })
        .when("/play-game-attribute", {
            activetab: 'play',
            controller: 'playGameAttributeCtrl',
            controllerAs: 'playGameAttributeController',
            templateUrl: 'app/play/game-attribute.html'
        })
        .when("/play-results-food", {
            activetab: 'play',
            controller: 'playResultsFoodCtrl',
            controllerAs: 'playResultsFoodController',
            templateUrl: 'app/play/results-food.html',
            /*resolve: {
                saveRoundData: roundManager => roundManager.saveRoundDataToDatabase('food'),
            }*/
        })
        .when("/play-results-attribute", {
            activetab: 'play',
            controller: 'playResultsAttributeCtrl',
            controllerAs: 'playResultsAttributeController',
            templateUrl: 'app/play/results-attribute.html',
            /*resolve: {
                saveRoundData: roundManager => roundManager.saveRoundDataToDatabase('word'),
            }*/
        })
        .when("/my-profile", {
            activetab: 'profile',
            controller: 'myProfileCtrl',
            controllerAs: 'myProfileController',
            templateUrl: 'app/my-profile/my-profile.html'
        })
        .when("/my-profile-unlocked-foods", {
            activetab: 'profile',
            controller: 'myProfileUnlockedCtrl',
            controllerAs: 'myProfileUnlockedController',
            templateUrl: 'app/my-profile/my-profile-unlocked-foods.html'
        })
        .when("/about", {
            activetab: 'about',
            templateUrl: 'app/about/about.html'
        })
        .when("/how-to-play", {
            activetab: 'about',
            templateUrl: 'app/about/how-to-play.html'
        })
        .when("/healthy-eating", {
            activetab: 'about',
            templateUrl: 'app/about/healthy-eating.html'
        })
        .when("/about-this-app", {
            activetab: 'about',
            templateUrl: 'app/about/about-this-app.html'
        })
        .otherwise({
            templateUrl: "app/main-menu/main-menu.html"
        });

});

implicitFood.controller("mainMenuController", function($scope) {
    //foodGame.initializeHealthyItems();
    //$scope.message = message;
    //console.log(message);
});

implicitFood.directive('navigation', ['$location', '$route', function(location, route) {

    return {
        template: '<div class="div-center-content navigation-bottom">' +
            '<div class="navigation-bottom-left"><a href="#/play" ng-class="{active: route.current.activetab === \'play\'}" class="navigation-bottom-btn">Play</a></div>' +
            '<div class="navigation-bottom-center"><a href="#/my-profile" ng-class="{active: route.current.activetab === \'profile\'}" class="navigation-bottom-btn navigation-bottom-btn-center">My Profile</a></div>' +
            '<div class="navigation-bottom-right"><a href="#/about" ng-class="{active: route.current.activetab === \'about\'}" class="navigation-bottom-btn">About</a></div>' +
            //"<div class='navigation-bottom-center'><a href='#/my-profile' ng-class='{active: route.current.activetab === 'profile'}' class='navigation-bottom-btn'>My Profile</a></div>" +
            //"<div class='navigation-bottom-right'><a href='#/about' ng-class='{active: route.current.activetab === 'about'}' class='navigation-bottom-btn'>About</a></div>" +
            '</div>'
            // "<h1>Made by a directive!</h1>" + route.current.activetab
    };

    /*return {
        link: function(scope, elem, attrs) {
            //things happen here
            location.url('/');
        }
    };
    */
}]);

implicitFood.factory('checkDatabase', ['$cordovaSQLite', '$q', function($cordovaSQLite, $q) {
    return {
        getDatabaseStatus: function() {
            var deferred = $q.defer();
            window.plugins.sqlDB.copy('foodapp.db', 0, databaseCopySuccess, databaseCopyError);

            function databaseCopySuccess() {
                console.log("Database copied successfully. ");
                deferred.resolve("Database copied successfully. ");

            }

            function databaseCopyError(e) {
                console.log("Error Code = " + JSON.stringify(e));
                deferred.resolve("Resolve message: error in copying database: " + JSON.stringify(e));
            }

            return deferred.promise;
        }
    };
}]);


implicitFood.run(function() {
    FastClick.attach(document.body);
});