/*!
 * 
 *   melonJS
 *   http://www.melonjs.org
 *		
 *   Step by step game creation tutorial
 *
 **/


//game resources
var game_resources = [

// tiles
{
    name: "area01",
    type: "tmx",
    src: "game/game_assets/area01.tmx"
},
{
    name: "trollympics_tileset",
    type: "image",
    src: "game/game_assets/area01_tileset/trollympics_tileset.png"
},
{
    name: "metatiles32x32",
    type: "image",
    src: "game/game_assets/area01_tileset/metatiles32x32.png"
},


// sprites
{
    name: "player1Sprite",
    type: "image",
    src: "game/game_assets/sprite/run_last.png"
},
{
    name: "folding_chair",
    type: "image",
    src: "game/game_assets/sprite/folding_chair.png"
},
// {
//     name: "firefall",
//     type: "image",
//     src: "game/game_assets/sprite/firefall.png"
// },
{
    name: "trollacola_can",
    type: "image",
    src: "game/game_assets/sprite/trollacola_can.png"
},
{
    name: "derp",
    type: "image",
    src: "game/game_assets/sprite/derp.png"
},


// background and environment
{
    name: "rainbow_sky",
    type: "image",
    src: "game/game_assets/area01_parallax/rainbow_sky.png"
},
{
    name: "ffbanner",
    type: "image",
    src: "game/game_assets/environment/ffbanner2.png"
},
{
    name: "banners",
    type: "image",
    src: "game/game_assets/environment/troll_banners.png"
},
// {
//     name: "derpbanner",
//     type: "image",
//     src: "game/game_assets/environment/chair_derp_sign.png"
// },



// audio resources
{
    name: "trollytrack",
    type: "audio",
    src: "game/game_assets/audio/",
    channel: 1
},
{
    //run into chair
    name: "67617__qubodup__metal-crash-collision",
    type: "audio",
    src: "game/game_assets/audio/",
    channel: 2
}, 
{
    //pick up trollacola
    name: "166188__drminky__potion-drink-regen",
    type: "audio",
    src: "game/game_assets/audio/",
    channel: 3
},
{
    //get over finish line
    name: "171671__fins__success-1",
    type: "audio",
    src: "game/game_assets/audio/",
    channel: 3
},
{
    name: "jump",
    type: "audio",
    src: "game/game_assets/audio/",
    channel: 4
},


// game font
{
    name: "32x32_font",
    type: "image",
    src: "game/game_assets/sprite/32x32_font.png"
},


// screens
{
    name: "credits_screen",
    type: "image",
    src: "game/game_assets/GUI/credits.png"  
}
];

var TrollympicsObjectTypes = {
    PLAYER : "player",
    CHAIR : "chair",
    CHAIRTARGET : "chairTarget",
    ENDTRIGGER : "endTrigger",
    TROLLACOLA : "trollaCola",
    DERP : "derp"
}

var TrollympicsGame =  {	

	onload: function() {
		if (!me.video.init('canvasContainer', window.innerWidth, window.innerHeight, false, 1.0)) {
			alert("Sorry but your browser does not support html 5 canvas.");
            return;
		}
		me.audio.init("mp3,ogg");
		me.loader.onload = this.loaded.bind(this);
		me.loader.preload(game_resources);
		me.state.change(me.state.LOADING);
	},
	
	
	loaded: function () {

		me.state.set(me.state.PLAY, new PlayScreen());
        me.state.set(me.state.GAME_END, new EndScreen());
        me.state.set(me.state.CREDITS, new CreditsScreen());
      
        me.entityPool.add("player", Player);

        me.entityPool.add("powerUp", PowerUp);
        me.entityPool.add("chair", Chair);
        // me.entityPool.add("chairTarget", ChairTarget);

        me.entityPool.add("endTrigger", EndTrigger);

        me.entityPool.add("banner", Banner);
        me.entityPool.add("ffbanner", FFBanner);

        // me.entityPool.add("derpbanner", DerpBanner);
        me.entityPool.add("derp", Derp);

        // enable the keyboard
        me.input.bindKey(me.input.KEY.LEFT,  "left");
        me.input.bindKey(me.input.KEY.RIGHT, "right");
        me.input.bindKey(me.input.KEY.UP,     "jump", true);
        me.input.bindKey(me.input.KEY.X,     "jump", true);

        me.gamestat.add("score");
        me.gamestat.add("time");

        me.gamestat.add("chairsTotal");
        // me.gamestat.setValue("chairsTotal", me.game.getEntityByName("chair").length);
        me.gamestat.add("chairsDestroyed");
        
        me.gamestat.add("derps");

        me.gamestat.add("trollacolas");
        me.gamestat.add("poweredUp");

        me.gamestat.add("crowdSad");
        me.gamestat.setValue("crowdSad", false);
        me.gamestat.add("crowdHappy");
        me.gamestat.setValue("crowdHappy", false);

        me.entityPool.add("invisibleTimer", Timer);

         // start the game 
        me.state.change(me.state.PLAY);
	}

};

var PlayScreen = me.ScreenObject.extend({

    init: function() {
        this.parent(true);
        // this.screenFont = new me.Font('century gothic', 32, 'white');
    },

    onResetEvent: function() {
        me.levelDirector.loadLevel("area01");
        me.game.currentLevel.getLayerByName("crowd-sad").setOpacity(0.0);
        me.game.currentLevel.getLayerByName("crowd-happy").setOpacity(0.0);
        me.game.addHUD(0, 0, window.innerWidth, window.innerHeight);
        me.game.HUD.addItem("score", new ScoreDisplay(window.innerWidth - 30, 10));
        me.game.HUD.addItem("time", new TimeDisplay(240, 10));
        me.audio.play("trollytrack", true, null, 0.5);
        me.game.sort();
	},

	onDestroyEvent: function() {
        me.game.remove("invisibleTimer");
    	me.game.disableHUD();
        me.audio.stop("trollytrack");
    }

});

var EndScreen = me.ScreenObject.extend({
    init: function() {
        this.parent(true);
        // this.screenFont = new me.Font('century gothic', 32, 'white');
        me.input.bindKey(me.input.KEY.ESC, 'showCredits');
        me.input.bindMouse(me.input.mouse.LEFT, me.input.KEY.ESC);
    },

    onResetEvent: function() {
        me.game.addHUD(0, 0, window.innerWidth, window.innerHeight);
        me.game.HUD.addItem("finalDisplay", new FinalDisplay(window.innerWidth/2, 100));
    },

    // draw: function() {

    // },

    update: function() {
        if (me.input.isKeyPressed('showCredits')) {
            me.state.change(me.state.CREDITS);
        }
    },

    onDestroyEvent: function() {
       me.game.disableHUD();
       me.input.unbindMouse(me.input.mouse.LEFT, this.showCredits);
    }
});

var CreditsScreen = me.ScreenObject.extend({

    init: function() {
        this.parent(true);
    },

    draw: function(context) {
        me.video.clearSurface(context, "#000022");
        var creditImage = me.loader.getImage("credits_screen");
        context.drawImage(
            creditImage,
            (window.innerWidth-creditImage.width)/2,
            (window.innerHeight-creditImage.height)/2);
    },

    onResetEvent: function() {

    },

    onDestroyEvent: function() {

    }

});