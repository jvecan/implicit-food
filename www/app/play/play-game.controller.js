 angular
     .module('play')
     .controller('playGameCtrl', playGameCtrl);

 playGameCtrl.$inject = ['$scope', '$timeout', '$location', 'dbFactory', 'gameItems'];

 function playGameCtrl($scope, $timeout, $location, dbFactory, gameItems) {
     var vm = this;


     // gameItems.setStartTime(Date.now());
     vm.randomFood = gameItems.getRandomItem();



     vm.differenceMilliseconds = gameItems.differenceInMilliseconds();

     $scope.gameItemsService = gameItems;

     vm.playerTouch = function(side, foodName) {

         //gameItems.setEndTime(Date.now());

         //console.log()

         console.log("end time: " + Date.now());
         console.log("start time: " + gameItems.getStartTime());

         gameItems.addRoundInfo(side, foodName, Date.now() - gameItems.getStartTime());

         vm.differenceMilliseconds = Date.now() - gameItems.getStartTime();

         gameItems.advanceRoundCounter();

         vm.randomFood = gameItems.getRandomItem();
         gameItems.setStartTime(Date.now());



         if (gameItems.getCurrentRound() == 10) {
             $location.path('/play-results');
         }

         /*

         gameItems.setEndTime(Date.now());
          */






     }

 }