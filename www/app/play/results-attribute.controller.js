 angular
     .module('play')
     .controller('playResultsAttributeCtrl', playResultsAttributeCtrl);

 playResultsAttributeCtrl.$inject = ['$scope', '$timeout', '$location', 'dbFactory', 'attributeGame', 'roundManager'];

 function playResultsAttributeCtrl($scope, $timeout, $location, dbFactory, attributeGame, roundManager) {
     var vm = this;

     vm.results = attributeGame.getRoundSummary();

     roundManager.createGameContainerForRounds('attribute');

     vm.averageHealthyTime;
     vm.averageUnhealthyTime;
     console.log(vm.results);


 }