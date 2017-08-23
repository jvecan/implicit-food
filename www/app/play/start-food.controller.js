 angular
     .module('play')
     .controller('playStartFoodCtrl', playStartFoodCtrl);

 playStartFoodCtrl.$inject = ['$scope', '$timeout', '$route', 'dbFactory', 'foodGame', 'roundManager'];

 function playStartFoodCtrl($scope, $timeout, $route, dbFactory, foodGame, roundManager) {
     $scope.route = $route;
     var vm = this;

     foodGame.initializeHealthyItems();
     foodGame.initializeUnhealthyItems();

     vm.healthyFoods = foodGame.getHealthyFoods();
     vm.unhealthyFoods = foodGame.getUnhealthyFoods();

     vm.positiveCategory = foodGame.getPositiveCategory();
     vm.negativeCategory = foodGame.getNegativeCategory();

     roundManager.resetRoundData();
     foodGame.setupRoundInfo(10);

 }