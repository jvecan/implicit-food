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

     var roundSaved = false;


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

         if (roundSaved == false) {
             if (foodAttributeCategoryId == 1) {
                 correctSide = "healthy";
             } else if (foodAttributeCategoryId == 2) {
                 correctSide = "unhealthy";
             }
             gameItems.addRoundInfo(side, correctSide, foodName, Date.now() - gameItems.getStartTime());
             roundSaved = true;
         }

         if (roundSaved == true && foodAttributeCategoryId == touchAreaAttributeId) {

             gameItems.advanceRoundCounter();

         }

         if ($scope.showError == true && roundSaved == true) {
             $scope.sideTouchAreasDisabled = false;
         }

         // debug
         vm.differenceMilliseconds = Date.now() - gameItems.getStartTime();
         // debug

         if (roundSaved == true && foodAttributeCategoryId == touchAreaAttributeId) {
             $timeout(function() {
                 vm.randomFood = gameItems.getRandomItem();
                 gameItems.setStartTime(Date.now());
                 $scope.showError = false;
                 roundSaved = false;

                 $scope.sideTouchAreasDisabled = false;
             }, 400);

             if (gameItems.getCurrentRound() == roundManager.getMaxRounds()) {
                 $location.path('/play-results');
             }

         }

     }

 }