 angular
     .module('play')
     .controller('playGameAttributeCtrl', playGameAttributeCtrl);

 playGameAttributeCtrl.$inject = ['$scope', '$timeout', '$location', 'dbFactory', 'attributeGame', 'roundManager'];

 function playGameAttributeCtrl($scope, $timeout, $location, dbFactory, attributeGame, roundManager) {
     var vm = this;
     vm.displayedItem;

     vm.leftTouchItem = attributeGame.getLeftTouchAreaData();
     vm.rightTouchItem = attributeGame.getRightTouchAreaData();

     if (attributeGame.getCurrentRound() == roundManager.getMaxRounds()) {
         $location.path('/play-start-attribute');
     }


     //vm.displayedItem = attributeGame.getNextDisplayItem();
     //$scope.attributeGameService = attributeGame;

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


     vm.playerTouch = function(side, itemName, displayItemCategoryId, touchAreaAttributeId) {
         console.log(side + " " + itemName + " " + displayItemCategoryId + " " + touchAreaAttributeId)
         if (displayItemCategoryId == touchAreaAttributeId) {
             $scope.showError = false;
         } else {
             $scope.showError = true;
         }
         $scope.sideTouchAreasDisabled = true;

         //console.log("end time: " + Date.now());
         //console.log("start time: " + attributeGame.getStartTime());
         //console.log("called playerTouch");

         if (roundSaved == false) {
             $scope.showStimulus = false;
             attributeGame.addRoundInfo(side, displayItemCategoryId, itemName, Date.now() - attributeGame.getStartTime());
             roundSaved = true;
         }

         if (roundSaved == true && displayItemCategoryId == touchAreaAttributeId) {
             $scope.showStimulus = false;
             attributeGame.advanceRoundCounter();
             if (attributeGame.getCurrentRound() == roundManager.getMaxRounds()) {
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

         if (roundSaved == true && displayItemCategoryId == touchAreaAttributeId) {
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