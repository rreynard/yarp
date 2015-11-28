var http = require("http"),
    qs = require("querystring"),
    url = require("url"),
    md5 = require("md5"),
    YarpLibrary = require("./yarp.library.js");
function toHtml() {
    return this.wrap.replace("%%CONTENT%%", this.data.join(""));
}
function ResponseHtmlContentObject() {
    this.content = {};
    this.content.wrap = "<!DOCTYPE html> %%CONTENT%% </html>";
    this.content.head = {
        data : [],
        wrap : "<head> %%CONTENT%% </head>",
        add : function(data) {
            this.data.push(data);
        }
    };
    this.content.head.toHtml = toHtml.bind(this.content.head);
    this.content.body = {
        data : [],
        wrap : "<body> %%CONTENT%% </body>",
        get add() {
            return function(data) {
                this.data.push(data);
            }
        }
    };
    this.content.body.toHtml = toHtml.bind(this.content.body);
    this.content.tail = {
        data : [],
        wrap : "<footer> %%CONTENT%% </footer>",
        get add() {
            return function(data) {
                this.data.push(data);
            }
        }
    };
    this.content.tail.toHtml = toHtml.bind(this.content.tail);
    this.toHtml = function() {
    
        console.log(this.content.wrap.replace("%%CONTENT%%",[
            this.content.head.toHtml(),
            this.content.body.toHtml(),
            this.content.tail.toHtml()
        ].join("")));
        
        return this.content.wrap.replace("%%CONTENT%%",[
            this.content.head.toHtml(),
            this.content.body.toHtml(),
            this.content.tail.toHtml()
        ].join(""))
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
        
            // passes if null or if url contains defined getProperty
            if((that.config.getProperty !== null ? request.url.search(that.config.getProperty) !== -1 : true)) {
     
                filterHash = that.getUrlHash(url.parse(request.url).pathname);
                console.log("request", filterHash);
                getHeaders = that.parseGetHeaders.bind(that)(request.url);
                
                response.DATA = new ResponseHtmlContentObject();
                response.DATA.content.head.add("<meta charset='utf-8' />");
                response.DATA.content.head.add("<base href='" + that.config.fullUrl + "'></base>");
                response.stopEmit = false;
                response._end = response.end;
                response.awaitEmit = false;
                response.awaitEmitTimeout = 3;
                response.emitPlain = false;
                
                response.end = function(data) {
                    this.stopEmit = true;
                    this.wait(0);
                }
                
                response.wait = function(sec) {
                    setTimeout(function() {
                        if(!that.cache.getKey(filterHash + "_DATA")) {
                            that.cache.store(filterHash + "_DATA", this.emitPlain ? response.DATA.content.body.data.join("") : response.DATA.toHtml());
                        }
                        this.write(that.cache.getKey(filterHash + "_DATA"));
                        this._end();
                    }.bind(this),  sec * 1000)
                }
                
                if(typeof that.urlFilters[filterHash] !== "undefined") {
                    that.urlFilters[filterHash](response, getHeaders);
                } else {
                    response.writeHead(that.config.defaultStatus, that.config.defaultHeader);
                    that.onrequest.bind(that)(request, response, getHeaders);
                }
                
                
            }
        }).listen(this.config.port); 
        return that;
    }
    return this;
}

module.exports = AbstractServerObject;