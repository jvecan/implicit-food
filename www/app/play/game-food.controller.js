 angular
     .module('play')
     .controller('playGameFoodCtrl', playGameFoodCtrl);

 playGameFoodCtrl.$inject = ['$scope', '$timeout', '$location', 'dbFactory', 'foodGame', 'roundManager'];

 function playGameFoodCtrl($scope, $timeout, $location, dbFactory, foodGame, roundManager) {
     var vm = this;
     vm.displayedItem;

     vm.leftTouchItem = foodGame.getLeftTouchAreaData();
     vm.rightTouchItem = foodGame.getRightTouchAreaData();

     if (foodGame.getCurrentRound() == roundManager.getMaxRounds()) {
         $location.path('/play-start-food');
     }

     $scope.sideTouchAreasDisabled = true;
     $scope.showOverlay = true;
     $scope.showError = false;
     $scope.showStimulus = false;

     var roundSaved = false;


     vm.startGameTouch = function() {
         $scope.showOverlay = false;

         $timeout(function() {
             vm.displayedItem = foodGame.getNextDisplayItem();
             $scope.showStimulus = true;
             $scope.sideTouchAreasDisabled = false;
         }, 1000);
     }


     // leftAttributeId, rightAttributeId, foodId, userResponseCategoryId, reactionTime, points

     vm.playerTouch = function(leftAttributeId, rightAttributeId, foodId, userResponseCategoryId, displayItemCategoryId) {

         if (displayItemCategoryId == userResponseCategoryId) {
             $scope.showError = false;
         } else {
             $scope.showError = true;
         }
         $scope.sideTouchAreasDisabled = true;

         //console.log("end time: " + Date.now());
         //console.log("start time: " + foodGame.getStartTime());
         //console.log("called playerTouch");

         if (roundSaved == false) {
             if (displayItemCategoryId == 1) {
                 correctSide = "good";
             } else if (displayItemCategoryId == 2) {
                 correctSide = "bad";
             }
             $scope.showStimulus = false;
             foodGame.addRoundInfo(leftAttributeId, rightAttributeId, foodId, userResponseCategoryId, Date.now() - foodGame.getStartTime(), 0);
             roundSaved = true;
         }

         if (roundSaved == true && displayItemCategoryId == userResponseCategoryId) {
             $scope.showStimulus = false;
             foodGame.advanceRoundCounter();
             if (foodGame.getCurrentRound() == roundManager.getMaxRounds()) {
                 $location.path('/play-results-food');
             }

         }

         if ($scope.showError == true && roundSaved == true) {
             $scope.showStimulus = true;
             $scope.sideTouchAreasDisabled = false;
         }

         // debug
         vm.differenceMilliseconds = Date.now() - foodGame.getStartTime();
         // debug

         if (roundSaved == true && displayItemCategoryId == userResponseCategoryId) {
             $timeout(function() {
                 vm.displayedItem = foodGame.getNextDisplayItem();
                 foodGame.setStartTime(Date.now());
                 $scope.showError = false;
                 roundSaved = false;
                 $scope.showStimulus = true;
                 $scope.sideTouchAreasDisabled = false;
             }, 200);

         }

     }

 }