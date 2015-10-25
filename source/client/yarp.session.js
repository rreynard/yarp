var yarp = {
    stream : new WebSocket("ws://localhost:1580")
};

yarp.stream.onopen = function() {
    ws.send('Hello');
};

yarp.stream.onmessage = function(msg) {
    console.log(msg.data);
};

yarp.stream.onerror = function(e) {
    console.log('ws error: ' + e);
};

console.log(yarp.stream);