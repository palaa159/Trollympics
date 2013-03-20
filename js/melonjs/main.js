/*!
 * 
 *   melonJS
 *   http://www.melonjs.org
 *		
 *   Step by step game creation tutorial
 *
 **/


//game resources
var g_resources = [{
    name: "area01_level_tiles",
    type: "image",
    src: "js/melonjs/data/area01_tileset/area01_level_tiles.png"
}, {
        name: "metatiles32x32",
        type: "image",
        src: "js/melonjs/data/area01_tileset/metatiles32x32.png"
}, {
    name: "area01",
    type: "tmx",
    src: "js/melonjs/data/area01.tmx"
}, {
    name: "green_runner_right",
    type: "image",
    src: "js/melonjs/data/sprite/green_runner_right.png"
},
    // the parallax background
    {
        name: "area01_bkg1",
        type: "image",
        src: "js/melonjs/data/area01_parallax/forestbg1.png"
    }, {
        name: "area01_bkg2",
        type: "image",
        src: "js/melonjs/data/area01_parallax/forestbg2.png"
    },
    
    // audio resources
    {
        name: "cling",
        type: "audio",
        src: "js/melonjs/data/audio/",
        channel: 2
    }, {
        name: "jump",
        type: "audio",
        src: "js/melonjs/data/audio/",
        channel: 1
    }
    
];

var jsApp	= 
{	
	/* ---
	
		Initialize the jsApp
		
		---			*/
	onload: function()
	{
		
		// init the video
		if (!me.video.init('canvasContainer', window.innerWidth, window.innerHeight, false, 1.0))
		{
			alert("Sorry but your browser does not support html 5 canvas.");
         return;
		}
				
		// initialize the "audio"
		me.audio.init("mp3,ogg");
		
		// set all resources to be loaded
		me.loader.onload = this.loaded.bind(this);
		
		// set all resources to be loaded
		me.loader.preload(g_resources);

		// load everything & display a loading screen
		me.state.change(me.state.LOADING);
	},
	
	
	/* ---
	
		callback when everything is loaded
		
		---										*/
	loaded: function ()
	{
		// set the "Play/Ingame" Screen Object
		me.state.set(me.state.PLAY, new PlayScreen());
      
    // add our player entity in the entity pool
     me.entityPool.add("player1", PlayerEntity);

     // enable the keyboard
     me.input.bindKey(me.input.KEY.LEFT,  "left");
     me.input.bindKey(me.input.KEY.RIGHT, "right");
     me.input.bindKey(me.input.KEY.X,     "jump", true);

     // start the game 
     me.state.change(me.state.PLAY);
	}

}; // jsApp

/* the in game stuff*/
var PlayScreen = me.ScreenObject.extend(
{

   onResetEvent: function()
	{	
      // stuff to reset on state change
      me.levelDirector.loadLevel("area01");
	},
	onDestroyEvent: function()
	{
	
   }

});


