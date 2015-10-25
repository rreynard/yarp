var WebSocket = require("nodejs-websocket"),
    clone = require("./yarp.util.js").clone,
    md5 = require("md5");

function WebSocketObject(opt, statechange) {
    
    var that = this;
    opt = opt || {port : 1581, id : 1, slots: 64}
    this.config = {
        hostname : typeof opt["hostname"] !== "undefined" ? opt.hostname : "localhost",
        port : typeof opt["port"] !== "undefined" ? opt.port : 1581,
        socket_id : typeof opt["id"] !== "undefined" ? opt.id : 1,
        max_slots : typeof opt["slots"] !== "undefined" ? opt.slots : 64,
        slotted : true
    }
    
    this.isAvail = statechange || [];
    
    this.state = {
        current_slots : 0,
        sid : 1,
        connections: {},
        get update() {
            if(this.hasSlotsAvail) {
                that.isAvail[that.config.socket_id] = {slotsAvail : this.slotsAvail}
            } else if(that.isAvail.indexOf(that.config.socket_id) !== -1) {
                that.isAvail.splice(that.config.socket_id, 1);
            }
            return that;
        },
        get slotsAvail() { return that.config.max_slots - that.state.current_slots },
        get hasSlotsAvail() { return this.slotsAvail > 0 },
        get addSlot() {
            return function(conn) {
                if(!that.state.hasSlotsAvail) {return null}
                that.state.current_slots += 1;
                conn.sid = that.state.sid++;
                that.isAvail[that.config.socket_id] = { slotsAvail : that.state.slotsAvail }
                that.state.connections[conn.sid] = conn;
            }
        },
        get removeSlot() {
            return function(conn) {
                if(typeof conn["sid"] !== "undefined") {
                    that.state.connections[conn.sid] = undefined;
                    that.state.current_slots -= 1;
                }
            }
        }
    }
    
    //interface methods
    this.ondata = function(text) {}
    this.onend = function(code, reason) {
        this.detach(this);
    }
    this.onbinary = function(stream) {}
    this.onfullslots = function(conn) {}
    
    this.on = function(type, fn) {
        this["on" + type] = fn;
        return this;
    }
    
    this.handle = function(conn) {
        if(that.state.addSlot(conn) === null) {that.onfullslots(conn); return};
        conn.detach = that.state.removeSlot;
        conn.detach.bind(that.state);
        conn.on("text", that.ondata.bind(conn));
        conn.on("binary", that.onbinary.bind(conn));
        conn.on("close", that.onend.bind(conn));
        return that;
    }
    
    this.run = function() {
        this.serverThread = WebSocket.createServer(this.handle).listen(this.config.port);
        return this;
    }
    
    return this;
}

// more functionality regarding user-slots etc.
function WebSocketBalancer(port) {

    
    this.cluster = {
        
    };
    
    this.clusterStates = [];
    
    this.config = {
        hostname : "localhost",
        port: port,
        max_slots_each : 64,
        cid : 1,
        cports : 1581
    };
    
    this.getClusterIdFromIndex = function(index) {
        return md5(index).substring(0,8)
    }
    
    this.getFirstAvailClusterId = function()  {
        return this.getClusterIdFromIndex(parseInt(Object.keys(this.clusterStates)[0]));
    };
    
    this.getFirstAvailCluster = function() {
        return this.cluster[this.getFirstAvailClusterId()];
    }
    
    this.getCluster = function(index) {
        var cluster = this.cluster[this.getClusterIdFromIndex(index)];
        if(typeof cluster !== "undefined") {
            return cluster;
        }
        return null;
    }
    
    this.newClustered = function() {
        this.cluster[this.getClusterIdFromIndex(this.config.cid)] = new WebSocketObject({
            port : this.config.cports++,
            id : this.config.cid,
        }, this.clusterStates).on("fullslots", this.delegateConnection).state.update;
        this.config.cid++;
        return this.cluster[this.getClusterIdFromIndex(this.config.cid-1)];
    }
    
    this.delegateConnection = function(conn) {
        if(this.clusterStates.length === 0) {
            this.newClustered().handle(conn);
        }
        console.log("Delegating Connection...");
        this.getFirstAvailCluster().handle(conn);        
    };
    
    this.run = function() {
        this.serverThread = WebSocket.createServer(this.delegateConnection).listen(this.config.port);
        return this;
    };
    
    return this;
}

var wsb = new WebSocketBalancer(1580);
wsb.newClustered();
wsb.newClustered();
console.log(wsb.getFirstAvailCluster().on("data", function(text) {
    console.log("Received message : " + text);
    this.sendText(text);
}).on("end", function() {
    console.log("End Connection ID: " + this.sid);
    this.detach(this);
}).run());
module.exports = WebSocketObject;