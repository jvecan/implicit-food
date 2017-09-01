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


    var addRoundData = function(leftItem, rightItem, displayedItem, userResponseCategoryId, reactionTime) {
        var points = 0;
        if (displayedItem.attribute_category_id == userResponseCategoryId) {
            points = scorer.scoreRound(reactionTime);
        }
        var roundObj = {
            'left_item_name': leftItem.name,
            'left_item_category_id': leftItem.attribute_category_id,
            'right_item_name': rightItem.name,
            'right_item_category_id': rightItem.attribute_category_id,
            'displayed_item_name': displayedItem.name,
            'displayed_item_category_id': displayedItem.attribute_category_id,
            'user_response_category_id': userResponseCategoryId,
            'reaction_time': reactionTime,
            'points': points
        };
        roundData.push(roundObj);
    };

    var updateGameContainer = function(game_id, total_points, round_statistics) {
        var promiseArray = [];
        if(isNaN(round_statistics["averageReactionTimeCorrectResponses"])) {
            round_statistics["averageReactionTimeCorrectResponses"] = 0;
        }
        var query = 'UPDATE game SET ' +
            'total_points = ' + total_points +
            ', correct_responses = ' + round_statistics["correctResponses"] +
            ', incorrect_responses = ' + round_statistics["incorrectResponses"] +
            ', average_reaction_time = ' + round_statistics["averageReactionTime"] +
            ', average_reaction_time_correct_responses = ' + round_statistics["averageReactionTimeCorrectResponses"] +
            ' WHERE id = ' + game_id + ';';
        dbFactory.execute(query, [], promiseArray);
        return promiseArray;

    };

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
            var query = 'INSERT INTO game_round(left_item_name, left_item_category_id, right_item_name, ' +
                'right_item_category_id, displayed_item_name, displayed_item_category_id, ' +
                'user_response_category_id, reaction_time, points, game_id) VALUES '
            for (i = 0; i < roundData.length; i++) {
                query += '("' + roundData[i].left_item_name + '", ' + roundData[i].left_item_category_id + ', "' + roundData[i].right_item_name + '", ' +
                    roundData[i].right_item_category_id + ', "' + roundData[i].displayed_item_name + '", ' + roundData[i].displayed_item_category_id + ', ' +
                    roundData[i].user_response_category_id + ', ' + roundData[i].reaction_time + ', ' + roundData[i].points + ', ' + gameId[0] + ')';
                if (i == roundData.length - 1) {
                    query += ';';
                } else {
                    query += ', ';
                }
            }
            dbFactory.execute(query, [], promiseArray).then(function() {
                roundSaved = true;
            });

            /*
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
             */
        });

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
            if (roundData[i].user_response_category_id == roundData[i].displayed_item_category_id) {
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
        addRoundData: addRoundData,
        saveRoundDataToDatabase: saveRoundDataToDatabase,
        createGameContainerForRounds: createGameContainerForRounds,
        updateGameContainer: updateGameContainer,
        getRoundSaved: getRoundSaved,
    };

});