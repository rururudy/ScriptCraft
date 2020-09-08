'use strict';
/*global require*/
var Drone = require('drone'),
  blocks = require('blocks');
/************************************************************************
### Drone.temple() method

Constructs a mayan temple.

#### Parameters
 
 * side - How many blocks wide and long the temple will be (default: 20)

#### Example

At the in-game prompt you can create a temple by looking at a block and typing:

```javascript
/js temple()
```

Alternatively you can create a new Drone object from a Player or Location object and call the temple() method.

```javascript
var d = new Drone(player);
d.temple();
```
![temple example](img/templeex1.png)

***/

function temple(side, hollow ) {
  if (hollow == undefined) {
    hollow = true;
  }
  if (!side) {
    side = 20;
  }
  this.chkpt('temple');
  var layerNumber = 1; // What level are we workin on?
  while (side > 4) {
    var middle = Math.round((side - 2) / 2);
    // make a layer of mossy bricks
    this.chkpt('temple-corner').box(blocks.brick.mossy, side, 1, side);
    // Add stairs if above the first level (level 1 is "in the dirt")
    if (layerNumber > 1) {
        this.right(middle)
          .box(blocks.stairs.stone)
          .right()
          .box(blocks.stairs.stone)
          .move('temple-corner');
        // if we want it hollow, carve out the layer we just made
        if (hollow && side > 6) {
        this.fwd(2).right(2)
            .box(blocks.air,side-4,1,side-4)
            .move('temple-corner');
        }
    }
    // set the 4 corners on fire
    if (layerNumber == 1) {
        this.box(blocks.netherrack,1,1,1).up().box(blocks.fire,1,1,1).down()
            .fwd(side-1)
            .box(blocks.netherrack,1,1,1).up().box(blocks.fire,1,1,1).down()
            .right(side-1)
            .box(blocks.netherrack,1,1,1).up().box(blocks.fire,1,1,1).down()
            .back(side-1)
            .box(blocks.netherrack,1,1,1).up().box(blocks.fire,1,1,1).down()
            .move('temple-corner');
    }
    // put stuff on ground level in the temple if hollow
    if (hollow && layerNumber == 2) {
        // anvils inside of temples!
        if (side > 8) {
            this.fwd(4).right(4)
                .box(blocks.anvil, 1, 1, 1)
                .move('temple-corner');
        }
        // put bed away from edge so you can wake up
        if (side > 12) {
            this.fwd(side-6).right(5)
                .bed()
                .right(2)
                .bed()
                .move('temple-corner');
        }
                
    }
    // Add some light inside temples
    if (hollow && side > 6 && layerNumber > 2) {
        this.fwd().right(1)
            .box(blocks.glowstone, 1, 1, 1)
            .fwd(side-3)
            .box(blocks.glowstone, 1, 1, 1)
            .right(side-3)
            .box(blocks.glowstone, 1, 1, 1)
            .back(side-3)
            .box(blocks.glowstone, 1, 1, 1)
            .move('temple-corner');
    }
    // Go up to next level.
    this.up().fwd().right().chkpt('temple-corner');
    // The next layer will be 2 bricks narrower. Up the pyramid we go!
    side = side - 2;
    // We are done with this layer.  incremend the layer counter!
    layerNumber++;
  }

  // we are done with the temple.  Put some light in it if hollow.
  if (hollow && layerNumber > 2) {
      this.down().down()
        .box(blocks.sealantern,side, 1, side)
        .up().up();
  }
        
  this.move('temple');
}
Drone.extend(temple);
