 angular
     .module('play')
     .controller('playGameFoodCtrl', playGameFoodCtrl);

 playGameFoodCtrl.$inject = ['$scope', '$timeout', '$location', '$route', 'dbFactory', 'foodGame', 'roundManager'];

 function playGameFoodCtrl($scope, $timeout, $location, $route, dbFactory, foodGame, roundManager) {
     $scope.route = $route;
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


     vm.playerTouch = function(userResponseCategoryId) {
         if (vm.displayedItem.attribute_category_id == userResponseCategoryId) {
             $scope.showError = false;
         } else {
             $scope.showError = true;
         }
         $scope.sideTouchAreasDisabled = true;

         if (roundSaved == false) {
             $scope.showStimulus = false;
             roundManager.addRoundData(vm.leftTouchItem, vm.rightTouchItem, vm.displayedItem,
                 userResponseCategoryId, Date.now() - foodGame.getStartTime());
             roundSaved = true;
         }

         if (roundSaved == true && vm.displayedItem.attribute_category_id == userResponseCategoryId) {
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

         if (roundSaved == true && vm.displayedItem.attribute_category_id == userResponseCategoryId) {
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