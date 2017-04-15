 angular
     .module('play')
     .controller('playResultsFoodCtrl', playResultsFoodCtrl);

 playResultsFoodCtrl.$inject = ['$scope', '$timeout', '$location', 'dbFactory', 'foodGame', 'roundManager'];

 function playResultsFoodCtrl($scope, $timeout, $location, dbFactory, foodGame, roundManager) {
     var vm = this;


     roundManager.createGameContainerForRounds('food');

     vm.averageHealthyTime;
     vm.averageUnhealthyTime;
     console.log(vm.results);

 }