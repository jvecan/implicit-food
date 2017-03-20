 angular
     .module('play')
     .controller('playStartFoodCtrl', playStartFoodCtrl);

 playStartFoodCtrl.$inject = ['$scope', '$timeout', 'dbFactory', 'gameItems'];

 function playStartFoodCtrl($scope, $timeout, dbFactory, gameItems) {
     var vm = this;

     vm.randomHealthyFoods = gameItems.getHealthyItems();
     vm.randomUnhealthyFoods = gameItems.getUnhealthyItems();

     //vm.leftAttribute = gameItems.getLeftAttribute();
     //vm.rightAttribute = gameItems.getRightAttribute();

     console.log(gameItems.getHealthyItems());
     console.log(vm.randomUnhealthyFoods);

 }