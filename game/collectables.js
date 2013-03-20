/*----------------
 a Coin entity
------------------------ */
var PowerUp = me.CollectableEntity.extend({
    // extending the init function is not mandatory
    // unless you need to add some extra initialization
    init: function(x, y, settings) {

        settings.spritewidth = 64;

        // call the parent constructor
        this.parent(x, y, settings);

        this.type = TrollympicsObjectTypes.TROLLACOLA;


        this.addAnimation ("spin", [0, 1, 2]);
        this.setCurrentAnimation("spin");

    },
 
    // this function is called by the engine, when
    // an object is touched by something (here collected)
    onCollision: function() {
        // TODO: this will also be triggered if a chair hits a trollacola...

        me.audio.play("166188__drminky__potion-drink-regen");
        me.gamestat.updateValue("trollacolas", 1);
        me.gamestat.updateValue("score", 500);
        me.game.HUD.updateItemValue("score", 500);
        // make sure it cannot be collected "again"
        this.collidable = false;
        // remove it
        me.game.remove(this);
        console.log(me.game.currentLevel.getLayerByName("crowd-happy"));
        me.game.currentLevel.getLayerByName("crowd-happy").setOpacity(1.0);
        me.gamestat.setValue("crowdHappy", true);

        me.gamestat.setValue("poweredUp", true);


    }
 
});