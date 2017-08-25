angular
        .module('mainmenu')
        .controller('mainMenuCtrl', mainMenuCtrl);

mainMenuCtrl.$inject = ['$scope', '$location', '$route', 'dbFactory', 'player'];

function mainMenuCtrl($scope, $location, $route, dbFactory, player) {
    $scope.route = $route;
    var vm = this;

    player.setUniqueId().then(function (data) {
        
    });


}