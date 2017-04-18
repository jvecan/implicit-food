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
        .when("/about", {
            activetab: 'about',
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