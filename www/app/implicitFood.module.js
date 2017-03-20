var implicitFood = angular.module("implicitFood", ['myProfile', 'play', 'ngCordova', 'ngRoute']);


implicitFood.config(function($locationProvider, $routeProvider) {
    //  $locationProvider.html5Mode(true);
    $locationProvider.hashPrefix('');
    $routeProvider
        .when("/play", {
            templateUrl: "app/play/play-start.html",
            controller: 'playStartCtrl',
            controllerAs: 'playStartController'
        })
        .when("/play-start-food", {
            controller: 'playStartFoodCtrl',
            controllerAs: 'playStartFoodController',
            templateUrl: 'app/play/play-start-food.html',
            resolve: {
                healthyFoods: gameItems => gameItems.initializeHealthyItems(),
                unhealthyFoods: gameItems => gameItems.initializeUnhealthyItems(),
            }
        })
        .when("/play-start-attribute", {
            controller: 'playStartAttributeCtrl',
            controllerAs: 'playStartAttributeController',
            templateUrl: 'app/play/play-start-attribute.html',
            resolve: {
                healthyFoods: gameItems => gameItems.initializeHealthyItems(),
                unhealthyFoods: gameItems => gameItems.initializeUnhealthyItems(),
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
        .when("/play-game", {
            controller: 'playGameCtrl',
            controllerAs: 'playGameController',
            templateUrl: 'app/play/play-game.html'
        })
        .when("/play-results", {
            controller: 'playResultsCtrl',
            controllerAs: 'playResultsController',
            templateUrl: 'app/play/play-results.html'
        })
        .when("/my-profile", {
            templateUrl: 'app/my-profile/my-profile.html'
        })
        .when("/about", {
            templateUrl: 'app/about/about.html'
        })
        .otherwise({
            templateUrl: "app/main-menu/main-menu.html"
        });



});


implicitFood.factory('randomGameType', ['$q', function($q) {
    return {
        getRandomGameType: function() {
            var deferred = $q.defer();
            var gameTypes = ["food", "attribute"];
            var randomGameType = gameTypes[Math.floor(Math.random() * gameTypes.length)];
            deferred.resolve(randomGameType);
            return deferred.promise.gameType;
        }
    }
}]);


implicitFood.controller("mainMenuController", function($scope, gameItems) {
    //gameItems.initializeHealthyItems();
    //$scope.message = message;
    //console.log(message);
});

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