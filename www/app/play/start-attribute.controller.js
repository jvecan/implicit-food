 angular
     .module('play')
     .controller('playStartAttributeCtrl', playStartAttributeCtrl);

 playStartAttributeCtrl.$inject = ['$scope', '$timeout', '$route', 'dbFactory', 'attributeGame', 'roundManager'];

 function playStartAttributeCtrl($scope, $timeout, $route, dbFactory, attributeGame, roundManager) {
     $scope.route = $route;
     var vm = this;

     attributeGame.initializeNegativeWords();
     attributeGame.initializePositiveWords();
     
     vm.positiveWords = attributeGame.getPositiveWords();
     vm.negativeWords = attributeGame.getNegativeWords();

     roundManager.resetRoundData();
     attributeGame.setupRoundInfo(10);

     vm.healthyFood = attributeGame.getHealthyFood();
     vm.unhealthyFood = attributeGame.getUnhealthyFood();
 }