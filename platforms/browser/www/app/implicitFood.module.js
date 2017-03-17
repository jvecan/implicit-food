var implicitFood = angular.module("implicitFood", ['myProfile', 'play', 'ngCordova', 'ngRoute']);


implicitFood.config(function($locationProvider, $routeProvider) {
    //  $locationProvider.html5Mode(true);
    $locationProvider.hashPrefix('');
    $routeProvider
        .when("/play", {
            templateUrl: 'app/play/play-start.html',
            controller: 'playController',
            resolve: {
                initialGameItems: function(playDatabase) {
                    return playDatabase.setInitialGameItems();
                }
            }
        })
        .when('/', {
            templateUrl: 'app/main-menu/main-menu.html',
            controller: 'mainMenuController',
            resolve: {
                message: function(checkDatabase) {
                    return checkDatabase.getDatabaseStatus();
                }
            }
        })
        .when("/play-game", {
            templateUrl: 'app/play/play-game.html'
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


implicitFood.controller("mainMenuController", function($scope, message) {
    $scope.message = message;
    console.log(message);
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