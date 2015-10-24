
function hexEncode(str, dontMerge) {

    var arr = [], i;
    for(i = 0; i < str.length; i++) {
        arr.push(str.charCodeAt(i).toString(16))
    }
    return !dontMerge ? arr.join("") : arr;
}

function hexDecode(str, dontMerge) {

    var arr = [], i, hex = str.toString();
    for(i = 0; i < hex.length; i = i + 2) {
        arr.push(String.fromCharCode(parseInt([hex[i], hex[i + 1]].join(""), 16)));
    }
    return !dontMerge ? arr.join("") : arr;
}

function isArray(item) {

    return typeof item["push"] !== "undefined"

}

module.exports = {
    hexEncode : hexEncode,
    hexDecode : hexDecode
}

