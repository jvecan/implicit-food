 angular
     .module('play')
     .controller('playStartAttributeCtrl', playStartAttributeCtrl);

 playStartAttributeCtrl.$inject = ['$scope', '$timeout', 'dbFactory', 'attributeGame'];

 function playStartAttributeCtrl($scope, $timeout, dbFactory, attributeGame) {
     var vm = this;

     vm.positiveWords = attributeGame.getPositiveWords();
     vm.negativeWords = attributeGame.getNegativeWords();

     vm.healthyFood = attributeGame.getHealthyFood();
     vm.unhealthyFood = attributeGame.getUnhealthyFood();

     console.log(attributeGame.getHealthyFood());
     //console.log(vm.randomUnhealthyFoods);

 }