 angular
     .module('myProfile')
     .controller('myProfileCtrl', myProfileCtrl);

 myProfileCtrl.$inject = ['$scope', '$timeout', '$interval', 'dbFactory', 'roundManager', 'player'];

 function myProfileCtrl($scope, $timeout, $interval, dbFactory, roundManager, player) {

     var vm = this;
     $scope.roundData = [];

     $scope.data = [];
     $scope.labels = [];

     $scope.options = {
         scales: {
             xAxes: [{
                     ticks: {
                         display: false
                     }
                 }]
                 /*,
                 yAxes: [{
                     ticks: {
                         display: false
                     }
                 }]*/
         }
     };

     //player.exportPlayerGamesToCSV();

     player.getHighScore().then(function(data) {
         vm.highScore = data[0].high_score;
     });

     player.getPlayerProfile().then(function(data) {
         vm.playerInfo = data[0];
     });

     player.getPlayedGamesFromDb().then(function(data) {
         vm.playedGames = data;

         for (var i = 0; i < vm.playedGames.length; i++) {
             $scope.data.push(vm.playedGames[i].total_points);

             $scope.labels.push(vm.playedGames[i].id);
         }


         /*
         for(var i = 0; i < vm.playedGames.length; i++) {
             playedGame.total_points
         }
         */
     });

     $scope.series = ['Series A'];

     vm.exportData = function() {
         console.log("export data kutsuttu");
         player.exportPlayerGamesToCSV();
     };

     //$scope.data = [65, 59, 80, 81, 56, 55, 40];





     /*

          player.getPlayedGamesFromDb().then(function() {
                  return player.getPlayerInfoFromDb();
              })

              
              .then(function() {
     */
     //vm.highScore = [];
     //vm.highScore = player.getHighScore(vm.highScore);

     //console.log(vm.highScore);

     //vm.playedGames = player.getPlayedGames();
     //vm.playerInfo = player.getPlayerInfo();

     /*
     var singleRound = [];
     for (var i = 0; i < vm.playedGames.length; i++) {

         player.getGameRoundsFromDb(vm.playedGames[i].game_type, vm.playedGames[i].id, singleRound).then(function() {
             console.log(singleRound);
             $scope.roundData.push(singleRound);
             singleRound.length = 0;
         });
         //player.getGameRounds(vm.playedGames[i].game_type, vm.playedGames[i].id);
     }
     */
     // });

 }