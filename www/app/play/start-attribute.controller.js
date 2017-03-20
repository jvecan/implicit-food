 angular
     .module('play')
     .controller('playStartAttributeCtrl', playStartAttributeCtrl);

 playStartAttributeCtrl.$inject = ['$scope', '$timeout', 'dbFactory', 'gameItems'];

 function playStartAttributeCtrl($scope, $timeout, dbFactory, gameItems) {
     var vm = this;

     vm.randomHealthyFoods = gameItems.getHealthyItems();
     vm.randomUnhealthyFoods = gameItems.getUnhealthyItems();

     console.log(gameItems.getHealthyItems());
     console.log(vm.randomUnhealthyFoods);

 }