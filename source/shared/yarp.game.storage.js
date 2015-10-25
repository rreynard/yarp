Yarp.Storage.BaseStorage.prototype.traits = {
    
    items : []

}

Yarp.Storage.Inventory.prototype.traits = {
    addItems : function(items) {
        for(var i = 0; i < items.length; i++) {
            this.items.push(items[i])
        }
    },
    addItemsAsync : function(items, cb) {
        var that = this;
        setTimeout(function() {
            that.addItems(items);
            if(typeof cb === "function") cb.bind(that)();
        }, 0);
    },
    removeItemByIndex : function(index) {
        this.items.splice(index, 1);
    },
    indexOfItem : function(obj) {
        var key = Object.keys(obj)[0];
        for(i = 0; i < this.items.length; i++) {
            if(typeof this.items[i][key] !== "undefined" && this.items[i][key] === obj[key]) return i;
        }
        return -1;
    },
    indexOfItemAsync : function(obj, cb) {
        var that = this;
        setTimeout(function() {
            if(typeof cb === "function") cb.bind(that)(that.indexOfItem(obj));
        }, 0);
    },
    removeItem : function(obj) {
        this.removeItemByIndex(this.indexOfItem(obj));
    },
    removeItemAsync : function(obj, cb) {
        var that = this;
        setTimeout(function() {
            that.removeItem(obj);
            if(typeof cb === "function") cb.bind(that)();
        }, 0)
    },
    findItem : function(obj) {
        var res = this.indexOfItem(obj);
        return res !== -1 ? this.items[res] : null;
    },
    findItemAsync : function(obj, cb) {
        var that = this;
        setTimeout(function() {
            if(typeof cb === "function") cb.bind(that)(that.findItem(obj))
        }, 0)
    }
};