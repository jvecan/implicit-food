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
        // Source: https://stackoverflow.com/a/6248722
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
        this.getPlayerInfoFromDb().then(function () {
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

        var csvData = 'game_id;left_item_name;left_item_category_id;right_item_name;right_item_category_id;displayed_item_name;displayed_item_category_id;user_response_category_id;reaction_time;points;game_type;timestamp\n';

        var q = $q.defer();


        $timeout(function () {
            q.notify("Exporting data");

        }, 0);

        var csvData = [];
        var csvHeaders = ["game_id", "left_item_name", "left_item_category_id", "right_item_name", "right_item_category_id", "displayed_item_name", "displayed_item_category_id", "user_response_category_id", "reaction_time", "points", "game_type", "timestamp"];

        this.getPlayerInfoFromDb().then(function () {
            csvData.push([playerInfo.unique_id]);
            csvData.push(csvHeaders);
            for (var i = 0; i < data.length; i++) {
                var roundObj = [data[i].game_id, data[i].left_item_name, data[i].left_item_category_id, data[i].right_item_name, data[i].right_item_category_id,
                    data[i].displayed_item_name, data[i].displayed_item_category_id, data[i].user_response_category_id, data[i].reaction_time, data[i].points,
                    data[i].game_type, data[i].timestamp
                ];
                csvData.push(roundObj);
            }

            var url = 'http://iikkamanninen.com/mailgun/index.php';
            var req = {
                method: 'POST',
                url: url,
                data: JSON.stringify(csvData)
            };

            $http(req).then(function () {
                q.resolve("Data exported successfully");
                console.log("onnistui");
            }, function () {
                q.reject("Failed to export data");
                console.log("epäonnistui");
            });

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

    var getPlayedGamesFromDb = function (limit) {
        playedGames = [];
        var query = 'SELECT id, timestamp, game_type, total_points, correct_responses, incorrect_responses, ' +
                'average_reaction_time, average_reaction_time_correct_responses FROM game ORDER BY timestamp DESC LIMIT ' + limit;
        var data = dbFactory.dbQuery(query, []);
        data.then(function (dataResponse) {
            playedGames = dataResponse;
        });
        return data;
    };

    var getPlayedGameRoundsFromDb = function (played_games) {
        var query = 'SELECT left_item_name, left_item_category_id, ' +
                'right_item_name, right_item_category_id, displayed_item_name, displayed_item_category_id, ' +
                'user_response_category_id, reaction_time, points, game_id, game_type, timestamp FROM game_round JOIN game ON game_round.game_id = game.id ';
        if (played_games.length > 0) {
            query += ' WHERE game_id IN (';
            for (var i = 0; i < played_games.length; i++) {
                query += played_games[i].id;

                if (i !== played_games.length - 1) {
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

    };

    var getUnlockedFoods = function (playerData) {
        unlockedFoods = [];
        var query = 'SELECT food.id, name, unlock_text, level, level.description as description FROM food JOIN food_attribute_category ' +
                'ON food.id = food_attribute_category.food_id JOIN level ON food.level = level.number WHERE level BETWEEN 1 AND ' + playerData.level + ' AND food_attribute_category.attribute_category_id = 1 ORDER BY level ASC';
        var data = dbFactory.dbQuery(query, []);
        data.then(function (dataResponse) {
            unlockedFoods = dataResponse;
        });
        return data;
    };

    var getUnlockedFoodStatisticsFood = function (name) {
        unlockedFood = [];
        var query = 'SELECT displayed_item_name as name, ' + 
                'SUM(CASE WHEN user_response_category_id = displayed_item_category_id THEN 1 ELSE 0 END) as correct_responses, ' + 
                'count(displayed_item_name) as total_responses, round(avg(reaction_time), 0) as reaction_time, round(sum(points), 0) as total_points ' +
                'FROM game_round ' +
                'JOIN game ON game.id = game_round.game_id ' +
                'WHERE game.game_type = "food" ' +
                'AND displayed_item_name = "' + name + '"' +
                ' GROUP BY displayed_item_name';
        var data = dbFactory.dbQuery(query, []);
        data.then(function (dataResponse) {
            unlockedFood = dataResponse;
        });
        return data;
    };
    
    var getUnlockedFoodStatisticsWord = function (name) {
        unlockedFood = [];
        var query = 'SELECT displayed_item_name, ' + 
                'SUM(CASE WHEN user_response_category_id = displayed_item_category_id THEN 1 ELSE 0 END) as correct_responses, ' + 
                'count(displayed_item_name) as total_responses, round(avg(reaction_time), 0) as reaction_time, round(sum(points), 0) as total_points ' +
                'FROM game_round ' +
                'JOIN game ON game.id = game_round.game_id ' +
                'WHERE game.game_type = "word" ' +
                'AND (right_item_name = "' + name + '"' +
                'OR left_item_name = "' + name + '")' +
                ' GROUP BY (CASE WHEN right_item_name = "' + name + '" THEN right_item_name WHEN left_item_name = "' + name + '" THEN left_item_name ELSE 0 END)';
        var data = dbFactory.dbQuery(query, []);
        data.then(function (dataResponse) {
            unlockedFood = dataResponse;
        });
        return data;
    };
    
    var getOtherFoodStatisticsFood = function (playerData) {
        unlockedFood = [];
        var query = 'SELECT displayed_item_name as name, ' + 
                'round((SUM(CASE WHEN user_response_category_id = displayed_item_category_id THEN 1.0 ELSE 0 END) / count(displayed_item_name)) * 100) as correct_responses, ' + 
                'count(displayed_item_name) as total_responses, round(avg(reaction_time), 0) as reaction_time, round(sum(points), 0) as total_points ' +
                'FROM game_round ' +
                'JOIN game ON game.id = game_round.game_id ' +                
                'JOIN food ON food.name = game_round.displayed_item_name ' +
                'WHERE game.game_type = "food" ' +
                'AND food.level <= ' + playerData.level + ' ' + 
                'AND food.unlock_text IS NULL ' +
                ' GROUP BY displayed_item_name ORDER BY correct_responses DESC';
        var data = dbFactory.dbQuery(query, []);
        data.then(function (dataResponse) {
            unlockedFood = dataResponse;
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

        this.getLevelInformation(nextLevelNumber, levelInformationArray).then(function () {
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
        getUnlockedFoodStatisticsFood: getUnlockedFoodStatisticsFood,
        getUnlockedFoodStatisticsWord: getUnlockedFoodStatisticsWord,
        getOtherFoodStatisticsFood: getOtherFoodStatisticsFood,
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