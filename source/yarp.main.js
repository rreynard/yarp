var http = require("http"),
    util = require("./yarp.util.js"),
    fs = require("fs"),
    YarpLibrary = require("./yarp.library.js"),
    AbstractServerObject = require("./yarp.server.js"),
    WebSocket = require("./yarp.websocket.js").WebSocketObject,
    WebSocketBalancer = require("./yarp.websocket.js").WebSocketBalancer,
    MongoConnectionHandler = require("./yarp.mongo-util.js"),
    wsb = new WebSocketBalancer(1580).run(),
    mch = new MongoConnectionHandler();
 
require("./shared/traits.js");

if(typeof GLOBAL["Yarp"] === "undefined") GLOBAL.Yarp = {};

// shorthand function
function valid(data, pArr) {
    for(var i = 0; i < pArr.length; i++) {
        if(typeof data[pArr[i]] === "undefined") return false;
    }
    return true;
}

// callback if mongoDB connect attempt is successful
mch.onconnect = function(err, db) {
    
    console.log("info mongodb_connected");
    
}

mch._connect.bind(mch)("mongodb://localhost:27017/yarp");

function mchReady() {
    wsb.socketSwarm(5);
    //var t = this.$get("yarp_main");
    wsb.each.bind(wsb)(function() {
    
        // Actions, called with websocket request e.g. {'action' : 'find', 'coll' : 'test', 'select' : {'a' : 4}}
        //   vvvv                                                  ^^^^^^
        this.findAction = function(data, conn) {
            if(valid(data, ["coll", "select"])) {
                mch.$get(data["coll"]).find(data["select"]).toArray(function(err, res) {
                    conn.sendText(JSON.stringify(res));
                })
            }
            
        }
        
        this.findManyAction = function(data, conn) {            
            if(valid(data, ["coll", "select"])) {
                mch.$get(data["coll"]).findMany(data["select"]).toArray(function(err, res) {
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
    
    var styles = fs.readFileSync("./fe/css/style.css").toString();
    var aso = new AbstractServerObject().conf("port", 1515)
    .on("end", function() {
        
    })
    .on("request", function(request, response, GET) {

    })
    .filter("/style.css", function(response, getHeaders) {
        response.writeHead(200,{"Content-Type" : "text/css"});
        response.write(styles);
        response.end(0);
    })
    .filter("/yarp", function(response, getHeaders) {
        response.writeHead(200, {"Content-Type" : "text/html"});
        response.HTML.content.head.add("<link rel='stylesheet' href='style.css'>");
        response.HTML.content.body.add("<div class='topbar'><button class='topbar__button'>button1</button></div>");
        response.wait(4);
    })
    .run();
}

setTimeout(function() {
    if(mch.isReady) {mchReady()}
}, 2000);




    