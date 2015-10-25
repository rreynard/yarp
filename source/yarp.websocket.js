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
                if(that.state.sid > 10) { that.state.flush();}
            }
        },
        get removeSlot() {
            return function(conn) {
                if(typeof conn["sid"] !== "undefined") {
                    that.state.connections[conn.sid] = undefined;
                    that.state.current_slots -= 1;
                }
            }
        },
        get flush() {
            return function() {
                var nConns = [], i, keys = Object.keys(that.state.connections);
                for(i = 0; i < keys.length; i++) {
                    if(typeof that.state.connections[keys[i]] !== "undefined") {
                        nConns.push(that.state.connections[keys[i]]);
                    }
                }
                that.state.connections = {};
                that.state.current_slots = 0;
                that.state.sid = 1;
                for(i = 0; i < nConns.length; i++) {
                    that.state.connections[that.state.sid] = nConns[i];
                    that.state.connections[that.state.sid].sid = that.state.sid;
                    that.state.sid = that.state.sid + 1;
                    that.state.current_slots = that.state.current_slots + 1;
                }
            }
        }
    }
    //interface methods
    this.ondata = function(text) {}
    this.onBeforeDataRender = function(data) {
        var pdata = JSON.parse(data);
        if(typeof pdata === "object") {
            if(typeof pdata["action"] !== "undefined") {
                if(typeof this[pdata.action + "Action"] === "function") {
                    this[pdata.action + "Action"](pdata);
                }
            }
        }
        this.ondata();
    }
    
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
        conn.on("text", that.onBeforeDataRender.bind(conn));
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

    var that = this;
    this.sockets = {
        
    };
    
    this.socketStates = [];
    
    this.config = {
        hostname : "localhost",
        port: port,
        max_slots_each : 64,
        cid : 1,
        cports : port + 1
    };
    
    this.getSocketKeys = function() {
        return Object.keys(this.sockets);
    }
    
    this.each = function(fn) {
        var keys = this.getSocketKeys(), i;
        for(i = 0; i < keys.length; i++) {
            fn.bind(this.sockets[keys[i]])(keys[i])
        }
        return this;
    }
    
    this.getSocketIdFromIndex = function(index) {
        return md5(index).substring(0,8)
    }
    
    this.getFirstAvailSocketId = function()  {
        return this.getSocketIdFromIndex(parseInt(Object.keys(this.socketStates)[0]));
    };
    
    this.getFirstAvailSocket = function() {
        return this.sockets[this.getFirstAvailSocketId()];
    }
    
    this.getSocket = function(index) {
        var socket = this.sockets[this.getSocketIdFromIndex(index)];
        if(typeof socket !== "undefined") {
            return socket;
        }
        return null;
    }
    
    // creates a new Socket in 'this.Socket'
    this.addSocket = function() {
    
        this.sockets[this.getSocketIdFromIndex(this.config.cid)] = new WebSocketObject({
            port : this.config.cports++,
            id : this.config.cid,
            slots : this.config.max_slots_each
        }, this.socketStates)
        .on("fullslots", this.delegateConnection)
        .on("xscr", this.connectSockets)
        .state.update;
        
        console.log("Added Socket: ", this.config.cid );
        this.config.cid++;
        return this.sockets[this.getSocketIdFromIndex(this.config.cid-1)];
    }
    
    // creates n amount of Sockets in 'this.Socket'
    this.socketSwarm = function(amount) {
        for(var i = 0; i < amount; i++) {
            this.addSocket();
        }
    }
    
    this.delegateConnection = function(conn) {
        if(that.socketStates.length === 0) {
            that.addSocket().handle(conn);
        }
        console.log("Delegating Connection...");
        console.log(that.socketStates);
        that.getFirstAvailSocket().handle(conn);        
    };
    
    this.run = function() {
        this.serverThread = WebSocket.createServer(this.delegateConnection).listen(this.config.port);
        return this;
    };
    
    return this;
}

module.exports = { 
    WebSocketObject : WebSocketObject,
    WebSocketBalancer : WebSocketBalancer
}