/**

    defines base for http / Websocket Server
    CONVENTIONS:
        - null as standard 0/undefined/false
**/
var http = require("http"),
    util = require("./yarp.util.js"),
    YarpLibrary = require("./yarp.library.js"),
    AbstractServerObject = require("./yarp.server.js");
    
    