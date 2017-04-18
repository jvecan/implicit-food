angular.module('implicitFood').factory('player', function($q, $cordovaSQLite, $cordovaFile, dbFactory) {

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

    var exportPlayerGamesToCSV = function() {
        var csvData = 'timestamp;game_type;total_points;correct_responses;incorrect_responses;average_reaction_time;average_reaction_time_correct_responses\n';

        getPlayedGamesFromDb().then(function(data) {
            playedGames = data;
            for (var i = 0; i < playedGames.length; i++) {
                csvData += playedGames[i].timestamp + ';' + playedGames[i].game_type + ';' + playedGames[i].total_points + ';' + playedGames[i].correct_responses +
                    ';' + playedGames[i].incorrect_responses + ';' + playedGames[i].average_reaction_time + ';' + playedGames[i].average_reaction_time_correct_responses + '\n';
            }
            $cordovaFile.writeFile(cordova.file.externalDataDirectory, "temp.csv", csvData, true)
                .then(function(success) {
                    console.log("Csv file success");
                }, function(error) {
                    console.log("Csv file failed failed failed");
                });
        });

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

    var getPlayedGameRoundsFromDb = function(game_type, game_id, gameRoundArray) {
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