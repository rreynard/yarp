if(typeof GLOBAL === "undefined") {
    GLOBAL = {
        Yarp : {}
    };
}

var Yarp = {};

Yarp.Map = function() {}

Yarp.Storage = {
    BaseStorage : function() { 
        this.$use(Yarp.Storage.BaseStorage)
    },
    // interface for BaseStorage
    Inventory : function() { 
        this.$use(Yarp.Storage.BaseStorage);
        this.$use(Yarp.Storage.Inventory);
    }
}

Yarp.Entity = {
    BaseEntity : function() {
        this.$use(Yarp.Entity.BaseEntity)
    },
    PlayerCharacter : function() {
        this.$use(Yarp.Entity.BaseEntity);
        this.$use(Yarp.Entity.PlayerCharacter);
    },
    NonPlayerCharacter : function() {
        this.$use(Yarp.Entity.BaseEntity);
        this.$use(Yarp.Entity.NonPlayerCharacter);
    }
}



GLOBAL.Yarp.Storage = Yarp.Storage;
GLOBAL.Yarp.Entity = Yarp.Entity;
GLOBAL.Yarp.CONSTANTS = {};
GLOBAL.Yarp.System = {};
