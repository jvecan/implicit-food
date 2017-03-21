 angular
     .module('play')
     .controller('playResultsCtrl', playResultsCtrl);

 playResultsCtrl.$inject = ['$scope', '$timeout', '$location', 'dbFactory', 'gameItems', 'roundManager'];

 function playResultsCtrl($scope, $timeout, $location, dbFactory, gameItems, roundManager) {
     var vm = this;


     vm.results = gameItems.getRoundSummary();



     roundManager.createGameContainerForRounds('food');

     vm.averageHealthyTime;
     vm.averageUnhealthyTime;
     console.log(vm.results);


 }