 angular
     .module('play')
     .controller('playResultsAttributeCtrl', playResultsAttributeCtrl);

 playResultsAttributeCtrl.$inject = ['$scope', '$timeout', '$location', '$interval', 'dbFactory', 'attributeGame', 'roundManager', 'scorer', 'player'];

 function playResultsAttributeCtrl($scope, $timeout, $location, $interval, dbFactory, attributeGame, roundManager, scorer, player) {
     var vm = this;

     $scope.newLevelUnlocked = false;
     $scope.nextLevelProgress = true;
     roundManager.createGameContainerForRounds('attribute');

     /*
     $scope.$watch('playerInfo', function() {
         alert('hey, myVar has changed!');
     });
     */

     vm.totalScore = scorer.calculateTotalScore(roundManager.getRoundData());
     vm.totalScore = Math.round(vm.totalScore);

     player.updateTotalPoints(vm.totalScore).then(function() {
             return player.getPlayerInfoFromDb();
         })
         .then(function() {
             return player.updateLevel();
         })
         .then(function() {
             return player.getPlayerInfoFromDb();
         })
         .then(function() {
             $scope.playerInfo = player.getPlayerInfo();
             if (player.newLevelUnlocked() == true) {

                 $scope.newLevelData = [];
                 player.getLevelInformation($scope.playerInfo.level, $scope.newLevelData).then(function() {
                     $scope.newLevelData = $scope.newLevelData[0];

                     var progressBarAnimation = $interval(progressBarAnimationFunction, 10);
                     var width = 0;

                     function progressBarAnimationFunction() {
                         if (width >= 100) {
                             $interval.cancel(progressBarAnimation);
                             $scope.newLevelMessage = "You have reached a new level!";
                             $scope.newLevelUnlocked = true;
                         } else {
                             width++;
                             $scope.progressBarWidth = width;
                         }
                     }
                 });
             } else {
                 $scope.nextLevelData = [];
                 player.getLevelInformation($scope.playerInfo.level + 1, $scope.nextLevelData).then(function() {
                     $scope.nextLevelData = $scope.nextLevelData[0];
                     $scope.pointsUntilNextLevel = $scope.nextLevelData.required_points - $scope.playerInfo.total_points;

                     $scope.currentLevelData = [];

                     player.getLevelInformation($scope.playerInfo.level, $scope.currentLevelData).then(function() {
                         $scope.currentLevelData = $scope.currentLevelData[0];
                         var width = 0;
                         var progressBarAnimation = $interval(progressBarAnimationFunction, 10);

                         var totalScale = $scope.nextLevelData.required_points - $scope.currentLevelData.required_points;
                         var scalePosition = Math.round(((totalScale - $scope.pointsUntilNextLevel) / totalScale) * 100);

                         function progressBarAnimationFunction() {
                             if (width >= scalePosition) {
                                 console.log($scope.playerInfo.total_points);
                                 console.log($scope.nextLevelData.required_points);
                                 /*
                                 if ($scope.playerInfo.total_points >= $scope.nextLevelData.required_points) {
                                     $scope.newLevelMessage = "You have reached a new level!";
                                 }
                                 */
                                 $interval.cancel(progressBarAnimation);
                             } else {
                                 width++;
                                 $scope.progressBarWidth = width;
                             }
                         }
                     });
                 });
             }
         });

     vm.results = roundManager.getRoundData();

 }