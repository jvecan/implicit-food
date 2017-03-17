 angular
     .module('play')
     .controller('playResultsCtrl', playResultsCtrl);

 playResultsCtrl.$inject = ['$scope', '$timeout', '$location', 'dbFactory', 'gameItems'];

 function playResultsCtrl($scope, $timeout, $location, dbFactory, gameItems) {
     var vm = this;


     vm.results = gameItems.getRoundSummary();

     vm.averageHealthyTime;
     vm.averageUnhealthyTime;



     console.log(vm.results);
     //vm.differenceMilliseconds = gameItems.differenceInMilliseconds();


 }