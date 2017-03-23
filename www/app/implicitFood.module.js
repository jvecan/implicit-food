var implicitFood = angular.module("implicitFood", ['myProfile', 'play', 'ngCordova', 'ngRoute']);


implicitFood.config(function($locationProvider, $routeProvider) {
    //  $locationProvider.html5Mode(true);
    $locationProvider.hashPrefix('');
    $routeProvider
        .when("/play", {
            controller: 'playStartCtrl',
            controllerAs: 'playStartController',
            templateUrl: "app/play/start.html"
        })
        .when("/play-start-food", {
            controller: 'playStartFoodCtrl',
            controllerAs: 'playStartFoodController',
            templateUrl: 'app/play/start-food.html',
            resolve: {
                healthyFoods: foodGame => foodGame.initializeHealthyItems(),
                unhealthyFoods: foodGame => foodGame.initializeUnhealthyItems(),
            }
        })
        .when("/play-start-attribute", {
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
        .when("/play-game", {
            controller: 'playGameCtrl',
            controllerAs: 'playGameController',
            templateUrl: 'app/play/game.html'
        })
        .when("/play-game-attribute", {
            controller: 'playGameAttributeCtrl',
            controllerAs: 'playGameAttributeController',
            templateUrl: 'app/play/game-attribute.html'
        })
        .when("/play-results", {
            controller: 'playResultsCtrl',
            controllerAs: 'playResultsController',
            templateUrl: 'app/play/results.html'
        })
        .when("/play-results-attribute", {
            controller: 'playResultsAttributeCtrl',
            controllerAs: 'playResultsAttributeController',
            templateUrl: 'app/play/results-attribute.html'
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


implicitFood.controller("mainMenuController", function($scope) {
    //foodGame.initializeHealthyItems();
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