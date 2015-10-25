GLOBAL.Yarp.CONSTANTS.ENTITY.DIRECTIONS = {
    UP : 0,
    LEFT : 1,
    DOWN : 2,
    RIGHT: 3
}

GLOBAL.Yarp.Entity.BaseEntity.prototype.traits = {
    aid : 0, // area id
    pos : [0,0],
    equip : [],
    states : [],// @TODO define query
    stats : {
        con :  10,
        str : 10,
        wis : 10,
        ch : 10,
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
    }
};

GLOBAL.Yarp.Entity.PlayerCharacter.prototype.traits = {

    

}