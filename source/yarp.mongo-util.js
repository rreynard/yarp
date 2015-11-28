var MongoClientConnect = require('mongodb').MongoClient.connect,
    fs = require("fs");

var MongoConnectionHandler = function() {
    var that = this;
    this.client = { connect : MongoClientConnect };
    this.current_db = null;
    this.isReady = false;
    this.coll = {
        current : null
    };
    this.$get = function(coll) {
        return this.current_db.collection(coll);
    };
    this.onend = function(err, result) {};
    this.onconnect = function(err, db) {
        
    };
    // MongoClient.connect wrapper for individual callbacks
    this._connect = function(url) {
        console.log("[mongo-util] connecting to:", url);
        var that = this;
        this.client.connect(url, function(err, db) {
            //that.onBeforeConnectHandler(err, db);
            that.current_db = db;
            that.isReady = true;
            that.onconnect(err, db);
        });
        return this;
    };
    this.close = function() {
        if(this.current_db !== null) this.current_db.close();
        return this;
    };
    this.colmodif = function(col, fn) {
        fn(this.current_db.collection(col))
    };
    return this;
}
    
module.exports = MongoConnectionHandler