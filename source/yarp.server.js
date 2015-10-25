function AbstractServerObject() {

    this.config = {
        hostname : "localhost",
        port : 1515,
        protocol : "http",
        getProperty : null, // e.g. "file=5"
        defaultHeader : {"Content-Type" : "text/plain"},
        defaultStatus : 200,
        defaultCreateServerFunction : http.createServer,
        fullUrl : "http://localhost:1515"
    }
    
    this.serverThread = null;
    this.cache = new YarpLibrary();
    // interface methods
    this.onrequest = function(request, response) {}
    this.onend = function() {}
    this.on = function(type, fn) {
        if(typeof this["on" + type] !== "undefined") {
            this["on" + type] = fn;
        }
        return this;
    }
    
    this.getFullUrl = function() {
        this.config.fullUrl = [
            this.config.protocol,
            "://",
            this.config.hostname       
        ].join("") 
        return this.config.fullUrl;
    }
    
    this.setGetProperty = function(string) { this.config.getProperty = string; }
    
    this.conf = function(property, value) {
        if("undefined" !== typeof this.config[property]) this.config[property] = value;
        return this;
    }
    
    this.run = function() {
        var that = this;
        this.cache.store("requestEndFunc", that.onend());
        this.serverThread = this.defaultCreateServerFunction(function(request, response) {
            if((that.config.getProperty !== null ? request.url.search(that.config.getProperty) !== -1 : true)) {
                response.writeHead(that.config.defaultStatus, that.config.defaultHeader);
                that.onrequest(request, response);
                response.end(that.cache.getKey("requestEndFunc"));
            }
        }).listen(this.config.port); 
        return that;
    }
    return this;
}

module.exports = AbstractServerObject;