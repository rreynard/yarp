GLOBAL.Yarp.CONSTANTS.STORAGE = {};
GLOBAL.Yarp.CONSTANTS.STORAGE.ITEM_SLOTS = {
    HEAD : 0,
    CHEST : 1,
    HANDS : 2,
    LEGS : 3,
    FEET : 4
}

GLOBAL.Yarp.Storage.AbstractStorage.prototype.traits = {  
    items : [],
    add : function(items) {
        if(typeof items !== "object") items = [items];
        for(var i = 0; i < items.length; i++) {
            this.items.push(items[i])
        }
    },
    addAsync : function(items, cb) {
        var that = this;
        setTimeout(function() {
            that.add(items);
            if(typeof cb === "function") cb.bind(that)();
        }, 0);
    },
    removeByIndex : function(index) {
        this.items.splice(index, 1);
    },
    index : function(obj) {
        // @TODO define Error Messages
        if(typeof obj !== "object") throw "Invalid Argument Passed in Yarp.Storage.AbstractStorage.index() typeof argument !== 'object'!";
        var key = Object.keys(obj)[0];
        for(i = 0; i < this.items.length; i++) {
            if(typeof this.items[i][key] !== "undefined" && this.items[i][key] === obj[key]) return i;
        }
        return -1;
    },
    indexAsync : function(obj, cb) {
        var that = this;
        setTimeout(function() {
            if(typeof cb === "function") cb.bind(that)(that.index(obj));
        }, 0);
    },
    remove : function(obj) {
        this.removeByIndex(this.index(obj));
        return this;
    },
    removeAsync : function(obj, cb) {
        var that = this;
        setTimeout(function() {
            that.remove(obj);
            if(typeof cb === "function") cb.bind(that)();
        }, 0)
    },
    find : function(obj) {
        if(typeof obj !== "object") throw "Invalid Argument Passed in Yarp.Storage.AbstractStorage.index() typeof argument !== 'object'!";
        var res = this.index(obj);
        return res !== -1 ? this.items[res] : null;
    },
    findAsync : function(obj, cb) {
        var that = this;
        setTimeout(function() {
            if(typeof cb === "function") cb.bind(that)(that.find(obj))
        }, 0)
    },
    each : function(fn) {
        for(var i = 0; i < this.items.length; i++) {
            fn.bind(this.items[i])(i);
        }
        return this;
    },
    eachAsync : function(fn, done) {
        var that = this;
        setTimeout(function() {
            that.each(fn);
            if(typeof done === "function") done();
        }, 0);
    }
}

GLOBAL.Yarp.Storage.Inventory.prototype.traits = {};
if(GLOBAL.Yarp.CONSTANTS.CONTEXT === 0) {
    console.log("Yarp.Storage done");
}