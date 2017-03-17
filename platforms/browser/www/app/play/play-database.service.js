/*angular
    .module('play')
    .factory('playDatabase', playDatabase); */


play.factory('playDatabase', ['$cordovaSQLite', '$q', 'databaseUtility', function($cordovaSQLite, $q, databaseUtility) {
    return {
        setInitialGameItems: function() {
            var deferred = $q.defer();

            deferred.resolve("kukkuu");
            console.log("Helouas");
            /*
            var query = 'SELECT food_id, name FROM food_attribute_category, food ' +
                'WHERE food_attribute_category.id IN (SELECT id FROM food_attribute_category WHERE attribute_category_id = ' + type +
                ' ORDER BY RANDOM() LIMIT 5) AND food.id = food_attribute_category.food_id';
            deferred.resolve(databaseUtility.executeQuery(query));*/
            return deferred.promise;
        }
    };

}]);


play.factory('databaseUtility', ['$cordovaSQLite', '$q', function($cordovaSQLite, $q) {
    return {

        executeQuery: function(query) {
            var deferred = $q.defer();
            var db = $cordovaSQLite.openDB({ name: "foodapp.db", location: "default" });
            var output_results = [];

            db.transaction(function(tx) {
                tx.executeSql(query, [], function(tx, res) {
                    var length = results.rows.length;
                    for (i = 0; i < length; i++) {
                        var result = results.rows.item(i);
                        output_results.push(result);
                        console.log(results.rows.item(i));
                    }

                });
            }, function(error) {
                // OK to close here:
                console.log('transaction error: ' + error.message);
                db.close();
            }, function() {
                // OK to close here:
                deferred.resolve(output_results);
                console.log('transaction ok');
                db.close(function() {
                    console.log('database is closed ok');
                });
            });

            return deferred.promise;
        },
        resultsHandler: function(deferred, successCB, errorCB) {
            var deferred = $q.defer();
            db.transaction(function(tx) {
                tx.executeSql(query, [], successCB(deferred), errorCB);
            }, errorCB);
            return deferred.promise;
        },
        errorHandler: function(error) {

            return deferred.reject(console.log(error));
        },


    };

}]);