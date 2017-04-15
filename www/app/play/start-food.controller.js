 angular
     .module('play')
     .controller('playStartFoodCtrl', playStartFoodCtrl);

 playStartFoodCtrl.$inject = ['$scope', '$timeout', 'dbFactory', 'foodGame', 'roundManager'];

 function playStartFoodCtrl($scope, $timeout, dbFactory, foodGame, roundManager) {
     var vm = this;

     vm.healthyFoods = foodGame.getHealthyFoods();
     vm.unhealthyFoods = foodGame.getUnhealthyFoods();

     vm.positiveCategory = foodGame.getPositiveCategory();
     vm.negativeCategory = foodGame.getNegativeCategory();

     roundManager.resetRoundData();
     foodGame.setupRoundInfo(10);

 }