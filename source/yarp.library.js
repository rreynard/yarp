function YarpLibrary() {
    
    this.__stor = { lib : {} }
    
    this.store = function(key, value) {
        this.__stor.lib[key] = value;
        return this;
    }
    
    this.getKey = function(key) {
        return typeof this.__stor.lib[key] !== "undefined" ? this.__stor.lib[key] : null;
    }
    
    this.remove = function(key) {   
        if(typeof this.__stor.lib[key] !== "undefined") this.__stor.lib[key] = undefined;
        return this;
    }
}

module.exports = YarpLibrary;