/*------------------- 
a player entity
-------------------------------- */
var PlayerEntity = me.ObjectEntity.extend({
 
    /* -----
 
    constructor
 
    ------ */
 
    init: function(x, y, settings) {
        // call the constructor
        this.parent(x, y, settings);
 
        // set the default horizontal & vertical speed (accel vector)
        this.setVelocity(100, 15);
        
        var that = this;
    		socket.on('run', function(fS) {
    		  
    			that.vel.x += that.accel.x * me.timer.tick;
    			that.isRunning = true;
    		});
    		
    		socket.on('jump', function(fS) {
    			if (!that.jumping && !that.falling) {
              // set current vel to the maximum defined value
              // gravity will then do the rest
              that.vel.y = -that.maxVel.y * me.timer.tick;
              
              me.audio.play("jump");
              
              // set the jumping flag
              that.jumping = true;
          }
    		});
        
        me.debug.renderHitBox = true;
 
        this.updateColRect(0, 56, 0, 96);
 
        // set the display to follow our position on both axis
        me.game.viewport.follow(this.pos, me.game.viewport.AXIS.BOTH);
 
    },
    
    originalColRectValues: [0,56,0,96],
    duckColRectValues: [0,56,60,36],
    
    
    updateSprite: function() {
      if (this.jumping) {
        
      }
    },
 
    /* -----
 
    update the player pos
 
    ------ */
    update: function() {
 
        /*
if (me.input.isKeyPressed('left')) {
            // flip the sprite on horizontal axis
            this.flipX(true);
            // update the entity velocity
            this.vel.x -= this.accel.x * me.timer.tick;
        } else if (me.input.isKeyPressed('right')) {
            // unflip the sprite
            this.flipX(false);
            // update the entity velocity
            this.vel.x += this.accel.x * me.timer.tick;
        } else {
            this.vel.x = 0;
        }
*/
        if (!this.isRunning) {
          this.vel.x = 0;
        } else {
          this.isRunning = false;
        }
        
        
		
		    /*
        if (me.input.isKeyPressed('jump')) {
            // make sure we are not already jumping or falling
            if (!this.jumping && !this.falling) {
                // set current vel to the maximum defined value
                // gravity will then do the rest
                this.vel.y = -this.maxVel.y * me.timer.tick;
                
                me.audio.play("jump");
                
                // set the jumping flag
                this.jumping = true;
            }
 
        }
        
        if (me.input.isKeyPressed('duck')) {
          //this.updateColRect(8, 48, -1, 0);
          console.log("duck pressed");
          this.updateColRect(this.duckColRectValues[0],this.duckColRectValues[1],
                              this.duckColRectValues[2],this.duckColRectValues[3]);
        } else {
          this.updateColRect(this.originalColRectValues[0],this.originalColRectValues[1],
                              this.originalColRectValues[2],this.originalColRectValues[3]);
          
        }
        */
        //this.updateSprite();
 
        // check & update player movement
        this.updateMovement();
 
        // update animation if necessary
        if (this.vel.x!=0 || this.vel.y!=0) {
            // update objet animation
            this.parent(this);
            return true;
        }
         
        // else inform the engine we did not perform
        // any update (e.g. position, animation)
        return false;
    }
 
});