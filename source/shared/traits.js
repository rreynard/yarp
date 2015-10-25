// clones from prototype - somewhat required because of hierarchy between Entities
// namespace {}.prototype.traits


Object.prototype.$use = function(props) {
    var keys = Object.keys(props.prototype.traits);
    for(var i = 0; i < keys.length; i++) {
        this[keys[i]] = props.prototype.traits[keys[i]]
    };
}

Object.prototype.traits = {}