 angular
     .module('play')
     .controller('playResultsFoodCtrl', playResultsFoodCtrl);

 playResultsFoodCtrl.$inject = ['$scope', '$timeout', '$location', '$interval', 'dbFactory', 'foodGame', 'roundManager', 'scorer', 'player'];

 function playResultsFoodCtrl($scope, $timeout, $location, $interval, dbFactory, foodGame, roundManager, scorer, player) {
     var vm = this;
     if (roundManager.getRoundSaved() == true || roundManager.getRoundData().length == 0) {
         $location.path('/play');
     } else {
         roundManager.saveRoundDataToDatabase('food');


         $scope.showNewLevelInfo = false;
         $scope.newLevelUnlocked = false;
         $scope.currentLevelData = [];
         $scope.nextLevelData = [];

         var progressBarFinalPosition = 0;
         var progressBarAnimationWidth = 0;
         var progressBarAnimation;
         $scope.progressBarWidth = 0;

         vm.roundStatistics = roundManager.compileRoundStatistics();
         vm.totalScore = scorer.calculateTotalScore(roundManager.getRoundData());
         vm.totalScore = scorer.giveTotalBonuses(vm.totalScore, vm.roundStatistics, roundManager.getRoundData());
         $scope.bonusInfo = scorer.getBonusInfo();

         vm.totalScore = Math.round(vm.totalScore);

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
                 roundManager.updateGameContainer(roundManager.getLastInsertedGameId(), vm.totalScore, vm.roundStatistics);

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

 }