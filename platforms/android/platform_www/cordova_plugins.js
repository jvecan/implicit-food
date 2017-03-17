cordova.define('cordova/plugin_list', function(require, exports, module) {
module.exports = [
    {
        "id": "cordova-plugin-dbcopy.sqlDB",
        "file": "plugins/cordova-plugin-dbcopy/www/sqlDB.js",
        "pluginId": "cordova-plugin-dbcopy",
        "clobbers": [
            "window.plugins.sqlDB"
        ]
    },
    {
        "id": "cordova-sqlite-ext.SQLitePlugin",
        "file": "plugins/cordova-sqlite-ext/www/SQLitePlugin.js",
        "pluginId": "cordova-sqlite-ext",
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
    "cordova-sqlite-ext": "0.10.4"
};
// BOTTOM OF METADATA
});