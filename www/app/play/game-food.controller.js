 angular
     .module('play')
     .controller('playGameFoodCtrl', playGameFoodCtrl);

 playGameFoodCtrl.$inject = ['$scope', '$timeout', '$location', 'dbFactory', 'foodGame', 'roundManager'];

 function playGameFoodCtrl($scope, $timeout, $location, dbFactory, foodGame, roundManager) {
     var vm = this;
     vm.displayedItem;

     vm.leftTouchItem = foodGame.getLeftTouchAreaData();
     vm.rightTouchItem = foodGame.getRightTouchAreaData();

     if (foodGame.getCurrentRound() == foodGame.getMaxRounds()) {
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
         //vm.playerTouch = function(leftAttributeId, rightAttributeId, foodId, userResponseCategoryId, displayItemCategoryId) {
     vm.playerTouch = function(leftWordId, rightWordId, displayedFoodId, displayedFoodCategoryId, userResponseCategoryId) {
         if (displayedFoodCategoryId == userResponseCategoryId) {
             $scope.showError = false;
         } else {
             $scope.showError = true;
         }
         $scope.sideTouchAreasDisabled = true;

         if (roundSaved == false) {
             $scope.showStimulus = false;
             roundManager.addFoodRoundData(leftWordId, rightWordId, displayedFoodId,
                 displayedFoodCategoryId, userResponseCategoryId, Date.now() - foodGame.getStartTime());
             roundSaved = true;
         }

         if (roundSaved == true && displayedFoodCategoryId == userResponseCategoryId) {
             $scope.showStimulus = false;
             foodGame.advanceRoundCounter();
             if (foodGame.getCurrentRound() == foodGame.getMaxRounds()) {
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

         if (roundSaved == true && displayedFoodCategoryId == userResponseCategoryId) {
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