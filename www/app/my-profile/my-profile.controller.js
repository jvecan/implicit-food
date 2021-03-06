angular
        .module('myProfile')
        .controller('myProfileCtrl', myProfileCtrl);

myProfileCtrl.$inject = ['$scope', '$timeout', '$interval', '$route', '$location', 'dbFactory', 'roundManager', 'player'];

function myProfileCtrl($scope, $timeout, $interval, $route, $location, dbFactory, roundManager, player) {

    var vm = this;
    $scope.roundData = [];

    $scope.route = $route;

    $scope.pointsData = [];
    $scope.reactionTimeData = [];
    $scope.correctResponsesData = [];
    $scope.labels = [];

    $scope.deleteNotification = false;

    $scope.exportNotification = false;
    $scope.exportNotificationLoaderGif = false;

    $scope.exportMessage = "";

    $scope.activeChartTab = "points";

    player.getHighScore().then(function (data) {
        vm.highScore = data[0].high_score;
    });

    player.getPlayerProfile().then(function (data) {
        vm.playerInfo = data[0];
    });



    player.getPlayedGamesFromDb(300).then(function (data) {
        vm.playedGames = data;

        if (vm.playedGames.length > 0) {
            vm.playedGames.reverse();

            for (var i = 0; i < vm.playedGames.length; i++) {
                $scope.pointsData.push(vm.playedGames[i].total_points);
                if (vm.playedGames[i].average_reaction_time_correct_responses > 1750) {
                    $scope.reactionTimeData.push(1750);
                } else {
                    $scope.reactionTimeData.push(vm.playedGames[i].average_reaction_time_correct_responses);
                }
                $scope.correctResponsesData.push(vm.playedGames[i].correct_responses);
                $scope.labels.push(vm.playedGames[i].id);
            }
        }



        $scope.optionsPoints = {
            scales: {
                xAxes: [{
                        ticks: {
                            display: false
                        },
                        gridLines: {
                            display: false
                        }
                    }],
                yAxes: [{
                        display: true,
                        ticks: {
                            beginAtZero: true
                        },
                        gridLines: {
                            display: false
                        }
                    }]
            },
            elements: {
                point: {
                    radius: 0
                }
            }
        };



        $scope.optionsReactionTime = {
            scales: {
                xAxes: [{
                        ticks: {
                            display: false
                        },
                        gridLines: {
                            display: false
                        }
                    }],
                yAxes: [{
                        display: true,
                        ticks: {
                            beginAtZero: true
                        },
                        gridLines: {
                            display: false
                        }
                    }]

            },
            elements: {
                point: {
                    radius: 0
                }
            }
        };

        $scope.optionsCorrectResponses = {
            scales: {
                xAxes: [{
                        ticks: {
                            display: false
                        },
                        gridLines: {
                            display: false
                        }
                    }],
                yAxes: [{
                        display: true,
                        ticks: {
                            beginAtZero: true,
                            steps: 10,
                            stepValue: 1,
                            max: 10
                        },
                        gridLines: {
                            display: false
                        }
                    }]
            },
            elements: {
                point: {
                    radius: 0
                }
            }
        };
    });

    $scope.series = ['Series A'];

    vm.confirmExportData = function () {
        $scope.exportNotification = true;

        player.getPlayedGameRoundsFromDb([]).then(function (roundData) {
            player.exportPlayerGamesToCSV(roundData).then(function (response) {
                $scope.exportMessage = response;
                $scope.exportNotificationLoaderGif = false;

                console.log('Success: ' + response);
                $timeout(function () {
                    $scope.exportNotification = false;
                    $scope.exportMessage = "";
                }, 1500);
            }, function (error) {
                $scope.exportMessage = error;
                console.log(error);
                $timeout(function () {
                    $scope.exportNotificationLoaderGif = false;
                    $scope.exportNotification = false;
                    $scope.exportMessage = "";
                }, 1500);
            }, function (update) {
                $scope.exportNotificationLoaderGif = true;
                $scope.exportMessage = update;
                console.log(update);
            });
        });
    };

    vm.exportData = function () {
        $scope.exportNotification = true;
    };

    vm.resetProfile = function () {
        $scope.deleteNotification = true;
    };

    vm.confirmProfileReset = function () {
        player.resetPlayerProfile().then(function () {
            $location.path('/');
        });

    };

    vm.closeDeleteNotification = function () {
        $scope.deleteNotification = false;
    };

    vm.closeExportNotification = function () {
        $scope.exportNotification = false;
    };



    vm.switchTab = function (tabName) {
        $scope.activeChartTab = tabName;
    };
}