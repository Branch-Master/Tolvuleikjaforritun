/*

spatialManager.js

A module which handles spatial lookup, as required for...
e.g. general collision detection.

*/

"use strict";

/* jshint browser: true, devel: true, globalstrict: true */

/*
0        1         2         3         4         5         6         7         8
12345678901234567890123456789012345678901234567890123456789012345678901234567890
*/

var spatialManager = {

// "PRIVATE" DATA

_nextSpatialID : 1, // make all valid IDs non-falsey (i.e. don't start at 0)

_entities : [],

// "PRIVATE" METHODS
//
// <none yet>


// PUBLIC METHODS

getNewSpatialID : function() {

    // TODO: YOUR STUFF HERE!
    var temp = this._nextSpatialID;
    this._nextSpatialID++;
    return temp;

},

register: function(entity) {
    var pos = entity.getPos();
    var spatialID = entity.getSpatialID();
    
    // TODO: YOUR STUFF HERE!
    this._entities[spatialID] = entity;

},

unregister: function(entity) {
    var spatialID = entity.getSpatialID();

    // TODO: YOUR STUFF HERE!
    this._entities[spatialID] = null;

},

findEntityInRange: function(posX, posY, radius) {

    // TODO: YOUR STUFF HERE!
    var x2;
    var y2;
    var radius2;

for(var i in this._entities){
    if(this._entities[i]){
        var pos = this._entities[i].getPos();
        x2 = pos.posX;
        y2 = pos.posY;
        radius2 = this._entities[i].getRadius();
        var distSq = util.wrappedDistSq(posX, posY, x2, y2,
                                        g_canvas.width, g_canvas.height);
        
        if(util.square(radius + radius2) >= distSq){ 
        return this._entities[i];
        }
    }	
}


},

render: function(ctx) {
    var oldStyle = ctx.strokeStyle;
    ctx.strokeStyle = "red";
    
    for (var ID in this._entities) {
        var e = this._entities[ID];
        util.strokeCircle(ctx, e.posX, e.posY, e.radius);
    }
    ctx.strokeStyle = oldStyle;
}

}
