angular.module('implicitFood').factory('player', function ($q, $cordovaSQLite, $cordovaFile, $timeout, $http, dbFactory) {

    var playerId = 1;
    var uniqueId = 0;
    var playerInfo = [];
    var playedGames = [];
    var highScore = [];
    var newLevelUnlocked = false;
    var playerProfile = [];

    var getPlayerInfo = function () {
        return playerInfo;
    };

    var newLevelUnlocked = function () {
        return newLevelUnlocked;
    };

    var getPlayedGames = function () {
        return playedGames;
    };

    function generateUID() {
        // I generate the UID from two parts here 
        // to ensure the random number provide enough bits.
        var firstPart = (Math.random() * 46656) | 0;
        var secondPart = (Math.random() * 46656) | 0;
        firstPart = ("000" + firstPart.toString(36)).slice(-3);
        secondPart = ("000" + secondPart.toString(36)).slice(-3);
        firstPart = firstPart.toUpperCase();
        secondPart = secondPart.toUpperCase();
        return firstPart + secondPart;
    }

    var setUniqueId = function () {
        var q = $q.defer();
        getPlayerInfoFromDb().then(function () {
            var unique_id = playerInfo.unique_id;
            if (unique_id === "0") {
                var new_unique_id = generateUID();

                var query = 'UPDATE player SET unique_id = "' + new_unique_id + '" WHERE id = ' + playerId;
                dbFactory.execute(query, [], []).then(function () {
                    q.resolve();
                });
            } else {
                q.resolve();
            }
        });
        return q.promise;
    };

    var exportPlayerGamesToCSV = function (data) {

        var query = 'SELECT left_item_name, left_item_category_id, ' +
                'right_item_name, right_item_category_id, displayed_item_name, displayed_item_category_id ' +
                'user_response_category_id, reaction_time, points, game_id FROM game_round';

        var csvData = 'game_id;left_item_name;left_item_category_id;right_item_name;right_item_category_id;displayed_item_name;displayed_item_category_id;user_response_category_id;reaction_time;points\n';

        var q = $q.defer();


        $timeout(function () {
            q.notify("Exporting data");

        }, 0);

        var csvData = [];
        var csvHeaders = ["game_id", "left_item_name", "left_item_category_id", "right_item_name", "right_item_category_id", "displayed_item_name", "displayed_item_category_id", "user_response_category_id", "reaction_time", "points"];

        getPlayerInfoFromDb().then(function () {

            csvData.push([playerInfo.unique_id]);
            csvData.push(csvHeaders);

            for (var i = 0; i < data.length; i++) {
                // var roundObj = {};
                var roundObj = [data[i].game_id, data[i].left_item_name, data[i].left_item_category_id, data[i].right_item_name, data[i].right_item_category_id,
                    data[i].displayed_item_name, data[i].displayed_item_category_id, data[i].user_response_category_id, data[i].reaction_time, data[i].points
                ];

                /*roundObj.round_id = i;
                 roundObj.left_item_name = data[i].left_item_name;
                 roundObj.reaction_time = data[i].reaction_time;*/
                csvData.push(roundObj);
            }


            var url = 'http://iikkamanninen.com/mailgun/index.php';
            //var parameter = JSON.stringify({ data });
            var req = {
                method: 'POST',
                url: url,
                data: JSON.stringify(csvData)
                        //data: { test: JSON.stringify(data) }
            };

            $http(req).then(function () {
                q.resolve("Data exported successfully");
                console.log("onnistui");
            }, function () {
                q.reject("Failed to export data");
                console.log("epäonnistui");
            });

            /*
             $cordovaFile.writeFile(cordova.file.externalRootDirectory, "data.csv", csvData, true)
             .then(function(success) {
             q.resolve("Data exported successfully");
             //console.log("Csv file success");
             }, function(error) {
             q.reject("Failed to export data");
             });
             */

        });

        return q.promise;

    };

    var getHighScore = function () {
        highScore = [];
        var query = 'SELECT max(total_points) AS high_score FROM game';
        var data = dbFactory.dbQuery(query, []);
        data.then(function (dataResponse) {
            highScore = dataResponse[0].high_score;
        });
        return data;
    };

    var getPlayerProfile = function () {
        playerProfile = [];
        var query = 'SELECT total_points, level, display_name, unique_id FROM player WHERE id = ' + playerId;
        var data = dbFactory.dbQuery(query, []);
        data.then(function (dataResponse) {
            playerProfile = dataResponse[0];
        });
        return data;
    };

    var getPlayedGamesFromDb = function () {
        playedGames = [];
        var query = 'SELECT id, timestamp, game_type, total_points, correct_responses, incorrect_responses, ' +
                'average_reaction_time, average_reaction_time_correct_responses FROM game ORDER BY timestamp ASC LIMIT 30';
        var data = dbFactory.dbQuery(query, []);
        data.then(function (dataResponse) {
            playedGames = dataResponse;
        });
        return data;
    };

    var getPlayedGameRoundsFromDb = function (played_games) {

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


        var data = dbFactory.dbQuery(query, []);
        data.then(function (dataResponse) {
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

    var getUnlockedFoods = function (playerData) {
        unlockedFoods = [];
        var query = 'SELECT name, unlock_text, level, level.description as description FROM food JOIN food_attribute_category ' +
                'ON food.id = food_attribute_category.food_id JOIN level ON food.level = level.number WHERE level BETWEEN 1 AND ' + playerData.level + ' AND food_attribute_category.attribute_category_id = 1 ORDER BY level ASC';
        var data = dbFactory.dbQuery(query, []);
        data.then(function (dataResponse) {
            unlockedFoods = dataResponse;
        });
        return data;
    };


    var getPlayerInfoFromDb = function () {
        var query = 'SELECT total_points, level, display_name, unique_id FROM player WHERE id = ' + playerId;
        var q = $q.defer();
        var playerInfoArray = [];

        dbFactory.execute(query, [], playerInfoArray).then(function () {
            playerInfo = playerInfoArray[0];
            q.resolve();
        });
        return q.promise;
    };


    var updateLevel = function () {
        var q = $q.defer();

        var nextLevelNumber = playerInfo.level + 1;
        var levelInformationArray = [];

        newLevelUnlocked = false;

        getLevelInformation(nextLevelNumber, levelInformationArray).then(function () {
            if (playerInfo.total_points > levelInformationArray[0].required_points) {
                newLevel = levelInformationArray[0].level_number;
                var query = 'UPDATE player SET level = ' + newLevel + ' WHERE id = ' + playerId;
                dbFactory.execute(query, [], []).then(function () {
                    q.resolve();
                });
                newLevelUnlocked = true;
            }
            q.resolve();
        });
        return q.promise;
    };

    var getLevelInformation = function (level, levelInformationArray) {
        var q = $q.defer();

        var query = 'SELECT level.number AS level_number, level.required_points AS required_points, ' +
                'level.description AS level_description, food.name AS food_name, food.unlock_text AS food_unlock_text FROM level, ' +
                'food, food_attribute_category WHERE level.number = ' + level + ' AND food.level = ' + level + ' AND food_attribute_category.attribute_category_id  = 1 AND ' +
                'food_attribute_category.food_id = food.id';

        dbFactory.execute(query, [], levelInformationArray).then(function () {
            levelInformationArray = levelInformationArray[0];
            q.resolve(levelInformationArray);
        });

        return q.promise;
    };

    var updateTotalPoints = function (points) {
        var q = $q.defer();
        getPlayerInfoFromDb().then(function () {
            var newTotalPoints = points + playerInfo.total_points;
            var query = 'UPDATE player SET total_points = ' + newTotalPoints + ' WHERE id = ' + playerId;
            dbFactory.execute(query, [], []).then(function () {
                q.resolve();
            });
        });
        return q.promise;
    };

    var resetPlayerProfile = function () {
        var q = $q.defer();
        var query = 'DELETE from game';
        dbFactory.dbQuery(query, []).then(function () {
            q.notify("Deleting game information");
            var query = 'DELETE from game_round';
            dbFactory.dbQuery(query, []).then(function () {
                q.notify("Deleting game round information");
                var query = 'UPDATE player SET total_points = 0, level = 0, unique_id = "0" WHERE id = ' + playerId;
                dbFactory.dbQuery(query, []).then(function () {
                    q.resolve("Delete completed");
                });
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
        getUnlockedFoods: getUnlockedFoods,
        exportPlayerGamesToCSV: exportPlayerGamesToCSV,
        getPlayedGameRoundsFromDb: getPlayedGameRoundsFromDb,
        getLevelInformation: getLevelInformation,
        setUniqueId: setUniqueId,
        newLevelUnlocked: newLevelUnlocked,
        getHighScore: getHighScore,
        updateLevel: updateLevel,
        updateTotalPoints: updateTotalPoints,
        resetPlayerProfile: resetPlayerProfile
    };
})