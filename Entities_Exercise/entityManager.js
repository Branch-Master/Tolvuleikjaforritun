/*

entityManager.js

A module which handles arbitrary entity-management for "Asteroids"


We create this module as a single global object, and initialise it
with suitable 'data' and 'methods'.

"Private" properties are denoted by an underscore prefix convention.

*/


"use strict";


// Tell jslint not to complain about my use of underscore prefixes (nomen),
// my flattening of some indentation (white), or my use of incr/decr ops 
// (plusplus).
//
/*jslint nomen: true, white: true, plusplus: true*/


var entityManager = {

// "PRIVATE" DATA

_rocks   : [],
_bullets : [],
_ships   : [],

_bShowRocks : true,

// "PRIVATE" METHODS

_generateRocks : function() {
    var i,
    NUM_ROCKS = 4;
    
    for(i=0; i<NUM_ROCKS;i++){
        this._rocks.push(new Rock());
    }
},

_findNearestShip : function(posX, posY) {
    
    var min_offset = 1000000;
    var closestShip; 
    var closestIndex;
    var y_offset;
    var x_offset;

    // using Pythagoras rule to find shortest distance 
    for(var i=0; i<this._ships.length; i++){
        if(this._ships[i].alive){
        y_offset = this._ships[i].cy - posY;
        x_offset = this._ships[i].cx - posX;

        var off_x2 = util.square(x_offset);
        var off_y2 = util.square(y_offset);
        var sum = off_x2 + off_y2;
        var offset = Math.sqrt(sum);
       

        if(offset < min_offset){
            min_offset = offset;
            closestShip = this._ships[i];
            closestIndex = i;
        }  
    } 
    }
    return {
	theShip : closestShip,   // the object itself
	theIndex: closestIndex   // the array index where it lives
    };
},

_forEachOf: function(aCategory, fn) {
    for (var i = 0; i < aCategory.length; ++i) {
	fn.call(aCategory[i]);
    }
},

// PUBLIC METHODS

// A special return value, used by other objects,
// to request the blessed release of death!
//
KILL_ME_NOW : -1,

// Some things must be deferred until after initial construction
// i.e. thing which need `this` to be defined.
//
deferredSetup : function () {
    this._categories = [this._rocks, this._bullets, this._ships];
},

init: function() {
    this._generateRocks();

    // I could have made some ships here too, but decided not to.
    //this._generateShip();
},

fireBullet: function(cx, cy, velX, velY, rotation) {
    //new bullet into the _bullets array  
    this._bullets.push(new Bullet({cx,cy,velX,velY,rotation}));
    
},

generateShip : function(descr) {
    //new ship into the _ships array
    this._ships.push(new Ship(descr));
},

killNearestShip : function(xPos, yPos) {

   var shipInfo = this._findNearestShip(xPos,yPos);
   var indexOfShip = shipInfo.theIndex;

   if(shipInfo.theIndex === undefined){return;} //if there are no ships to kill

    this._ships[indexOfShip].killShip();
       
},

yoinkNearestShip : function(xPos, yPos) {
    // TODO: Implement this

    // NB: Don't forget the "edge cases"

    var shipInfo = this._findNearestShip(xPos,yPos);
    var indexOfShip = shipInfo.theIndex;
 
    if(shipInfo.theIndex === undefined){return;} //if there are no ships to yoink

    this._ships[indexOfShip].cx = xPos;
    this._ships[indexOfShip].cy = yPos;

},

resetShips: function() {
    this._forEachOf(this._ships, Ship.prototype.reset);
},

haltShips: function() {
    this._forEachOf(this._ships, Ship.prototype.halt);
},	

toggleRocks: function() {
    this._bShowRocks = !this._bShowRocks;
},

update: function(du) {

    // NB: Remember to handle the "KILL_ME_NOW" return value!
    //     and to properly update the array in that case.
    for(var i=0;i<this._ships.length;i++){
        this._ships[i].update(du);
    }
    if(this._bShowRocks){
       for(var i=0; i< this._rocks.length; i++){
        this._rocks[i].update(du);
        } 
    }
    
    for(var i=0;i<this._bullets.length;i++){
        this._bullets[i].update(du);
    }
},

render: function(ctx) {

    // NB: Remember to implement the ._bShowRocks toggle!
    // (Either here, or if you prefer, in the Rock objects)
    
    if(this._bShowRocks){
         for(var i=0; i< this._rocks.length; i++){
        this._rocks[i].render(ctx);
        }
    }
    
    for(var i=0;i<this._bullets.length;i++){
        this._bullets[i].render(ctx);
    }
    
    for(var i=0;i<this._ships.length;i++){
        this._ships[i].render(ctx);
    }
    
}

}

// Some deferred setup which needs the object to have been created first
entityManager.deferredSetup();

entityManager.init();
