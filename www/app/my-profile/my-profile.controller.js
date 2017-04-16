 angular
     .module('myProfile')
     .controller('myProfileCtrl', myProfileCtrl);

 myProfileCtrl.$inject = ['$scope', '$timeout', '$interval', 'dbFactory', 'roundManager', 'player'];

 function myProfileCtrl($scope, $timeout, $interval, dbFactory, roundManager, player) {

     var vm = this;
     $scope.roundData = [];

     player.exportPlayerGamesToCSV();

     player.getPlayedGamesFromDb().then(function() {
             return player.getPlayerInfoFromDb();
         })
         .then(function() {
             vm.playedGames = player.getPlayedGames();
             for (var i = 0; i < vm.playedGames.length; i++) {
                 var singleRound = [];
                 player.getGameRoundsFromDb(vm.playedGames[i].game_type, vm.playedGames[i].id, singleRound).then(function() {
                     console.log(singleRound);
                     $scope.roundData.push(singleRound);
                 });
                 //player.getGameRounds(vm.playedGames[i].game_type, vm.playedGames[i].id);
             }
         });

 }