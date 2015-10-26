GLOBAL.Yarp.Base.BaseObject.prototype.traits = {
    id : 0,
    serialize : function() {return JSON.stringify(Object.getPrototypeOf(this).traits)}
}