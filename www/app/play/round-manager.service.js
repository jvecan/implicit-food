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

    var saveFoodRoundData = function(leftAttributeId, rightAttributeId, foodId, userResponseCategoryId, reactionTime, points) {
        var roundObj = {
            'left_attribute_category_id': leftAttributeId,
            'right_attribute_category_id': rightAttributeId,
            'food_id': foodId,
            'user_response_category_id': userResponseCategoryId,
            'reaction_time': reactionTime,
            'points': points
        };
        roundData.push(roundObj);

        // stub
    };
    var saveAttributeRoundData = function(side, at) {
        var roundObj = { 'side': side, 'name': foodName, 'time': difference };
        roundData.push(roundObj);

        // stub
    };

    var createGameContainerForRounds = function(game_type) {
        var query = 'INSERT INTO game(game_type) VALUES ("' + game_type + '")';
        dbFactory.execute(query, [], []);
    }

    //var saveFoodRoundToDatabase

    var saveRoundDataToDatabase = function() {
        for (i = 0; i < roundData.length; i++) {
            console.log('INSERT INTO game_round_food(left_attribute_category_id, right_attribute_category_id, food_id, user_response_category_id, reaction_time, points, game_id) ' +
                +'VALUES (' + roundData[i].left_attribute_category_id + ', ' + roundData[i].right_attribute_category_id + ', ' + roundData[i].food_id + ', ' +
                roundData[i].user_response_category_id + ', ' + roundData[i].reaction_time + ', ' + roundData[i].points + ', ' + roundData[i].game_id + ')');
        }
    };


    return {
        currentRound: currentRound,
        advanceRoundCounter: advanceRoundCounter,
        getMaxRounds: getMaxRounds,
        resetAllRoundData: resetAllRoundData,
        saveFoodRoundData: saveFoodRoundData,
        saveAttributeRoundData: saveAttributeRoundData,
        saveRoundDataToDatabase: saveRoundDataToDatabase,
        createGameContainerForRounds: createGameContainerForRounds

    };

});