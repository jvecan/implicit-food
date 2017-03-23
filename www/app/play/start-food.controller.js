 angular
     .module('play')
     .controller('playStartFoodCtrl', playStartFoodCtrl);

 playStartFoodCtrl.$inject = ['$scope', '$timeout', 'dbFactory', 'foodGame'];

 function playStartFoodCtrl($scope, $timeout, dbFactory, foodGame) {
     var vm = this;

     vm.randomHealthyFoods = foodGame.getPositiveItems();
     vm.randomUnhealthyFoods = foodGame.getNegativeItems();

     //vm.leftAttribute = foodGame.getLeftAttribute();
     //vm.rightAttribute = foodGame.getRightAttribute();

     //console.log(foodGame.getPositiveItems());
     //console.log(vm.randomUnhealthyFoods);

 }