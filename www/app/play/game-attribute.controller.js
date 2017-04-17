 angular
     .module('play')
     .controller('playGameAttributeCtrl', playGameAttributeCtrl);

 playGameAttributeCtrl.$inject = ['$scope', '$timeout', '$location', 'dbFactory', 'attributeGame', 'roundManager'];

 function playGameAttributeCtrl($scope, $timeout, $location, dbFactory, attributeGame, roundManager) {
     var vm = this;
     vm.displayedItem;

     vm.leftTouchItem = attributeGame.getLeftTouchAreaData();
     vm.rightTouchItem = attributeGame.getRightTouchAreaData();

     if (attributeGame.getCurrentRound() == attributeGame.getMaxRounds()) {
         $location.path('/play-start-attribute');
     }

     $scope.sideTouchAreasDisabled = true;
     $scope.showOverlay = true;
     $scope.showError = false;
     $scope.showStimulus = false;

     var roundSaved = false;


     vm.startGameTouch = function() {
         $scope.showOverlay = false;
         $timeout(function() {
             vm.displayedItem = attributeGame.getNextDisplayItem();
             $scope.showStimulus = true;
             $scope.sideTouchAreasDisabled = false;
         }, 1000);
     }


     vm.playerTouch = function(leftFoodId, rightFoodId, displayedWordId, displayedWordCategoryId, userResponseCategoryId, displayedName) { // leftFoodId, rightFoodId, attributeWordId, userResponseId
         if (displayedWordCategoryId == userResponseCategoryId) {
             $scope.showError = false;
         } else {
             $scope.showError = true;
         }
         $scope.sideTouchAreasDisabled = true;

         if (roundSaved == false) {
             $scope.showStimulus = false;
             roundManager.addAttributeRoundData(leftFoodId, rightFoodId, displayedWordId,
                 displayedWordCategoryId, userResponseCategoryId, Date.now() - attributeGame.getStartTime(), displayedName);
             roundSaved = true;
         }

         if (roundSaved == true && displayedWordCategoryId == userResponseCategoryId) {
             $scope.showStimulus = false;
             attributeGame.advanceRoundCounter();
             if (attributeGame.getCurrentRound() == attributeGame.getMaxRounds()) {
                 $location.path('/play-results-attribute');
             }
         }

         if ($scope.showError == true && roundSaved == true) {
             $scope.showStimulus = true;
             $scope.sideTouchAreasDisabled = false;
         }

         // debug
         vm.differenceMilliseconds = Date.now() - attributeGame.getStartTime();
         // debug

         if (roundSaved == true && displayedWordCategoryId == userResponseCategoryId) {
             $timeout(function() {
                 vm.displayedItem = attributeGame.getNextDisplayItem();
                 attributeGame.setStartTime(Date.now());
                 $scope.showError = false;
                 roundSaved = false;
                 $scope.showStimulus = true;
                 $scope.sideTouchAreasDisabled = false;
             }, 200);
         }
     }
 }