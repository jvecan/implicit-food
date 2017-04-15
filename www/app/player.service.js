angular.module('implicitFood').factory('player', function($q, $cordovaSQLite, dbFactory) {
    //private variables


    var playerId = 1;
    var playerInfo = [];
    var newLevelUnlocked = false;


    var getPlayerInfo = function() {
        return playerInfo;
    };

    var newLevelUnlocked = function() {
        return newLevelUnlocked;
    }

    var getPlayerInfoFromDb = function() {
        var query = 'SELECT total_points, level, display_name FROM player WHERE id = ' + playerId;
        var q = $q.defer();
        var playerInfoArray = [];

        dbFactory.execute(query, [], playerInfoArray).then(function() {
            // console.log(playerInfoArray);
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
            console.log(levelInformationArray[0].required_points);
            console.log(playerInfo.total_points);

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



        /*
        dbFactory.execute(query, [], nextLevel).then(function() {
            if (playerInfo.total_points > nextLevel[0].required_points) {
                newLevel = nextLevel[0].number;
                var query = 'UPDATE player SET level = ' + newLevel + ' WHERE id = ' + playerId;
                dbFactory.execute(query, [], []);
                q.resolve();
            }
            q.resolve();
        });
        */
        return q.promise;
    };

    var getLevelInformation = function(level, levelInformationArray) {
        var q = $q.defer();

        var query = 'SELECT level.number AS level_number, level.required_points AS required_points, ' +
            'level.description AS level_description, food.name AS food_name, food.unlock_text AS food_unlock_text FROM level, ' +
            'food WHERE level.number = ' + level + ' AND food.level = ' + level;

        dbFactory.execute(query, [], levelInformationArray).then(function() {
            levelInformationArray = levelInformationArray[0];
            q.resolve(levelInformationArray);
        });

        return q.promise;

        // return levelInformation[0];
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
        getLevelInformation: getLevelInformation,
        newLevelUnlocked: newLevelUnlocked,
        updateLevel: updateLevel,
        updateTotalPoints: updateTotalPoints
    };
})