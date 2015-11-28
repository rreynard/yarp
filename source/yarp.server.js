var http = require("http"),
    qs = require("querystring"),
    url = require("url"),
    md5 = require("md5"),
    YarpLibrary = require("./yarp.library.js");
function toHtml() {
    console.log(this);
    return this.wrap.replace("%%CONTENT%%", this.data.join("\n"));
}
function ResponseHtmlContentObject() {
    this.content = {};
    this.content.wrap = "<!DOCTYPE html> %%CONTENT%% </html>";
    this.content.head = {
        data : [],
        wrap : "<head> %%CONTENT%% </head>",
        get add() {
            return function(data) {
                this.data.push(data);
            }
        }
    };
    this.content.head.toHtml = toHtml;
    this.content.body = {
        data : [],
        wrap : "<body> %%CONTENT%% </body>",
        get add() {
            return function(data) {
                this.data.push(data);
            }
        }
    };
    this.content.body.toHtml = toHtml;
    this.content.tail = {
        data : [],
        wrap : "<footer> %%CONTENT%% </footer>",
        get add() {
            return function(data) {
                this.data.push(data);
            }
        }
    };
    this.content.tail.toHtml = toHtml;
    this.toHtml = function() {
        return this.content.wrap.replace("%%CONTENT%%",[
            this.content.head.toHtml(),
            this.content.body.toHtml(),
            this.content.tail.toHtml()
        ].join("\n"))
    }
}

function AbstractServerObject() {

    this.config = {
        hostname : "localhost",
        port : 1515,
        protocol : "http",
        getProperty : null, // e.g. "file=5"
        defaultHeader : {"Content-Type" : "text/html"},
        defaultStatus : 200,
        defaultCreateServerFunction : http.createServer,
        fullUrl : "http://localhost:1515"
    }
    this.urlFilters = {};
    this.serverThread = null;
    this.cache = new YarpLibrary();
    this.getUrlHash = function(url) {
        return md5(url).substring(0, 7);
    };
    this.filter = function(url, cb) {
        var hash = this.getUrlHash(url);
        this.urlFilters[hash] = cb;
        console.log("register ", hash);
        return this;
    };
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
        ].join("");
        return this.config.fullUrl;
    }
    
    this.setGetProperty = function(string) { this.config.getProperty = string; }
    
    this.conf = function(property, value) {
        if("undefined" !== typeof this.config[property]) this.config[property] = value;
        return this;
    }

    this.parseGetHeaders = function(_url) {
        return qs.parse(url.parse(_url).query);
    }
    
    this.run = function() {
        var that = this, filterHash = null, getHeaders = null;
        this.cache.store("requestEndFunc", that.onend.bind(that)());
        console.log("list", that.urlFilters);
        this.serverThread = this.config.defaultCreateServerFunction(function(request, response) {
            if((that.config.getProperty !== null ? request.url.search(that.config.getProperty) !== -1 : true)) {
     
                filterHash = that.getUrlHash(url.parse(request.url).pathname);
                console.log("request", filterHash);
                getHeaders = that.parseGetHeaders.bind(that)(request.url);
                
                response.HTML = new ResponseHtmlContentObject();
                response.stopEmit = false;
                response._end = response.end;
                response.awaitEmit = false;
                response.awaitEmitTimeout = 3;
                
                response.end = function(data) {
                    if(!this.awaitEmit) {
                        this._end(data);
                        this.stopEmit = true;
                    }
                }
                
                response.wait = function(sec) {
                    this.awaitEmit = true;
                    this.awaitEmitTimeout = sec || this.awaitEmitTimeout || 3;
                }
                
                if(typeof that.urlFilters[filterHash] !== "undefined") {
                    that.urlFilters[filterHash](response, getHeaders);
                } else {
                    response.writeHead(that.config.defaultStatus, that.config.defaultHeader);
                    that.onrequest.bind(that)(request, response, getHeaders);
                }
                
                if(!response.stopEmit && !response.awaitEmit) {
                    response.write(response.HTML.toHtml());
                    response.end(that.cache.getKey("requestEndFunc"));
                }
                
                setTimeout(function() {
                    this.write(response.HTML.toHtml());
                    this.end(that.cache.getKey("requestEndFunc"));
                }.bind(response),  response.awaitEmitTimeout * 1000)
            }
        }).listen(this.config.port); 
        return that;
    }
    return this;
}

module.exports = AbstractServerObject;