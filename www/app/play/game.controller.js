 angular
     .module('play')
     .controller('playGameCtrl', playGameCtrl);

 playGameCtrl.$inject = ['$scope', '$timeout', '$location', 'dbFactory', 'gameItems', 'roundManager'];

 function playGameCtrl($scope, $timeout, $location, dbFactory, gameItems, roundManager) {
     var vm = this;
     vm.displayedFood;

     vm.leftCategory = gameItems.getLeftCategoryData();
     vm.rightCategory = gameItems.getRightCategoryData();

     if (gameItems.getCurrentRound() == roundManager.getMaxRounds()) {
         $location.path('/play-start-food');
     }

     //vm.displayedFood = gameItems.getNextFoodItem();
     $scope.gameItemsService = gameItems;

     $scope.sideTouchAreasDisabled = true;
     $scope.showOverlay = true;
     $scope.showError = false;
     $scope.showStimulus = false;

     var roundSaved = false;


     vm.startGameTouch = function() {
         $scope.showOverlay = false;

         $timeout(function() {
             vm.displayedFood = gameItems.getNextFoodItem();
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
                 correctSide = "good";
             } else if (foodAttributeCategoryId == 2) {
                 correctSide = "bad";
             }
             $scope.showStimulus = false;
             gameItems.addRoundInfo(side, correctSide, foodName, Date.now() - gameItems.getStartTime());
             roundSaved = true;
         }

         if (roundSaved == true && foodAttributeCategoryId == touchAreaAttributeId) {
             $scope.showStimulus = false;
             gameItems.advanceRoundCounter();
             if (gameItems.getCurrentRound() == roundManager.getMaxRounds()) {
                 $location.path('/play-results');
             }

         }

         if ($scope.showError == true && roundSaved == true) {
             $scope.showStimulus = true;
             $scope.sideTouchAreasDisabled = false;
         }

         // debug
         vm.differenceMilliseconds = Date.now() - gameItems.getStartTime();
         // debug

         if (roundSaved == true && foodAttributeCategoryId == touchAreaAttributeId) {
             $timeout(function() {
                 vm.displayedFood = gameItems.getNextFoodItem();
                 gameItems.setStartTime(Date.now());
                 $scope.showError = false;
                 roundSaved = false;
                 $scope.showStimulus = true;
                 $scope.sideTouchAreasDisabled = false;
             }, 200);


         }


     }

 }