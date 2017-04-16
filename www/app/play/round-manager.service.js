angular.module('play').factory("roundManager", function($q, $timeout, dbFactory, scorer) {

    var gameId = [];
    var roundData = [];

    var resetRoundData = function() {
        roundData.length = 0;
    };

    var getRoundData = function() {
        return roundData;
    }

    var addFoodRoundData = function(leftWordId, rightWordId, displayedFoodId, displayedFoodCategoryId, userResponseCategoryId, reactionTime) {
        var points = 0;
        if (displayedFoodCategoryId == userResponseCategoryId) {
            points = scorer.scoreAttributeRound(reactionTime);
        }
        var roundObj = {
            'left_word_id': leftWordId,
            'right_word_id': rightWordId,
            'displayed_food_id': displayedFoodId,
            //'displayed_word_category_id': displayedWordCategoryId,
            'user_response_category_id': userResponseCategoryId,
            'reaction_time': reactionTime,
            'points': points
        };
        roundData.push(roundObj);
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
            //'displayed_word_category_id': displayedWordCategoryId,
            'user_response_category_id': userResponseCategoryId,
            'reaction_time': reactionTime,
            'points': points
        };
        roundData.push(roundObj);
    };

    var createGameContainerForRounds = function(game_type) {
        var q = $q.defer();
        var query = 'INSERT INTO game(timestamp, game_type) VALUES (' + Date.now() + ', "' + game_type + '")';
        dbFactory.execute(query, [], gameId).then(function() {
            q.resolve();
        });
        return q.promise;
    }

    var saveRoundDataToDatabase = function(game_type) {
        gameId.length = 0;
        var promiseArray = [];
        createGameContainerForRounds(game_type).then(function() {
            if (game_type == 'word') {
                var query = 'INSERT INTO game_round_word(left_food_id, right_food_id, displayed_word_id, ' +
                    'user_response_category_id, reaction_time, points, game_id) VALUES ';
                for (i = 0; i < roundData.length; i++) {
                    query += '(' + roundData[i].left_food_id + ', ' + roundData[i].right_food_id + ', ' + roundData[i].displayed_word_id + ', ' +
                        roundData[i].user_response_category_id + ', ' + roundData[i].reaction_time + ', ' + roundData[i].points + ', ' + gameId[0] + ')';
                    if (i == roundData.length - 1) {
                        query += ';';
                    } else {
                        query += ', ';
                    }
                }
                dbFactory.execute(query, [], promiseArray);
            } else if (game_type == 'food') {
                var query = 'INSERT INTO game_round_food(left_word_id, right_word_id, displayed_food_id, ' +
                    'user_response_category_id, reaction_time, points, game_id) VALUES ';
                for (i = 0; i < roundData.length; i++) {
                    query += '(' + roundData[i].left_word_id + ', ' + roundData[i].right_word_id + ', ' + roundData[i].displayed_food_id + ', ' +
                        roundData[i].user_response_category_id + ', ' + roundData[i].reaction_time + ', ' + roundData[i].points + ', ' + gameId[0] + ')';
                    if (i == roundData.length - 1) {
                        query += ';';
                    } else {
                        query += ', ';
                    }
                }
                dbFactory.execute(query, [], promiseArray);
            }
        });
        return promiseArray;
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