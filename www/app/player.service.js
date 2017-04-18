angular.module('implicitFood').factory('player', function($q, $cordovaSQLite, $cordovaFile, $timeout, dbFactory) {

    var playerId = 1;
    var playerInfo = [];
    var playedGames = [];
    var highScore = [];
    var newLevelUnlocked = false;
    var playerProfile = [];

    var getPlayerInfo = function() {
        return playerInfo;
    };

    var newLevelUnlocked = function() {
        return newLevelUnlocked;
    };

    var getPlayedGames = function() {
        return playedGames;
    };

    var exportPlayerGamesToCSV = function(data) {

        var query = 'SELECT left_item_name, left_item_category_id, ' +
            'right_item_name, right_item_category_id, displayed_item_name, displayed_item_category_id ' +
            'user_response_category_id, reaction_time, points, game_id FROM game_round';

        //var csvData = 'timestamp;game_type;total_points;correct_responses;incorrect_responses;average_reaction_time;average_reaction_time_correct_responses\n';
        var csvData = 'game_id;left_item_name;left_item_category_id;right_item_name;right_item_category_id;displayed_item_name;displayed_item_category_id;user_response_category_id;reaction_time;points\n';

        var q = $q.defer();


        $timeout(function() {
            q.notify("Exporting data");

        }, 0);

        //playedGames = data;

        for (var i = 0; i < data.length; i++) {
            csvData += data[i].game_id + ';' + data[i].left_item_name + ';' + data[i].left_item_category_id + ';' + data[i].right_item_name + ';' + data[i].right_item_category_id + ';' +
                data[i].displayed_item_name + ';' + data[i].displayed_item_category_id + ';' +
                data[i].user_response_category_id + ';' + data[i].reaction_time + ';' + data[i].points + '\n';
        }

        $cordovaFile.writeFile(cordova.file.externalRootDirectory, "data.csv", csvData, true)
            .then(function(success) {
                q.resolve("Data exported successfully");
                //console.log("Csv file success");
            }, function(error) {
                q.reject("Failed to export data");
            });

        return q.promise;

    };

    var getHighScore = function() {
        highScore = [];
        var query = 'SELECT max(total_points) AS high_score FROM game';
        var data = dbFactory.dbQuery(query, []);
        data.then(function(dataResponse) {
            highScore = dataResponse[0].high_score;
        });
        return data;
    };

    var getPlayerProfile = function() {
        playerProfile = [];
        var query = 'SELECT total_points, level, display_name FROM player WHERE id = ' + playerId;
        var data = dbFactory.dbQuery(query, []);
        data.then(function(dataResponse) {
            playerProfile = dataResponse[0];
        });
        return data;
    };

    var getPlayedGamesFromDb = function() {
        playedGames = [];
        var query = 'SELECT id, timestamp, game_type, total_points, correct_responses, incorrect_responses, ' +
            'average_reaction_time, average_reaction_time_correct_responses FROM game ORDER BY timestamp ASC';
        var data = dbFactory.dbQuery(query, []);
        data.then(function(dataResponse) {
            playedGames = dataResponse;
        });
        return data;
    };

    var getPlayedGameRoundsFromDb = function(played_games) {
        var query = 'SELECT left_item_name, left_item_category_id, ' +
            'right_item_name, right_item_category_id, displayed_item_name, displayed_item_category_id, ' +
            'user_response_category_id, reaction_time, points, game_id FROM game_round';
        if (played_games.length > 0) {
            query += ' WHERE game_id IN (';

            for (var i = 0; i < played_games.length; i++) {
                query += played_games[i].id;

                if (i != played_games.length - 1) {
                    query += ', ';
                } else {

                }
            }
            query += ") ORDER BY game_id ASC";
        } else {
            query += " ORDER BY game_id ASC";
        }

        console.log(query);

        var data = dbFactory.dbQuery(query, []);
        data.then(function(dataResponse) {
            //playedGames = dataResponse;
        });
        return data;

        /*
        var query = 'SELECT id, reaction_time FROM game_round_' + game_type + ' WHERE game_id = ' + game_id;
        var q = $q.defer();

        dbFactory.execute(query, [], gameRoundArray).then(function() {
            q.resolve(gameRoundArray);
        });
        return q.promise;
        */
    };


    var getPlayerInfoFromDb = function() {
        var query = 'SELECT total_points, level, display_name FROM player WHERE id = ' + playerId;
        var q = $q.defer();
        var playerInfoArray = [];

        dbFactory.execute(query, [], playerInfoArray).then(function() {
            playerInfo = playerInfoArray[0];
            q.resolve();
        });
        return q.promise;
    };





    var updateLevel = function() {
        var q = $q.defer();

        var nextLevelNumber = playerInfo.level + 1;
        var levelInformationArray = [];

        newLevelUnlocked = false;

        getLevelInformation(nextLevelNumber, levelInformationArray).then(function() {
            //console.log(levelInformationArray[0].required_points);
            //console.log(playerInfo.total_points);

            if (playerInfo.total_points > levelInformationArray[0].required_points) {
                newLevel = levelInformationArray[0].level_number;
                var query = 'UPDATE player SET level = ' + newLevel + ' WHERE id = ' + playerId;
                dbFactory.execute(query, [], []).then(function() {
                    q.resolve();
                });
                newLevelUnlocked = true;
            }
            q.resolve();
        });
        return q.promise;
    };

    var getLevelInformation = function(level, levelInformationArray) {
        var q = $q.defer();

        var query = 'SELECT level.number AS level_number, level.required_points AS required_points, ' +
            'level.description AS level_description, food.name AS food_name, food.unlock_text AS food_unlock_text FROM level, ' +
            'food, food_attribute_category WHERE level.number = ' + level + ' AND food.level = ' + level + ' AND food_attribute_category.attribute_category_id  = 1 AND ' +
            'food_attribute_category.food_id = food.id';

        dbFactory.execute(query, [], levelInformationArray).then(function() {
            levelInformationArray = levelInformationArray[0];
            q.resolve(levelInformationArray);
        });

        return q.promise;
    };

    var updateTotalPoints = function(points) {
        var q = $q.defer();
        getPlayerInfoFromDb().then(function() {
            var newTotalPoints = points + playerInfo.total_points;
            var query = 'UPDATE player SET total_points = ' + newTotalPoints + ' WHERE id = ' + playerId;
            dbFactory.execute(query, [], []).then(function() {
                q.resolve();
            });
        });
        return q.promise;
    };

    return {
        getPlayerInfoFromDb: getPlayerInfoFromDb,
        getPlayerInfo: getPlayerInfo,
        getPlayerProfile: getPlayerProfile,
        getPlayedGamesFromDb: getPlayedGamesFromDb,
        getPlayedGames: getPlayedGames,
        exportPlayerGamesToCSV: exportPlayerGamesToCSV,
        getPlayedGameRoundsFromDb: getPlayedGameRoundsFromDb,
        getLevelInformation: getLevelInformation,
        newLevelUnlocked: newLevelUnlocked,
        getHighScore: getHighScore,
        updateLevel: updateLevel,
        updateTotalPoints: updateTotalPoints
    };
})