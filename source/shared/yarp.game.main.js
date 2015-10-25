/**

    database structure for game:
    - entities (req inventory)
    - map
        - grid?
    - items
    - storage
        - inventory
    
**/
// ===== BASE ENTITY =====
// player character, npc, hostile etc...
Yarp.Entity.BaseEntity.prototype.traits = {
    aid : 0, // area id
    pos : [0,0],
    equip : {}, // @TODO define
    states : [] // @TODO define
};

//===== BASE INVENTORY ====
var inv = new Yarp.Storage.Inventory();
console.log(inv);
inv.addItemsAsync([{id : 2, hp : 10}, {id : 3, hp : 5}, {id : 4, hp : 12}], function() {
    console.log("finished!");
    console.log(this.items);
});

// either
// inv.indexOfItemAsync({id : 2}, inv.removeItemByIndex);

// or
inv.removeItemAsync({id : 2});

setTimeout(function() {
    console.log(inv.items)
}, 2000)

inv.findItemAsync({id : 4}, function(item) {
    console.log(item);
});

if(typeof module !== "undefined" && typeof module["exports"] !== "undefined") {

}