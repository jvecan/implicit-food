play.controller('playController', playController);

playController.$inject = ['$cordovaSQLite', '$scope', 'playDatabase', 'initialGameItems'];




function playController($cordovaSQLite, $scope, playDatabase, initialGameItems) {

    $scope.initialGameItems = initialGameItems;
    console.log(initialGameItems);

    //playDatabase.getMessage();

    var vm = this;
    vm.db = '';
    vm.randomHealthyFoods = [];
    vm.randomUnhealthyFoods = [];





    // alert(gameItemsForInstructions);
    //vm.randomFoods.push("apple");
    //vm.randomFoods.push("asparagus");
    //vm.randomFoods.push("bacon");
    //vm.randomFoods.push("biscuit");
    //vm.randomFoods.push("banana");





}