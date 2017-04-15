 angular
     .module('play')
     .controller('playResultsFoodCtrl', playResultsFoodCtrl);

 playResultsFoodCtrl.$inject = ['$scope', '$timeout', '$location', '$interval', 'dbFactory', 'foodGame', 'roundManager', 'scorer', 'player'];

 function playResultsFoodCtrl($scope, $timeout, $location, $interval, dbFactory, foodGame, roundManager, scorer, player) {
     var vm = this;

     $scope.showNewLevelInfo = false;
     $scope.newLevelUnlocked = false;
     roundManager.createGameContainerForRounds('food');

     vm.totalScore = scorer.calculateTotalScore(roundManager.getRoundData());
     vm.totalScore = Math.round(vm.totalScore);
     $scope.currentLevelData = [];
     $scope.nextLevelData = [];

     var progressBarFinalPosition = 0;
     var progressBarAnimationWidth = 0;
     var progressBarAnimation;
     $scope.progressBarWidth = 0;


     player.updateTotalPoints(vm.totalScore).then(function() {
             return player.getPlayerInfoFromDb();
         })
         .then(function() {
             $scope.playerInfo = player.getPlayerInfo();
             return player.getLevelInformation($scope.playerInfo.level, $scope.currentLevelData);
         })
         .then(function() {
             return player.getLevelInformation($scope.playerInfo.level + 1, $scope.nextLevelData);
         })
         .then(function() {
             $scope.nextLevelData = $scope.nextLevelData[0];
             $scope.currentLevelData = $scope.currentLevelData[0];
             var pointsUntilNextLevel;
             progressBarTotalScale = $scope.nextLevelData.required_points - $scope.currentLevelData.required_points;

             if ($scope.playerInfo.total_points > $scope.nextLevelData.required_points) {
                 progressBarFinalPosition = 100;
                 $scope.newLevelUnlocked = true;
                 player.updateLevel();

             } else {
                 pointsUntilNextLevel = $scope.nextLevelData.required_points - $scope.playerInfo.total_points;
                 progressBarFinalPosition = Math.round(((progressBarTotalScale - pointsUntilNextLevel) / progressBarTotalScale) * 100);
             }

             progressBarAnimation = $interval(progressBarAnimationFunction, 10);
         });

     vm.results = roundManager.getRoundData();

     function progressBarAnimationFunction() {
         if (progressBarAnimationWidth >= progressBarFinalPosition) {
             if ($scope.newLevelUnlocked == true) {
                 $scope.showNewLevelInfo = true;
                 $scope.newLevelMessage = "You have reached a new level!";
             }
             $interval.cancel(progressBarAnimation);
         } else {
             progressBarAnimationWidth++;
             $scope.progressBarWidth = progressBarAnimationWidth;
         }
     }

 }