if(typeof GLOBAL === "undefined") {
    GLOBAL = {
        Yarp : {}
    };
}

GLOBAL.Yarp.Base = {};
GLOBAL.Yarp.Base.BaseObject = function() {
    this.$use(GLOBAL.Yarp.Base.BaseObject)
    return this;
}

GLOBAL.Yarp.Base.Util = {

};

GLOBAL.Yarp.Storage = {
    AbstractStorage : function() {
        this.$use(GLOBAL.Yarp.Base.BaseObject)
        this.$use(GLOBAL.Yarp.Storage.AbstractStorage);
        return this;
    },
    // interface for AbstractStorage
    Inventory : function() { 
        this.$use(GLOBAL.Yarp.Storage.AbstractStorage, true);
        this.$use(GLOBAL.Yarp.Storage.Inventory);
        return this;
    }
}

GLOBAL.Yarp.Entity = {
    BaseEntity : function() {
        this.$use(GLOBAL.Yarp.Entity.BaseEntity);
        return this;
    },
    PlayerCharacter : function() {
        this.$use(GLOBAL.Yarp.Entity.BaseEntity);
        this.$use(GLOBAL.Yarp.Entity.PlayerCharacter);
        return this;
    },
    NonPlayerCharacter : function() {
        this.$use(GLOBAL.Yarp.Entity.BaseEntity);
        this.$use(GLOBAL.Yarp.Entity.NonPlayerCharacter);
        return this;
    }
}

GLOBAL.Yarp.CONSTANTS = {};

// dev/production
GLOBAL.Yarp.CONSTANTS.CONTEXT = 0;
GLOBAL.Yarp.FE = {};
GLOBAL.Yarp.FE.Cache = function() {
    this.$use(GLOBAL.Yarp.Storage.AbstractStorage)
};

//reserved for later usage with frontend javascript
GLOBAL.Yarp.FE.Plugin = {};
GLOBAL.Yarp.FE.Plugin.Upstream = function() {
    this.$use(GLOBAL.Yarp.Plugin.Upstream);
}


GLOBAL.Yarp.Interface = {
    AbstractInterface : function() {
        this.$use(GLOBAL.Yarp.Interface.AbstractInterface)
        return this;
    }
};

GLOBAL.Yarp.System = {
    // Base Map Interface
    Map : function() {
        this.$use(GLOBAL.Yarp.System.Map);
        return this;
    },
    Grid : function(gridCells) {
        this.$use(GLOBAL.Yarp.Storage.AbstractStorage, true);
        this.$use(GLOBAL.Yarp.System.Grid);
        return this;
    },
    // yields events
    GridCell : function() {
        this.$use(GLOBAL.Yarp.Storage.AbstractStorage, true);
        this.$use(GLOBAL.Yarp.System.GridCell);
        return this;
    },
    // describes an event inside a GridCell
    GridCellItem : function() {
        this.$use(GLOBAL.Yarp.System.GridCellItem);
        return this;
    },
    // part of the map (clustered)
    MapCluster : function() {
        this.$use(GLOBAL.Yarp.Storage.AbstractStorage, true);
        this.$use(GLOBAL.Yarp.System.MapCluster);
        return this;
    },
    // Backend specific runtime do compute events etc...
    MapRuntime : function() {
        this.$use(GLOBAL.Yarp.System.MapRuntime);
        return this;
    }
    
};