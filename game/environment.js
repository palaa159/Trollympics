var Banner = me.ObjectEntity.extend({
    init: function(x, y, settings) {
        
        this.collidable = false;
        settings.image = "banners";
        settings.spriteheight = 38;
        settings.spritewidth = 397;

        this.parent(x, y, settings);

        this.addAnimation ("bannercycle", [0, 1, 2, 3, 4, 5, 6, 7, 8, 9],
                                (me.sys.fps * (1+Math.floor(Math.random()*3))));
        this.setCurrentAnimation("bannercycle");

        this.setAnimationFrame(Math.floor(Math.random()*10));

        
    },
 
    update: function() {
        this.parent(this);
    }
});

//there is almost certainly a better way
var FFBanner = me.ObjectEntity.extend({
    init: function(x, y, settings) {
        
        this.collidable = false;
        settings.image = "ffbanner";
        settings.spriteheight = 38;
        settings.spritewidth = 524;

        this.parent(x, y, settings);

    },
 
    update: function() {

    }
});

//there is almost certainly a better way
var DerpBanner = me.ObjectEntity.extend({
    init: function(x, y, settings) {
        
        this.collidable = false;
        settings.image = "derpbanner";
        settings.spritewidth = 400;

        this.parent(x, y, settings);

    },
 
    update: function() {

    }
});