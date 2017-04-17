angular.module('play').factory("roundManager", function($q, $timeout, dbFactory, scorer) {

    var gameId = [];
    var roundData = [];
    var roundStatistics = [];
    var lastInsertedGameId = 0;
    var roundSaved = false;

    var resetRoundData = function() {
        roundSaved = false;
        roundData.length = 0;
    };

    var getRoundSaved = function() {
        return roundSaved;
    }

    var getRoundData = function() {
        return roundData;
    };

    var getLastInsertedGameId = function() {
        return lastInsertedGameId;
    };

    var addFoodRoundData = function(leftWordId, rightWordId, displayedFoodId, displayedCategoryId, userResponseCategoryId, reactionTime, displayedName) {
        var points = 0;
        if (displayedCategoryId == userResponseCategoryId) {
            points = scorer.scoreFoodRound(reactionTime);
        }
        var roundObj = {
            'left_word_id': leftWordId,
            'right_word_id': rightWordId,
            'displayed_food_id': displayedFoodId,
            'displayed_name': displayedName,
            'displayed_category_id': displayedCategoryId,
            'user_response_category_id': userResponseCategoryId,
            'reaction_time': reactionTime,
            'points': points
        };
        roundData.push(roundObj);
    };
    var addAttributeRoundData = function(leftFoodId, rightFoodId, displayedWordId, displayedCategoryId, userResponseCategoryId, reactionTime, displayedName) {
        var points = 0;
        if (displayedCategoryId == userResponseCategoryId) {
            points = scorer.scoreAttributeRound(reactionTime);
        }
        var roundObj = {
            'left_food_id': leftFoodId,
            'right_food_id': rightFoodId,
            'displayed_word_id': displayedWordId,
            'displayed_name': displayedName,
            'displayed_category_id': displayedCategoryId,
            'user_response_category_id': userResponseCategoryId,
            'reaction_time': reactionTime,
            'points': points
        };
        roundData.push(roundObj);
    };

    var updateGameContainer = function(game_id, total_points, round_statistics) {
        var promiseArray = [];
        var query = 'UPDATE game SET ' +
            'total_points = ' + total_points +
            ', correct_responses = ' + round_statistics["correctResponses"] +
            ', incorrect_responses = ' + round_statistics["incorrectResponses"] +
            ', average_reaction_time = ' + round_statistics["averageReactionTime"] +
            ', average_reaction_time_correct_responses = ' + round_statistics["averageReactionTimeCorrectResponses"] +
            ' WHERE id = ' + game_id + ';';
        dbFactory.execute(query, [], promiseArray);
        return promiseArray;

    }

    var createGameContainerForRounds = function(game_type) {
        var q = $q.defer();
        var query = 'INSERT INTO game(timestamp, game_type) VALUES (' + Date.now() + ', "' + game_type + '")';
        dbFactory.execute(query, [], gameId).then(function() {
            //gameId = gameId[0];
            q.resolve();
        });

        return q.promise;
    }

    var saveRoundDataToDatabase = function(game_type) {
        roundSaved = false;
        gameId.length = 0;
        var promiseArray = [];
        createGameContainerForRounds(game_type).then(function() {
            lastInsertedGameId = gameId[0];

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
                dbFactory.execute(query, [], promiseArray).then(function() {

                });
            }
        });
        roundSaved = true;
        return promiseArray;
    };

    var compileRoundStatistics = function() {
        roundStatistics.length = 0;
        var correctResponseItems = [];
        var incorrectResponseItems = []
        var correctResponses = 0;
        var incorrectResponses = 0;
        var reactionTimeSum = 0;
        var reactionTimeCorrectResponsesSum = 0;

        for (i = 0; i < roundData.length; i++) {
            reactionTimeSum += roundData[i].reaction_time;
            if (roundData[i].user_response_category_id == roundData[i].displayed_category_id) {
                correctResponseItems.push(roundData[i].displayed_name);
                correctResponses++;
                reactionTimeCorrectResponsesSum += roundData[i].reaction_time;
            } else {
                incorrectResponseItems.push(roundData[i].displayed_name);
                incorrectResponses++;
            }

        }
        roundStatistics["averageReactionTime"] = Math.round(reactionTimeSum / roundData.length);
        roundStatistics["averageReactionTimeCorrectResponses"] = Math.round(reactionTimeCorrectResponsesSum / correctResponses);
        roundStatistics["correctResponseItems"] = correctResponseItems;
        roundStatistics["incorrectResponseItems"] = incorrectResponseItems;
        roundStatistics["correctResponses"] = correctResponses;
        roundStatistics["incorrectResponses"] = incorrectResponses;

        return roundStatistics;
    };


    return {
        resetRoundData: resetRoundData,
        getRoundData: getRoundData,
        getLastInsertedGameId: getLastInsertedGameId,
        compileRoundStatistics: compileRoundStatistics,
        addFoodRoundData: addFoodRoundData,
        addAttributeRoundData: addAttributeRoundData,
        saveRoundDataToDatabase: saveRoundDataToDatabase,
        createGameContainerForRounds: createGameContainerForRounds,
        updateGameContainer: updateGameContainer,
        getRoundSaved: getRoundSaved,
    };

});