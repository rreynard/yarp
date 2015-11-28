GLOBAL.Yarp.CONSTANTS.ENTITY = {};

GLOBAL.Yarp.CONSTANTS.ENTITY.DIRECTIONS = {
    UP : 0,
    LEFT : 1,
    DOWN : 2,
    RIGHT: 3
};

GLOBAL.Yarp.Entity.BaseStatObject = function(baseMod) {
    if(typeof baseMod === "undefined") baseMod = 0;
    return {
        con : 0 + (baseMod),
        str : 0 + (baseMod),
        wis : 0 + (baseMod),
        ch : 0 + (baseMod)
    }
}
/**
    @param string $name
    @param string $applies ex.: "+5HP"
    @return object
*/
GLOBAL.Yarp.Entity.BaseStateObject = function(name, applies) {
    this.name = name;
    this.applies = applies;
    this.__isBaseStateObject = true;
    return this;
}



GLOBAL.Yarp.Entity.BaseEntity.prototype.traits = {
    aid : 0, // area id
    pos : [0,0],
    equip : [],
    states : [],
    stateQuery : [],
    stats : new GLOBAL.Yarp.Entity.BaseStatObject(),
    reflectStats : function() {
        return {stats : this.stats}
    },
    move : function(direction, by) {
        switch(direction) {
            case GLOBAL.Yarp.CONSTANTS.ENTITY.DIRECTIONS.UP:
                this.pos[1] = this.pos[1] + by;
            break;
            case GLOBAL.Yarp.CONSTANTS.ENTITY.DIRECTIONS.LEFT:
                this.pos[0] = this.pos[0] - by;
            break;
            case GLOBAL.Yarp.CONSTANTS.ENTITY.DIRECTIONS.DOWN:
                this.pos[1] = this.pos[1] - by;
            break;
            case GLOBAL.Yarp.CONSTANTS.ENTITY.DIRECTIONS.RIGHT:
                this.pos[0] = this.pos[0] + by;
            break;
            default:
            
        }
    },
    // defines stateQuery
    setStateQuery : function() {
        for(var i = 0; i < this.states.length; i++) {
            if(this.states[i].__isBaseStateObject) {
                
            }
        }
    },
    // resolves (an entity's) state query 
    resolveStateQuery : function() {
        var reflected = this.reflectStats();
        for(var i = 0; i < this.stateQuery.length; i++) {
            // @TODO define after BaseObject.stat definition
        }
    }
};

GLOBAL.Yarp.Entity.PlayerCharacter.prototype.traits = {

    

}

if(GLOBAL.Yarp.CONSTANTS.CONTEXT === 0) {
    console.log("Yarp.Entity done");
}