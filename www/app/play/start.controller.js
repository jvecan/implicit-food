 angular
     .module('play')
     .controller('playStartCtrl', playStartCtrl);

 playStartCtrl.$inject = ['$scope', '$timeout', '$route', 'dbFactory'];

 function playStartCtrl($scope, $timeout, $route, dbFactory) {
     $scope.route = $route;

 }