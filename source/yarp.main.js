var http = require("http"),
    util = require("./yarp.util.js"),
    YarpLibrary = require("./yarp.library.js"),
    AbstractServerObject = require("./yarp.server.js"),
    WebSocket = require("./yarp.websocket.js").WebSocketObject,
    WebSocketBalancer = require("./yarp.websocket.js").WebSocketBalancer;
    
var wsb = new WebSocketBalancer(1580).run();
wsb.socketSwarm(5);
wsb.each(function() {

    // this = WebSocketObject
    this.ondata = function(text) {
        // this = Connection
        console.log("BOUNDATA: " + text);
        this.sendText(text.toUpperCase());
    }
    
    // Actions
    this.requestAction = function(data) {
        
    }
});


    