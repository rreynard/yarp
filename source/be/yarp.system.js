if(typeof GLOBAL === "undefined") GLOBAL = {};
if(typeof GLOBAL["Yarp"] === "undefined") GLOBAL.Yarp = {};
GLOBAL.Yarp.CONSTANTS.SYSTEM = {}
GLOBAL.Yarp.CONSTANTS.SYSTEM.GRID_CELL_ITEM_TYPE = {
    CITY : 0,
    EVENT : 1,
    POI : 2
}

GLOBAL.Yarp.System.GridCellItem.prototype.traits = {
    type : null,
}

GLOBAL.Yarp.System.GridCell.prototype.traits = {
    id : 0,
    $item : function(query) {
        return this.find(query);
    },
    $itemAsync : function(query, cb) {
        this.findAsync(query, cb);
    }
}

GLOBAL.Yarp.System.Grid.prototype.traits = {
    dimensions : [100, 100],
    setDimensions2D : function(width, height) {
        
    }
}

// yields grid
GLOBAL.Yarp.System.Map.prototype.traits = {

    grid : new GLOBAL.Yarp.System.Grid(),
    $cell : function(query) {
        return this.grid.find(query);
    },
    $cellAsync : function(query, cb) {
        this.grid.findAsync(query, cb);
    }
    
}

// yields maps
GLOBAL.Yarp.System.MapCluster.prototype.traits = {
    $map : function(query) {
        return this.find(query);
    },
    $mapAsync : function(query, cb) {
        this.findAsync(query, cb);
    },
    addMap : function(map) {
        this.add(map);
    }
}

GLOBAL.Yarp.System.MapRuntime.prototype.traits = {
    config : {
        interval : 1
    },
    mapCluster : new GLOBAL.Yarp.System.MapCluster(),
    cycle : function() {},
}

if(GLOBAL.Yarp.CONSTANTS.CONTEXT === 0) {
    console.log("Yarp.System done");
}