var Player = me.ObjectEntity.extend({

    init: function(x, y, settings) {

        // me.debug.renderHitBox = true;
 
        settings.image = "player1Sprite";
        settings.spritewidth = 192;
        this.parent(x, y, settings);

        this.collidable = true;

        this.addAnimation ("run", [0, 1, 2, 3]);
        this.updateColRect(30, 128, 25, 210);
        this.addAnimation("jump", [ 4 ]);
        this.setCurrentAnimation("run");

        this.setVelocity(12, 25);

        this.type = TrollympicsObjectTypes.PLAYER;
        
        me.game.viewport.follow(this.pos, me.game.viewport.AXIS.BOTH);
        this.bounceBackFrames = 0;
        this.crowdEmotingFrames = 0;
        this.poweredUpFrames = 0;

        me.game.viewport.setDeadzone(20, 400);
        
        console.log("init player done, player object is ",this);



        var that = this;
		socket.on('run', function(fS) {
            console.log("in run socket listener, fS is ",fS);
			that.vel.x += (fS) * me.timer.tick;
            console.log("adding ",fS*me.timer.tick," to velocity, result is ",that.vel.x);
		});
		
		socket.on('jumpOrDuck', function(fS) {
			if (fS == 1 || me.input.isKeyPressed('jump')) {
    			console.log("you are jumping");
                if (!that.jumping && !that.falling) {
                    // set current vel to the maximum defined value
                    // gravity will then do the rest
                    that.vel.y = -that.maxVel.y * me.timer.tick;
                    me.audio.play("jump");
                    that.jumping = true;
                }
            }
		});
        this.vel.x = 0;

    },    
    
    updateSprite: function() {
      if (this.jumping) {
        this.setCurrentAnimation("jump");
      } else {
        this.setCurrentAnimation("run");
      }
    },

    updateCrowd: function() {
        if (me.gamestat.getItemValue("crowdSad")) {
            this.crowdEmotingFrames = 60;
            this.emotionLayer = me.game.currentLevel.getLayerByName("crowd-sad");
            me.gamestat.setValue("crowdSad", false);
        } else if (me.gamestat.getItemValue("crowdHappy")) {
            this.crowdEmotingFrames = 60;
            this.emotionLayer = me.game.currentLevel.getLayerByName("crowd-happy");
            me.gamestat.setValue("crowdHappy", false);
        }
        if (this.crowdEmotingFrames > 0) {
            this.crowdEmotingFrames--;
            // this.emotionLayer.setOpacity(0.009*this.crowdEmotingFrames);
            if (this.crowdEmotingFrames == 0) {
                this.emotionLayer.setOpacity(0.00);
            }
        }

    },

    updatePowerups: function() {
        if (me.gamestat.getItemValue("poweredUp")) {
            me.gamestat.setValue("poweredUp", false);
            this.poweredUpFrames = 40;
        }
        if (this.poweredUpFrames > 0) {
            this.maxVel.x = 25;
            this.poweredUpFrames--;
        } else {
            this.maxVel.x = 12;
        }
    },

    update: function() {
 

        if (this.bounceBackFrames > 0) {
            this.vel.x = -this.accel.x * Math.log(this.bounceBackFrames);
            this.bounceBackFrames--;
        } else {


            this.updatePowerups();

            // if (me.input.isKeyPressed('left')) {
            //     this.flipX(true);
            //     this.vel.x -= this.accel.x * me.timer.tick;
            // } else if (me.input.isKeyPressed('right')) {
            //     this.flipX(false);
            //     this.vel.x += this.accel.x * me.timer.tick;
            // } else {
            //     this.vel.x = 0;
            // }

            var res = me.game.collide(this);

            if (res) {
                console.log("player collided with ",res.obj.type);
                if (res.obj.type == TrollympicsObjectTypes.CHAIR) {
                    //play sound
                    if (res.x >= 0) {
                        this.maxVel.x = 30;
                        this.bounceBackFrames = 6;
                        console.log("shaking viewport!");
                        me.game.viewport.shake(10, 30, me.game.viewport.AXIS.BOTH);
                    }
                } else if (res.obj.type == TrollympicsObjectTypes.ENDTRIGGER) {
                    // me.game.viewport.setDeadzone(600, 400);
                    me.game.viewport.fadeIn("#000000", 2000, this.goToGameOver);
                }

                //boioioioioing
                if (res.y > 0) {
                    this.vel.y = -this.maxVel.y * me.timer.tick;
                }

            }
        }
        
        // if (me.input.isKeyPressed('jump')) {
        //     if (!this.jumping && !this.falling) {
        //         this.vel.y = -this.maxVel.y * me.timer.tick;
        //         me.audio.play("jump");
        //         this.jumping = true;
        //     }

        // }
        
		this.vel.x -= 1 * me.timer.tick;
		if(this.vel.x <= 0) {
			this.vel.x = 0;
		}

        this.updateCrowd();

        this.updateSprite();

        this.updateMovement();

        if (this.vel.x!==0 || this.vel.y!==0) {
            // update object animation
            this.parent(this);
            return true;
        }

        // else inform the engine we did not perform
        // any update (e.g. position, animation)
        return false;
    },

    goToGameOver: function() {
        me.state.change(me.state.GAME_END);
    }
 
});


