var MongoConnectionHandler = function() {
    return {
        client : require('mongodb').MongoClient,
        current_db : null,
        isReady : false,
        coll : {
            current : null
        },
        $get : function(coll) {
            if(this.coll.current === coll) {return this.coll.current}
            this.coll.current = this.current_db.collection(coll)
            return this.coll.current;
        },
        onend : function(err, result) {},
        onconnect : function(err, db) {
            
        },
        onBeforeConnectHandler : function(err, db) {
            this.current_db = db;
            this.isReady = true;
            this.onconnect(err, db);
        },
        // MongoClient.connect wrapper for individual callbacks
        connect : function(url) {
            this.client.connect.bind(this)(url, this.onBeforeConnectHandler.bind(this));
            return this;
        },
        close : function() {
            if(this.current_db !== null) this.current_db.close();
            return this;
        },
        colmodif : function(col, fn) {
            fn(this.current_db.collection(col))
        }
    }
}
module.exports = MongoConnectionHandler