angular.module('play').factory("roundManager", function($q, $timeout, dbFactory, scorer) {

    var gameId = 0;
    var roundData = [];

    var resetRoundData = function() {
        roundData.length = 0;
    };

    var getRoundData = function() {
        return roundData;
    }

    var addFoodRoundData = function(leftAttributeId, rightAttributeId, foodId, userResponseId, reactionTime) {
        //var score = scorer.
        var roundObj = {
            'left_attribute_category_id': leftAttributeId,
            'right_attribute_category_id': rightAttributeId,
            'food_id': foodId,
            'user_response_category_id': userResponseId,
            'reaction_time': reactionTime,
            'points': points
        };
        roundData.push(roundObj);

        // stub
    };
    var addAttributeRoundData = function(leftFoodId, rightFoodId, displayedWordId, displayedWordCategoryId, userResponseCategoryId, reactionTime) {
        var points = 0;
        if (displayedWordCategoryId == userResponseCategoryId) {
            points = scorer.scoreAttributeRound(reactionTime);
        }
        var roundObj = {
            'left_food_id': leftFoodId,
            'right_food_id': rightFoodId,
            'displayed_word_id': displayedWordId,
            'displayed_word_category_id': displayedWordCategoryId,
            'user_response_category_id': userResponseCategoryId,
            'reaction_time': reactionTime,
            'points': points
        };
        roundData.push(roundObj);
    };

    var createGameContainerForRounds = function(game_type) {
        var query = 'INSERT INTO game(game_type) VALUES ("' + game_type + '")';
        dbFactory.execute(query, [], []);
    }

    var saveRoundDataToDatabase = function() {
        for (i = 0; i < roundData.length; i++) {
            console.log('INSERT INTO game_round_food(left_attribute_category_id, right_attribute_category_id, food_id, user_response_category_id, reaction_time, points, game_id) ' +
                +'VALUES (' + roundData[i].left_attribute_category_id + ', ' + roundData[i].right_attribute_category_id + ', ' + roundData[i].food_id + ', ' +
                roundData[i].user_response_category_id + ', ' + roundData[i].reaction_time + ', ' + roundData[i].points + ', ' + roundData[i].game_id + ')');
        }
    };


    return {
        resetRoundData: resetRoundData,
        getRoundData: getRoundData,
        addFoodRoundData: addFoodRoundData,
        addAttributeRoundData: addAttributeRoundData,
        saveRoundDataToDatabase: saveRoundDataToDatabase,
        createGameContainerForRounds: createGameContainerForRounds

    };

});