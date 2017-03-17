 angular
     .module('play')
     .controller('playStartCtrl', playStartCtrl);

 playStartCtrl.$inject = ['$scope', '$timeout', 'dbFactory', 'gameItems'];

 function playStartCtrl($scope, $timeout, dbFactory, gameItems) {
     var vm = this;

     vm.randomHealthyFoods = gameItems.getHealthyItems();
     vm.randomUnhealthyFoods = gameItems.getUnhealthyItems();

     console.log(gameItems.getHealthyItems());
     console.log(vm.randomUnhealthyFoods);

 }