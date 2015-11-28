// clones from prototype - somewhat required because of hierarchy between objects
// namespace Object.prototype.traits
// strict usage
Object.prototype.$use = function(props, getChilds) {
    
    var keys = Object.keys(props.prototype.traits), i;
    
    if(getChilds)  {
        try {
            var result = props.bind(props)(),
            addKeys = Object.keys(props);
            for(i = 0; i < addKeys.length; i++) {
                this[addKeys[i]] = result[addKeys[i]]
            }
        } catch(e) { console.log(e) }
    }
    
    for(i = 0; i < keys.length; i++) {
        this[keys[i]] = props.prototype.traits[keys[i]]
    };    
}

Object.prototype.traits = {}