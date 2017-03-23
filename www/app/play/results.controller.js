 angular
     .module('play')
     .controller('playResultsCtrl', playResultsCtrl);

 playResultsCtrl.$inject = ['$scope', '$timeout', '$location', 'dbFactory', 'foodGame', 'roundManager'];

 function playResultsCtrl($scope, $timeout, $location, dbFactory, foodGame, roundManager) {
     var vm = this;


     vm.results = foodGame.getRoundSummary();


     roundManager.createGameContainerForRounds('food');

     vm.averageHealthyTime;
     vm.averageUnhealthyTime;
     console.log(vm.results);

 }