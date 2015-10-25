var http = require("http"),
    util = require("./yarp.util.js"),
    YarpLibrary = require("./yarp.library.js"),
    AbstractServerObject = require("./yarp.server.js"),
    WebSocket = require("./yarp.websocket.js").WebSocketObject,
    WebSocketBalancer = require("./yarp.websocket.js").WebSocketBalancer,
    MongoConnectionHandler = require("./yarp.mongo-util.js"),
    wsb = new WebSocketBalancer(1580).run(),
    mch = new MongoConnectionHandler();

function valid(data, pArr) {
    for(var i = 0; i < pArr.length; i++) {
        if(typeof data[pArr[i]] === "undefined") return false;
    }
    return true;
}

mch.onconnect = function(err, db) {
    wsb.socketSwarm(5);
    wsb.each.bind(wsb)(function() {
        // Actions
        this.findAction = function(data, conn) {
            console.log("requestAction");
            
            if(valid(data, ["coll", "select"])) {
                mch.$get(data["coll"]).find(data["select"]).toArray(function(err, res) {
                    conn.sendText(JSON.stringify(res));
                })
            }
            
        }
        
        this.insertAction = function(data, conn) {
        
            if(valid(data, ["coll", "doc"])) {
                mch.$get(data["coll"]).insert(data["doc"], function(err, res) {
                    if(err) console.log(err);
                })
            }
        
        }
        
        this.updateAction = function(data, conn) {
            if(valid(data, ["coll", "select", "doc"])) {
                mch.$get(data["coll"]).updateOne(data["select"], { $set : data["doc"] }, function() {
                    if(err) console.log(err);
                })
            }
        }
        
        this.deleteAction = function(data, conn) {
            if(valid(data, ["coll", "select"])) {
                mch.$get(data["coll"]).deleteOne(data["select"], function(err, res) {
                    if(err) console.log(err);
                })
            }
        }
        
        this.deleteManyAction = function(data, conn) {
            if(valid(data, ["coll", "select"])) {
                mch.$get(data["coll"]).deleteMany(data["select"], function(err, res) {
                    if(err) console.log(err);
                })
            }
        }
        
    });
}

mch.connect("mongodb://localhost:27017/yarp");


    