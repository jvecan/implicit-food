angular.module('implicitFood').factory('dbFactory', function($q, $cordovaSQLite) {
    //private variables


    var db_;

    // private methods - all return promises
    var openDB_ = function(dbName, location) {
        var q = $q.defer();
        try {
            if (db_ == null) {
                db_ = $cordovaSQLite.openDB({
                    name: dbName,
                    location: location
                });
            }
            q.resolve(db_);
        } catch (e) {
            q.reject("Exception thrown while opening DB " + JSON.stringify(e));
        }
        return q.promise;
    };

    var performQuery_ = function(query, params, out) {
        var q = $q.defer();
        params = params || []; // If params value is set then set it, otherwise set to empty array. 
        out = out || []; // If out value is set then set it, otherwise set to empty array. 

        //open the DB

        /*
        openDB_("foodapp.db", "default");

        $cordovaSQLite.execute(db_, query, []).then(function(res) {
            for (var i = 0; i < res.rows.length; i++) {
                out.push(res.rows.item(i));
                console.log("Added row to set", JSON.stringify(res.rows.item(i)));
            }
        }, function(err) {
            console.error(err);
            q.reject();
        });
*/

        openDB_("foodapp.db", "default")
            .then(function(db) {
                //then execute the query
                //console.log(query);
                $cordovaSQLite.execute(db, query, params).then(function(res) {

                    // console.log("insertId: " + res.insertId);
                    //then add the records to the out param
                    console.log("Query executed", JSON.stringify(query));
                    for (var i = 0; i < res.rows.length; i++) {
                        out.push(res.rows.item(i));
                        //console.log("Added row to set", JSON.stringify(res.rows.item(i)));
                    }
                    if (res.rows.length == 0) {
                        out.push(res.insertId);
                        //console.log("No results found ");
                        console.log("insertId: " + res.insertId);
                    }
                    q.resolve();

                }, function(err) {
                    console.log("Query failed", JSON.stringify(query));
                    console.error(err);
                    q.reject();
                });
                /*
                db_.open(function() {
                    q.resolve("DB Opened")
                }, function() {
                    q.reject("Failed to open DB");
                });*/
            }, function(err) {
                console.log(JSON.stringify(err), this.query);
                q.reject(err);
            });

        return q.promise;


    };

    // public methods
    var execute = function(query, params, out) {
        var q = $q.defer();
        performQuery_(query, params, out).then(function() {
            q.resolve([query, params]);
        }, function(err) {
            q.reject([query, params, err]);
        });
        return q.promise;
    };

    return {
        execute: execute
    };
})