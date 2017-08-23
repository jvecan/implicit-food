 angular
     .module('myProfile')
     .controller('myProfileUnlockedCtrl', myProfileUnlockedCtrl);

 myProfileUnlockedCtrl.$inject = ['$scope', '$timeout', '$interval', '$route', 'dbFactory', 'roundManager', 'player'];

 function myProfileUnlockedCtrl($scope, $timeout, $interval, $route, dbFactory, roundManager, player) {
     var vm = this;
     vm.unlockedFoods = [];

     $scope.showUnlockedFoodInformation = false;
     $scope.unlockedFoodInformation = "";
     $scope.unlockedFoodInformationTitle = "";

     player.getPlayerProfile().then(function(playerData) {
         player.getUnlockedFoods(playerData[0]).then(function(unlockedData) {
             vm.unlockedFoods = unlockedData;
         });
     });


     vm.showFoodInformation = function(foodLevel) {
         $scope.showUnlockedFoodInformation = true;
         $scope.unlockedFoodInformationTitle = vm.unlockedFoods[foodLevel - 1].name;
         $scope.unlockedFoodInformationLevelDescription = vm.unlockedFoods[foodLevel - 1].description;
         $scope.unlockedFoodInformationLevel = vm.unlockedFoods[foodLevel - 1].level;
         $scope.unlockedFoodInformation = vm.unlockedFoods[foodLevel - 1].unlock_text;
         $scope.unlockedFoodInformation = $scope.unlockedFoodInformation.charAt(0).toUpperCase() + $scope.unlockedFoodInformation.slice(1);
     };

     vm.closeFoodInformation = function() {
         $scope.showUnlockedFoodInformation = false;
     };


 }