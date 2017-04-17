 angular
     .module('play')
     .controller('playStartAttributeCtrl', playStartAttributeCtrl);

 playStartAttributeCtrl.$inject = ['$scope', '$timeout', 'dbFactory', 'attributeGame', 'roundManager'];

 function playStartAttributeCtrl($scope, $timeout, dbFactory, attributeGame, roundManager) {
     var vm = this;

     vm.positiveWords = attributeGame.getPositiveWords();
     vm.negativeWords = attributeGame.getNegativeWords();

     roundManager.resetRoundData();
     attributeGame.setupRoundInfo(10);

     vm.healthyFood = attributeGame.getHealthyFood();
     vm.unhealthyFood = attributeGame.getUnhealthyFood();
 }