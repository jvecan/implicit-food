angular.module('play').factory("roundManager", function($q, $timeout, dbFactory) {

    var currentRound = 0;
    var maxRounds = 10;
    var roundDataArray = [];


    var getCurrentRound = function() {
        return currentRound;
    };

    var advanceRoundCounter = function() {
        currentRound++;
    };

    var getMaxRounds = function() {
        return maxRounds;
    };

    var resetAllRoundData = function() {
        roundData.length = 0;
        currentRound = 0;
    };

    var saveFoodRoundData = function(leftAttributeId, rightAttributeId, stimulusFoodId, timeTaken, error) {
        var roundObj = { 'side': side, 'name': foodName, 'time': difference };
        roundData.push(roundObj);

        // stub
    };
    var saveAttributeRoundData = function(side, at) {
        var roundObj = { 'side': side, 'name': foodName, 'time': difference };
        roundData.push(roundObj);

        // stub
    };
    var saveRoundDataToDatabase = function() {
        // stub
    };


    return {
        currentRound: currentRound,
        advanceRoundCounter: advanceRoundCounter,
        getMaxRounds: getMaxRounds,
        resetAllRoundData: resetAllRoundData,
        saveFoodRoundData: saveFoodRoundData,
        saveAttributeRoundData: saveAttributeRoundData,
        saveRoundDataToDatabase: saveRoundDataToDatabase



    };

});