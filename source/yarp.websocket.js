var WebSocket = require("nodejs-websocket");

function WebSocketObject() {
    
    this.config = {
        hostname : "localhost",
        port : 1581
    }
    
    //interface methods
    this.ondata = function(text) {}
    this.onend = function(code, reason) {}
    this.onbinary = function(stream) {}
    this.on = function(type, fn) {
        this["on" + type] = fn;
        return this;
    }
    
    this.run = function() {
        var that = this;
        this.serverThread = WebSocket.createServer(function(conn) {
            conn.on("text", that.ondata.bind(conn));
            conn.on("binary", that.onbinary.bind(conn));
            conn.on("close", that.onend);
        }).listen(that.config.port);
    }
    return this;
}
module.exports = WebSocketObject;