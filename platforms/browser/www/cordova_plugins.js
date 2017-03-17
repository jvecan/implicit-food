cordova.define('cordova/plugin_list', function(require, exports, module) {
module.exports = [
    {
        "file": "plugins/cordova-plugin-dbcopy/www/sqlDB.js",
        "id": "cordova-plugin-dbcopy.sqlDB",
        "pluginId": "cordova-plugin-dbcopy",
        "clobbers": [
            "window.plugins.sqlDB"
        ]
    },
    {
        "file": "plugins/cordova-sqlite-ext/www/SQLitePlugin.js",
        "id": "cordova-sqlite-ext.SQLitePlugin",
        "pluginId": "cordova-sqlite-ext",
        "clobbers": [
            "SQLitePlugin"
        ]
    },
    {
        "file": "plugins/cordova-sqlite-storage/www/SQLitePlugin.js",
        "id": "cordova-sqlite-storage.SQLitePlugin",
        "pluginId": "cordova-sqlite-storage",
        "clobbers": [
            "SQLitePlugin"
        ]
    }
];
module.exports.metadata = 
// TOP OF METADATA
{
    "cordova-plugin-dbcopy": "1.0.4",
    "cordova-plugin-whitelist": "1.3.1",
    "cordova-sqlite-ext": "0.10.4",
    "cordova-sqlite-storage": "1.5.3"
}
// BOTTOM OF METADATA
});