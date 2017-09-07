angular
        .module('myProfile')
        .controller('myProfileOtherStatisticsCtrl', myProfileOtherStatisticsCtrl);

myProfileOtherStatisticsCtrl.$inject = ['$scope', '$route', 'player'];

function myProfileOtherStatisticsCtrl($scope, $route, player) {
    var vm = this;
    vm.otherStatistics = [];

    $scope.orderByField = 'correct_responses';
    $scope.reverseSort = false;

    player.getPlayerProfile().then(function (playerData) {
        player.getOtherFoodStatisticsFood(playerData[0]).then(function (otherStatistics) {
            vm.otherStatistics = otherStatistics;
            for (var i = 0; i < vm.otherStatistics.length; i++) {
                //vm.otherStatistics[i].correct_responses = Math.round((vm.otherStatistics[i].correct_responses / vm.otherStatistics[i].total_responses) * 100);
            }
        });
    });



}