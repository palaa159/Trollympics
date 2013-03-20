
var Chair = me.ObjectEntity.extend({
    init: function(x, y, settings) {
        settings.image = "folding_chair";
        settings.spritewidth = 128;
        settings.spriteheight = 192;
 
        this.parent(x, y, settings);

        this.name = "chair";

        me.gamestat.updateValue("chairsTotal", 1);
 
        this.collidable = true;
        this.type = TrollympicsObjectTypes.CHAIR;

        this.updateColRect(24, 96, 55, 138);

        this.addAnimation ("normal", [0]);
        this.addAnimation ("onFire", [1]);
        this.setCurrentAnimation("normal");

        this.visible = true;

        this.burned = false;


        this.spinTween = new me.Tween(this).to({
            angle:this.angle-540
        }, 1000).onComplete(this.onLand.bind(this));

    },

    onLand: function() {
        // me.game.remove(this);
        this.setVelocity(0,0);
        console.log("chair landed");
        this.jumping = false;
    },

    handlePlayerHit: function() {
        if (!this.burned) {
            this.showSadCrowd();
            me.game.HUD.updateItemValue("score", 500);
            me.gamestat.updateValue("score", 500);
            this.burned = true;
            me.gamestat.updateValue("chairsDestroyed", 1);
        }
        this.setCurrentAnimation("onFire");
        me.audio.play("67617__qubodup__metal-crash-collision");
        this.spinTween.to({
            angle:this.angle-540
        }, 1000).start();
        this.setVelocity(24, 20);
        this.jumping = true;
        this.vel.y = -this.maxVel.y * me.timer.tick;
        this.vel.x = this.maxVel.x * me.timer.tick;
        console.log("player kicked chair");            
    },

    showSadCrowd: function() {
        console.log(me.game.currentLevel.getLayerByName("crowd-sad"));
        me.game.currentLevel.getLayerByName("crowd-sad").setOpacity(1.0);
        me.gamestat.setValue("crowdSad", true);
        console.log("setting crowdSad to ",me.gamestat.getItemValue("crowdSad"));
    },

    update: function() {
        this.updateMovement();

        if (this.vel.x!==0 || this.vel.y!==0) {
            // update object animation
            this.parent(this);
            return true;
        }


        return false;
    },
 

    onCollision: function(res, obj) {

        if (res.y > 0) {
            this.vel.y = -this.maxVel.y * me.timer.tick;
        }
        console.log("chair collided with ",obj.type);
        if (obj.type == TrollympicsObjectTypes.PLAYER) {
            this.handlePlayerHit();
        } else if (obj.type == TrollympicsObjectTypes.CHAIRGOAL) {
            console.log("chair hit target");
            me.game.HUD.updateItemValue("score", 25837384885109);
            this.visible = false;
            me.game.remove(this);
        }


    },
 
 
});


var ChairTarget = me.InvisibleEntity.extend({
    init: function(x, y, settings) {
 
        this.collidable = true;
        this.type = TrollympicsObjectTypes.CHAIRTARGET;
        this.name = "chairGoal";

        this.parent(x, y, settings);

    },
 

    onCollision: function(res, obj) {

        console.log(obj, "=========================================hit the chair goal thing");
    },
 
    update: function() {
        this.parent(this);
        return true;
    }
});

var EndTrigger = me.InvisibleEntity.extend({
    init: function(x, y, settings) {
        this.parent(x, y, settings);
        this.collidable = true;
        this.type = TrollympicsObjectTypes.ENDTRIGGER;
    },
 

    onCollision: function(res, obj) {
        // console.log("endTrigger collision!");
        me.audio.play("171671__fins__success-1");

    },
 
    update: function() {

    }
});

//there is almost certainly a better way
var Derp = me.ObjectEntity.extend({
    init: function(x, y, settings) {
        
        this.collidable = true;
        settings.image = "derp";
        settings.spritewidth = 96;

        this.parent(x, y, settings);

        this.type = TrollympicsObjectTypes.DERP;

        this.addAnimation ("normal", [0]);
        this.addAnimation ("happy", [1]);
        this.setCurrentAnimation("normal");

    },
 
    update: function() {

    }
});