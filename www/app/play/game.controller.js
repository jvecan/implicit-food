 angular
     .module('play')
     .controller('playGameCtrl', playGameCtrl);

 playGameCtrl.$inject = ['$scope', '$timeout', '$location', 'dbFactory', 'gameItems', 'roundManager'];

 function playGameCtrl($scope, $timeout, $location, dbFactory, gameItems, roundManager) {
     var vm = this;

     vm.randomFood;
     //vm.randomFood = gameItems.getRandomItem();
     //vm.differenceMilliseconds = gameItems.differenceInMilliseconds();

     $scope.gameItemsService = gameItems;

     $scope.sideTouchAreasDisabled = true;

     $scope.showOverlay = true;

     $scope.showError = false;

     $scope.showStimulus = false;

     var advanceRound = false;


     vm.startGameTouch = function() {
         $scope.showOverlay = false;

         $timeout(function() {
             vm.randomFood = gameItems.getRandomItem();
             $scope.showStimulus = true;
             $scope.sideTouchAreasDisabled = false;
         }, 800);
         //$scope.showOverlay = false;
     }




     vm.playerTouch = function(side, foodName, foodAttributeCategoryId, touchAreaAttributeId) {

         if (foodAttributeCategoryId == touchAreaAttributeId) {
             $scope.showError = false;
         } else {
             $scope.showError = true;
         }

         $scope.sideTouchAreasDisabled = true;

         //console.log("end time: " + Date.now());
         //console.log("start time: " + gameItems.getStartTime());
         //console.log("called playerTouch");

         gameItems.addRoundInfo(side, foodName, Date.now() - gameItems.getStartTime());



         gameItems.advanceRoundCounter();

         // debug
         vm.differenceMilliseconds = Date.now() - gameItems.getStartTime();
         // debug

         if ($scope.showError == false) {
             $timeout(function() {
                 vm.randomFood = gameItems.getRandomItem();
                 gameItems.setStartTime(Date.now());


                 $scope.sideTouchAreasDisabled = false;
             }, 400);

             if (gameItems.getCurrentRound() == roundManager.getMaxRounds()) {
                 $location.path('/play-results');
             }

         }



     }

 }